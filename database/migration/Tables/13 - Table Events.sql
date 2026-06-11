-- ============================================================================
-- 🚨 Mémoria - Events.sql
-- Fichier: database/migrations/13 - Table Events.sql
-- Version: 4.0.1 (PostgreSQL 17+)
-- Description: Journal d'Audit Append-Only Immuable - Alignement binaire parfait
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ----------------------------------------------------------------------------
Drop Table if Exists "Events";

Create Table "Events" ( -- Alignement machine descendant strict pour éliminer le padding physique
    "aeIdEvent"    Uuid Not Null,                                -- 16 octets fixes (Value Object binaire)
    "aeUserId"     Uuid Null,                                    -- 16 octets fixes (Zone clé étrangère liée à Users, Null si RGPD)
    "aeCreatedAt"  Timestamp Not Null Default Current_Timestamp, --  8 octets fixes (Horodatage de production immuable)
    "aeCategoryId" Char(4) Not Null,                             --  4 octets fixes (Quadrigramme lié au dictionnaire catégories)
    "aeSeverityId" Char(4) Not Null,                             --  4 octets fixes (Zone clé étrangère liée à Severites)
    "aeSecteurId"  Char(4) Not Null,                             --  4 octets fixes (Zone clé étrangère liée à EventSecteurs)
    "aeActionId"   Char(4) Not Null,                             --  4 octets fixes (Zone clé étrangère liée à EventActions)
    "aeMessage"    Text Not Null,                                -- Taille variable (Message lisible admin)
    "aeMetadata"   Jsonb Not Null Default '{}'::Jsonb,           -- Taille variable lourde (Ferme la marche de la ligne)

    Constraint "Events_aeIdEvent_Pkey" Primary Key ("aeIdEvent"),

    Constraint "Events_aeIdEvent_Taille_Chk" Check (octet_length("UUID-Bin"("aeIdEvent")) = 16),
    Constraint "Events_aeUserId_Taille_Chk"  Check ("aeUserId" is Null or octet_length("UUID-Bin"("aeUserId")) = 16),

    Constraint "Events_aeUserId_Fkey"     Foreign Key ("aeUserId"    ) References "Users"("usIdUser"),
    Constraint "Events_aeSeverityId_Fkey" Foreign Key ("aeSeverityId") References "Severites"("seIdSeverity"),
    Constraint "Events_aeCategoryId_Fkey" Foreign Key ("aeCategoryId") References "EventCategories"("ecIdCategory"),
    Constraint "Events_aeActionId_Fkey"   Foreign Key ("aeActionId"  ) References "EventActions"("eaIdAction"),
    Constraint "Events_aeSecteurId_Fkey"  Foreign Key ("aeSecteurId" ) References "EventSecteurs"("ecIdSecteur")
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations de combat B-Tree (_Idx)
-- ----------------------------------------------------------------------------
Create Index "Events_aeSeverityId_Idx"             On "Events" Using btree ("aeSeverityId");
Create Index "Events_aeCategoryId_aeCreatedAt_Idx" On "Events" Using btree ("aeCategoryId", "aeCreatedAt" Desc);
Create Index "Events_aeUserId_Idx"                 On "Events" Using btree ("aeUserId") Where "aeUserId" is Not Null;
Create Index "Events_aeSecteurId_aeActionId_Idx"   On "Events" Using btree ("aeSecteurId", "aeActionId");

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "Events" is 'Journal d''audit immuable (Append-Only) enregistrant les traces de sécurité et d''exploitation du système.';

Comment on Column "Events"."aeIdEvent"    is 'Identifiant unique fort de la trace d''audit, calculé en UUID v7 (16 octets Bytea).';
Comment on Column "Events"."aeUserId"     is 'Clé étrangère binaire optionnelle pointant vers l''acteur responsable (basculée à Null en cas de purge RGPD).';
Comment on Column "Events"."aeCreatedAt"  is 'Horodatage immuable et non révisable de l''enregistrement du log, géré par la RAM du domaine.';
Comment on Column "Events"."aeCategoryId" is 'Quadrigramme pointant vers le dictionnaire des catégories d''événements d''infrastructure.';
Comment on Column "Events"."aeSeverityId" is 'Clé étrangère pointant vers le quadrigramme du dictionnaire des niveaux de gravité (table "Severites").';
Comment on Column "Events"."aeSecteurId"  is 'Clé étrangère binaire fixe pointant vers la table EventSecteurs (ex: ''SYST'', ''UTIL'').';
Comment on Column "Events"."aeActionId"   is 'Clé étrangère binaire fixe pointant vers la table EventActions (ex: ''CONN'', ''CREA'').';
Comment on Column "Events"."aeMessage"    is 'Description textuelle claire de l''événement pour les administrateurs.';
Comment on Column "Events"."aeMetadata"   is 'Dictionnaire Jsonb binaire contenant le contexte technique variable (IP, user-agent).';

-- ----------------------------------------------------------------------------
-- 🎛️ 4. Automatisation de la Forteresse (Trigger de Bilan de Purge)
-- ----------------------------------------------------------------------------
Drop Function if Exists "EnregistrerBilanPurge"() Cascade;

Create or Replace Function "EnregistrerBilanPurge"()
Returns Trigger As $$
Declare
    l_iLignesSupprimees Integer;
    l_sMessage           Text;
Begin
    -- Extraction magique du nombre de lignes affectées par le DELETE précédent
    Get Diagnostics l_iLignesSupprimees = Row_Count;

    -- Si l'administration a purgé à blanc (0 ligne), on évite de saturer le tas
    if l_iLignesSupprimees > 0 Then
        l_sMessage := 'Bilan de purge des événements : ' || l_iLignesSupprimees || ' lignes ont été définitivement détruites.';

        Insert Into "Events" (
            "aeIdEvent", "aeUserId", "aeCreatedAt", "aeCategoryId",
            "aeSeverityId", "aeSecteurId", "aeActionId", "aeMessage", "aeMetadata"
        ) Values (
            "Gen_Random_Uuid"(), -- Utilisation propre de l'usine système native
            Null,
            Current_Timestamp,
            'MONI',            -- Catégorie : Supervision
            'INFO',            -- Gravité   : Information
            'SYST',            -- Secteur   : Système
            'PURG',            -- Action    : Purge (À ajouter à la table de référence)
            l_sMessage,
            '{"origine": "PostgreSQL_Trigger_Statement"}'::Jsonb
        );
    End if;

    Return Null; -- Trigger AFTER STATEMENT : la valeur de retour n'affecte pas l'opération
End;
$$ Language Plpgsql;

Create Trigger "Events_BilanPurge_Trg"
After Delete On "Events"
For Each Statement -- S'exécute une seule fois par transaction globale de destruction
Execute Function "EnregistrerBilanPurge"();
