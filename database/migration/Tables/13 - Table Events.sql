-- ============================================================================
-- 🚨 Mémoria - Events
-- Fichier: database/migrations/13 - Table Events.sql
-- Version: 4.2.2 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Journal d'Audit Append-Only - Clés franconiennes stricts Rule 3
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro padding)
-- ----------------------------------------------------------------------------
Drop Table if exists "Events" Cascade;

Create Table "Events" (
    "aeIdEvent"     Uuid Not Null,                                -- 16 octets fixes (Value Object binaire).
    "aeUserId"      Uuid Null,                                    -- 16 octets fixes (Zone clé étrangère liée à Users, Null si RGPD).
    "aeCreatedAt"   Timestamp Not Null Default Current_Timestamp, --  8 octets fixes (Horodatage de production immuable).
    "aeCategorieId" Char(4) Not Null,                             --  4 octets fixes (Zone clé étrangère liée à Categories).
    "aeSeveriteId"  Char(4) Not Null,                             --  4 octets fixes (Zone clé étrangère liée à Severites).
    "aeSecteurId"   Char(4) Not Null,                             --  4 octets fixes (Zone clé étrangère liée à Secteurs).
    "aeActionId"    Char(4) Not Null,                             --  4 octets fixes (Zone clé étrangère liée à Actions).
    "aeMessage"     Varchar(255) Not Null,                        -- Taille variable (Message lisible admin).
    "aeMetadata"    Jsonb Not Null Default '{}'::jsonb,           -- Taille variable lourde (Ferme la marche de la ligne).

    Constraint "Events_aeIdEvent_Pkey" Primary Key ("aeIdEvent"),

    Constraint "Events_aeIdEvent_Taille_Chk" Check (octet_length("UUID-Bin"("aeIdEvent")) = 16),
    Constraint "Events_aeUserId_Taille_Chk"  Check ("aeUserId" is Null or octet_length("UUID-Bin"("aeUserId")) = 16),

    Constraint "Events_aeUserId_Fkey"      Foreign Key ("aeUserId")      References "Users"("usIdUser"),
    Constraint "Events_aeCategorieId_Fkey" Foreign Key ("aeCategorieId") References "Categories"("caIdCategory"), -- 🪓 ALIGNÉ : préfixe + NomTableCible + Id
    Constraint "Events_aeSeveriteId_Fkey"  Foreign Key ("aeSeveriteId")  References "Severites"("seIdSeverity"),  -- 🪓 ALIGNÉ : préfixe + NomTableCible + Id
    Constraint "Events_aeSecteurId_Fkey"   Foreign Key ("aeSecteurId")   References "Secteurs"("scIdSecteur"),
    Constraint "Events_aeActionId_Fkey"    Foreign Key ("aeActionId")    References "Actions"("acIdAction")
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations de combat B-Tree (_Idx)
-- ----------------------------------------------------------------------------
Create Index "Events_aeSeveriteId_Idx"              On "Events" Using btree ("aeSeveriteId");
Create Index "Events_aeCategorieId_aeCreatedAt_Idx" On "Events" Using btree ("aeCategorieId", "aeCreatedAt" Desc);
Create Index "Events_aeUserId_Idx"                  On "Events" Using btree ("aeUserId") Where "aeUserId" is Not Null;
Create Index "Events_aeSecteurId_aeActionId_Idx"    On "Events" Using btree ("aeSecteurId", "aeActionId");

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "Events" is 'Journal d''audit immuable (Append-Only) enregistrant les traces de sécurité et d''exploitation du système.';

Comment on Column "Events"."aeIdEvent"     is 'Identifiant unique fort de la trace d''audit, calculé en UUID v7 (16 octets Bytea).';
Comment on Column "Events"."aeUserId"      is 'Clé étrangère binaire optionnelle pointant vers l''acteur responsable (basculée à Null en cas de purge RGPD).';
Comment on Column "Events"."aeCreatedAt"   is 'Horodatage immuable et non révisable de l''enregistrement du log, géré par la RAM du domaine.';
Comment on Column "Events"."aeCategorieId" is 'Clé étrangère pointant vers le dictionnaire des catégories d''événements (table "Categories").';
Comment on Column "Events"."aeSeveriteId"  is 'Clé étrangère pointant vers le dictionnaire des niveaux de gravité (table "Severites").';
Comment on Column "Events"."aeSecteurId"   is 'Clé étrangère binaire fixe pointant vers la table Secteurs (ex: ''SYST'', ''AUTH'').';
Comment on Column "Events"."aeActionId"    is 'Clé étrangère binaire fixe pointant vers la table Actions (ex: ''CONN'', ''CREA'').';
Comment on Column "Events"."aeMessage"     is 'Description textuelle claire de l''événement pour les administrateurs.';
Comment on Column "Events"."aeMetadata"    is 'Dictionnaire Jsonb binaire contenant le contexte technique variable (IP, user-agent).';

-- ----------------------------------------------------------------------------
-- 🎛️ 4. Automatisation de la Forteresse (Trigger de Bilan de Purge)
-- ----------------------------------------------------------------------------
Drop Function if exists "EnregistrerBilanPurge"() Cascade;

Create or Replace Function "EnregistrerBilanPurge"()
Returns Trigger as $$
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
            "aeIdEvent", "aeUserId", "aeCreatedAt", "aeCategorieId",
            "aeSeveriteId", "aeSecteurId", "aeActionId", "aeMessage", "aeMetadata"
        ) Values (
            "Gen_Random_Uuid"(),                                -- Utilisation propre de l'usine système native.
            Null,
            Current_Timestamp,
            'MONI',                                             -- Catégorie : Supervision.
            'INFO',                                             -- Gravité   : Information (Balisage de repli).
            'SYST',                                             -- Secteur   : Système.
            'PURG',                                             -- Action    : Purge de soute.
            l_sMessage,
            '{"origine": "PostgreSQL_Trigger_Statement"}'::jsonb
        );
    End if;

    Return Null;                                                -- Trigger AFTER STATEMENT : la valeur de retour n'affecte pas l'opération.
End;
$$ Language plpgsql;

Create Trigger "Events_BilanPurge_Trg"
After Delete on "Events"
For Each Statement                                              -- S'exécute une seule fois par transaction globale.
Execute Function "EnregistrerBilanPurge"();
