-- ============================================================================
-- 👥 Mémoria - Fonctions Stockées d'Infrastructure : Pôle Acteurs (Users)
-- Fichier: database/functions/TousLesActeurs(Utilisateurs).sql
-- Version: 4.2.0 (PostgreSQL 17+ - Jojo-Style Compliant Strict)
-- Description: Mutations d'acteurs sécurisées par arbitrage de repli dynamique
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Écriture Nominale Idempotente et Sécurisée : CreerActeur
-- ----------------------------------------------------------------------------
Drop Function if exists public."CreerActeur"(UUID, Character Varying, Character Varying, Character Varying, Character Varying, Character Varying, JsonB, Boolean, TimeStamp Without Time Zone, TimeStamp Without Time Zone);

Create Or Replace Function public."CreerActeur"(
    p_axIdUser      UUID,                        -- Paramètre : L'identifiant 128 bits natif (Rule 1).
    p_sCourriel     Character Varying,           -- Paramètre : Chaîne de l'adresse de contact.
    p_sPasswordHash Character Varying,           -- Paramètre : Empreinte secrète Argon2id.
    p_sPseudo       Character Varying,           -- Paramètre : Pseudonyme public d'affichage.
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
    "usRgpdConsent"  Boolean,                     -- [RÉPARÉ V4] Aligné au caractère près sur la table.
    "usRgpdDate"     TimeStamp Without Time Zone, -- [RÉPARÉ V4] Aligné au caractère près sur la table.
    "usCreatedAt"    TimeStamp Without Time Zone,
    "usUpdatedAt"    TimeStamp Without Time Zone
)
Language plpgsql
as $$
Declare
    l_usRoleIdCalculé     Character Varying(4);  -- Variable locale : Arbitrage dynamique du privilège.
    l_usProviderIdCalculé Character Varying(4);  -- Variable locale : Arbitrage dynamique du mécanisme.
Begin
    -- 🪓 ARBITRAGE DU ROLE : Si le paramètre existe en base on le prend, sinon direction le bit roDefaut
    If Exists (Select 1 From public."Roles" Where "roIdRole" = p_usRoleId) Then
        l_usRoleIdCalculé := p_usRoleId;
    Else
        l_usRoleIdCalculé := (Select "roIdRole" From public."Roles" Where "roDefaut" = True Limit 1);
    End if;

    -- 🪓 ARBITRAGE DU PROVIDER : Si le paramètre existe en base on le prend, sinon direction le bit apDefaut
    If Exists (Select 1 From public."Providers" Where "prIdProvider" = p_usProviderId) Then
        l_usProviderIdCalculé := p_usProviderId;
    Else
        l_usProviderIdCalculé := (Select "prIdProvider" From public."Providers" Where "prDefaut" = True Limit 1);
    End if;

    Return Query
    Insert Into public."Users" (
        "usIdUser", "usCourriel", "usPasswordHash", "usPseudo",
        "usRoleId", "usProviderId", "usSettingsUser", "usRgpdConsent", "usRgpdDate", "usCreatedAt"
    )
    Values (
        p_axIdUser,                               -- [RÉPARÉ V4] UUID natif inséré directement sans "Bin-UUID".
        Lower(Trim(p_sCourriel)),                 -- Normalisation en minuscules stricts.
        p_sPasswordHash,
        Trim(p_sPseudo),
        l_usRoleIdCalculé,                        -- Injection du code validé ou replié.
        l_usProviderIdCalculé,                    -- Injection du code validé ou replié.
        p_oSettingsUser,
        p_bRgpdConsent,
        p_dRgpdDate,
        p_dCreatedAt
    )
    Returning
        "usIdUser",                               -- Plus besoin de cast, c'est déjà de l'UUID natif.
        "usCourriel",
        "usPasswordHash",
        "usPseudo",
        "usRoleId",
        "usProviderId",
        "usSettingsUser",
        "usRgpdConsent",
        "usRgpdDate",
        "usCreatedAt",
        "usUpdatedAt";
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
Declare
    l_usRoleIdCalculé     Character Varying(4);  -- Variable locale : Arbitrage du privilège après révision.
    l_usProviderIdCalculé Character Varying(4);  -- Variable locale : Arbitrage du mécanisme après révision.
