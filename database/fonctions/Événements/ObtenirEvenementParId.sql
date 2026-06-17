-- ——— fichier : database\fonctions\Événements\ObtenirEvenementParId.sql

-- ============================================================================
-- 🚨 INFRASTRUCTURE : EXTRACTEUR CHIRURGICAL D'ÉVÉNEMENT PAR CLÉ PRIMAIRE
-- Version: 4.2.0 (PostgreSQL 17+)
-- Description: Recherche directe sur index unique de soute (Plan préparable)
-- Auteur & Vision : Joël (Architecte DR-DOS)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."ObtenirEvenementParId"(UUID);

Create Or Replace Function public."ObtenirEvenementParId"(
    p_aeIdEvent UUID                                            -- 🪓 Index unique direct.
)
Returns Table (
    "aeIdEvent"     UUID,
    "aeUserId"      UUID,
    "aeCreatedAt"   Timestamp,
    "aeCategorieId" Char(4),
    "aeSeveriteId"  Char(4),
    "aeSecteurId"   Char(4),
    "aeActionId"    Char(4),
    "aeMessage"     Text,
    "aeMetadata"    Jsonb
) As $$
Begin
    Return Query
    Select
        "Events"."aeIdEvent",
        "Events"."aeUserId",
        "Events"."aeCreatedAt",
        "Events"."aeCategorieId",
        "Events"."aeSeveriteId",
        "Events"."aeSecteurId",
        "Events"."aeActionId",
        "Events"."aeMessage",
        "Events"."aeMetadata"
    From public."Events"
    Where "Events"."aeIdEvent" = p_aeIdEvent;                   -- 🎯 Tir laser sur l'index UNIQUE !
End;
$$ Language plpgsql Stable;

Comment On Function public."ObtenirEvenementParId"(UUID) Is 'Recherche chirurgicale et ultra-rapide d''une trame d''audit par sa clé primaire unique.';
