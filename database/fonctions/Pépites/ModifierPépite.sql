-- ——— fichier : database/fonctions/Pépites/ModifierPepite.sql

Drop Function If Exists public."ModifierPepite"(Uuid, Uuid, Character Varying, Character Varying, Character Varying, Text, Character Varying, Character Varying, JsonB);

Create Or Replace Function public."ModifierPepite"(
    p_axIdPepite    Uuid,
    p_axIdActeur    Uuid,
    p_ctContentType Character Varying,
    p_sLibelle      Character Varying,
    p_sSlug         Character Varying,
    p_sContent      Text,
    p_sAuteurSource Character Varying,
    p_sThumbnailUrl Character Varying,
    p_oMetadata     JsonB
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
)
Language plpgsql
as $$
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
      and "itUserId" = p_axIdActeur -- Sécurité : un acteur ne peut altérer que ses propres pépites.
    Returning *;
End;
$$;

Comment On Function public."ModifierPepite" is 'Mutation partielle sécurisée révisant l''état d''une pépite sur le tas.';
