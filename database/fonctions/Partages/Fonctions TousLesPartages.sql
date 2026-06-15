-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Infrastructure : Partages (Partie 1/2)
-- Fichier: database/functions/Partages/Fonctions TousLesPartages.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Extractions globales et indexées du pôle Shares en UUID natif
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Extraction des Partages d'une Pépite : TousLesPartagesDunePepite
-- ----------------------------------------------------------------------------
Drop Function if exists public."TousLesPartagesDunePepite"(UUID, Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesPartagesDunePepite"(
    p_axItemId    UUID,                                         -- L'identifiant 128 bits natif de la pépite.
    p_iLimit      Integer,
    p_iOffset     Integer,
    p_sColonneTri Character Varying,
    p_sOrdreTri   Character Varying
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"  Character Varying,                          -- [RÉPARÉ V4] Aligné sur shAccesJeton.
    "shAccesConfig" JsonB,                                      -- [RÉPARÉ V4] Aligné sur shAccesConfig.
    "rNbLignesTotal" BigInt
)
Language plpgsql
as $$
Declare
    l_sRequete Text;                                            -- Variable locale : Requête textuelle dynamique.
Begin
    l_sRequete := '
        Select
            "shIdShare",
            "shItemId",
            "shItemOwnerId",
            "shCreatedAt",
            "shUpdatedAt",
            "shCourrielDest",
            "shAccesJeton",
            "shAccesConfig",
            Count(*) Over()
        From
            public."Shares"
        Where
            "shItemId" = $1                                     -- [RÉPARÉ V4] UUID natif direct sans "Bin-UUID".
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $2
        Offset $3';

    Return Query Execute l_sRequete Using p_axItemId, p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesPartagesDunePepite"(UUID, Integer, Integer, Character Varying, Character Varying) Is 'Extracteur relationnel paginé des passerelles URL-Safe rattachées à une ressource en UUID natif pur.';


