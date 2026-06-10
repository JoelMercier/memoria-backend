-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Infrastructure : Partages
-- Fichier: database\Refonte\28 - Fonctions Shares Unifiees.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Unification des flux de lecture et d'écriture du pôle Shares
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Extraction des Partages d'une Pépite : TousLesPartagesDunePepite
-- ----------------------------------------------------------------------------
Drop Function If Exists public."TousLesPartagesDunePepite"(UUID, Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesPartagesDunePepite"(
    p_axItemId        UUID,             -- 🪓 Les colosses en tête (Rule 1)
    p_iLimit          Integer,
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
)
Returns Table (
    "shIdShare"       UUID,             -- 🪓 Densité physique décroissante anti-padding (Rule 1)
    "shItemId"        UUID,
    "shItemOwnerId"   UUID,
    "shCreatedAt"     TimeStamp Without Time Zone,
    "shUpdatedAt"     TimeStamp Without Time Zone,
    "shCourrielDest"  Character Varying,
    "shJeton"         Character Varying,
    "shConfiguration" JsonB,
    "rNbLignesTotal"  BigInt
)
Language plpgsql
as $$
Declare
    l_sRequete Text;
Begin
    l_sRequete := '
        Select
            "shIdShare",
            "shItemId",
            "shItemOwnerId",
            "shCreatedAt",
            "shUpdatedAt",
            "shCourrielDest",
            "shJeton",
            "shConfiguration",
            Count(*) Over()
        From
            public."Shares"
        Where
            "shItemId" = "Bin-UUID"($1)
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $2
        Offset $3';

    Return Query Execute l_sRequete Using p_axItemId, p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesPartagesDunePepite" is 'Extracteur relationnel paginé des passerelles URL-Safe rattachées à une ressource.';


-- ----------------------------------------------------------------------------
-- 🏛️ 2. Extraction des Partages d'un Acteur : TousLesPartagesDunActeur
-- ----------------------------------------------------------------------------
Drop Function If Exists public."TousLesPartagesDunActeur"(UUID, Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesPartagesDunActeur"(
    p_axUserId        UUID,             -- 🪓 Tir direct sur la colonne dé-normalisée !
    p_iLimit          Integer,
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
)
Returns Table (
    "shIdShare"       UUID,
    "shItemId"        UUID,
    "shItemOwnerId"   UUID,
    "shCreatedAt"     TimeStamp Without Time Zone,
    "shUpdatedAt"     TimeStamp Without Time Zone,
    "shCourrielDest"  Character Varying,
    "shJeton"         Character Varying,
    "shConfiguration" JsonB,
    "rNbLignesTotal"  BigInt
)
Language plpgsql
as $$
Declare
    l_sRequete Text;
Begin
    l_sRequete := '
        Select
            "shIdShare",
            "shItemId",
            "shItemOwnerId",
            "shCreatedAt",
            "shUpdatedAt",
            "shCourrielDest",
            "shJeton",
            "shConfiguration",
            Count(*) Over()
        From
            public."Shares"
        Where
            "shItemOwnerId" = "Bin-UUID"($1)
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $2
        Offset $3';

    Return Query Execute l_sRequete Using p_axUserId, p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesPartagesDunActeur" is 'Extracteur de performance exploitant l''index d''ownership dé-normalisé sans jointure Items.';


-- ----------------------------------------------------------------------------
-- 🏛️ 3. Extraction Globale d'Administration : TousLesPartagesDuChateau
-- ----------------------------------------------------------------------------
Drop Function If Exists public."TousLesPartagesDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesPartagesDuChateau"(
    p_iLimit          Integer,
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
)
Returns Table (
    "shIdShare"       UUID,
    "shItemId"        UUID,
    "shItemOwnerId"   UUID,
    "shCreatedAt"     TimeStamp Without Time Zone,
    "shUpdatedAt"     TimeStamp Without Time Zone,
    "shCourrielDest"  Character Varying,
    "shJeton"         Character Varying,
    "shConfiguration" JsonB,
    "rNbLignesTotal"  BigInt
)
Language plpgsql
as $$
Declare
    l_sRequete Text;
Begin
    l_sRequete := '
        Select
            "shIdShare",
            "shItemId",
            "shItemOwnerId",
            "shCreatedAt",
            "shUpdatedAt",
            "shCourrielDest",
            "shJeton",
            "shConfiguration",
            Count(*) Over()
        From
            public."Shares"
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesPartagesDuChateau" is 'Extracteur universel d''administration d''IHM pour le grand coffre-fort des partages.';

-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Écriture : Partages
-- Fichier: database\Refonte\29 - Fonctions Ecriture Shares.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Verrous transactionnels unitaires d'écriture pour le pôle Shares
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Écriture Nominale Ideumpotente : CreerPartage
-- ----------------------------------------------------------------------------
Drop Function If Exists public."CreerPartage"(UUID, UUID, UUID, Character Varying, Character Varying, JsonB);

