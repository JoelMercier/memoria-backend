-- ——— fichier : database/fonctions/Pépites/TrouverPepiteParSlug.sql

-- ============================================================================
-- 🚨 INFRASTRUCTURE : RECHERCHE CHIRURGICALE VIA INDEX COMPOSITE DE PERMALIEN
-- Version: 4.2.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Extraction instantanée par index unique composite de slug.
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if Exists public."TrouverPepiteParSlug"(Uuid, Character Varying);

Create Or Replace Function public."TrouverPepiteParSlug"(
    p_axIdActeur  Uuid,             -- Paramètre : Identifiant 128 bits natif de l'acteur.
    p_sSlugPepite Character Varying -- Paramètre : Version URL-friendly unique nettoyée.
)
Returns Table (
    "itIdItem"        Uuid,                        -- 16 octets fixes (UUID natif).
    "itUserId"        Uuid,                        -- 16 octets fixes (UUID natif).
    "itCreatedAt"     TimeStamp Without Time Zone, --  8 octets fixes (Horodateur).
    "itUpdatedAt"     TimeStamp Without Time Zone, --  8 octets fixes (Horodateur).
    "itContentTypeId" Character(4),                --  4 octets fixes (Code léger).
    "itLibelle"       Character Varying,           -- Taille variable en fin de ligne.
    "itSlug"          Character Varying,
    "itAuteurSource"  Character Varying,
    "itThumbnailUrl"  Character Varying,
    "itMetadata"      JsonB,
    "itContent"       Text
) As $$
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
    Where "itUserId" = p_axIdActeur
      and "itSlug"   = Lower(Trim(p_sSlugPepite)); -- [SCELLÉ] Alignement strict sur l'index composite unique de slug.
End;
$$ Language plpgsql Security Definer; -- 🔒 [DECRET JOEL] Sûreté d'exécution garantie pour l'extraction !

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire (Rule 7 : Alignement vertical du 'is')
-- ----------------------------------------------------------------------------
Comment On Function public."TrouverPepiteParSlug"(Uuid, Character Varying) is 'Tir laser chirurgical extrayant une pépite via l''index composite unique du permalien.';
