-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Infrastructure : Journaux d'Audit
-- Fichier: database\Refonte\26 - Fonctions Events Unifiees.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Écriture, purge et lecture globale paginée des traces d'audit
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Écriture Append-Only : ConsignerEvenement
-- ----------------------------------------------------------------------------
Drop Function If Exists public."ConsignerEvenement"(UUID, UUID, Char, Char, Char, Char, Text, JsonB);

Create Or Replace Function public."ConsignerEvenement"(
    p_axIdEvent     UUID,             -- 🪓 Les colosses 16 octets fixes en tête (Rule 1)
    p_axUserId      UUID,
    p_cCategoryId   Char(4),          -- Quadrigrammes exclusifs (Rule 1)
    p_cSeverityId   Char(4),
    p_cSecteurId    Char(4),
    p_cActionId     Char(4),
    p_sMessage      Text,             -- Les variables variables en fin de ligne
    p_rMetadata     JsonB
)
Returns Table (
    "aeIdEvent"     Uuid,
    "aeUserId"      Uuid,
    "aeCreatedAt"   TimeStamp Without Time Zone,
    "aeCategoryId"  Char(4),
    "aeSeverityId"  Char(4),
    "aeSecteurId"   Char(4),
    "aeActionId"    Char(4),
    "aeMessage"     Text,
    "aeMetadata"    JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Insert Into public."Events" (
        "aeIdEvent",
        "aeUserId",
        "aeCategoryId",
        "aeSeverityId",
        "aeSecteurId",
        "aeActionId",
        "aeMessage",
        "aeMetadata"
    )
    Values (
        "Bin-UUID"(p_axIdEvent),
        "Bin-UUID"(p_axUserId),
        p_cCategoryId,
        p_cSeverityId,
        p_cSecteurId,
        p_cActionId,
        p_sMessage,
        p_rMetadata
    )
    Returning
        "aeIdEvent",
        "aeUserId",
        "aeCreatedAt",
        "aeUpdatedAt", -- non inséré mais géré par défaut
        "aeCategoryId",
        "aeSeverityId",
        "aeSecteurId",
        "aeActionId",
        "aeMessage",
        "aeMetadata";
End;
$$;

Comment On Function public."ConsignerEvenement" is 'Fondeur d''écriture append-only sécurisé pour les journaux d''audit système.';


-- ----------------------------------------------------------------------------
-- 🏛️ 2. Extraction globale paginée système : ToutesLesTracesDuChateau
-- ----------------------------------------------------------------------------
Drop Function If Exists public."ToutesLesTracesDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesTracesDuChateau"(
    p_iLimit          Integer,           -- 🪓 Densité physique décroissante (Rule 1)
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
)
Returns Table (
    "aeIdEvent"       Uuid,
    "aeUserId"        Uuid,
    "aeCreatedAt"     TimeStamp Without Time Zone,
    "aeCategoryId"    Char(4),
    "aeSeverityId"    Char(4),
    "aeSecteurId"     Char(4),
    "aeActionId"      Char(4),
    "aeMessage"       Text,
    "aeMetadata"      JsonB,
    "rNbLignesTotal"  BigInt
)
Language plpgsql
as $$
Declare
    l_sRequete Text;
Begin
    l_sRequete := '
        Select
            "aeIdEvent",
            "aeUserId",
            "aeCreatedAt",
            "aeCategoryId",
            "aeSeverityId",
            "aeSecteurId",
            "aeActionId",
            "aeMessage",
            "aeMetadata",
            Count(*) Over()
        From
            public."Events"
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."ToutesLesTracesDuChateau" is 'Extracteur universel d''administration pour la table Events, bridé anti-fuite de RAM.';


-- 🪓 Destruction préventive de l'ancien moule orphelin
Drop Function If Exists public."FiltrerJournaux"(Bytea, Char, Char, Char, Char, Integer, Integer);
Drop Function If Exists public."ToutesLesTraces"(Bytea, Char, Char, Char, Char, Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesTraces"(
    p_axUserId        Bytea,             -- 🪓 Les colosses fixes 16 octets en tête (Rule 1)
    p_cSecteurId      Char(4),           -- Quadrigrammes de dictionnaire fixes
    p_cActionId       Char(4),
    p_cCategoryId     Char(4),
    p_cSeverityId     Char(4),
    p_iLimit          Integer,           -- Limites et offsets physiques
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
)
Returns Table (
    -- 1. Les colosses (16 octets fixes fixed-width Bytea/UUID) (Rule 1)
    "aeIdEvent"       Uuid,
    "aeUserId"        Uuid,

    -- 2. Les horodateurs (8 octets fixes fixed-width)
    "aeCreatedAt"     TimeStamp Without Time Zone,

    -- 3. Les variables et fin de tas (Rule 1)
    "aeCategoryId"    Char(4),
    "aeSeverityId"    Char(4),
    "aeSecteurId"     Char(4),
    "aeActionId"      Char(4),
    "aeMessage"       Text,
    "aeMetadata"      JsonB,
    "rNbLignesTotal"  BigInt
)
Language plpgsql
as $$
Declare
    l_sRequete Text;
Begin
    l_sRequete := '
        Select
            "aeIdEvent",
            "aeUserId",
            "aeCreatedAt",
            "aeCategoryId",
            "aeSeverityId",
            "aeSecteurId",
            "aeActionId",
            "aeMessage",
            "aeMetadata",
            Count(*) Over()
        From
            public."Events"
        Where
            ($1 is Null or "aeUserId" = "Bin-UUID"($1))
            and ($2 is Null or "aeSecteurId" = $2)
            and ($3 is Null or "aeActionId" = $3)
            and ($4 is Null or "aeCategoryId" = $4)
            and ($5 is Null or "aeSeverityId" = $5)
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $6
        Offset $7';

    Return Query Execute l_sRequete
    Using p_axUserId, p_cSecteurId, p_cActionId, p_cCategoryId, p_cSeverityId, p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."ToutesLesTraces" is 'Extracteur universel et polymorphe du Donjon pour l''audit système, couplé à la Choupy Doctrine V4.';