Create Or Replace Function public."CreerPartage"(
    p_axIdShare       UUID,             -- 🪓 Les colosses 16 octets fixes en tête (Rule 1)
    p_axItemId        UUID,
    p_axItemOwnerId   UUID,             -- Colonne dé-normalisée de performance
    p_sCourrielDest   Character Varying,
    p_sJeton          Character Varying,
    p_rConfiguration  JsonB              -- Les variables fin de tas
)
Returns Table (
    "shIdShare"       UUID,
    "shItemId"        UUID,
    "shItemOwnerId"   UUID,
    "shCreatedAt"     TimeStamp Without Time Zone,
    "shUpdatedAt"     TimeStamp Without Time Zone,
    "shCourrielDest"  Character Varying,
    "shJeton"         Character Varying,
    "shConfiguration" JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Insert Into public."Shares" (
        "shIdShare",
        "shItemId",
        "shItemOwnerId",
        "shCourrielDest",
        "shJeton",
        "shConfiguration"
    )
    Values (
        "Bin-UUID"(p_axIdShare),
        "Bin-UUID"(p_axItemId),
        "Bin-UUID"(p_axItemOwnerId),
        p_sCourrielDest,
        p_sJeton,
        p_rConfiguration
    )
    Returning
        "shIdShare",
        "shItemId",
        "shItemOwnerId",
        "shCreatedAt",
        "shUpdatedAt",
        "shCourrielDest",
        "shJeton",
        "shConfiguration";
End;
$$;

Comment On Function public."CreerPartage" is 'Fondeur d''écriture sécurisé injectant une nouvelle passerelle d''accès au Domaine.';


-- ----------------------------------------------------------------------------
-- 🏛️ 2. Mutation Partielle Sécurisée : ModifierPartage
-- ----------------------------------------------------------------------------
Drop Function If Exists public."ModifierPartage"(UUID, Character Varying, JsonB);

Create Or Replace Function public."ModifierPartage"(
    p_axIdShare       UUID,
    p_sCourrielDest   Character Varying,
    p_rConfiguration  JsonB
)
Returns Table (
    "shIdShare"       UUID,
    "shItemId"        UUID,
    "shItemOwnerId"   UUID,
    "shCreatedAt"     TimeStamp Without Time Zone,
    "shUpdatedAt"     TimeStamp Without Time Zone,
    "shCourrielDest"  Character Varying,
    "shJeton"         Character Varying,
    "shConfiguration" JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Update public."Shares"
    Set
        -- Coalesce préserve l'ancienne valeur si le paramètre TypeScript arrive à Null
        "shCourrielDest"  = Coalesce(p_sCourrielDest, "shCourrielDest"),
        "shConfiguration" = Coalesce(p_rConfiguration, "shConfiguration")
    Where
        "shIdShare" = "Bin-UUID"(p_axIdShare)
    Returning
        "shIdShare",
        "shItemId",
        "shItemOwnerId",
        "shCreatedAt",
        "shUpdatedAt",
        "shCourrielDest",
        "shJeton",
        "shConfiguration";
End;
$$;

Comment On Function public."ModifierPartage" is 'Applique des révisions partielles ou complètes sur les métadonnées et restrictions d''accès.';


-- ----------------------------------------------------------------------------
-- 🏛️ 3. Révocation Atomique : RevoquerPartage
-- ----------------------------------------------------------------------------
Drop Function If Exists public."RevoquerPartage"(UUID);

Create Or Replace Function public."RevoquerPartage"(
    p_axIdShare       UUID
)
Returns Boolean
Language plpgsql
as $$
Begin
    Delete From public."Shares"
    Where "shIdShare" = "Bin-UUID"(p_axIdShare);
    Return found;
End;
$$;

Comment On Function public."RevoquerPartage" is 'Révocation destructive immédiate d''une passerelle URL-Safe.';

-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées de Lecture Unitaire : Partages
-- Fichier: database\Refonte\30 - Fonctions Lecture Unique Shares.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Tirs lasers unitaires indexés pour le pôle Shares
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Lecture Directe par Clé Primaire : TrouverPartageParId
-- ----------------------------------------------------------------------------
Drop Function If Exists public."TrouverPartageParId"(UUID);

Create Or Replace Function public."TrouverPartageParId"(
    p_axIdShare UUID                  -- 🪓 16 octets fixes (Rule 1)
)
Returns Table (
    "shIdShare"       UUID,
    "shItemId"        UUID,
    "shItemOwnerId"   UUID,
    "shCreatedAt"     TimeStamp Without Time Zone,
    "shUpdatedAt"     TimeStamp Without Time Zone,
    "shCourrielDest"  Character Varying,
    "shJeton"         Character Varying,
    "shConfiguration" JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Select
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCreatedAt", "shUpdatedAt", "shCourrielDest",
        "shJeton", "shConfiguration"
    From
        public."Shares"
    Where
        "shIdShare" = "Bin-UUID"(p_axIdShare);
End;
$$;

Comment On Function public."TrouverPartageParId" is 'Tir laser indexé extrayant une passerelle unique via sa clé primaire binaire.';


-- ----------------------------------------------------------------------------
-- 🏛️ 2. Lecture par Permalien URL : TrouverPartageParJeton
-- ----------------------------------------------------------------------------
Drop Function If Exists public."TrouverPartageParJeton"(Character Varying);

Create Or Replace Function public."TrouverPartageParJeton"(
    p_sJeton Character Varying
)
Returns Table (
    "shIdShare"       UUID,
    "shItemId"        UUID,
    "shItemOwnerId"   UUID,
    "shCreatedAt"     TimeStamp Without Time Zone,
    "shUpdatedAt"     TimeStamp Without Time Zone,
    "shCourrielDest"  Character Varying,
    "shJeton"         Character Varying,
    "shConfiguration" JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Select
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCreatedAt", "shUpdatedAt", "shCourrielDest",
        "shJeton", "shConfiguration"
    From
        public."Shares"
    Where
        "shJeton" = p_sJeton;
End;
$$;

Comment On Function public."TrouverPartageParJeton" is 'Tir laser indexé extrayant une passerelle unique via son jeton cryptographique d''URL.';
