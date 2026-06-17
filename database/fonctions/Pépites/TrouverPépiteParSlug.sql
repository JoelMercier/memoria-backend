-- ——— fichier : database/fonctions/Pépites/TrouverPepiteParSlug.sql

Drop Function if Exists "TrouverPepiteParSlug"( p_axIdActeur Uuid, p_sSlugPepite Character Varying);

Create Or Replace Function public."TrouverPepiteParSlug"(
    p_axIdActeur  Uuid,             -- Paramètre : Clé binaire 128 bits du propriétaire (ByteA en RAM).
    p_sSlugPepite Character Varying -- Paramètre : Version URL-friendly unique nettoyée.
)
Returns Table (
    "itIdItem"        Uuid,                        -- 16 octets fixes (Colosse).
    "itUserId"        Uuid,                        -- 16 octets fixes (Colosse).
    "itCreatedAt"     TimeStamp Without Time Zone, --  8 octets fixes (Horodateur).
    "itUpdatedAt"     TimeStamp Without Time Zone, --  8 octets fixes (Horodateur).
    "itContentTypeId" Character(4),                --  4 octets fixes (Code léger).
    "itLibelle"       Character Varying,           -- Taille variable en fin de ligne.
    "itSlug"          Character Varying,
    "itAuteurSource"  Character Varying,
    "itThumbnailUrl"  Character Varying,
    "itMetadata"      JsonB,
    "itContent"       Text
)
Language plpgsql
as $$
Begin
    Return Query
    Select
        "itIdItem",
        "itUserId",
        "itCreatedAt",
        "itUpdatedAt",
        "itContentTypeId",
        "itLibelle",
        "itSlug",
        "itAuteurSource",
        "itThumbnailUrl",
        "itMetadata",
        "itContent"
    From public."Items"
    where "itUserId" = p_axIdActeur
      and "itSlug"   = Lower(Trim(p_sSlugPepite)); -- Index unique composite "Items_itUserId_itSlug_Udx" !
End;
$$;

Comment On Function public."TrouverPepiteParSlug"(Uuid, Character Varying)    is 'Tir laser chirurgical extrayant une pépite via l''index composite unique du permalien.';
