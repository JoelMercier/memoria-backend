-- ——— fichier : database/fonctions/Pépites/CreerPepite.sql

-- ============================================================================
-- 🚨 INFRASTRUCTURE : INJECTEUR NOMINAL D'ÉCRITURE DES PÉPITES D'OR
-- Version: 4.2.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Insertion atomique sécurisée sous le régime Security Definer.
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function If Exists public."CreerPepite"(Uuid, Uuid, Character Varying, Character Varying, Character Varying, Text, Character Varying, Character Varying, JsonB);
Drop Function If Exists public."CreerPepite"(Uuid, Uuid, Character, Character Varying, Character Varying, Text, Character Varying, Character Varying, JsonB);

Create Or Replace Function public."CreerPepite"(
    p_axIdPepite    Uuid,              -- Paramètre : Clé binaire 128 bits de la pépite.
    p_axIdActeur    Uuid,              -- Paramètre : Clé binaire 128 bits de l'acteur propriétaire.
    p_ctContentType Character(4),      -- [RÉPARÉ V4] Alignement strict sur le type Char(4) fixe [1.1].
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
) As $$
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
    Returning *; -- Crache la ligne physique indexée en tas au format Jojo-Style [1.1].
End;
$$ Language plpgsql Security Definer; -- 🔒 [DECRET JOEL] Indispensable pour passer le mur du rôle restreint [1.1] !

Comment On Function public."CreerPepite"(Uuid, Uuid, Character, Character Varying, Character Varying, Text, Character Varying, Character Varying, JsonB) Is 'Mutation nominale insérant une pépite d''or en soute basse avec élévation sécurisée de privilèges [1.1].';
