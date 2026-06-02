-- ============================================================================
-- 🏷️ Mémoria - 06 - Tags.sql
-- Fichier: database/migrations/06 - Tags.sql
-- Version: 3.1.0 (PostgreSQL 17+)
-- Description: Dictionnaire sémantique par acteur - Alignement binaire Bytea
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ----------------------------------------------------------------------------
Create Table "Tags" (
    "tgIdTag"     Bytea Not Null,         -- 16 octets bruts fixes (Pour la classe IdBinaire) [Mémoria]
    "tgUserId"    Bytea Not Null,         -- 16 octets bruts fixes (Zone clé étrangère liée à Users.usIdUser) [Mémoria]
    "tgCreatedAt" Timestamp Not Null,     -- 8 octets fixes (Date brute calculée par le domaine)
    "tgUpdatedAt" Timestamp,              -- 8 octets fixes (Géré par notre trigger universel)
    "tgName"      Varchar(50) Not Null,   -- Variable (Normalisé en minuscules à la frontière) [Mémoria]

    Constraint "Tags_tgIdTag_Pkey" Primary Key ("tgIdTag"),
    Constraint "Tags_tgUserId_Fkey" Foreign Key ("tgUserId") References "Users"("usIdUser") On Delete Cascade,
    Constraint "Tags_tgIdTag_Taille_Chk" Check (octet_length("tgIdTag") = 16),
    Constraint "Tags_tgUserId_Taille_Chk" Check (octet_length("tgUserId") = 16)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
-- Index d Unicité composite absolu : verrouille le dictionnaire de l acteur [Mémoria]
Create Unique Index "Tags_tgUserId_tgName_Udx" On "Tags" ("tgUserId", "tgName");

-- ----------------------------------------------------------------------------
-- ⚡ 3. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Tags_BeforeUpdate_Trg"
Before Update on "Tags"
For Each Row Execute Function "TraceModif"('tgUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du domaine (Pour le respect des normes)
-- ----------------------------------------------------------------------------
Comment On Table "Tags" is 'Mots-clés personnalisés créés par les utilisateurs pour organiser leurs pépites de connaissances.';
Comment On Column "Tags"."tgIdTag" is 'Identifiant unique fort 128 bits stocké sous forme de segment binaire de 16 octets (Bytea).';
Comment On Column "Tags"."tgUserId" is 'Clé étrangère binaire invitée (On Delete Cascade) pointant vers l unique usIdUser propriétaire.';
Comment On Column "Tags"."tgCreatedAt" is 'Horodatage de création physique géré de manière synchrone en amont par la RAM du domaine.';
Comment On Column "Users"."usUpdatedAt" is 'Horodatage de dernière modification géré physiquement par le trigger universel.';
Comment On Column "Tags"."tgName" is 'Libellé textuel nettoyé de l étiquette (normalisé en minuscules strictes par la cour basse).';
