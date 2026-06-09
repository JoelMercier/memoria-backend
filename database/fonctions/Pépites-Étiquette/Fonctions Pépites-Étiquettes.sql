-- ——— fichier : database\fonctions\Pépites-Étiquette\Fonctions Pépites-Étiquettes.sql

-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Infrastructure : ItemTags-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Unification des verbes unitaires de liaison Many-to-Many
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Affectation unitaire : LierEtiquette
-- ----------------------------------------------------------------------------
Drop Function If Exists public."LierEtiquette"(UUID, UUID);

Create Or Replace Function public."LierEtiquette"(
    p_axItemId  UUID,
    p_axTagId   UUID
)
Returns Void
Language plpgsql
as $$
Begin
    Insert Into public."ItemTags" ("tiItemId", "tiTagId")
    Values ("Bin-UUID"(p_axItemId), "Bin-UUID"(p_axTagId))
    on Conflict ("tiTagId", "tiItemId") Do Nothing;
End;
$$;

Comment On Function public."LierEtiquette" is 'Injection unitaire idempotente d''une liaison Many-to-Many.';


-- ----------------------------------------------------------------------------
-- 🏛️ 2. Révocation unitaire : DelierEtiquette
-- ----------------------------------------------------------------------------
Drop Function If Exists public."DelierEtiquette"(UUID, UUID);

Create Or Replace Function public."DelierEtiquette"(
    p_axItemId  UUID,
    p_axTagId   UUID
)
Returns Boolean
Language plpgsql
as $$
Declare
    l_bImpacted Boolean;
Begin
    Delete From public."ItemTags"
    Where "tiItemId" = "Bin-UUID"(p_axItemId) and "tiTagId" = "Bin-UUID"(p_axTagId);
    Return found;
End;
$$;

Comment On Function public."DelierEtiquette" is 'Purge chirurgicale unitaire d''une liaison d''étiquette.';


-- ----------------------------------------------------------------------------
-- 🏛️ 3. Purge complète avant destruction : NettoyerEtquettesPepite
-- ----------------------------------------------------------------------------
Drop Function If Exists public."NettoyerEtiquettesPepite"(UUID);

Create Or Replace Function public."NettoyerEtiquettesPepite"(
    p_axItemId  UUID
)
Returns Void
Language plpgsql
as $$
Begin
    Delete From public."ItemTags"
    Where "tiItemId" = "Bin-UUID"(p_axItemId);
End;
$$;

Comment On Function public."NettoyerEtiquettesPepite" is 'Destruction de masse des mots-clés d''une ressource avant éradication.';
