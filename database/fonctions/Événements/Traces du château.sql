-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Infrastructure : Journaux d'Audit
-- Fichier: database/functions/Partages/Fonctions Events Unifiees.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Écriture, purge et lecture globale paginée des traces d'audit
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Écriture Append-Only : ConsignerEvenement
-- ----------------------------------------------------------------------------
Drop Function if exists public."ConsignerEvenement"(UUID, UUID, Char(4), Char(4), Char(4), Char(4), Text, JsonB);

Create Or Replace Function public."ConsignerEvenement"(
    p_axIdEvent     UUID,                                       -- Identifiant 128 bits natif de la trace.
    p_axUserId      UUID,                                       -- Acteur responsable (Null si action système).
    p_cCategorieId  Char(4),                                    -- [RÉPARÉ V4] Alignement nominal ca.
    p_cSeveriteId   Char(4),                                    -- [RÉPARÉ V4] Alignement nominal se.
    p_cSecteurId    Char(4),                                    -- Alignement nominal sc.
    p_cActionId     Char(4),                                    -- Alignement nominal ac.
    p_sMessage      Text,
    p_rMetadata     JsonB
)
Returns Table (
    "aeIdEvent"     Uuid,
    "aeUserId"      Uuid,
    "aeCreatedAt"   TimeStamp Without Time Zone,
    "aeCategorieId" Char(4),
    "aeSeveriteId"  Char(4),
    "aeSecteurId"   Char(4),
    "aeActionId"    Char(4),
    "aeMessage"     Text,
    "aeMetadata"    JsonB
)
Language plpgsql
as $$
Declare
    l_cCategorieCalculée Char(4);                               -- Variable locale : Arbitrage de la catégorie.
    l_cSeveriteCalculée  Char(4);                               -- Variable locale : Arbitrage de la sévérité.
Begin
    -- 🪓 ARBITRAGE CATEGORIE : Si invalide ou absente, repli sur le bit caDefaut
    If Exists (Select 1 From public."Categories" Where "caIdCategory" = p_cCategorieId) Then
        l_cCategorieCalculée := p_cCategorieId;
    Else
        l_cCategorieCalculée := (Select "caIdCategory" From public."Categories" Where "caDefaut" = True Limit 1);
    End if;

    -- 🪓 ARBITRAGE SEVERITE : Si invalide ou absente, repli sur le bit seDefaut
    If Exists (Select 1 From public."Severites" Where "seIdSeverity" = p_cSeveriteId) Then
        l_cSeveriteCalculée := p_cSeveriteId;
    Else
        l_cSeveriteCalculée := (Select "seIdSeverity" From public."Severites" Where "seDefaut" = True Limit 1);
    End if;

    Return Query
    Insert Into public."Events" (
        "aeIdEvent", "aeUserId", "aeCategorieId",
        "aeSeveriteId", "aeSecteurId", "aeActionId",
        "aeMessage", "aeMetadata"
    )
    Values (
        p_axIdEvent, p_axUserId, l_cCategorieCalculée,
        l_cSeveriteCalculée, p_cSecteurId, p_cActionId,
        p_sMessage, p_rMetadata
    )
    Returning
        "aeIdEvent",
        "aeUserId",
        "aeCreatedAt",
        "aeCategorieId",
        "aeSeveriteId",
        "aeSecteurId",
        "aeActionId",
        "aeMessage",
        "aeMetadata";                                           -- [RÉPARÉ V4] Éradication définitive d'aeUpdatedAt.
End;
$$;

Comment On Function public."ConsignerEvenement"(UUID, UUID, Char(4), Char(4), Char(4), Char(4), Text, JsonB) Is 'Fondeur d''écriture append-only sécurisé pour les journaux d''audit système en UUID natif pur.';


-- ----------------------------------------------------------------------------
-- 🏛️ 2. Extraction globale paginée système : ToutesLesTracesDuChateau
-- ----------------------------------------------------------------------------
Drop Function if exists public."ToutesLesTracesDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesTracesDuChateau"(
    p_iLimit      Integer,
    p_iOffset     Integer,
    p_sColonneTri Character Varying,
    p_sOrdreTri   Character Varying
)
Returns Table (
    "aeIdEvent"      Uuid,
    "aeUserId"       Uuid,
    "aeCreatedAt"    TimeStamp Without Time Zone,
    "aeCategorieId"  Char(4),                                   -- [RÉPARÉ V4] Alignement nominal.
    "aeSeveriteId"   Char(4),                                   -- [RÉPARÉ V4] Alignement nominal.
    "aeSecteurId"    Char(4),
    "aeActionId"     Char(4),
    "aeMessage"      Text,
    "aeMetadata"     JsonB,
    "rNbLignesTotal" BigInt
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
            "aeCategorieId",
            "aeSeveriteId",
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

Comment On Function public."ToutesLesTracesDuChateau"(Integer, Integer, Character Varying, Character Varying) Is 'Extracteur universel d''administration pour la table Events paginé en UUID natif pur.';


-- ----------------------------------------------------------------------------
-- 🏛️ 3. Extraction Filtrée et Polymorphe : ToutesLesTraces
-- ----------------------------------------------------------------------------
Drop Function if exists public."ToutesLesTraces"(Bytea, Char(4), Char(4), Char(4), Char(4), Integer, Integer, Character Varying, Character Varying);
Drop Function if exists public."ToutesLesTraces"(UUID, Char(4), Char(4), Char(4), Char(4), Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesTraces"(
    p_axUserId      UUID,                                       -- [RÉPARÉ V4] Aligné sur le type UUID natif.
    p_cSecteurId    Char(4),
    p_cActionId     Char(4),
    p_cCategorieId  Char(4),
    p_cSeveriteId   Char(4),
    p_iLimit        Integer,
    p_iOffset       Integer,
    p_sColonneTri   Character Varying,
    p_sOrdreTri     Character Varying
)
Returns Table (
    "aeIdEvent"      Uuid,
    "aeUserId"       Uuid,
    "aeCreatedAt"    TimeStamp Without Time Zone,
    "aeCategorieId"  Char(4),                                   -- [RÉPARÉ V4] Alignement nominal Rule 3.
    "aeSeveriteId"   Char(4),                                   -- [RÉPARÉ V4] Alignement nominal Rule 3.
    "aeSecteurId"    Char(4),
    "aeActionId"     Char(4),
    "aeMessage"      Text,
    "aeMetadata"     JsonB,
    "rNbLignesTotal" BigInt
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
            "aeCategorieId",
            "aeSeveriteId",
            "aeSecteurId",
            "aeActionId",
            "aeMessage",
            "aeMetadata",
            Count(*) Over()
        From
            public."Events"
        Where
            ($1 is null or "aeUserId" = $1)                     -- [RÉPARÉ V4] UUID natif direct sans "Bin-UUID".
            and ($2 is null or "aeSecteurId" = $2)
            and ($3 is null or "aeActionId" = $3)
            and ($4 is null or "aeCategorieId" = $4)
            and ($5 is null or "aeSeveriteId" = $5)
        Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || '
        Limit $6
        Offset $7';

    Return Query Execute l_sRequete
    Using p_axUserId, p_cSecteurId, p_cActionId, p_cCategorieId, p_cSeverityId, p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."ToutesLesTraces"(UUID, Char(4), Char(4), Char(4), Char(4), Integer, Integer, Character Varying, Character Varying) Is 'Extracteur universel et polymorphe du Donjon pour l''audit système unifié V4 Pro.';
