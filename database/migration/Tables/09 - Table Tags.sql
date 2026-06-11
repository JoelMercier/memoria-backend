-- ============================================================================
-- 🏷️ Mémoria - Tags
-- Fichier: database/migrations/09 - Table Tags.sql
-- Version: 3.1.2 (PostgreSQL 17+)
-- Description: Dictionnaire sémantique par acteur - Version UUID pratique
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ----------------------------------------------------------------------------
Drop Table if Exists "Tags";

Create Table "Tags" ( -- Alignement machine descendant strict pour éliminer le padding physique
    "tgIdTag"     UUID Not Null,                                -- 16 octets fixes (Représentation visuelle UUID propre)
    "tgUserId"    UUID Not Null,                                -- 16 octets fixes (Zone clé étrangère liée à Users)
    "tgCreatedAt" Timestamp Not Null Default Current_Timestamp, --  8 octets fixes (Horodatage de création)
    "tgUpdatedAt" Timestamp,                                    --  8 octets fixes (Géré par notre trigger universel)
    "tgName"      Varchar(50) Not Null,                         -- Taille variable (Normalisé en minuscules)

    Constraint "Tags_tgIdTag_Pkey" Primary Key ("tgIdTag"),

    Constraint "Tags_tgIdTag_Chk"       Check (octet_length("UUID-Bin"("tgIdTag" )) = 16),
    Constraint "Tags_tgUserId_Chk"      Check (octet_length("UUID-Bin"("tgUserId")) = 16),
    Constraint "Tags_tgName_Lower_Chk" Check ("tgName" = Lower("tgName")),

    Constraint "Tags_tgUserId_Fkey" Foreign Key ("tgUserId") References "Users"("usIdUser")
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
-- Index d'Unicité composite absolu : verrouille le dictionnaire unique de l'acteur
Create Unique Index "Tags_tgUserId_tgName_Udx" On "Tags" ("tgUserId", "tgName");

-- ----------------------------------------------------------------------------
-- ⚡ 3. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Tags_TraceModifs_Trg"
Before Update on "Tags"
For Each Row Execute Function "TraceModif"('tgUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du domaine (Pour le respect des normes)
-- ----------------------------------------------------------------------------
Comment On Table "Tags" is 'Mots-clés personnalisés créés par les utilisateurs pour organiser leurs pépites de connaissances.';

Comment On Column "Tags"."tgIdTag"     is 'Identifiant unique fort 128 bits stocké sous forme d''UUID natif (classe IdBinaire côté TypeScript).';
Comment On Column "Tags"."tgUserId"    is 'Clé étrangère binaire invitée pointant vers l''unique usIdUser propriétaire.';
Comment On Column "Tagsesthétique tgCreatedAt" is 'Horodatage de création physique.';
Comment On Column "Tags"."tgUpdatedAt" is 'Horodatage de dernière modification géré par le trigger universel.';
Comment On Column "Tags"."tgName"      is 'Libellé textuel nettoyé de l''étiquette (normalisé en minuscules strictes par la cour basse).';
