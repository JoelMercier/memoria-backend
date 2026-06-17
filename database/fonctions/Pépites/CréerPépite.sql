-- ——— fichier : database/fonctions/Pépites/CreerPepite.sql

Drop Function If Exists public."CreerPepite"(Uuid, Uuid, Character Varying, Character Varying, Character Varying, Text, Character Varying, Character Varying, JsonB);

Create Or Replace Function public."CreerPepite"(
    p_axIdPepite    Uuid,              -- Paramètre : Clé binaire 128 bits de la pépite (ByteA).
    p_axIdActeur    Uuid,              -- Paramètre : Clé binaire 128 bits de l'acteur propriétaire.
    p_ctContentType Character Varying, -- Paramètre : Code technique du type de contenu.
    p_sLibelle      Character Varying, -- Paramètre : Titre nominal nettoyé.
    p_sSlug         Character Varying, -- Paramètre : Permalien unique calculé en RAM.
    p_sContent      Text,              -- Paramètre : Corps textuel lourd de la ressource.
    p_sAuteurSource Character Varying, -- Paramètre : Origine ou auteur de la collecte.
    p_sThumbnailUrl Character Varying, -- Paramètre : Lien de l'illustration optionnelle.
    p_oMetadata     JsonB              -- Paramètre : Conteneur flexible d'attributs.
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
    Insert Into public."Items" (
        "itIdItem", "itUserId", "itContentTypeId", "itLibelle",
        "itSlug", "itContent", "itAuteurSource", "itThumbnailUrl", "itMetadata"
    )
    Values (
        p_axIdPepite,
        p_axIdActeur,
        p_ctContentType,
        Trim(p_sLibelle),
        Lower(Trim(p_sSlug)),
        p_sContent,
        Trim(p_sAuteurSource),
        p_sThumbnailUrl,
        p_oMetadata
    )
    Returning *; -- Crache la ligne physique indexée en tas au format Jojo-Style.
End;
$$;

Comment On Function public."CreerPepite" is 'Mutation nominale insérant une pépite d''or en soute basse avec forçage de l''idempotence.';
