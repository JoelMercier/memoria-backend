-- ——— fichier : database/fonctions/Pépites/TrouverPepiteParLibelle.sql

-- ============================================================================
-- 🚨 INFRASTRUCTURE : TIR LASER ANTI-DOUBLON VIA INDEX COMPOSITE UNIQUE
-- Version: 4.2.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Recherche exacte ultra-rapide sur l'index unique de soute.
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if Exists public."TrouverPepiteParLibelle"(Uuid, Character Varying);

Create Or Replace Function public."TrouverPepiteParLibelle"(
    p_axIdActeur     Uuid,             -- Paramètre : Identifiant 128 bits natif de l'acteur.
    p_sLibellePepite Character Varying -- Paramètre : Titre nominal brut recherché.
)
Returns Table (
    "itIdItem"        Uuid,
    "itUserId"        Uuid,
    "itCreatedAt"     TimeStamp Without Time Zone,
    "itUpdatedAt"     TimeStamp Without Time Zone,
    "itContentTypeId" Character(4),
    "itLibelle"       Character Varying,
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
    Where "itUserId"  = p_axIdActeur          -- [RÉPARÉ] Comparaison binaire directe 128 bits pour mordre dans l'index !
      and "itLibelle" = Trim(p_sLibellePepite); -- [SCELLÉ] Alignement strict sur l'index composite unique.
End;
$$ Language plpgsql Security Definer; -- 🔒 [DECRET JOEL] Sûreté d'exécution garantie pour l'anti-doublon !

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire (Rule 7 : Alignement vertical du 'is')
-- ----------------------------------------------------------------------------
Comment On Function public."TrouverPepiteParLibelle"(Uuid, Character Varying) is 'Tir laser anti-doublon extrayant une pépite via l''index composite unique de son libellé.';
