-- ============================================================================
-- 👥 Mémoria - 05 - Users.sql
-- Fichier: database/migrations/05 - Users.sql
-- Version: 3.2.0 (PostgreSQL 17+)
-- Description: Coffre-fort d identification des acteurs - Alignement binaire parfait
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits de padding)
-- ----------------------------------------------------------------------------
Create Table "Users" (
    "usIdUser"         Bytea Not Null,         -- 16 octets bruts fixes (Pour la classe IdBinaire)
    "usCreatedAt"      Timestamp Not Null,     -- 8 octets fixes (Date brute calculée par le domaine)
    "usUpdatedAt"      Timestamp,              -- 8 octets fixes (Géré par notre trigger universel)
    "usGdprDate"       Timestamp,              -- 8 octets fixes (Horodatage universel UTC)
    "usRoleId"         Char(4) Not Null Default 'CUST', -- 4 octets fixes (Zone clé étrangère liée à Roles)
    "usProviderId"     Char(4) Not Null Default 'LOCA', -- 4 octets fixes (Zone clé étrangère liée à Providers)
    "usGdprConsent"    Boolean Not Null Default False, -- 1 octet (Placé ici avec les variables pour 0% padding)
    "usPseudo"         Varchar(50) Not Null,   -- Variable
    "usCourriel"       Varchar(255) Not Null,  -- Variable (Le nettoyeur linguistique francisé)
    "usPasswordHash"   Varchar(255) Not Null,  -- Variable (Secret cryptographique Argon2id)
    "usSettingsUser"   Jsonb Not Null Default '{}'::jsonb, -- Sac variable lourd (Ferme la ligne)

    Constraint "Users_usIdUser_Pkey" Primary Key ("usIdUser"),
    Constraint "Users_usCourriel_Udx" Unique ("usCourriel"),
    Constraint "Users_usPseudo_Udx" Unique ("usPseudo"),
    Constraint "Users_usIdUser_Taille_Chk" Check (octet_length("usIdUser") = 16),
    Constraint "Users_usRoleId_Fkey" Foreign Key ("usRoleId") References "Roles"("roIdRole"),
    Constraint "Users_usProviderId_Fkey" Foreign Key ("usProviderId") References "Providers"("apIdProvider")
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Indexations d'infrastructure stratégiques
-- ----------------------------------------------------------------------------
Create Index "Users_usSettingsUser_Idx" On "Users" USING gin ("usSettingsUser");

-- ----------------------------------------------------------------------------
-- ⚡ 3. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "Users_BeforeUpdate_Trg"
Before Update on "Users"
For Each Row Execute Function "TraceModif"('usUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Table "Users" is 'Coffre-fort d identification et de stockage des données de profil des acteurs de Mémoria.';
Comment On Column "Users"."usIdUser" is 'Identifiant unique fort 128 bits stocké sous forme de segment binaire de 16 octets (Bytea).';
Comment On Column "Users"."usCreatedAt" is 'Horodatage de création physique géré en amont par la RAM du domaine.';
Comment On Column "Users"."usUpdatedAt" is 'Horodatage de dernière modification géré physiquement par le trigger universel.';
Comment On Column "Users"."usGdprDate" is 'Horodatage transactionnel du scellage du consentement RGPD calculé par le domaine.';
Comment On Column "Users"."usRoleId" is 'Clé étrangère liée au dictionnaire des rôles (table "Roles").';
Comment On Column "Users"."usProviderId" is 'Clé étrangère liée au dictionnaire des mécanismes d authentification (table "Providers").';
Comment On Column "Users"."usGdprConsent" is 'Drapeau de validation obligatoire du consentement aux règles d extraction RGPD.';
Comment On Column "Users"."usPseudo" is 'Pseudonyme d affichage unique de l acteur.';
Comment On Column "Users"."usCourriel" is 'Adresse de contact électronique normalisée en minuscules à la frontière de la cour basse.';
Comment On Column "Users"."usPasswordHash" is 'Empreinte cryptographique du secret d accès calculée via l algorithme Argon2id.';
Comment On Column "Users"."usSettingsUser" is 'Dictionnaire Jsonb binaire indexé des préférences d interface de l utilisateur.';
