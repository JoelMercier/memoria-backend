-- ============================================================================
-- 🗄️ Mémoria - Fonctions Stockées d'Infrastructure : Étiquettes (Tags)
-- Fichier: database\Refonte\31 - Fonctions Tags Unifiees.sql
-- Version: 4.5.0 (PostgreSQL 17+)
-- Description: Éradication du SQL volant pour l'intégralité du pôle Tags
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Création Idempotente : CreerTag
-- ----------------------------------------------------------------------------
Drop Function If Exists public."CreerTag"(UUID, UUID, Character Varying);

Create Or Replace Function public."CreerTag"(
    p_axIdTag     UUID,              -- 🪓 Les colosses 16 octets fixes en tête (Rule 1)
    p_axUserId    UUID,
    p_sName       Character Varying   -- Les chaînes en fin de soute
)
Returns Table (
    "tgIdTag"     Uuid,
    "tgUserId"    Uuid,
    "tgName"      Character Varying,
    "tgCreatedAt" TimeStamp Without Time Zone,
    "tgUpdatedAt" TimeStamp Without Time Zone
)
Language plpgsql
as $$
Begin
    Return Query
    Insert Into public."Tags" ("tgIdTag", "tgUserId", "tgName")
    Values ("Bin-UUID"(p_axIdTag), "Bin-UUID"(p_axUserId), p_sName)
    Returning "tgIdTag", "tgUserId", "tgName", "tgCreatedAt", "tgUpdatedAt";
End;
$$;

-- ----------------------------------------------------------------------------
-- 🏛️ 2. Mutation Partielle Sécurisée : ModifierTag
-- ----------------------------------------------------------------------------
Drop Function If Exists public."ModifierTag"(UUID, Character Varying);

Create Or Replace Function public."ModifierTag"(
    p_axIdTag     UUID,
    p_sName       Character Varying
)
Returns Table (
    "tgIdTag"     Uuid,
    "tgUserId"    Uuid,
    "tgName"      Character Varying,
    "tgCreatedAt" TimeStamp Without Time Zone,
    "tgUpdatedAt" TimeStamp Without Time Zone
)
Language plpgsql
as $$
Begin
    Return Query
    Update public."Tags"
    Set "tgName" = Coalesce(p_sName, "tgName")
    Where "tgIdTag" = "Bin-UUID"(p_axIdTag)
    Returning "tgIdTag", "tgUserId", "tgName", "tgCreatedAt", "tgUpdatedAt";
End;
$$;

-- ----------------------------------------------------------------------------
-- 🏛️ 3. Lecture Unitaire Directe : TrouverTagParId et TrouverTagParNom
-- ----------------------------------------------------------------------------
Drop Function If Exists public."TrouverTagParId"(UUID);
Drop Function If Exists public."TrouverTagParNom"(UUID, Character Varying);

Create Or Replace Function public."TrouverTagParId"(p_axIdTag UUID)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgName" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone)
Language plpgsql as $$ Begin Return Query Select "tgIdTag", "tgUserId", "tgName", "tgCreatedAt", "tgUpdatedAt" From public."Tags" Where "tgIdTag" = "Bin-UUID"(p_axIdTag); End; $$;

Create Or Replace Function public."TrouverTagParNom"(p_axUserId UUID, p_sName Character Varying)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgName" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone)
Language plpgsql as $$ Begin Return Query Select "tgIdTag", "tgUserId", "tgName", "tgCreatedAt", "tgUpdatedAt" From public."Tags" Where "tgUserId" = "Bin-UUID"(p_axUserId) and Lower("tgName") = Lower(p_sName); End; $$;

-- ----------------------------------------------------------------------------
-- 🏛️ 4. Extractions Massives Paginées : ToutesLesEtiquettesDunActeur et ToutesLesEtiquettesDuChateau
-- ----------------------------------------------------------------------------
Drop Function If Exists public."ToutesLesEtiquettesDunActeur"(UUID, Integer, Integer, Character Varying, Character Varying);
Drop Function If Exists public."ToutesLesEtiquettesDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesEtiquettesDunActeur"(
    p_axUserId        UUID,
    p_iLimit          Integer,
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgName" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone, "rNbLignesTotal" BigInt)
Language plpgsql as $$ Declare l_sRequete Text; Begin
    l_sRequete := 'Select "tgIdTag", "tgUserId", "tgName", "tgCreatedAt", "tgUpdatedAt", Count(*) Over() From public."Tags" Where "tgUserId" = "Bin-UUID"(\$1) Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || ' Limit \$2 Offset \$3';
    Return Query Execute l_sRequete Using p_axUserId, p_iLimit, p_iOffset;
End; $$;

Create Or Replace Function public."ToutesLesEtiquettesDuChateau"(
    p_iLimit          Integer,
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgName" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone, "rNbLignesTotal" BigInt)
Language plpgsql as $$ Declare l_sRequete Text; Begin
    l_sRequete := 'Select "tgIdTag", "tgUserId", "tgName", "tgCreatedAt", "tgUpdatedAt", Count(*) Over() From public."Tags" Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || ' Limit \$1 Offset \$2';
    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End; $$;

-- ----------------------------------------------------------------------------
-- 🏛️ 5. Lecture par Lot : ToutesLesEtiquettesParIds
-- ----------------------------------------------------------------------------
Drop Function If Exists public."ToutesLesEtiquettesParIds"(UUID[], Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesEtiquettesParIds"(
    p_axIds           UUID[],
    p_iLimit          Integer,
    p_iOffset         Integer,
    p_sColonneTri     Character Varying,
    p_sOrdreTri       Character Varying
)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgName" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone, "rNbLignesTotal" BigInt)
Language plpgsql as $$ Declare l_sRequete Text; Begin
    l_sRequete := 'Select "tgIdTag", "tgUserId", "tgName", "tgCreatedAt", "tgUpdatedAt", Count(*) Over() From public."Tags" Where "tgIdTag" = Any(\$1) Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || ' Limit \$2 Offset \$3';
    Return Query Execute l_sRequete Using p_axIds, p_iLimit, p_iOffset;
End; $$;

COMMENT ON FUNCTION public."CreerTag" is 'Insertion unitaire stricte 128 bits sécurisée.';
COMMENT ON FUNCTION public."ToutesLesEtiquettesDunActeur" is 'Extraction relationnelle filtrée, ordonnée et paginée en Cour Basse.';
