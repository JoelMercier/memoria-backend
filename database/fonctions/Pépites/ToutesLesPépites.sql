-- ============================================================================
-- 🗄️ Mémoria - Fonction Stockée : ToutesLesPepites
-- Fichier: database\Refonte\20 - Fonction ToutesLesPepites.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Extraction unifiée, filtrée et paginée des pépites
-- ============================================================================
Drop Function if exists "ToutesLesPepites"(
    p_axUserId        Bytea,
    p_cContentTypeId  Character Varying,
    p_sMotsCles       Character Varying,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying,
    p_iLimit          Integer,
    p_iOffset         Integer
);

Create Or Replace Function public."ToutesLesPepites"(
    p_axUserId        Bytea,             -- 🪓 Les colosses en tête (Rule 1)
    p_cContentTypeId  Character Varying,
    p_sMotsCles       Character Varying,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying,
    p_iLimit          Integer,
    p_iOffset         Integer
)
Returns Table (
    -- 1. Les colosses (16 octets fixes fixed-width Bytea/UUID) (Rule 1)
    "itIdItem"        Uuid,
    "itUserId"        Uuid,

    -- 2. Les horodateurs (8 octets fixes fixed-width)
    "itCreatedAt"     TimeStamp Without Time Zone,
    "itUpdatedAt"     TimeStamp Without Time Zone,

    -- 3. Les variables et fin de tas (Rule 1)
    "itContentTypeId" Character Varying,
    "itTitle"         Character Varying,
    "itSlug"          Character Varying,
    "itContent"       Text,
    "itSourceAuthor"  Character Varying,
    "itThumbnailUrl"  Character Varying,
    "itMetadata"      JsonB,
    "rNbLignesTotal"  BigInt -- 🗲 [Rule 5] Majuscules accentuées sur le retour !
)
Language plpgsql
as $$
Declare
    l_sRequete Text;
Begin
    -- 🪓 Construction de la requête dynamique épurée (ZÉRO ALIAS DE TABLE - Rule 3)
    l_sRequete := '
        Select
            "itIdItem",
            "itUserId",
            "itCreatedAt",
            "itUpdatedAt",
            "itContentTypeId",
            "itTitle",
            "itSlug",
            "itContent",
            "itSourceAuthor",
            "itThumbnailUrl",
            "itMetadata",
            Count(*) Over()
        From
            public."Items"
        Where
            "itUserId" = "Bin-UUID"($1)
            and ($2 is Null or "itContentTypeId" = $2)
            and ($3 is Null or "itTitle" Ilike $3)
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $4
        Offset $5';

    Return Query Execute l_sRequete
    Using p_axUserId, p_cContentTypeId, p_sMotsCles, p_iLimit, p_iOffset;
End;
$$;

COMMENT ON FUNCTION public."ToutesLesPepites" is 'Extracteur universel dé-normalisé et paginé pour la table Items, calé sur le français d''élite.';
