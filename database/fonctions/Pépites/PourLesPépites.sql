-- ============================================================================
-- 📦 Mémoria - Fonctions Stockées d'Infrastructure : Écritures Pépites (Items)
-- Fichier: database/functions/Pépites/Fonctions Écriture Items.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Verbes d'écriture et de destruction de la table maîtresse Items
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Écriture Nominale Idempotente : CreerPepite
-- ----------------------------------------------------------------------------
Drop Function if exists public."CreerPepite"(UUID, UUID, Char(4), Character Varying, Character Varying, Character Varying, Character Varying, JsonB, Text);

Create Or Replace Function public."CreerPepite"(
    p_itIdItem        UUID,                                     -- Identifiant 128 bits natif de la pépite (Rule 1).
    p_itUserId        UUID,                                     -- Référence usIdUser du propriétaire connecté.
    p_itContentTypeId Char(4),                                  -- Quadrigramme fixe du format (table ContentTypes).
    p_sLibelle        Character Varying,                        -- Titre/Libellé de la ressource (itLibelle franconien).
    p_sSlug           Character Varying,                        -- Chaîne normalisée gérée par la RAM du domaine.
    p_sAuteurSource   Character Varying,                        -- Auteur d'origine (par défaut 'N.C.').
    p_sThumbnailUrl   Character Varying,                        -- URL de l'image d'illustration optionnelle.
    p_rMetadata       JsonB,                                    -- Sac indexé GIN d'attributs spécifiques.
    p_sContent        Text                                      -- Contenu textuel libre s'engouffrant en fin de tas.
)
Returns Table (
    "itIdItem"        UUID,
    "itUserId"        UUID,
    "itCreatedAt"     TimeStamp Without Time Zone,
    "itUpdatedAt"     TimeStamp Without Time Zone,
    "itContentTypeId" Char(4),
    "itLibelle"       Character Varying,
    "itSlug"          Character Varying,
    "itAuteurSource"  Character Varying,
    "itThumbnailUrl"  Character Varying,
    "itMetadata"      JsonB,
    "itContent"       Text
)
Language plpgsql
as $$
Begin
    Return Query
    Insert Into public."Items" (
        "itIdItem", "itUserId", "itContentTypeId", "itLibelle",
        "itSlug", "itAuteurSource", "itThumbnailUrl", "itMetadata", "itContent"
    )
    Values (
        p_itIdItem,
        p_itUserId,
        p_itContentTypeId,
        Trim(p_sLibelle),
        Lower(Trim(p_sSlug)),                                   -- Normalisation stricte du slug en minuscules de soute.
        Coalesce(Trim(p_sAuteurSource), 'N.C.'),
        p_sThumbnailUrl,
        Coalesce(p_rMetadata, '{}'::jsonb),
        p_sContent
    )
    Returning
        public."Items"."itIdItem",
        public."Items"."itUserId",
        public."Items"."itCreatedAt",
        public."Items"."itUpdatedAt",
        public."Items"."itContentTypeId",
        public."Items"."itLibelle",
        public."Items"."itSlug",
        public."Items"."itAuteurSource",
        public."Items"."itThumbnailUrl",
        public."Items"."itMetadata",
        public."Items"."itContent";
End;
$$;

Comment On Function public."CreerPepite"(UUID, UUID, Char(4), Character Varying, Character Varying, Character Varying, Character Varying, JsonB, Text) Is 'Fondeur d''écriture injectant une nouvelle pépite atomique de connaissance en UUID natif pur [Mémoria].';


-- ----------------------------------------------------------------------------
-- 🏛️ 2. Mutation Partielle Sécurisée : ModifierPepite
-- ----------------------------------------------------------------------------
Drop Function if exists public."ModifierPepite"(UUID, Char(4), Character Varying, Character Varying, Character Varying, Character Varying, JsonB, Text);

