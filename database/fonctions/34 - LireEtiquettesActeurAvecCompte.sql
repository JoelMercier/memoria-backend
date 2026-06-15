-- ============================================================================
-- 🏷️ INFRASTRUCTURE : EXTRACTION DES ÉTIQUETTES D'UN ACTEUR AVEC COMPTE RÉEL
-- Fichier: database/fonctions/03_LireEtiquettesActeurAvecCompte.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Jojo-Style Compliant Strict)
-- Description: Extraction indexée avec calcul d'agrégation sans produit cartésien
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."LireEtiquettesActeurAvecCompte"(ByteA);
Drop Function if exists public."LireEtiquettesActeurAvecCompte"(UUID);

Create Or Replace Function public."LireEtiquettesActeurAvecCompte"(p_usIdUser UUID)
Returns Table (
    "tgIdTag"       UUID,                                       -- [RÉPARÉ V4] Aligné sur le type UUID natif.
    "tgUserId"      UUID,                                       -- [RÉPARÉ V4] Aligné sur le type UUID natif.
    "tgCreatedAt"   Timestamp,
    "tgLibelle"     Varchar(50),                                -- [RÉPARÉ V4] Éradication définitive de tgName.
    "NombrePepites" Bigint                                      -- Résultat de l'agrégation mathématique.
) as $$
Begin
    -- [RÉPARÉ V4] Le typage fort du paramètre d'entrée UUID natif 128 bits
    -- élimine le besoin d'évaluer barbaremente la longueur physique des octets.

    Return Query
    Select
        "Tags"."tgIdTag",                                       -- Préfixé pour le parseur de Cour Basse.
        "Tags"."tgUserId",
        "Tags"."tgCreatedAt",
        "Tags"."tgLibelle",                                     -- Alignement franconien.
        Count("ItemTags"."tiItemId") as "NombrePepites"        -- Agrégation via la clé pivot de liaison ti.
    From public."Tags"
    Left Outer Join public."ItemTags" On "Tags"."tgIdTag" = "ItemTags"."tiTagId"
    Where "Tags"."tgUserId" = p_usIdUser                        -- Filtre immédiat sur l'index composite à la racine.
    Group By
        "Tags"."tgIdTag",
        "Tags"."tgUserId",
        "Tags"."tgLibelle",
        "Tags"."tgCreatedAt"
    Order By "Tags"."tgLibelle" Asc;                           -- Tri alphabétique poli unifié.
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."LireEtiquettesActeurAvecCompte"(UUID) Is '🏷️ API de Cour Basse extrayant le dictionnaire d''étiquettes d''un acteur avec calcul du volume associé en UUID natif pur.';
