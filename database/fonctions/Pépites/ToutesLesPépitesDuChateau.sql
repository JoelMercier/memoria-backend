-- ============================================================================
-- 📦 INFRASTRUCTURE : EXTRACTION GLOBALE ET PAGINÉE DU TAS PHYSIQUE
-- Fichier: database/functions/ToutesLesPepitesDuChateau.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Extracteur universel d'administration sans aucune barrière d'acteur
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."ToutesLesPepitesDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesPepitesDuChateau"(
    p_iLimit      Integer,                                      -- Paramètre : Nombre maximal de lignes.
    p_iOffset     Integer,                                      -- Paramètre : Index de décalage de soute.
    p_sColonneTri Character Varying,                            -- Paramètre : Identifiant de la colonne cible.
    p_sOrdreTri   Character Varying                             -- Paramètre : Code technique ('ASC' ou 'DESC').
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
    -- Construction de la requête pure selon l'immobilier soviétique de 1960
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
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."ToutesLesPepitesDuChateau"(Integer, Integer, Character Varying, Character Varying) Is 'Extracteur universel d''IHM pour le grand fichier des pépites de connaissances gérées en UUID natif pur.';

