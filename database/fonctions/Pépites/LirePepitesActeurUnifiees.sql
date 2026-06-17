-- ——— fichier : database/fonctions/Pépites/LirePepitesActeurUnifiees.sql

-- ============================================================================
-- 📦 INFRASTRUCTURE : LECTURE UNIFIÉE DES PÉPITES ET ÉTIQUETTES D'UN ACTEUR
-- Fichier: database/functions/Pépites/LirePepitesActeurUnifiees.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Rapatrie les ressources d''un acteur avec liste de tags agrégée
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================


Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function If Exists public."LirePepitesActeurUnifiees"(Uuid, Boolean);

Create Or Replace Function public."LirePepitesActeurUnifiees"(
    p_axIdActeur       Uuid,           -- Paramètre : Identifiant 128 bits natif de l'acteur connecté.
    p_bFiltreOrphelins Boolean Default False -- Paramètre : Si Vrai, isole uniquement les pépites sans étiquettes.
)
Returns Table (
    "IdPepite"         Uuid,                        -- 16 octets fixes (Colosse).
    "FormatId"         Character(4),                --  4 octets fixes (Code léger).
    "LibellePepite"    Character Varying,           -- Taille variable en fin de ligne (itLibelle).
    "AuteurSource"     Character Varying,           -- Taille variable (itAuteurSource).
    "ChaineEtiquettes" Text                         -- Liste compacte séparée par des virgules.
)
Language plpgsql Stable Strict
as $$
Begin
    Return Query
    Select
        "itIdItem",
        "itContentTypeId",
        "itLibelle",
        "itAuteurSource",
        -- 🎛️ TOILAGE DE SOUTE SOUVERAIN : Agrégation textuelle ultra-rapide sans alias.
        Coalesce(string_agg("tgLibelle", ',' Order By "tgLibelle" Asc), '') as "ChaineEtiquettes"
    From public."Items"
    Left Join public."ItemTags" On "itIdItem" = "tiItemId"   -- Scan foudroyant des index de Cour Basse.
    Left Join public."Tags"     On "tiTagId"  = "tgIdTag"    -- Raccordement direct sans alias lâche.
    where "itUserId" = p_axIdActeur
    Group By
        "itIdItem",
        "itContentTypeId",
        "itLibelle",
        "itAuteurSource"
    Having
        (p_bFiltreOrphelins = False) or (Count("tiTagId") = 0)
    Order By "itLibelle" Asc;
End;
$$;

Comment On Function public."LirePepitesActeurUnifiees"(Uuid, Boolean) is 'API d''élite extrayant le tas des pépites d''un acteur avec fusion de leurs étiquettes en une seule ligne de texte compacte.';
