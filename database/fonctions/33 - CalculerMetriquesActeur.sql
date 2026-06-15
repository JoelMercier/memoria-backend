-- ============================================================================
-- 📊 INFRASTRUCTURE : CALCUL ISOLÉ DES COMPTEURS D'ACTIVITÉ D'UN ACTEUR
-- Fichier: database/fonctions/01_CalculerMetriquesActeur.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Jojo-Style Compliant Strict)
-- Description: Décompte chirurgical indexé sans aucun produit cartésien
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."CalculerMetriquesActeur"(p_usIdUser ByteA);
Drop Function if exists public."CalculerMetriquesActeur"(p_usIdUser UUID);

Create Or Replace Function public."CalculerMetriquesActeur"(p_usIdUser UUID)
Returns Table (
    "usPseudo"        Varchar(50),
    "TotalPepites"    Bigint,
    "TotalEtiquettes" Bigint
) as $$
Begin
    -- [RÉPARÉ V4] Éradication complète de octet_length sur l''UUID natif.
    -- Le typage fort du paramètre d''entrée garantit l''intégrité de la trame 128 bits.

    Return Query
    Select
        "usPseudo",
        -- Sous-requête 1 : Décompte chirurgical sur l''index de la table des pépites
        (Select Count(*) From public."Items" Where "itUserId" = p_usIdUser),
        -- Sous-requête 2 : Décompte chirurgical sur l''index de la table des étiquettes (tgLibelle réaligné)
        (Select Count(*) From public."Tags" Where "tgUserId" = p_usIdUser)
    From public."Users"
    Where "usIdUser" = p_usIdUser;                              -- Isolation immédiate sur la clé primaire nominale.
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."CalculerMetriquesActeur"(UUID) Is '📊 API de Cour Basse calculant de manière isolée les totaux d''un acteur via sous-requêtes indexées sans produit cartésien.';
