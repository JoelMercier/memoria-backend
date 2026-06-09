-- ——— fichier : database\fonctions\Pépites-Étiquette\Fonction ÉtiquettesD'UnePépite.sql

-- ============================================================================
-- 🗄️ Mémoria - Fonction Stockée : EtiquettesDunePepite
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Extraction des instances de tags rattachées à une pépite
-- ============================================================================

-- 🪓 Destruction préventive de l'ancien moule pour éviter les conflits de soute
Drop Function If Exists public."EtiquettesDunePepite"(UUID);

Create Or Replace Function public."EtiquettesDunePepite"(
    p_axItemId UUID                  -- 🪓 Les colosses fixes 16 octets (Rule 1)
)
Returns Table (
    -- 1. Les colosses (16 octets fixes fixed-width Bytea/UUID) (Rule 1)
    "tgIdTag"     Uuid,
    "tgUserId"    Uuid,

    -- 2. Les horodateurs (8 octets fixes fixed-width)
    "tgCreatedAt" TimeStamp Without Time Zone,
    "tgUpdatedAt" TimeStamp Without Time Zone,

    -- 3. Les variables et fin de tas (Rule 1)
    "tgName"      Character Varying
)
Language plpgsql
as $$
Begin
    Return Query
    Select
        "tgIdTag",
        "tgUserId",
        "tgCreatedAt",
        "tgUpdatedAt",
        "tgName"
    From
        public."Tags"
    Inner Join
        public."ItemTags" on "tiTagId" = "tgIdTag"
    Where
        "tiItemId" = "Bin-UUID"(p_axItemId)
    Order By
        "tgName" Asc;
End;
$$;

Comment On Function public."EtiquettesDunePepite" is 'Extracteur relationnel d''élite rapatriant les mots-clés d''une pépite, ordonnés par nom.';