-- ----------------------------------------------------------------------------
-- 🏛️ 2. Extraction des Partages d'un Acteur : TousLesPartagesDunActeur
-- ----------------------------------------------------------------------------
Drop Function if exists public."TousLesPartagesDunActeur"(UUID, Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesPartagesDunActeur"(
    p_axUserId    UUID,                                         -- Tir direct sur la colonne dé-normalisée.
    p_iLimit      Integer,
    p_iOffset     Integer,
    p_sColonneTri Character Varying,
    p_sOrdreTri   Character Varying
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"  Character Varying,                          -- [RÉPARÉ V4] Aligné sur shAccesJeton.
    "shAccesConfig" JsonB,                                      -- [RÉPARÉ V4] Aligné sur shAccesConfig.
    "rNbLignesTotal" BigInt
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
            "shAccesJeton",
            "shAccesConfig",
            Count(*) Over()
        From
            public."Shares"
        Where
            "shItemOwnerId" = $1                                -- [RÉPARÉ V4] UUID natif direct sans "Bin-UUID".
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $2
        Offset $3';

    Return Query Execute l_sRequete Using p_axUserId, p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesPartagesDunActeur"(UUID, Integer, Integer, Character Varying, Character Varying) Is 'Extracteur de performance exploitant l''index d''ownership dé-normalisé sans jointure.';


-- ----------------------------------------------------------------------------
-- 🏛️ 3. Extraction Globale d'Administration : TousLesPartagesDuChateau
-- ----------------------------------------------------------------------------
Drop Function if exists public."TousLesPartagesDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesPartagesDuChateau"(
    p_iLimit      Integer,
    p_iOffset     Integer,
    p_sColonneTri Character Varying,
    p_sOrdreTri   Character Varying
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"  Character Varying,                          -- [RÉPARÉ V4] Aligné sur shAccesJeton.
    "shAccesConfig" JsonB,                                      -- [RÉPARÉ V4] Aligné sur shAccesConfig.
    "rNbLignesTotal" BigInt
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
            "shAccesJeton",
            "shAccesConfig",
            Count(*) Over()
        From
            public."Shares"
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesPartagesDuChateau"(Integer, Integer, Character Varying, Character Varying) Is 'Extracteur universel d''administration d''IHM pour le grand fichier des partages de soute.';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Écriture Nominale : CreerPartage
-- ----------------------------------------------------------------------------
Drop Function if exists public."CreerPartage"(UUID, UUID, UUID, Character Varying, Character Varying, JsonB);

Create Or Replace Function public."CreerPartage"(
    p_axIdShare      UUID,                                      -- L'identifiant 128 bits natif du partage (Rule 1).
    p_axItemId       UUID,                                      -- Clé étrangère liée à la table Items.
    p_axItemOwnerId  UUID,                                      -- Colonne dé-normalisée de performance pure.
    p_sCourrielDest  Character Varying,
    p_sAccesJeton    Character Varying,                         -- Paramètre réaligné sur shAccesJeton.
    p_rAccesConfig   JsonB                                      -- Paramètre réaligné sur shAccesConfig.
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"  Character Varying,                          -- [RÉPARÉ V4] Alignement nominal.
    "shAccesConfig" JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Insert Into public."Shares" (
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCourrielDest", "shAccesJeton", "shAccesConfig"
    )
    Values (
        p_axIdShare, p_axItemId, p_axItemOwnerId,                -- [RÉPARÉ V4] UUID natifs injectés directement.
        p_sCourrielDest, p_sAccesJeton, p_rAccesConfig
    )
    Returning
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCreatedAt", "shUpdatedAt", "shCourrielDest",
        "shAccesJeton", "shAccesConfig";
End;
$$;

Comment On Function public."CreerPartage"(UUID, UUID, UUID, Character Varying, Character Varying, JsonB) Is 'Fondeur d''écriture sécurisé injectant une nouvelle passerelle d''accès en UUID natif pur.';

-- ----------------------------------------------------------------------------
-- 🏛️ 2. Mutation Partielle Sécurisée : ModifierPartage
-- ----------------------------------------------------------------------------
Drop Function if exists public."ModifierPartage"(UUID, Character Varying, JsonB);

Create Or Replace Function public."ModifierPartage"(
    p_axIdShare    UUID,
    p_sCourrielDest Character Varying,
    p_rAccesConfig  JsonB
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"  Character Varying,
    "shAccesConfig" JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Update public."Shares"
    Set
        "shCourrielDest" = Coalesce(p_sCourrielDest, "shCourrielDest"),
        "shAccesConfig"  = Coalesce(p_rAccesConfig, "shAccesConfig")   -- [RÉPARÉ V4] Mutation avec repli sur shAccesConfig.
    Where
        "shIdShare" = p_axIdShare                               -- [RÉPARÉ V4] UUID natif ciblé en ligne droite.
    Returning
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCreatedAt", "shUpdatedAt", "shCourrielDest",
        "shAccesJeton", "shAccesConfig";
End;
$$;

Comment On Function public."ModifierPartage"(UUID, Character Varying, JsonB) Is 'Applique des révisions partielles sur les restrictions d''accès shAccesConfig en UUID natif.';

-- ----------------------------------------------------------------------------
-- 🏛️ 3. Révocation Atomique : RevoquerPartage
-- ----------------------------------------------------------------------------
Drop Function if exists public."RevoquerPartage"(UUID);

Create Or Replace Function public."RevoquerPartage"(
    p_axIdShare UUID
)
Returns Boolean
Language plpgsql
as $$
Begin
    Delete From public."Shares"
    Where "shIdShare" = p_axIdShare;                            -- [RÉPARÉ V4] Révocation directe sans "Bin-UUID".
    Return found;
End;
$$;

Comment On Function public."RevoquerPartage"(UUID) Is 'Révocation destructive immédiate d''une passerelle URL-Safe via son UUID natif.';

-- ----------------------------------------------------------------------------
-- 🏛️ 4. Lecture Directe par Clé Primaire : TrouverPartageParId
-- ----------------------------------------------------------------------------
Drop Function if exists public."TrouverPartageParId"(UUID);

Create Or Replace Function public."TrouverPartageParId"(
    p_axIdShare UUID
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"  Character Varying,
    "shAccesConfig" JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Select
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCreatedAt", "shUpdatedAt", "shCourrielDest",
        "shAccesJeton", "shAccesConfig"
    From
        public."Shares"
    Where
        "shIdShare" = p_axIdShare;                               -- [RÉPARÉ V4] Tir laser sur index de clé primaire.
End;
$$;

Comment On Function public."TrouverPartageParId"(UUID) Is 'Tir laser indexé extrayant une passerelle unique via sa clé primaire binaire UUID.';

-- ----------------------------------------------------------------------------
-- 🏛️ 5. Lecture par Permalien URL : TrouverPartageParJeton
-- ----------------------------------------------------------------------------
Drop Function if exists public."TrouverPartageParJeton"(Character Varying);

Create Or Replace Function public."TrouverPartageParJeton"(
    p_sAccesJeton Character Varying
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"  Character Varying,
    "shAccesConfig" JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Select
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCreatedAt", "shUpdatedAt", "shCourrielDest",
        "shAccesJeton", "shAccesConfig"
    From
        public."Shares"
    Where
        "shAccesJeton" = p_sAccesJeton;                         -- [RÉPARÉ V4] Match sur l''index unique shAccesJeton.
End;
$$;

Comment On Function public."TrouverPartageParJeton"(Character Varying) Is 'Tir laser indexé extrayant une passerelle unique via son jeton d''accès d''URL.';
