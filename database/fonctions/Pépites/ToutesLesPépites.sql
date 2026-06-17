-- ============================================================================
-- 📦 INFRASTRUCTURE : EXTRACTION FILTRÉE, EXTENSIVE ET PAGINÉE DES PÉPITES
-- Fichier: database/functions/ToutesLesPepites.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Extracteur de flux métier par acteur unifié en UUID natif pur
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

--Drop Function if exists public."ToutesLesPepites"(ByteA, Character Varying, Character Varying, Character Varying, Character Varying, Integer, Integer);
Drop Function if exists public."ToutesLesPepites"(UUID, Character Varying, Character Varying, Character Varying, Character Varying, Integer, Integer);

Create Or Replace Function public."ToutesLesPepites"(
    p_axUserId       UUID,                                      -- [RÉPARÉ V4] Aligné sur le type UUID natif d'élite.
    p_cContentTypeId Character Varying,
    p_sMotsCles      Character Varying,
    p_sColonneTri    Character Varying,
    p_sOrdreTri      Character Varying,
    p_iLimit         Integer,
    p_iOffset        Integer
)
Returns Table (
    "itIdItem"        Uuid,                                     -- 16 octets fixes (UUID natif).
    "itUserId"        Uuid,                                     -- 16 octets fixes (UUID natif).
    "itCreatedAt"     TimeStamp Without Time Zone,              --  8 octets fixes.
    "itUpdatedAt"     TimeStamp Without Time Zone,              --  8 octets fixes.
    "itContentTypeId" Char(4),                                  -- [RÉPARÉ V4] Aligné sur le quadrigramme physique.
    "itLibelle"       Character Varying,                        -- [RÉPARÉ V4] Éradication définitive de itTitle.
    "itSlug"          Character Varying,
    "itContent"       Text,                                     -- Tas textuel lourd de fin de ligne.
    "itAuteurSource"  Character Varying,                        -- [RÉPARÉ V4] Éradication définitive de itSourceAuthor.
    "itThumbnailUrl"  Character Varying,
    "itMetadata"      JsonB,
    "rNbLignesTotal"  BigInt                                    -- Compteur analytique pour le fenêtrage d'IHM.
)
Language plpgsql
as $$
Declare
    l_sRequete Text;                                            -- Variable locale : Stockage de la trame dynamique.
Begin
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
            "itUserId" = "Bin-UUID"($1)                                   -- [RÉPARÉ V4] Liaison directe au plus près de l''index.
            and ($2 is null or "itContentTypeId" = $2)
            and ($3 is null or "itLibelle" ilike $3)           -- [RÉPARÉ V4] Filtre calé sur le franconien itLibelle.
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $4
        Offset $5';

    Return Query Execute l_sRequete
    Using p_axUserId, p_cContentTypeId, p_sMotsCles, p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."ToutesLesPepites"(UUID, Character Varying, Character Varying, Character Varying, Character Varying, Integer, Integer) Is 'Extracteur universel dé-normalisé, filtré et paginé pour le flux applicatif d''un acteur en UUID natif pur.';
