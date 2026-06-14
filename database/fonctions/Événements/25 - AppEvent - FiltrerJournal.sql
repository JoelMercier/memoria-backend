-- ============================================================================
-- 🏺 Mémoria - Fonctions d'Audit Systèmes V4
-- Version: 4.3.1 (PostgreSQL 17+)
-- Description: Extracteur universel paginé avec sévérité incrémentale stricte
-- ============================================================================

Set search_path To Public;

Create Or Replace Function "FiltrerJournaux"(
    "p_aeUserId" Bytea,
    "p_aeContext" Char(4),
    "p_aeAction" Char(4),
    "p_aeCategory" Char(4),
    "p_aeSeverity" Char(4),
    "p_NbLignes" Integer,
    "p_LigneDebut" Integer
)
Returns Table (
    "aeIdEvent" Bytea,
    "aeUserId" Bytea,
    "aeContext" Char(4),
    "aeAction" Char(4),
    "aeCategory" Char(4),
    "aeSeverity" Char(4),
    "aeMessage" Text,
    "aeMetadata" Jsonb,
    "aeCreatedAt" Timestamp,
    "totalCount" Bigint
) As $$
Declare
    "l_nNiveauExige" Integer;
Begin
    -- 1. Extraction rapide du poids numérique de criticité via la colonne seNiveau [Mémoria]
    If "p_aeSeverity" Is Not Null Then
        Select "Severites"."seNiveau" Into "l_nNiveauExige"
        From "Severites"
        Where "Severites"."seCode" = "p_aeSeverity";
    End If;

    -- 2. Requête principale avec jointure de dictionnaire pour le filtre incrémental [Mémoria]
    Return Query
    With "FiltreTotal" As (
        Select
            "Events"."aeIdEvent",
            "Events"."aeUserId",
            "Events"."aeContext",
            "Events"."aeAction",
            "Events"."aeCategory",
            "Events"."aeSeverity",
            "Events"."aeMessage",
            "Events"."aeMetadata",
            "Events"."aeCreatedAt",
            Count(*) Over() As "TotalCalcule"
        From "Events"
        Left Join "Severites" On "Events"."aeSeverity" = "Severites"."seCode"
        Where ("p_aeUserId" Is Null Or "Events"."aeUserId" = "p_aeUserId")
          And ("p_aeContext" Is Null Or "Events"."aeContext" = "p_aeContext")
          And ("p_aeAction" Is Null Or "Events"."aeAction" = "p_aeAction")
          And ("p_aeCategory" Is Null Or "Events"."aeCategory" = "p_aeCategory")
          -- 🗲 [SUGGESTION RECALÉE ET RÉPARÉE] Tri sur seNiveau pour la sévérité incrémentale ! [Mémoria]
          And ("p_aeSeverity" Is Null Or "Severites"."seNiveau" >= "l_nNiveauExige")
    )
    Select
        "FiltreTotal"."aeIdEvent",
        "FiltreTotal"."aeUserId",
        "FiltreTotal"."aeContext",
        "FiltreTotal"."aeAction",
        "FiltreTotal"."aeCategory",
        "FiltreTotal"."aeSeverity",
        "FiltreTotal"."aeMessage",
        "FiltreTotal"."aeMetadata",
        "FiltreTotal"."aeCreatedAt",
        "FiltreTotal"."TotalCalcule"
    From "FiltreTotal"
    Order By "FiltreTotal"."aeCreatedAt" Desc
    Limit "p_NbLignes" Offset "p_LigneDebut";
End;
$$ Language Plpgsql Stable;
