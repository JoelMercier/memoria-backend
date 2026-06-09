-- ============================================================================
-- 🗄️ Mémoria - Fonction Stockée : ToutesLesPepitesDuChateau
-- Fichier: database\Refonte\21 - Fonction ToutesLesPepitesDuChateau.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Extraction globale, systémique et paginée de tout le tas physique
-- ============================================================================
Drop Function if exists "ToutesLesPepitesDuChateau"(
    p_iLimit          Integer,           -- 🪓 Les colosses et numériques en tête
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
);

Create Or Replace Function public."ToutesLesPepitesDuChateau"(
    p_iLimit          Integer,           -- 🪓 Les colosses et numériques en tête
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
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
    "rNbLignesTotal"  BigInt
)
Language plpgsql
as $$
Declare
    l_sRequete Text;
Begin
    -- Construction de la requête système pure, sans aucun filtre d'ownership (Rule 3)
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
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete
    Using p_iLimit, p_iOffset;
End;
$$;

COMMENT ON FUNCTION public."ToutesLesPepitesDuChateau" is 'Extracteur systémique et global pour l''administration, exempt de barrière d''acteur.';
