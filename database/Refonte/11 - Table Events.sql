-- ============================================================================
-- 🚨 Mémoria - 10 - Events.sql
-- Fichier: database/migrations/11 - Table Events.sql
-- Version: 3.2.0 (PostgreSQL 17+)
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
    "aeType"       Varchar(100) Not Null,                        -- Variable (Le format francisé utilisateur.connexion)
    "aeMessage"    Text Not Null,                                -- Variable (Message lisible pour les administrateurs)
    "aeMetadata"   Jsonb Not Null Default '{}'::jsonb,           -- Variable lourde (Ferme la ligne de données)

    Constraint "Events_aeIdEvent_Pkey" Primary Key ("aeIdEvent"),

    Constraint "Events_aeUserId_Fkey"     Foreign Key ("aeUserId"    ) References "Users"("usIdUser"),
    Constraint "Events_aeSeverityId_Fkey" Foreign Key ("aeSeverityId") References "Severites"("seIdSeverity"),
    Constraint "Events_aeCategoryId_Fkey" Foreign Key ("aeCategoryId") References "EventCategories"("ecIdCategory"),

    Constraint "Events_aeIdEvent_Taille_Chk" Check (                      octet_length("UUID-Bin"("aeIdEvent")) = 16),
    Constraint "Events_aeUserId_Taille_Chk"  Check ("aeUserId" is Null or octet_length("UUID-Bin"("aeUserId" )) = 16)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques (Zéro bégayage)
-- ----------------------------------------------------------------------------
Create Index "Events_aeSeverityId_Idx"             on "Events" ("aeSeverityId");
Create Index "Events_aeCategoryId_aeCreatedAt_Idx" on "Events" ("aeCategoryId", "aeCreatedAt" Desc);
Create Index "Events_aeUserId_Idx"                 on "Events" ("aeUserId") Where "aeUserId" is Not Null;

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "Events" is 'Journal d''audit immuable (Append-Only) enregistrant les traces de sécurité et d''exploitation du système.';

Comment on Column "Events"."aeIdEvent"    is 'Identifiant unique fort de la trace d''audit, calculé en UUID v7 (16 octets Bytea).';
Comment on Column "Events"."aeUserId"     is 'Clé étrangère binaire optionnelle pointant vers l''acteur responsable.';
Comment on Column "Events"."aeCreatedAt"  is 'Horodatage immuable et non révisable de l enregistrement du log, géré par la RAM du domaine.';
Comment on Column "Events"."aeCategoryId" is 'Quadrigramme pointant vers le dictionnaire des catégories d événements d infrastructure.';
Comment on Column "Events"."aeSeverityId" is 'Clé étrangère pointant vers le quadrigramme du dictionnaire des niveaux de gravité (table "Severites").';
Comment on Column "Events"."aeType"       is 'Code technique francisé de l''action (ex: utilisateur.connexion, pepite.creation).';
Comment on Column "Events"."aeMessage"    is 'Description textuelle claire de l''événement pour les administrateurs.';
Comment on Column "Events"."aeMetadata"   is 'Dictionnaire Jsonb binaire contenant le contexte technique variable (IP, user-agent).';
