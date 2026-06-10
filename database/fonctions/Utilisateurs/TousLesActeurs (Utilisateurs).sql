-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Infrastructure : Utilisateurs (Users)
-- Fichier: database\Refonte\32 - Fonctions Users Unifiees.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Centralisation des écritures et extractions du pôle Acteurs
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Écriture Nominale Idempotente : CreerActeur
-- ----------------------------------------------------------------------------
Drop Function If Exists public."CreerActeur"(UUID, Character Varying, Character Varying, Character Varying, Character Varying, Character Varying, JsonB, Boolean, TimeStamp Without Time Zone, TimeStamp Without Time Zone);

Create Or Replace Function public."CreerActeur"(
    p_axIdUser        UUID,             -- 🪓 Les colosses 16 octets fixes en tête (Rule 1)
    p_sCourriel       Character Varying,
    p_sPasswordHash   Character Varying,
    p_sPseudo         Character Varying,
    p_cIdRole         Character Varying,
    p_cIdProvider     Character Varying,
    p_rSettingsUser   JsonB,             -- Les variables et structures de fin de ligne
    p_bGdprConsent    Boolean,
    p_dGdprDate       TimeStamp Without Time Zone,
    p_dCreatedAt      TimeStamp Without Time Zone
)
Returns Table (
    "usIdUser"        Uuid,
    "usCourriel"      Character Varying,
    "usPasswordHash"  Character Varying,
    "usPseudo"        Character Varying,
    "usIdRole"        Character Varying,
    "usIdProvider"    Character Varying,
    "usSettingsUser"  JsonB,
    "usGdprConsent"   Boolean,
    "usGdprDate"      TimeStamp Without Time Zone,
    "usCreatedAt"     TimeStamp Without Time Zone,
    "usUpdatedAt"     TimeStamp Without Time Zone
)
Language plpgsql
as $$
Begin
    Return Query
    Insert Into public."Users" (
        "usIdUser", "usCourriel", "usPasswordHash", "usPseudo",
        "usIdRole", "usIdProvider", "usSettingsUser", "usGdprConsent", "usGdprDate", "usCreatedAt"
    )
    Values (
        "Bin-UUID"(p_axIdUser), Lower(Trim(p_sCourriel)), p_sPasswordHash, p_sPseudo,
        p_cIdRole, p_cIdProvider, p_rSettingsUser, p_bGdprConsent, p_dGdprDate, p_dCreatedAt
    )
    Returning "usIdUser", "usCourriel", "usPasswordHash", "usPseudo", "usIdRole", "usIdProvider", "usSettingsUser", "usGdprConsent", "usGdprDate", "usCreatedAt", "usUpdatedAt";
End;
$$;

-- ----------------------------------------------------------------------------
-- 🏛️ 2. Mutation Partielle Sécurisée : ModifierActeur
-- ----------------------------------------------------------------------------
Drop Function If Exists public."ModifierActeur"(UUID, Character Varying, Character Varying, Character Varying, JsonB, Boolean, TimeStamp Without Time Zone, Character Varying, Character Varying);

Create Or Replace Function public."ModifierActeur"(
    p_axIdUser        UUID,
    p_sCourriel       Character Varying,
    p_sPasswordHash   Character Varying,
    p_sPseudo         Character Varying,
    p_rSettingsUser   JsonB,
    p_bGdprConsent    Boolean,
    p_dGdprDate       TimeStamp Without Time Zone,
    p_cIdRole         Character Varying,
    p_cIdProvider     Character Varying
)
Returns Table (
    "usIdUser"        Uuid,
    "usCourriel"      Character Varying,
    "usPasswordHash"  Character Varying,
    "usPseudo"        Character Varying,
    "usIdRole"        Character Varying,
    "usIdProvider"    Character Varying,
    "usSettingsUser"  JsonB,
    "usGdprConsent"   Boolean,
    "usGdprDate"      TimeStamp Without Time Zone,
    "usCreatedAt"     TimeStamp Without Time Zone,
    "usUpdatedAt"     TimeStamp Without Time Zone
)
Language plpgsql
as $$
Begin
    Return Query
    Update public."Users"
    Set
        "usCourriel"     = Coalesce(Lower(Trim(p_sCourriel)), "usCourriel"),
        "usPasswordHash" = Coalesce(p_sPasswordHash, "usPasswordHash"),
        "usPseudo"       = Coalesce(p_sPseudo, "usPseudo"),
        "usSettingsUser" = Coalesce(p_rSettingsUser, "usSettingsUser"),
        "usGdprConsent"  = Coalesce(p_bGdprConsent, "usGdprConsent"),
        "usGdprDate"     = Coalesce(p_dGdprDate, "usGdprDate"),
        "usIdRole"       = Coalesce(p_cIdRole, "usIdRole"),
        "usIdProvider"   = Coalesce(p_cIdProvider, "usIdProvider")
    Where
        "usIdUser" = "Bin-UUID"(p_axIdUser)
    Returning "usIdUser", "usCourriel", "usPasswordHash", "usPseudo", "usIdRole", "usIdProvider", "usSettingsUser", "usGdprConsent", "usGdprDate", "usCreatedAt", "usUpdatedAt";
End;
$$;

-- ----------------------------------------------------------------------------
-- 🏛️ 3. Extraction Globale d'Administration : TousLesActeursDuChateau
-- ----------------------------------------------------------------------------
Drop Function If Exists public."LireActeursSysteme"(Integer, Integer);
Drop Function If Exists public."TousLesActeursDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesActeursDuChateau"(
    p_iLimit          Integer,
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
)
Returns Table (
    "usIdUser"        Uuid,
    "usCourriel"      Character Varying,
    "usPasswordHash"  Character Varying,
    "usPseudo"        Character Varying,
    "usIdRole"        Character Varying,
    "usIdProvider"    Character Varying,
    "usSettingsUser"  JsonB,
    "usGdprConsent"   Boolean,
    "usGdprDate"      TimeStamp Without Time Zone,
    "usCreatedAt"     TimeStamp Without Time Zone,
    "usUpdatedAt"     TimeStamp Without Time Zone,
    "rNbLignesTotal"  BigInt
)
Language plpgsql
as $$
Declare
    l_sRequete Text;
Begin
    l_sRequete := '
        Select
            "usIdUser", "usCourriel", "usPasswordHash", "usPseudo",
            "usIdRole", "usIdProvider", "usSettingsUser", "usGdprConsent", "usGdprDate",
            "usCreatedAt", "usUpdatedAt",
            Count(*) Over()
        From
            public."Users"
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesActeursDuChateau" is 'Extracteur universel d''IHM pour le grand fichier des utilisateurs de soute.';
