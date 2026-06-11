-- ============================================================================
-- 👥 Mémoria - Users
-- Fichier: database/migrations/08 - Table Users.sql
-- Version: 3.2.0 (PostgreSQL 17+)
-- Description: Coffre-fort d'identification des acteurs - Alignement binaire parfait
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- -----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- -----------------------------------------------------------------------------
Drop Table if Exists "Users";

Create Table "Users" ( -- Alignement machine descendant strict pour éliminer le padding physique
    "usIdUser"         Bytea Not Null,                               -- 16 octets bruts fixes (Value Object binaire)
    "usCreatedAt"      Timestamp Not Null Default Current_Timestamp, --  8 octets fixes (Horodatage de création)
    "usUpdatedAt"      Timestamp,                                    --  8 octets fixes (Géré par notre trigger universel)
    "usRgpdDate"       Timestamp,                                    --  8 octets fixes (Horodatage de consentement UTC)
    "usRoleId"         Char(4) Not Null Default 'CUST',              --  4 octets fixes (Zone clé étrangère liée à Roles)
    "usProviderId"     Char(4) Not Null Default 'LOCA',              --  4 octets fixes (Zone clé étrangère liée à Providers)
    "usRgpdConsent"    Boolean Not Null Default False,               --  1 octet  fixe  (Placé ici avant les variables pour 0% padding)
    "usPseudo"         Varchar(50) Not Null,                         -- Taille variable
    "usCourriel"       Varchar(254) Not Null,                        -- Taille variable (Normalisé en minuscules stricts)
    "usPasswordHash"   Varchar(255) Not Null,                        -- Taille variable (Secret cryptographique Argon2id)
    "usSettingsUser"   Jsonb Not Null Default '{}'::jsonb,           -- Sac variable lourd (Ferme la marche de la ligne)

    Constraint "Users_usIdUser_Pkey" Primary Key ("usIdUser"),
    Constraint "Users_usCourriel_Udx" Unique ("usCourriel"),
    Constraint "Users_usPseudo_Udx"   Unique ("usPseudo"),

    Constraint "Users_usIdUser_Chk"        Check (octet_length("usIdUser") = 16), -- Validation de la taille physique 128 bits
    Constraint "Users_usCourriel_Lower_Chk" Check ("usCourriel" = Lower("usCourriel")),

    Constraint "Users_usRoleId_Fkey"     Foreign Key ("usRoleId")     References "Roles"("roIdRole"),
    Constraint "Users_usProviderId_Fkey" Foreign Key ("usProviderId") References "Providers"("apIdProvider")
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
-- Index GIN binaire sur le JSONB pour foudroyer le coût des requêtes de préférences utilisateur
Create Index "Users_usSettingsUser_Idx" On "Users" Using gin ("usSettingsUser");

-- ----------------------------------------------------------------------------
-- ⚡ 3. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Users_TraceModifs_Trg"
Before Update on "Users"
For Each Row Execute Function "TraceModif"('usUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Users" is 'Coffre-fort d''identification et de stockage des données de profil des acteurs de Mémoria.';

Comment On Column "Users"."usIdUser"       is 'Identifiant unique fort 128 bits stocké sous forme de segment binaire de 16 octets (Bytea).';
Comment On Column "Users"."usCreatedAt"    is 'Horodatage de création physique géré en amont par la RAM du domaine.';
Comment On Column "Users"."usUpdatedAt"    is 'Horodatage de dernière modification géré physiquement par le trigger universel.';
Comment On Column "Users"."usRgpdDate"     is 'Horodatage transactionnel du scellage du consentement RGPD calculé par le domaine.';
Comment On Column "Users"."usRoleId"       is 'Clé étrangère liée au dictionnaire des rôles (table "Roles").';
Comment On Column "Users"."usProviderId"   is 'Clé étrangère liée au dictionnaire des mécanismes d''authentification (table "Providers").';
Comment On Column "Users"."usRgpdConsent"  is 'Drapeau de validation obligatoire du consentement aux règles d''extraction RGPD.';
Comment On Column "Users"."usPseudo"       is 'Pseudonyme d''affichage unique de l''acteur.';
Comment On Column "Users"."usCourriel"     is 'Adresse de contact électronique normalisée en minuscules à la frontière de la cour basse.';
Comment On Column "Users"."usPasswordHash" is 'Empreinte cryptographique du secret d''accès calculée via l''algorithme Argon2id.';
Comment On Column "Users"."usSettingsUser" is 'Dictionnaire Jsonb binaire indexé des préférences d''interface de l''utilisateur.';
