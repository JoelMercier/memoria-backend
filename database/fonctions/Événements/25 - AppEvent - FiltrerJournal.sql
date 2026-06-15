-- ============================================================================
-- 🚨 INFRASTRUCTURE : EXTRACTEUR UNIVERSEL PAGINÉ DES JOURNAUX D'AUDIT
-- Fichier: database/functions/FiltrerJournaux.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Filtrage incrémental multicritère adossé aux index de soute
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."FiltrerJournaux"(ByteA, Char(4), Char(4), Char(4), Char(4), Integer, Integer);
Drop Function if exists public."FiltrerJournaux"(UUID, Char(4), Char(4), Char(4), Char(4), Integer, Integer);

Create Or Replace Function public."FiltrerJournaux"(
    p_aeUserId    UUID,                                         -- [RÉPARÉ V4] Aligné sur le type UUID natif d'élite.
    p_aeSecteurId Char(4),                                      -- [RÉPARÉ V4] Alignement sémantique sc.
    p_aeActionId  Char(4),                                      -- [RÉPARÉ V4] Alignement sémantique ac.
    p_aeCategorieId Char(4),                                    -- [RÉPARÉ V4] Alignement sémantique ca.
    p_aeSeveriteId  Char(4),                                    -- [RÉPARÉ V4] Alignement sémantique se.
    p_NbLignes    Integer,
    p_LigneDebut  Integer
)
Returns Table (
    "aeIdEvent"     UUID,                                       -- [RÉPARÉ V4] Aligné sur l'UUID natif.
    "aeUserId"      UUID,                                       -- [RÉPARÉ V4] Aligné sur l'UUID natif.
    "aeCategorieId" Char(4),                                    -- [RÉPARÉ V4] Alignement nominal Rule 3.
    "aeSeveriteId"  Char(4),                                    -- [RÉPARÉ V4] Alignement nominal Rule 3.
    "aeSecteurId"   Char(4),                                    -- [RÉPARÉ V4] Alignement nominal Rule 3.
    "aeActionId"    Char(4),                                    -- [RÉPARÉ V4] Alignement nominal Rule 3.
    "aeMessage"     Varchar(255),
    "aeMetadata"    Jsonb,
    "aeCreatedAt"   Timestamp,
    "totalCount"    Bigint
) As $$
Declare
    l_nNiveauExige Integer;                                     -- Variable locale : Arbitrage mathématique de la gravité.
Begin
    -- 1. Extraction rapide du poids numérique de criticité via la colonne seNiveau
    If p_aeSeveriteId Is Not Null Then
        Select "seNiveau" Into l_nNiveauExige
        From public."Severites"
        Where "seIdSeverity" = p_aeSeveriteId;                  -- [RÉPARÉ V4] Aligné sur la clé primaire correcte.
    End If;

    -- 2. Requête principale avec jointure de dictionnaire pour le filtre incrémental
    Return Query
    With "FiltreTotal" As (
        Select
            "Events"."aeIdEvent",
            "Events"."aeUserId",
            "Events"."aeCategorieId",
            "Events"."aeSeveriteId",
            "Events"."aeSecteurId",
            "Events"."aeActionId",
            "Events"."aeMessage",
            "Events"."aeMetadata",
            "Events"."aeCreatedAt",
            Count(*) Over() As "TotalCalcule"
        From public."Events"
        Left Join public."Severites" On "Events"."aeSeveriteId" = "Severites"."seIdSeverity"
        Where (p_aeUserId Is Null Or "Events"."aeUserId" = p_aeUserId)
          And (p_aeSecteurId Is Null Or "Events"."aeSecteurId" = p_aeSecteurId)
          And (p_aeActionId Is Null Or "Events"."aeActionId" = p_aeActionId)
          And (p_aeCategorieId Is Null Or "Events"."aeCategorieId" = p_aeCategorieId)
          And (p_aeSeveriteId Is Null Or "Severites"."seNiveau" >= l_nNiveauExige) -- Filtre incrémental d'élite.
    )
    Select
        "FiltreTotal"."aeIdEvent",
        "FiltreTotal"."aeUserId",
        "FiltreTotal"."aeCategorieId",
        "FiltreTotal"."aeSeveriteId",
        "FiltreTotal"."aeSecteurId",
        "FiltreTotal"."aeActionId",
        "FiltreTotal"."aeMessage",
        "FiltreTotal"."aeMetadata",
        "FiltreTotal"."aeCreatedAt",
        "FiltreTotal"."TotalCalcule"
    From "FiltreTotal"
    Order By "FiltreTotal"."aeCreatedAt" Desc
    Limit p_NbLignes Offset p_LigneDebut;
End;
$$ Language plpgsql Stable;

Comment On Function public."FiltrerJournaux"(UUID, Char(4), Char(4), Char(4), Char(4), Integer, Integer) Is 'Extracteur universel d''IHM pour le journal d''audit, gérant le filtrage par sévérité incrémentale en UUID natif pur.';
