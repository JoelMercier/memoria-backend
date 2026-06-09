-- ============================================================================
-- 🗄️ Mémoria - Fonction Stockée : SynchroniserLesEtiquettes
-- Fichier: database\Refonte\23 - Fonction SynchroniserLesEtiquettes.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Synchronisation matricielle différentielle des étiquettes d'une pépite
-- ============================================================================

Create Or Replace Function public."SynchroniserLesEtiquettes"(
    p_axItemId         Uuid,             -- 🪓 Les colosses en tête (Rule 1)
    p_aTagIdsCibles    Uuid[]            -- Tableau matriciel des identifiants cibles
)
Returns Void
Language plpgsql
as $$
Begin
    -- 1. Purge chirurgicale immédiate des étiquettes devenues orphelines (les Sortants)
    Delete From public."ItemTags"
    Where "tiItemId" = p_axItemId
      and "tiTagId" != all(p_aTagIdsCibles);

    -- 2. Insertion fraîche et idempotente des nouvelles liaisons (les Entrants)
    Insert Into public."ItemTags" ("tiItemId", "tiTagId")
    Select p_axItemId, l_axTagId
    From unnest(p_aTagIdsCibles) as l_axTagId
    On Conflict ("tiTagId", "tiItemId") Do Nothing; -- Conserve le createdAt intact d'il y a 3 ans !
End;
$$;

COMMENT ON FUNCTION public."SynchroniserLesEtiquettes" is 'Serrure transactionnelle différentielle gérant l''affectation des mots-clés d''une pépite.';
