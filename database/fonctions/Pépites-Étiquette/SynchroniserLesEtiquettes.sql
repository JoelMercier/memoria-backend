-- ============================================================================
-- 🗄️ Mémoria - Fonction Stockée : SynchroniserLesEtiquettes
-- Fichier: database/functions/SynchroniserLesEtiquettes.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Synchronisation matricielle différentielle des étiquettes d'une pépite
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."SynchroniserLesEtiquettes"(UUID, UUID[]);

Create Or Replace Function public."SynchroniserLesEtiquettes"(
    p_axItemId      UUID,                                       -- Identifiant 128 bits natif de la pépite cible.
    p_aTagIdsCibles UUID[]                                      -- Tableau matriciel des identifiants étiquettes cibles.
)
Returns Void
Language plpgsql
as $$
Begin
    -- 1. Purge chirurgicale immédiate des étiquettes devenues orphelines (les Sortants)
    Delete From public."ItemTags"
    Where "tiItemId" = p_axItemId
      And "tiTagId" != all(p_aTagIdsCibles);                    -- Éradication nette sans boucle paresseuse.

    -- 2. Insertion fraîche et idempotente des nouvelles liaisons (les Entrants)
    Insert Into public."ItemTags" ("tiItemId", "tiTagId")
    Select p_axItemId, l_axTagId
    From unnest(p_aTagIdsCibles) as l_axTagId                   -- Extraction à la vitesse de la RAM.
    on conflict ("tiItemId", "tiTagId") Do Nothing;            -- [RÉPARÉ V4] Alignement micrométrique sur la clé primaire.
End;
$$;

Comment On Function public."SynchroniserLesEtiquettes"(UUID, UUID[]) Is 'Serrure transactionnelle différentielle d''élite gérant l''affectation de masse des mots-clés d''une pépite, préservant le CreatedAt des liaisons inchangées.';
