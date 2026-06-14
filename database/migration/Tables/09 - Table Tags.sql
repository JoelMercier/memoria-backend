-- ============================================================================
-- 🏷️ Mémoria - Tags
-- Fichier: database/migrations/09 - Table Tags.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Dictionnaire sémantique par acteur - Version UUID native d'élite
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro padding)
-- ----------------------------------------------------------------------------
Drop Table if exists "Tags" Cascade;

Create Table "Tags" (
    "tgIdTag"     UUID Not Null,                                -- 16 octets fixes (Type UUID natif de soute conservé).
    "tgUserId"    UUID Not Null,                                -- 16 octets fixes (Type UUID natif de soute conservé).
    "tgCreatedAt" Timestamp Not Null Default Current_Timestamp, --  8 octets fixes (Horodatage de création).
    "tgUpdatedAt" Timestamp,                                    --  8 octets fixes (Géré par notre trigger universel).
    "tgLibelle"   Varchar(50) Not Null,                         -- Taille variable (Substitue l''ancien tgName).

    Constraint "Tags_tgIdTag_Pkey" Primary Key ("tgIdTag"),

    Constraint "Tags_tgIdTag_Chk"         Check (octet_length("UUID-Bin"("tgIdTag")) = 16),
    Constraint "Tags_tgUserId_Chk"        Check (octet_length("UUID-Bin"("tgUserId")) = 16),
    Constraint "Tags_tgLibelle_Lower_Chk" Check ("tgLibelle" = Lower("tgLibelle")),

    Constraint "Tags_tgUserId_Fkey" Foreign Key ("tgUserId") References "Users"("usIdUser") -- Clé étrangère relationnelle.
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
-- Index d'Unicité composite absolu : verrouille le dictionnaire unique de l'acteur
Create Unique Index "Tags_tgUserId_tgLibelle_Udx" On "Tags" ("tgUserId", "tgLibelle");

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
Comment On Column "Tags"."tgCreatedAt" is 'Horodatage de création physique.';
Comment On Column "Tags"."tgUpdatedAt" is 'Horodatage de dernière modification géré par le trigger universel.';
Comment On Column "Tags"."tgLibelle"   is 'Libellé textuel nettoyé de l''étiquette (normalisé en minuscules strictes par la cour basse).';
