-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Infrastructure : Journaux d'Audit
-- Fichier: database/functions/Partages/Fonctions Events Unifiees.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Écriture, purge et lecture globale paginée des traces d'audit
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Écriture Append-Only : ConsignerEvenement
-- ----------------------------------------------------------------------------
Drop Function if exists public."ConsignerEvenement"(UUID, UUID, Char(4), Char(4), Char(4), Char(4), Text, JsonB);

Create Or Replace Function public."ConsignerEvenement"(
    p_axIdEvent     UUID,                                       -- Identifiant 128 bits natif de la trace.
    p_axUserId      UUID,                                       -- Acteur responsable (Null si action système).
    p_cCategorieId  Char(4),                                    -- [RÉPARÉ V4] Alignement nominal ca.
    p_cSeveriteId   Char(4),                                    -- [RÉPARÉ V4] Alignement nominal se.
    p_cSecteurId    Char(4),                                    -- Alignement nominal sc.
    p_cActionId     Char(4),                                    -- Alignement nominal ac.
    p_sMessage      Text,
    p_rMetadata     JsonB
)
Returns Table (
    "aeIdEvent"     Uuid,
    "aeUserId"      Uuid,
    "aeCreatedAt"   TimeStamp Without Time Zone,
    "aeCategorieId" Char(4),
    "aeSeveriteId"  Char(4),
    "aeSecteurId"   Char(4),
    "aeActionId"    Char(4),
    "aeMessage"     Text,
    "aeMetadata"    JsonB
)
Language plpgsql
as $$
Declare
    l_cCategorieCalculée Char(4);                               -- Variable locale : Arbitrage de la catégorie.
    l_cSeveriteCalculée  Char(4);                               -- Variable locale : Arbitrage de la sévérité.
Begin
    -- 🪓 ARBITRAGE CATEGORIE : Si invalide ou absente, repli sur le bit caDefaut
    If Exists (Select 1 From public."Categories" Where "caIdCategory" = p_cCategorieId) Then
        l_cCategorieCalculée := p_cCategorieId;
    Else
        l_cCategorieCalculée := (Select "caIdCategory" From public."Categories" Where "caDefaut" = True Limit 1);
    End if;

    -- 🪓 ARBITRAGE SEVERITE : Si invalide ou absente, repli sur le bit seDefaut
    If Exists (Select 1 From public."Severites" Where "seIdSeverity" = p_cSeveriteId) Then
        l_cSeveriteCalculée := p_cSeveriteId;
    Else
        l_cSeveriteCalculée := (Select "seIdSeverity" From public."Severites" Where "seDefaut" = True Limit 1);
    End if;

    Return Query
    Insert Into public."Events" (
        "aeIdEvent", "aeUserId", "aeCategorieId",
        "aeSeveriteId", "aeSecteurId", "aeActionId",
        "aeMessage", "aeMetadata"
    )
    Values (
        p_axIdEvent, p_axUserId, l_cCategorieCalculée,
        l_cSeveriteCalculée, p_cSecteurId, p_cActionId,
        p_sMessage, p_rMetadata
    )
    Returning
        "aeIdEvent",
        "aeUserId",
        "aeCreatedAt",
        "aeCategorieId",
        "aeSeveriteId",
        "aeSecteurId",
        "aeActionId",
        "aeMessage",
        "aeMetadata";                                           -- [RÉPARÉ V4] Éradication définitive d'aeUpdatedAt.
End;
$$;

Comment On Function public."ConsignerEvenement"(UUID, UUID, Char(4), Char(4), Char(4), Char(4), Text, JsonB) Is 'Fondeur d''écriture append-only sécurisé pour les journaux d''audit système en UUID natif pur.';
