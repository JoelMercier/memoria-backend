-- ============================================================================
-- 🏷️ Mémoria - 07 - Tags
-- Fichier: database/migrations/07 - Table Tags.sql
-- Version: 3.1.0 (PostgreSQL 17+)
-- Description: Dictionnaire sémantique par acteur
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ----------------------------------------------------------------------------
Drop Table if Exists "Tags";

Create Table "Tags" (
    "tgIdTag"     UUID Not Null,                                -- 16 octets bruts fixes (Pour la classe IdBinaire)
    "tgUserId"    UUID Not Null,                                -- 16 octets bruts fixes (Zone clé étrangère liée à Users.usIdUser)
    "tgCreatedAt" Timestamp Not Null Default Current_Timestamp, --  8 octets fixes (Date brute)
    "tgUpdatedAt" Timestamp,                                    --  8 octets fixes (Géré par notre trigger universel)
    "tgName"      Varchar(50) Not Null,                         -- Variable (Normalisé en minuscules à la frontière)

    Constraint "Tags_tgIdTag_Pkey" Primary Key ("tgIdTag"),

    Constraint "Tags_tgUserId_Fkey" Foreign Key ("tgUserId") References "Users"("usIdUser"),

    Constraint "Tags_tgIdTag_Taille_Chk"  Check (octet_length("UUID-Bin"("tgIdTag" )) = 16),
    Constraint "Tags_tgUserId_Taille_Chk" Check (octet_length("UUID-Bin"("tgUserId")) = 16)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
-- Index d'Unicité composite absolu : verrouille le dictionnaire de l'acteur
Create Unique Index "Tags_tgUserId_tgName_Udx" On "Tags" ("tgUserId", "tgName");

-- ----------------------------------------------------------------------------
-- ⚡ 3. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Tags_TraceModifs_Trg"
Before Update on "Tags"
For Each Row Execute Function "TraceModif"('tgUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du domaine (Pour le respect des normes)
-- ----------------------------------------------------------------------------
Comment On Table "Tags" is 'Mots-clés personnalisés créés par les utilisateurs pour organiser leurs pépites de connaissances.';

Comment On Column "Tags"."tgIdTag"     is 'Identifiant unique fort 128 bits stocké sous forme de segment binaire de 16 octets (Bytea <=> UUID).';
Comment On Column "Tags"."tgUserId"    is 'Clé étrangère binaire invitée pointant vers l''unique usIdUser propriétaire.';
Comment On Column "Tags"."tgCreatedAt" is 'Horodatage de création physique.';
Comment On Column "Tags"."usUpdatedAt" is 'Horodatage de dernière modification géré par le trigger universel.';
Comment On Column "Tags"."tgName"      is 'Libellé textuel nettoyé de l''étiquette (normalisé en minuscules strictes par la cour basse).';
