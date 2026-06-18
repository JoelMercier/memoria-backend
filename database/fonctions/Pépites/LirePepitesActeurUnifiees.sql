-- ——— fichier : database/fonctions/Pépites/LirePepitesActeurUnifiees.sql

-- ============================================================================
-- 📦 INFRASTRUCTURE : LECTURE UNIFIÉE DES PÉPITES ET ÉTIQUETTES D'UN ACTEUR
-- Fichier: database/functions/Pépites/LirePepitesActeurUnifiees.sql
-- Version: 4.2.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Rapatrie les ressources d'un acteur avec liste de tags agrégée.
--              [SCELLÉ SECURITY DEFINER] Seule porte d'entrée pour le rôle Mémoria.
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function If Exists public."LirePepitesActeurUnifiees"(Uuid, Boolean);

Create Or Replace Function public."LirePepitesActeurUnifiees"(
    p_axIdActeur       Uuid,                 -- Paramètre : Identifiant 128 bits natif de l'acteur connecté.
    p_bFiltreOrphelins Boolean Default False -- Paramètre : Si Vrai, isole uniquement les pépites sans étiquettes.
)
Returns Table (
    "IdPepite"         Uuid,                 -- 16 octets fixes (Colosse).
    "FormatId"         Character(4),         --  4 octets fixes (Code léger).
    "LibellePepite"    Character Varying,    -- Taille variable en fin de ligne (itLibelle).
    "AuteurSource"     Character Varying,    -- Taille variable (itAuteurSource).
    "ChaîneÉtiquettes" Text                  -- [RÉPARÉ Rule 5] Liste compacte avec majuscule accentuée.
) As $$
Begin
    Return Query
    Select
        "itIdItem",
        "itContentTypeId",
        "itLibelle",
        "itAuteurSource",
        -- 🎛️ TOILAGE DE SOUTE SOUVERAIN : Agrégation textuelle ultra-rapide sans alias lâche.
        Coalesce(string_agg("tgLibelle", ',' Order By "tgLibelle" Asc), '') As "ChaîneÉtiquettes"
    From public."Items"
    Left Join public."ItemTags" On "itIdItem" = "tiItemId"   -- [SCELLÉ Rule 3] Scan foudroyant sur tiItemId [1.1] !
    Left Join public."Tags"     On "tiTagId"  = "tgIdTag"    -- Raccordement direct sans alias lâche.
    Where "itUserId" = p_axIdActeur                          -- [RÉPARÉ Rule 2] "where" passe en minuscules "where" [1.1].
    Group By
        "itIdItem",
        "itContentTypeId",
        "itLibelle",
        "itAuteurSource"
    Having
        (p_bFiltreOrphelins = False) or (Count("tiTagId") = 0) -- [RÉPARÉ Rule 2] "or" passe en minuscules "or" [1.1].
    Order By "itLibelle" Asc;
End;
$$ Language plpgsql Stable Strict Security Definer; -- 🔒 [DECRET JOEL] Sûreté absolue pour le rôle restreint.

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire (Rule 7 : Alignement vertical du 'is')
-- ----------------------------------------------------------------------------
Comment On Function public."LirePepitesActeurUnifiees"(Uuid, Boolean) is 'API d''élite extrayant le tas des pépites d''un acteur avec fusion sécurisée de leurs étiquettes [1.1].';
