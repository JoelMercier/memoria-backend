-- ============================================================================
-- 🚨 Mémoria - Events.sql
-- Fichier: database/migrations/13 - Table Events.sql
-- Version: 4.0.0 (PostgreSQL 17+)
-- Description: Journal d Audit Append-Only Immuable - Alignement binaire parfait
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ----------------------------------------------------------------------------
Drop Table if Exists "Events";

Create Table "Events" (
    "aeIdEvent"    UUID Not Null,                                -- 16 octets fixes (Pour la classe IdBinaire)
    "aeUserId"     UUID Null,                                    -- 16 octets fixes (Zone clé étrangère liée à Users.usIdUser)
    "aeCreatedAt"  Timestamp Not Null Default Current_Timestamp, --  8 octets fixes (Horodatage de production immuable)
    "aeCategoryId" Char(4) Not Null,                             --  4 octets fixes (Quadrigramme lié au dictionnaire catégories)
    "aeSeverityId" Char(4) Not Null,                             --  4 octets fixes (Zone clé étrangère liée à Severites)
    "aeSecteurId"  Char(4) Not Null,                             --  4 octets fixes -> EventSecteurs
    "aeActionId"   Char(4) Not Null,                             --  4 octets fixes -> EventActions
    "aeMessage"    Text Not Null,                                -- Variable (Message lisible pour les administrateurs)
    "aeMetadata"   Jsonb Not Null Default '{}'::jsonb,           -- Variable lourde (Ferme la ligne de données)

    Constraint "Events_aeIdEvent_Pkey" Primary Key ("aeIdEvent"),

    Constraint "Events_aeUserId_Fkey"     Foreign Key ("aeUserId"    ) References "Users"("usIdUser"),
    Constraint "Events_aeSeverityId_Fkey" Foreign Key ("aeSeverityId") References "Severites"("seIdSeverity"),
    Constraint "Events_aeCategoryId_Fkey" Foreign Key ("aeCategoryId") References "EventCategories"("ecIdCategory"),
    Constraint "Events_aeActionId_Fkey"   Foreign Key ("aeActionId"  ) References "EventActions"("eaIdAction"),
    Constraint "Events_aeSecteurId_Fkey"  Foreign Key ("aeSecteurId" ) References "EventSecteurs"("ecIdSecteur"),

    Constraint "Events_aeIdEvent_Taille_Chk" Check (                      octet_length("UUID-Bin"("aeIdEvent")) = 16),
    Constraint "Events_aeUserId_Taille_Chk"  Check ("aeUserId" is Null or octet_length("UUID-Bin"("aeUserId" )) = 16)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations
-- ----------------------------------------------------------------------------

Create Index if Not Exists "Events_aeSeverityId_Idx"             on "Events" Using Btree ("aeSeverityId");
Create Index if Not Exists "Events_aeCategoryId_aeCreatedAt_Idx" on "Events" Using Btree ("aeCategoryId", "aeCreatedAt" Desc);
Create Index if Not Exists "Events_aeUserId_Idx"                 on "Events" Using Btree ("aeUserId") Where "aeUserId" is Not Null;
Create Index If Not Exists "Events_aeSecteurId_aeActionId_Idx"   On "Events" Using Btree ("aeSecteurId", "aeActionId");
Create Index If Not Exists "Events_aeCategoryId_Idx"             On "Events" Using Btree ("aeCategoryId");
Create Index If Not Exists "Events_aeActionId_Idx"               on "Events" Using Btree ("aeActionId");

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "Events" is 'Journal d''audit immuable (Append-Only) enregistrant les traces de sécurité et d''exploitation du système.';

Comment on Column "Events"."aeIdEvent"    is 'Identifiant unique fort de la trace d''audit, calculé en UUID v7 (16 octets Bytea).';
Comment on Column "Events"."aeUserId"     is 'Clé étrangère binaire optionnelle pointant vers l''acteur responsable.';
Comment on Column "Events"."aeCreatedAt"  is 'Horodatage immuable et non révisable de l enregistrement du log, géré par la RAM du domaine.';
Comment on Column "Events"."aeCategoryId" is 'Quadrigramme pointant vers le dictionnaire des catégories d événements d infrastructure.';
Comment on Column "Events"."aeSeverityId" is 'Clé étrangère pointant vers le quadrigramme du dictionnaire des niveaux de gravité (table "Severites").';
Comment on Column "Events"."aeSecteurId"  is 'Clé étrangère binaire fixe pointant vers la table EventSecteurs (ex: SYST, UTIL).';
Comment on Column "Events"."aeActionId"   is 'Clé étrangère binaire fixe pointant vers la table EventActions (ex: DEMA, ENRE).';
Comment on Column "Events"."aeMessage"    is 'Description textuelle claire de l''événement pour les administrateurs.';
Comment on Column "Events"."aeMetadata"   is 'Dictionnaire Jsonb binaire contenant le contexte technique variable (IP, user-agent).';


--
-- 🚨 Mémoria - Triggers de Forteresse - Bilan Purge
--
-- 🛠️ 1. La fonction stockée autonome de bilan
Drop Trigger If Exists "Events_BilanPurge_Trg" On "Events";

Drop Function if Exists "EnregistrerBilanPurge"();

Create or Replace Function "EnregistrerBilanPurge"()
Returns Trigger As $$
Declare
    l_nLignesSupprimees Integer;
    l_sMessage TEXT;
Begin
    -- Extraction magique du nombre de lignes affectées par le DELETE précédent
    Get Diagnostics l_nLignesSupprimees = Row_Count;

    -- Si l'admin a purgé à blanc (0 ligne), on évite de saturer la table pour rien
    If l_nLignesSupprimees > 0 Then
        l_sMessage := 'Bilan de purge des événements : ' || l_nLignesSupprimees || ' lignes ont été définitivement détruites.';

        Insert Into "Events" (
            "aeIdEvent",
            "aeUserId",
            "aeCreatedAt",
            "aeCategoryId",
            "aeSeverityId",
            "aeSecteurId",
            "aeActionId",
            "aeMessage",
            "aeMetadata"
        ) Values (
            "Gen_Random_Uuid"(), -- Génération UUID v4 d'infrastructure
            Null,                -- Action purement machine autonome
            Current_Timestamp,
            'MONI',              -- Catégorie : Supervision
            'INFO',              -- Gravité   : Information
            'SYST',              -- Secteur   : Système
            'PURG',              -- Action    : Purge
            l_sMessage,
            '{"origine": "PostgreSQL_Trigger_Statement"}'::jsonb
        );
    End If;

    Return Null; -- Trigger AFTER STATEMENT : la valeur de retour n'affecte pas l'opération
End;
$$ Language Plpgsql;

-- ⚡ 2. Le déclencheur au niveau de la requête globale
Drop Trigger If Exists "Events_BilanPurge_Trg" On "Events";

Create Trigger "Events_BilanPurge_Trg"
After Delete On "Events"
For Each Statement -- S'exécute UNE SEULE fois pour toute la purge !
Execute Function "EnregistrerBilanPurge"();
