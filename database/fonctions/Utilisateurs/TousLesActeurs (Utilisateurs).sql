-- ============================================================================
-- 👥 Mémoria - Fonctions Stockées d'Infrastructure : Pôle Acteurs (Users)
-- Fichier: database/functions/TousLesActeurs(Utilisateurs).sql
-- Version: 4.0.0 (PostgreSQL 17+ - Jojo-Style Compliant)
-- Description: Centralisation des mutations et extractions paginées des Users
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Écriture Nominale Idempotente : CreerActeur
-- ----------------------------------------------------------------------------
Drop Function if exists public."CreerActeur"(UUID, Character Varying, Character Varying, Character Varying, Character Varying, Character Varying, JsonB, Boolean, TimeStamp Without Time Zone, TimeStamp Without Time Zone);

Create Or Replace Function public."CreerActeur"(
    p_axIdUser      UUID,                        -- Paramètre : L'identifiant 128 bits en tête (Rule 1).
    p_sCourriel     Character Varying,           -- Paramètre : Chaîne de l'adresse de contact.
    p_sPasswordHash Character Varying,           -- Paramètre : Empreinte secrète Argon2id.
    p_sPseudo       Character Varying,           -- Paramètre : Pseudonyme acceptant les trémas.
    p_usRoleId      Character Varying,           -- Paramètre : Quadrigramme du rôle cible.
    p_usProviderId  Character Varying,           -- Paramètre : Quadrigramme du fournisseur d'accès.
    p_oSettingsUser JsonB,                       -- Paramètre : Objet JSONB de configuration d'IHM.
    p_bRgpdConsent  Boolean,                     -- Paramètre : Booléen de consentement RGPD.
    p_dRgpdDate     TimeStamp Without Time Zone, -- Paramètre : Horodatage UTC du scellage RGPD.
    p_dCreatedAt    TimeStamp Without Time Zone  -- Paramètre : Horodatage immuable de fondation.
)
Returns Table (
    "usIdUser"       Uuid,
    "usCourriel"     Character Varying,
    "usPasswordHash" Character Varying,
    "usPseudo"       Character Varying,
    "usRoleId"       Character Varying,
    "usProviderId"   Character Varying,
    "usSettingsUser" JsonB,
    "usRgpdConsent"  Boolean,
    "usRgpdDate"     TimeStamp Without Time Zone,
    "usCreatedAt"    TimeStamp Without Time Zone,
    "usUpdatedAt"    TimeStamp Without Time Zone
)
Language plpgsql
as $$
Begin
    Return Query
    Insert Into public."Users" (
        "usIdUser", "usCourriel", "usPasswordHash", "usPseudo",
        "usRoleId", "usProviderId", "usSettingsUser", "usRgpdConsent", "usRgpdDate", "usCreatedAt"
    )
    Values (
        "Bin-UUID"(p_axIdUser),             -- Transformation de l'UUID en trame ByteA 128 bits.
        Lower(Trim(p_sCourriel)),           -- Normalisation en minuscules stricts exigée par le check.
        p_sPasswordHash,                    -- Enfournement de l'empreinte de sécurité.
        Trim(p_sPseudo),                    -- Nettoyage des espaces autour des trémas.
        p_usRoleId,                         -- Injection du rôle validé en surface.
        p_usProviderId,                     -- Injection du mécanisme d'authentification.
        p_oSettingsUser,                    -- Stockage initial des préférences d'interface.
        p_bRgpdConsent,                     -- Injection du drapeau de consentement.
        p_dRgpdDate,                        -- Scellage de la tôle temporelle RGPD.
        p_dCreatedAt                        -- Date de fondation ancrée dans le domaine.
    )
    Returning
        "usIdUser"::Uuid,                   -- Cast inverse pour renvoyer le format attendu.
        "usCourriel",
        "usPasswordHash",
        "usPseudo",
        "usRoleId",
        "usProviderId",
        "usSettingsUser",
        "usRgpdConsent",
        "usRgpdDate",
        "usCreatedAt",
        "usUpdatedAt";                      -- Récupération instantanée du record mis à disposition.
End;
$$;

-- ----------------------------------------------------------------------------
-- 🏛️ 2. Mutation Partielle Sécurisée : ModifierActeur
-- ----------------------------------------------------------------------------
Drop Function If Exists public."ModifierActeur"(UUID, Character Varying, Character Varying, Character Varying, JsonB, Boolean, TimeStamp Without Time Zone, Character Varying, Character Varying);