Create Or Replace Function public."ModifierPepite"(
    p_itIdItem        UUID,                                     -- L'identifiant de la pépite cible.
    p_itContentTypeId Char(4),                                  -- Mutation optionnelle du format.
    p_sLibelle        Character Varying,                        -- Nouveau libellé partiel.
    p_sSlug           Character Varying,                        -- Nouveau slug synchronisé.
    p_sAuteurSource   Character Varying,
    p_sThumbnailUrl   Character Varying,
    p_rMetadata       JsonB,
    p_sContent        Text
)
Returns Table (
    "itIdItem"        UUID,
    "itUserId"        UUID,
    "itCreatedAt"     TimeStamp Without Time Zone,
    "itUpdatedAt"     TimeStamp Without Time Zone,
    "itContentTypeId" Char(4),
    "itLibelle"       Character Varying,
    "itSlug"          Character Varying,
    "itAuteurSource"  Character Varying,
    "itThumbnailUrl"  Character Varying,
    "itMetadata"      JsonB,
    "itContent"       Text
)
Language plpgsql
as $$
Begin
    Return Query
    Update public."Items"
    Set
        -- Coalesce préserve l'ancienne valeur si le paramètre TypeScript arrive vide
        "itContentTypeId" = Coalesce(p_itContentTypeId, "itContentTypeId"),
        "itLibelle"       = Coalesce(Trim(p_sLibelle), "itLibelle"),
        "itSlug"          = Coalesce(Lower(Trim(p_sSlug)), "itSlug"),
        "itAuteurSource"  = Coalesce(Trim(p_sAuteurSource), "itAuteurSource"),
        "itThumbnailUrl"  = Coalesce(p_sThumbnailUrl, "itThumbnailUrl"),
        "itMetadata"      = Coalesce(p_rMetadata, "itMetadata"),
        "itContent"       = Coalesce(p_sContent, "itContent")
    Where
        "itIdItem" = p_itIdItem                                 -- Ciblage laser direct sur l'UUID.
    Returning
        public."Items"."itIdItem",
        public."Items"."itUserId",
        public."Items"."itCreatedAt",
        public."Items"."itUpdatedAt",
        public."Items"."itContentTypeId",
        public."Items"."itLibelle",
        public."Items"."itSlug",
        public."Items"."itAuteurSource",
        public."Items"."itThumbnailUrl",
        public."Items"."itMetadata",
        public."Items"."itContent";                              -- Déclenche de force le trigger de soute itUpdatedAt.
End;
$$;

Comment On Function public."ModifierPepite"(UUID, Char(4), Character Varying, Character Varying, Character Varying, Character Varying, JsonB, Text) Is 'Applique des révisions partielles ou complètes sur les attributs textuels et métadonnées d''une pépite en UUID natif [Mémoria].';


-- ----------------------------------------------------------------------------
-- 🏛️ 3. Destruction Sécurisée et Ordonnée : DetruirePepite
-- ----------------------------------------------------------------------------
Drop Function if exists public."DetruirePepite"(UUID);

Create Or Replace Function public."DetruirePepite"(
    p_itIdItem UUID
)
Returns Boolean
Language plpgsql
as $$
Begin
    -- 1. Nettoyage préventif obligatoire de la table pivot pour éviter la violation de clé étrangère
    Delete From public."ItemTags"
    Where "tiItemId" = p_itIdItem;

    -- 2. Nettoyage préventif des passerelles d'accès URL liées
    Delete From public."Shares"
    Where "shItemId" = p_itIdItem;

    -- 3. Éradication physique de la pépite au cœur du coffre-fort
    Delete From public."Items"
    Where "itIdItem" = p_itIdItem;

    Return found;                                               -- Renvoie Vrai si le bloc a bien été désintégré.
End;
$$;

Comment On Function public."DetruirePepite"(UUID) Is 'Éradication destructive complète d''une pépite, de ses partages et de ses liens d''étiquettes en Cour Basse [Mémoria].';
