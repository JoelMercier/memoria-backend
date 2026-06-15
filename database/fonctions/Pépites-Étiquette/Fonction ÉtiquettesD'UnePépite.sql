-- ============================================================================
-- 🗄️ Mémoria - Fonction Stockée : EtiquettesDunePepite
-- Fichier: database/fonctions/Pépites-Étiquette/Fonction ÉtiquettesD'UnePépite.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Extraction des instances de tags rattachées à une pépite
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- 🪓 Destruction préventive de l'ancien moule pour éviter les conflits de soute
Drop Function if exists public."EtiquettesDunePepite"(UUID);

Create Or Replace Function public."EtiquettesDunePepite"(
    p_axItemId UUID                                             -- L'identifiant immuable 128 bits natif de la pépite.
)
Returns Table (
    "tgIdTag"     Uuid,                                         -- [RÉPARÉ V4] UUID natif conforme à la table Tags.
    "tgUserId"    Uuid,                                         -- [RÉPARÉ V4] UUID natif conforme à la table Tags.
    "tgCreatedAt" TimeStamp Without Time Zone,
    "tgUpdatedAt" TimeStamp Without Time Zone,
    "tgLibelle"   Character Varying                             -- [RÉPARÉ V4] Éradication définitive de tgName.
)
Language plpgsql
as $$
Begin
    Return Query
    Select
        "Tags"."tgIdTag",
        "Tags"."tgUserId",
        "Tags"."tgCreatedAt",
        "Tags"."tgIdTag",                                       -- [RÉPARÉ V4] Remplacement de l'ancien tgName anglo-saxon.
        "Tags"."tgLibelle"
    From public."Tags"
    Inner Join public."ItemTags" on "ItemTags"."tiTagId" = "Tags"."tgIdTag"
    Where "ItemTags"."tiItemId" = p_axItemId                   -- [RÉPARÉ V4] Liaison UUID directe sans "Bin-UUID".
    Order By "Tags"."tgLibelle" Asc;                           -- Tri alphabétique unifié.
End;
$$;

Comment On Function public."EtiquettesDunePepite"(UUID) Is 'Extracteur relationnel d''élite rapatriant les mots-clés d''une pépite, ordonnés par libellé franconien.';