Begin
    -- 🪓 ARBITRAGE DU ROLE : Si fourni, on vérifie l'existence, sinon on conserve l'état actuel de la table
    If p_usRoleId Is Not Null Then
        If Exists (Select 1 From public."Roles" Where "roIdRole" = p_usRoleId) Then
            l_usRoleIdCalculé := p_usRoleId;
        Else
            l_usRoleIdCalculé := (Select "usRoleId" From public."Users" Where "usIdUser" = p_axIdUser);
        End if;
    Else
        l_usRoleIdCalculé := Null;
    End if;

    -- 🪓 ARBITRAGE DU PROVIDER : Si fourni, on vérifie l'existence, sinon on conserve l'état actuel de la table
    If p_usProviderId Is Not Null Then
        If Exists (Select 1 From public."Providers" Where "prIdProvider" = p_usProviderId) Then
            l_usProviderIdCalculé := p_usProviderId;
        Else
            l_usProviderIdCalculé := (Select "usProviderId" From public."Users" Where "usIdUser" = p_axIdUser);
        End if;
    Else
        l_usProviderIdCalculé := Null;
    End if;

    Return Query
    Update public."Users"
    Set
        "usCourriel"     = Coalesce(Lower(Trim(p_sCourriel)), "usCourriel"    ),
        "usPasswordHash" = Coalesce(p_sPasswordHash         , "usPasswordHash"),
        "usPseudo"       = Coalesce(p_sPseudo               , "usPseudo"      ),
        "usSettingsUser" = Coalesce(p_oSettingsUser         , "usSettingsUser"),
        "usRgpdConsent"  = Coalesce(p_bRgpdConsent          , "usRgpdConsent" ),
        "usRgpdDate"     = Coalesce(p_dRgpdDate             , "usRgpdDate"    ),
        "usRoleId"       = Coalesce(l_usRoleIdCalculé       , "usRoleId"      ),   -- Injection du rôle arbitré.
        "usProviderId"   = Coalesce(l_usProviderIdCalculé   , "usProviderId"  )    -- Injection du mécanisme arbitré.
    Where
        "usIdUser" = p_axIdUser                   -- [RÉPARÉ V4] UUID natif ciblé en ligne droite.
    Returning
        "usIdUser",
        "usCourriel",
        "usPasswordHash",
        "usPseudo",
        "usRoleId",
        "usProviderId",
        "usSettingsUser",
        "usRgpdConsent",
        "usRgpdDate",
        "usCreatedAt",
        "usUpdatedAt";
End;
$$;
-- ----------------------------------------------------------------------------
-- 🏛️ 3. Extraction Globale d'Administration : TousLesActeursDuChateau
-- ----------------------------------------------------------------------------
Drop Function if exists public."LireActeursSysteme"(Integer, Integer);
Drop Function if exists public."TousLesActeursDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesActeursDuChateau"(
    p_iLimit      Integer,                       -- Paramètre : Gabarit du nombre maximal de lignes.
    p_iOffset     Integer,                       -- Paramètre : Index de décalage de soute.
    p_sColonneTri Character Varying,             -- Paramètre : Identifiant de la colonne cible.
    p_sOrdreTri   Character Varying              -- Paramètre : Code technique (''ASC'' ou ''DESC'').
)
Returns Table (
    "usIdUser"       Uuid,
    "usCourriel"     Character Varying,
    "usPasswordHash" Character Varying,
    "usPseudo"       Character Varying,
    "usRoleId"       Character Varying,
    "usProviderId"   Character Varying,
    "usSettingsUser" JsonB,
    "usRgpdConsent"  Boolean,                     -- [RÉPARÉ V4] Alignement nominal franconien sur la table.
    "usRgpdDate"     TimeStamp Without Time Zone, -- [RÉPARÉ V4] Alignement nominal franconien sur la table.
    "usCreatedAt"    TimeStamp Without Time Zone,
    "usUpdatedAt"    TimeStamp Without Time Zone,
    "rNbLignesTotal" BigInt                       -- Résultat : Compteur analytique pour pagination IHM.
)
Language plpgsql
as $$
Declare
    l_sRequete Text;                             -- Variable locale : Stockage de la trame dynamique.
Begin
    -- Construction de l'aiguillage en ligne droite au format immobilier 1960
    l_sRequete := '
        Select
            "usIdUser", "usCourriel", "usPasswordHash", "usPseudo",
            "usRoleId", "usProviderId", "usSettingsUser", "usRgpdConsent", "usRgpdDate",
            "usCreatedAt", "usUpdatedAt",
            Count(*) Over()                      -- Fenêtrage atomique analytique pour la pagination.
        From
            public."Users"
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesActeursDuChateau"(Integer, Integer, Character Varying, Character Varying) Is 'Extracteur universel d''IHM pour le grand fichier des utilisateurs de soute en UUID natif pur.';
