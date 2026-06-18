-- ============================================================================
-- 📦 INFRASTRUCTURE : EXTRACTION GLOBALE ET PAGINÉE DU TAS PHYSIQUE
-- Fichier: database/functions/ToutesLesPepitesDuChateau.sql
-- Version: 4.2.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Extracteur universel d'administration sans aucune barrière d'acteur.
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."ToutesLesPepitesDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesPepitesDuChateau"(
    p_iLimit      Integer,           -- Paramètre : Nombre maximal de lignes.
    p_iOffset     Integer,           -- Paramètre : Index de décalage de soute.
    p_sColonneTri Character Varying, -- Paramètre : Identifiant de la colonne cible.
    p_sOrdreTri   Character Varying  -- Paramètre : Code technique ('ASC' ou 'DESC').
)
Returns Table (
    "itIdItem"        Uuid,          -- 16 octets fixes (UUID natif).
    "itUserId"        Uuid,          -- 16 octets fixes (UUID natif).
    "itCreatedAt"     TimeStamp Without Time Zone,
    "itUpdatedAt"     TimeStamp Without Time Zone,
    "itContentTypeId" Char(4),       -- [RÉPARÉ V4] Aligné sur le quadrigramme physique.
    "itLibelle"       Character Varying,
    "itSlug"          Character Varying,
    "itContent"       Text,          -- Tas textuel lourd de fin de ligne.
    "itAuteurSource"  Character Varying,
    "itThumbnailUrl"  Character Varying,
    "itMetadata"      JsonB,
    "rNbLignesTotal"  BigInt         -- Compteur analytique Over() pour le fenêtrage d'IHM.
) As $$
Declare
    l_sRequete   Text;               -- Variable : Stockage de la trame dynamique.
    l_sOrdreSanit Text;              -- Variable : Conteneur sécurisé du mot-clé de direction.
Begin
    -- 🛡️ [BLINDAGE ANTI-INJECTION] : Validation stricte de la direction du tri (Whitelisting)
    l_sOrdreSanit := Upper(Trim(p_sOrdreTri));
    If l_sOrdreSanit Not In ('ASC', 'DESC') Then
        l_sOrdreSanit := 'DESC';     -- Repli défensif systématique sur le plus récent.
    End If;

    -- Construction de la requête pure selon l'immobilier soviétique de 1960 (Rule 3)
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
        Order By ' || quote_ident(p_sColonneTri) || ' ' || l_sOrdreSanit || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End;
$$ Language plpgsql Security Definer; -- 🔒 [DECRET JOEL] Surélévation de privilèges pour l'administration globale [1.1] !

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire (Rule 7 : Alignement vertical du 'is')
-- ----------------------------------------------------------------------------
Comment On Function public."ToutesLesPepitesDuChateau"(Integer, Integer, Character Varying, Character Varying) is 'Extracteur universel d''IHM pour le grand fichier des pépites de connaissances gérées en UUID natif pur [1.1].';
