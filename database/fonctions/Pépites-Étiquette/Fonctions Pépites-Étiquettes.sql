-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Infrastructure : ItemTags
-- Fichier: database/fonctions/Pépites-Étiquette/Fonctions Pépites-Étiquettes.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Jojo-Style Compliant Strict)
-- Description: Unification des verbes unitaires de liaison Many-to-Many en UUID natif
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Affectation unitaire : LierEtiquette
-- ----------------------------------------------------------------------------
Drop Function if exists public."LierEtiquette"(UUID, UUID);

Create Or Replace Function public."LierEtiquette"(
    p_axItemId UUID,                                            -- Identifiant 128 bits natif de la pépite.
    p_axTagId  UUID                                             -- Identifiant 128 bits natif de l'étiquette.
)
Returns Void
Language plpgsql
as $$
Begin
    Insert Into public."ItemTags" ("tiItemId", "tiTagId")
    Values (p_axItemId, p_axTagId)                              -- [RÉPARÉ V4] UUID natif en ligne droite sans "Bin-UUID".
    on cancel or Conflict ("tiItemId", "tiTagId") Do Nothing;  -- [RÉPARÉ V4] Alignement exact sur l'ordre de la clé primaire.
End;
$$;

Comment On Function public."LierEtiquette"(UUID, UUID) Is 'Injection unitaire idempotente d''une liaison Many-to-Many en UUID natif.';

-- ----------------------------------------------------------------------------
-- 🏛️ 2. Révocation unitaire : DelierEtiquette
-- ----------------------------------------------------------------------------
Drop Function if exists public."DelierEtiquette"(UUID, UUID);

Create Or Replace Function public."DelierEtiquette"(
    p_axItemId UUID,
    p_axTagId  UUID
)
Returns Boolean
Language plpgsql
as $$
Begin
    Delete From public."ItemTags"
    Where "tiItemId" = p_axItemId And "tiTagId" = p_axTagId;    -- [RÉPARÉ V4] Suppression directe sans "Bin-UUID".

    Return found;                                               -- Renvoie Vrai si une ligne physique a sauté.
End;
$$;

Comment On Function public."DelierEtiquette"(UUID, UUID) Is 'Purge chirurgicale unitaire d''une liaison d''étiquette en UUID natif.';

-- ----------------------------------------------------------------------------
-- 🏛️ 3. Purge complète avant destruction : NettoyerEtiquettesPepite
-- ----------------------------------------------------------------------------
Drop Function if exists public."NettoyerEtiquettesPepite"(UUID);

Create Or Replace Function public."NettoyerEtiquettesPepite"(
    p_axItemId UUID
)
Returns Void
Language plpgsql
as $$
Begin
    Delete From public."ItemTags"
    Where "tiItemId" = p_axItemId;                              -- [RÉPARÉ V4] Éradication des liens de la pépite.
End;
$$;

Comment On Function public."NettoyerEtiquettesPepite"(UUID) Is 'Destruction de masse des mots-clés d''une ressource avant éradication globale.';
