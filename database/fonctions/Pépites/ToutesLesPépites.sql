-- ============================================================================
-- 📦 INFRASTRUCTURE : EXTRACTION FILTRÉE, EXTENSIVE ET PAGINÉE DES PÉPITES
-- Fichier: database/functions/ToutesLesPepites.sql
-- Version: 4.2.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Extracteur dynamique sécurisé, paginé et immunisé contre les injections.
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."ToutesLesPepites"(UUID, Character Varying, Character Varying, Character Varying, Character Varying, Integer, Integer);
Drop Function if exists public."ToutesLesPepites"(UUID, Character(4), Character Varying, Character Varying, Character Varying, Integer, Integer);

Create Or Replace Function public."ToutesLesPepites"(
    p_axUserId       UUID,              -- Paramètre : Identifiant 128 bits natif de l'acteur (Index Direct).
    p_cContentTypeId Character(4),      -- [REPARÉ Rule 1] Alignement strict sur le quadrigramme physique Char(4).
    p_sMotsCles      Character Varying, -- Paramètre : Pattern de recherche textuelle pour ILIKE.
    p_sColonneTri    Character Varying, -- Paramètre : Colonne cible du tri dynamique.
    p_sOrdreTri      Character Varying, -- Paramètre : Direction du tri (ASC/DESC).
    p_iLimit         Integer,           -- Paramètre : Limite de fenêtrage de lignes.
    p_iOffset        Integer            -- Paramètre : Décalage de fenêtrage de lignes.
)
Returns Table (
    "itIdItem"        Uuid,             -- 16 octets fixes (UUID natif).
    "itUserId"        Uuid,             -- 16 octets fixes (UUID natif).
    "itCreatedAt"     TimeStamp Without Time Zone,
    "itUpdatedAt"     TimeStamp Without Time Zone,
    "itContentTypeId" Char(4),          -- Quadrigramme physique de soute.
    "itLibelle"       Character Varying,-- Libellé nominal de la pépite.
    "itSlug"          Character Varying,
    "itContent"       Text,             -- Tas textuel lourd de fin de ligne.
    "itAuteurSource"  Character Varying,
    "itThumbnailUrl"  Character Varying,
    "itMetadata"      JsonB,
    "rNbLignesTotal"  BigInt            -- Compteur analytique Over() pour la pagination IHM.
) As $$
Declare
    l_sRequete   Text;                  -- Variable : Trame textuelle de la requête dynamique.
    l_sOrdreSanit Text;                 -- Variable : Conteneur sécurisé du mot-clé de direction.
Begin
    -- 🛡️ [BLINDAGE ANTI-INJECTION] : Validation stricte de la direction du tri (Whitelisting)
    l_sOrdreSanit := Upper(Trim(p_sOrdreTri));
    If l_sOrdreSanit Not In ('ASC', 'DESC') Then
        l_sOrdreSanit := 'DESC';        -- Repli défensif systématique sur le plus récent.
    End If;

    -- Construction de la requête pure sans aucun alias de table (Rule 3)
    l_sRequete := '
        Select
            "itIdItem",
            "itUserId",
            "itCreatedAt",
            "itUpdatedAt",
            "itContentTypeId",
            "itLibelle",
            "itSlug",
            "itContent",
            "itAuteurSource",
            "itThumbnailUrl",
            "itMetadata",
            Count(*) Over()
        From
            public."Items"
        Where
            "itUserId" = $1
            and ($2 is null or "itContentTypeId" = $2)
            and ($3 is null or "itLibelle" ilike $3)
        Order By ' || quote_ident(p_sColonneTri) || ' ' || l_sOrdreSanit || '
        Limit $4
        Offset $5';

    Return Query Execute l_sRequete
    Using p_axUserId, p_cContentTypeId, p_sMotsCles, p_iLimit, p_iOffset;
End;
$$ Language plpgsql Security Definer; -- 🔒 [DECRET JOEL] Autorisation d'accès déléguée impérative !

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire (Rule 7 : Alignement vertical du 'is')
-- ----------------------------------------------------------------------------
Comment On Function public."ToutesLesPepites"(UUID, Character(4), Character Varying, Character Varying, Character Varying, Integer, Integer) is 'Extracteur universel dé-normalisé, filtré et paginé pour le flux applicatif d''un acteur en UUID natif pur.';
