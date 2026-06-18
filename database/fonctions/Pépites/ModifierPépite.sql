-- ——— fichier : database/fonctions/Pépites/ModifierPepite.sql

-- ============================================================================
-- 🚨 INFRASTRUCTURE : MUTATEUR CHIRURGICAL ET PARTIEL DES PÉPITES D'OR
-- Version: 4.2.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Mise à jour sécurisée sur index unique sous Security Definer.
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function If Exists public."ModifierPepite"(Uuid, Uuid, Character Varying, Character Varying, Character Varying, Text, Character Varying, Character Varying, JsonB);
Drop Function If Exists public."ModifierPepite"(Uuid, Uuid, Character, Character Varying, Character Varying, Text, Character Varying, Character Varying, JsonB);

Create Or Replace Function public."ModifierPepite"(
    p_axIdPepite    Uuid,              -- Paramètre : Identifiant 128 bits natif de la pépite.
    p_axIdActeur    Uuid,              -- Paramètre : Identifiant 128 bits natif de l'acteur propriétaire.
    p_ctContentType Character(4),      -- [RÉPARÉ Rule 1] Alignement strict sur le format fixe Char(4) [1.1].
    p_sLibelle      Character Varying, -- Paramètre : Nouveau titre nominal nettoyé optionnel.
    p_sSlug         Character Varying, -- Paramètre : Nouveau permalien calculé en RAM optionnel.
    p_sContent      Text,              -- Paramètre : Nouveau corps textuel lourd de la ressource.
    p_sAuteurSource Character Varying, -- Paramètre : Nouvelle origine ou auteur de la collecte.
    p_sThumbnailUrl Character Varying, -- Paramètre : Nouvelle illustration optionnelle.
    p_oMetadata     JsonB              -- Paramètre : Nouveau conteneur d'attributs flexibles.
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
    Update public."Items"
    Set
        "itContentTypeId" = Coalesce(p_ctContentType, "itContentTypeId"),
        "itLibelle"       = Coalesce(Trim(p_sLibelle), "itLibelle"),
        "itSlug"          = Coalesce(Lower(Trim(p_sSlug)), "itSlug"),
        "itContent"       = Coalesce(p_sContent, "itContent"),
        "itAuteurSource"  = Coalesce(Trim(p_sAuteurSource), "itAuteurSource"),
        "itThumbnailUrl"  = Coalesce(p_sThumbnailUrl, "itThumbnailUrl"),
        "itMetadata"      = Coalesce(p_oMetadata, "itMetadata")
    Where "itIdItem" = p_axIdPepite
      and "itUserId" = p_axIdActeur -- [SCELLÉ] Sécurité : un acteur ne peut altérer que ses propres pépites.
    Returning *;
End;
$$ Language plpgsql Security Definer; -- 🔒 [DECRET JOEL] Sûreté absolue face au rôle restreint de Mémoria [1.1] !

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire (Rule 7 : Alignement vertical du 'is')
-- ----------------------------------------------------------------------------
Comment On Function public."ModifierPepite"(Uuid, Uuid, Character, Character Varying, Character Varying, Text, Character Varying, Character Varying, JsonB) is 'Mutation partielle sécurisée révisant l''état d''une pépite sur le tas [1.1].';
