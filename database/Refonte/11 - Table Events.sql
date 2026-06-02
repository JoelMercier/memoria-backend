-- ============================================================================
-- 🚨 Mémoria - 10 - Events.sql
-- Fichier: database/migrations/10 - Events.sql
-- Version: 3.2.0 (PostgreSQL 17+)
-- Description: Journal d Audit Append-Only Immuable - Alignement binaire parfait
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ----------------------------------------------------------------------------
Create Table "Events" (
    "aeIdEvent"    Bytea Not Null,         -- 16 octets bruts fixes (Pour la classe IdBinaire) [Mémoria]
    "aeUserId"     Bytea Null,             -- 16 octets bruts fixes (Zone clé étrangère liée à Users.usIdUser) [Mémoria]
    "aeCreatedAt"  Timestamp Not Null,     -- 8 octets fixes (Horodatage de production immuable) [Mémoria]
    "aeCategoryId" Char(4) Not Null,       -- 4 octets fixes (Quadrigramme lié au dictionnaire catégories) [Mémoria]
    "aeSeverityId" Char(4) Not Null,       -- 4 octets fixes (Zone clé étrangère liée à Severites) [Mémoria]
    "aeType"       Varchar(100) Not Null,  -- Variable (Le format francisé utilisateur.connexion) [Mémoria]
    "aeMessage"    Text Not Null,          -- Variable (Message lisible pour les administrateurs) [Mémoria]
    "aeMetadata"   Jsonb Not Null Default '{}'::jsonb, -- Variable lourde (Ferme la ligne de données) [Mémoria]

    Constraint "Events_aeIdEvent_Pkey" Primary Key ("aeIdEvent"),
    Constraint "Events_aeUserId_Fkey" Foreign Key ("aeUserId") References "Users"("usIdUser") On Delete Set Null, -- RGPD [Mémoria]
    Constraint "Events_aeSeverityId_Fkey" Foreign Key ("aeSeverityId") References "Severites"("seIdSeverity"),
    Constraint "Events_aeIdEvent_Taille_Chk" Check (octet_length("aeIdEvent") = 16),
    Constraint "Events_aeUserId_Taille_Chk" Check ("aeUserId" Is Null or octet_length("aeUserId") = 16)
    Constraint "Events_aeIdCategory_Fkey" Foreign Key ("aeCategoryId") References "EventCategories"("ecIdCategory")
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques (Zéro bégayage)
-- ----------------------------------------------------------------------------
Create Index "Events_aeSeverityId_Idx" On "Events" ("aeSeverityId");
Create Index "Events_aeIdCategory_aeCreatedAt_Idx" On "Events" ("aeIdCategory", "aeCreatedAt" Desc);
Create Index "Events_aeUserId_Idx" On "Events" ("aeUserId") Where "aeUserId" Is Not Null;

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Events" is 'Journal d audit immuable (Append-Only) enregistrant les traces de sécurité et d exploitation du système.';
Comment On Column "Events"."aeIdEvent" is 'Identifiant unique fort de la trace d audit, calculé en UUIDv7 (16 octets Bytea) par le domaine.';
Comment On Column "Events"."aeUserId" is 'Clé étrangère binaire optionnelle (On Delete Set Null) pointant vers l acteur responsable.';
Comment On Column "Events"."aeCreatedAt" is 'Horodatage immuable et non révisable de l enregistrement du log, géré par la RAM du domaine.';
Comment On Column "Events"."aeIdCategory" is 'Quadrigramme pointant vers le dictionnaire des catégories d événements d infrastructure.';
Comment On Column "Events"."aeSeverityId" is 'Clé étrangère pointant vers le quadrigramme du dictionnaire des niveaux de gravité (table "Severites").';
Comment On Column "Events"."aeType" is 'Code technique francisé de l action (ex: utilisateur.connexion, pepite.creation).';
Comment On Column "Events"."aeMessage" is 'Description textuelle claire de l événement pour les administrateurs.';
Comment On Column "Events"."aeMetadata" is 'Dictionnaire Jsonb binaire contenant le contexte technique variable (IP, user-agent).';
