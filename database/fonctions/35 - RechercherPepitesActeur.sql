-- ============================================================================
-- 🔍 INFRASTRUCTURE : RECHERCHE TEXTUELLE FILTRÉE RAPIDE PAR ACTEUR
-- Fichier: database/fonctions/02_RechercherPepitesActeur.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Jojo-Style Compliant Strict)
-- Description: Balayage textuel localisé adossé à l'index propriétaire usIdUser
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."RechercherPepitesActeur"(UUID, Character Varying);

Create Or Replace Function public."RechercherPepitesActeur"(
    p_usIdUser  UUID,
    p_Recherche Character Varying(100)
)
Returns Table (
    "itIdItem"        UUID,                                     -- 16 octets fixes (UUID natif).
    "itUserId"        UUID,                                     -- 16 octets fixes (UUID natif).
    "itCreatedAt"     Timestamp,                                --  8 octets fixes.
    "itContentTypeId" Char(4),                                  -- [RÉPARÉ V4] Quadrigramme aligné au bit près.
    "itLibelle"       Character Varying(255),                   -- [RÉPARÉ V4] Éradication définitive de itTitle.
    "itSlug"          Character Varying(255),
    "itContent"       Text,                                     -- Corps textuel infini libre de soute.
    "itThumbnailUrl"  Character Varying(255)
) as $$
Begin
    -- [RÉPARÉ V4] Le typage fort du paramètre d'entrée UUID natif 128 bits
    -- élimine le besoin d'évaluer barbaremente la longueur physique des octets.

    -- Normalisation du mot-clé à la frontière pour soulager le microprocesseur 🎛️
    p_Recherche := Lower(Trim(p_Recherche));

    Return Query
    Select
        "itIdItem",
        "itUserId",
        "itCreatedAt",
        "itContentTypeId",                                      -- Réaligné sur la clé de soute correcte.
        "itLibelle",                                            -- Réaligné sur le franconien pur de la table Items.
        "itSlug",
        "itContent",
        "itThumbnailUrl"
    From public."Items"
    Where "itUserId" = p_usIdUser                               -- 1. Cordon sanitaire : blocage immédiat sur l'index de l'acteur.
      And (
            Lower("itLibelle") Like '%' || p_Recherche || '%'  -- 2. Scan textuel ciblé ultra-rapide.
         Or Lower("itContent") Like '%' || p_Recherche || '%'
      );
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."RechercherPepitesActeur"(UUID, Character Varying) Is '🔍 API de Cour Basse exécutant une recherche textuelle filtrée à la racine sur l''index propriétaire de la table Items.';
