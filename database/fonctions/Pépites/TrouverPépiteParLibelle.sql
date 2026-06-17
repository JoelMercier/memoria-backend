-- ——— fichier : database/fonctions/Pépites/TrouverPepiteParLibelle.sql

Drop Function if Exists "TrouverPepiteParLibelle"( p_axIdActeur Uuid, p_sLibellePepite Character Varying );

Create Or Replace Function public."TrouverPepiteParLibelle"(
    p_axIdActeur     Uuid,             -- Paramètre : Clé binaire 128 bits du propriétaire.
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
    where "itUserId" = "Bin-UUID"(p_axIdActeur)
      and "itLibelle" = Trim(p_sLibellePepite); -- Index unique composite "Items_itUserId_itLibelle_Udx" !
End;
$$;

Comment On Function public."TrouverPepiteParLibelle"(Uuid, Character Varying) is 'Tir laser anti-doublon extrayant une pépite via l''index composite unique de son libellé.';