Create Or Replace Function public."ModifierActeur"(
    p_axIdUser      UUID,                        -- Paramètre : L'identifiant fort de l'acteur cible.
    p_sCourriel     Character Varying,           -- Paramètre : Nouvelle adresse électronique optionnelle.
    p_sPasswordHash Character Varying,           -- Paramètre : Nouveau secret d'accès optionnel.
    p_sPseudo       Character Varying,           -- Paramètre : Nouveau pseudonyme d'affichage.
    p_oSettingsUser JsonB,                       -- Paramètre : Lot partiel de préférences d'interface.
    p_bRgpdConsent  Boolean,                     -- Paramètre : Mutation du statut de consentement.
    p_dRgpdDate     TimeStamp Without Time Zone, -- Paramètre : Horodatage UTC du scellage de révision.
    p_usRoleId      Character Varying,           -- Paramètre : Mutation du privilège de l'acteur.
    p_usProviderId  Character Varying            -- Paramètre : Mutation du fournisseur d'accès.
)
Returns Table (
    "usIdUser"       Uuid,
    "usCourriel"     Character Varying,
    "usPasswordHash" Character Varying,
    "usPseudo"       Character Varying,
    "usRoleId"       Character Varying,
    "usProviderId"   Character Varying,
    "usSettingsUser" JsonB,
    "usRgpdConsent"  Boolean,
    "usRgpdDate"     TimeStamp Without Time Zone,
    "usCreatedAt"    TimeStamp Without Time Zone,
    "usUpdatedAt"    TimeStamp Without Time Zone
)
Language plpgsql
as $$
Begin
    Return Query
    Update public."Users"
    Set
        "usCourriel"     = Coalesce(Lower(Trim(p_sCourriel)), "usCourriel"    ),   -- Mutation avec repli automatique si absent.
        "usPasswordHash" = Coalesce(p_sPasswordHash         , "usPasswordHash"),   -- Préservation du secret si non fourni.
        "usPseudo"       = Coalesce(p_sPseudo               , "usPseudo"      ),   -- Préservation du pseudonyme si inchangé.
        "usSettingsUser" = Coalesce(p_oSettingsUser         , "usSettingsUser"),   -- Fusion ou remplacement partiel du sac.
        "usRgpdConsent"  = Coalesce(p_bRgpdConsent          , "usRgpdConsent" ),   -- Préservation du consentement RGPD.
        "usRgpdDate"     = Coalesce(p_dRgpdDate             , "usRgpdDate"    ),   -- Sauvegarde du marqueur chronologique.
        "usRoleId"       = Coalesce(p_usRoleId              , "usRoleId"      ),   -- Maintien ou surclassement du rôle.
        "usProviderId"   = Coalesce(p_usProviderId          , "usProviderId"  )    -- Maintien du mécanisme de sécurité.
    Where
        "usIdUser" = "Bin-UUID"(p_axIdUser)  -- Ciblage direct via la trame binaire 16 octets.
    Returning
        "usIdUser"::Uuid,                   -- Extraction castée conforme au contrat.
        "usCourriel",
        "usPasswordHash",
        "usPseudo",
        "usRoleId",
        "usProviderId",
        "usSettingsUser",
        "usRgpdConsent",
        "usRgpdDate",
        "usCreatedAt",
        "usUpdatedAt";                      -- Déclenchement automatique du trigger updated_at.
End;
$$;

-- ----------------------------------------------------------------------------
-- 🏛️ 3. Extraction Globale d'Administration : TousLesActeursDuChateau
-- ----------------------------------------------------------------------------
Drop Function If Exists public."LireActeursSysteme"(Integer, Integer);
Drop Function If Exists public."TousLesActeursDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesActeursDuChateau"(
    p_iLimit      Integer,                       -- Paramètre : Gabarit du nombre maximal de lignes.
    p_iOffset     Integer,                       -- Paramètre : Index de décalage de soute.
    p_sColonneTri Character Varying,             -- Paramètre : Identifiant de la colonne cible.
    p_sOrdreTri   Character Varying              -- Paramètre : Code technique ('ASC' ou 'DESC').
)
Returns Table (
    "usIdUser"       Uuid,
    "usCourriel"     Character Varying,
    "usPasswordHash" Character Varying,
    "usPseudo"       Character Varying,
    "usRoleId"       Character Varying,
    "usProviderId"   Character Varying,
    "usSettingsUser" JsonB,
    "usRgpdConsent"  Boolean,
    "usRgpdDate"     TimeStamp Without Time Zone,
    "usCreatedAt"    TimeStamp Without Time Zone,
    "usUpdatedAt"    TimeStamp Without Time Zone,
    "rNbLignesTotal" BigInt                          -- Résultat : Compteur analytique pour pagination IHM.
)
Language plpgsql
as $$
Declare
    l_sRequete Text;                                 -- Variable locale : Stockage de la trame dynamique.
Begin
    -- Construction de l'aiguillage en ligne droite pour foudroyer le coût
    l_sRequete := '
        Select
            "usIdUser"::Uuid, "usCourriel", "usPasswordHash", "usPseudo",
            "usRoleId", "usProviderId", "usSettingsUser", "usRgpdConsent", "usRgpdDate",
            "usCreatedAt", "usUpdatedAt",
            Count(*) Over()                          -- Fenêtrage atomique pour renvoyer la taille totale.
        From
            public."Users"
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;   -- Injection sécurisée des gabarits numériques.
End;
$$;

Comment On Function public."TousLesActeursDuChateau" is 'Extracteur universel d''IHM pour le grand fichier des utilisateurs de soute.';
