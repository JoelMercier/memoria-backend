-- ============================================================================
-- 🏷️ Mémoria - Fonctions Stockées d'Infrastructure : Étiquettes (Tags)
-- Fichier: database/functions/Tags/Fonctions Tags Unifiees.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Éradication du SQL volant et alignement UUID natif - Pôle Tags
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. Création Idempotente : CreerTag
-- ----------------------------------------------------------------------------
Drop Function if exists public."CreerTag"(UUID, UUID, Character Varying);

Create Or Replace Function public."CreerTag"(
    p_axIdTag   UUID,                                           -- Identifiant 128 bits natif de l'étiquette.
    p_axUserId  UUID,                                           -- Identifiant 128 bits natif de l'acteur propriétaire.
    p_sLibelle  Character Varying                               -- Libellé textuel nettoyé de l'étiquette.
)
Returns Table (
    "tgIdTag"     Uuid,
    "tgUserId"    Uuid,
    "tgLibelle"   Character Varying,                            -- [RÉPARÉ V4] Alignement franconien.
    "tgCreatedAt" TimeStamp Without Time Zone,
    "tgUpdatedAt" TimeStamp Without Time Zone
)
Language plpgsql
as $$
Begin
    Return Query
    Insert Into public."Tags" ("tgIdTag", "tgUserId", "tgLibelle")
    Values (
        p_axIdTag,
        p_axUserId,
        Lower(Trim(p_sLibelle))                                 -- [RÉPARÉ V4] Normalisation stricte exigée par le check.
    )
    Returning "tgIdTag", "tgUserId", "tgLibelle", "tgCreatedAt", "tgUpdatedAt";
End;
$$;

Comment On Function public."CreerTag"(UUID, UUID, Character Varying) Is 'Insertion unitaire stricte et normalisée en UUID natif pur.';


-- ----------------------------------------------------------------------------
-- 🏛️ 2. Mutation Partielle Sécurisée : ModifierTag
-- ----------------------------------------------------------------------------
Drop Function if exists public."ModifierTag"(UUID, Character Varying);

Create Or Replace Function public."ModifierTag"(
    p_axIdTag  UUID,
    p_sLibelle Character Varying
)
Returns Table (
    "tgIdTag"     Uuid,
    "tgUserId"    Uuid,
    "tgLibelle"   Character Varying,
    "tgCreatedAt" TimeStamp Without Time Zone,
    "tgUpdatedAt" TimeStamp Without Time Zone
)
Language plpgsql
as $$
Begin
    Return Query
    Update public."Tags"
    Set "tgLibelle" = Coalesce(Lower(Trim(p_sLibelle)), "tgLibelle") -- Mutation nettoyée et sécurisée.
    Where "tgIdTag" = p_axIdTag                                 -- [RÉPARÉ V4] UUID natif en ligne droite.
    Returning "tgIdTag", "tgUserId", "tgLibelle", "tgCreatedAt", "tgUpdatedAt";
End;
$$;

Comment On Function public."ModifierTag"(UUID, Character Varying) Is 'Applique des révisions normalisées sur le libellé d''une étiquette.';


-- ----------------------------------------------------------------------------
-- 🏛️ 3. Lecture Unitaire Directe : TrouverTagParId et TrouverTagParNom
-- ----------------------------------------------------------------------------
Drop Function if exists public."TrouverTagParId"(UUID);
Drop Function if exists public."TrouverTagParNom"(UUID, Character Varying);

Create Or Replace Function public."TrouverTagParId"(p_axIdTag UUID)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgLibelle" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone)
Language plpgsql as $$
Begin
    Return Query
    Select "tgIdTag", "tgUserId", "tgLibelle", "tgCreatedAt", "tgUpdatedAt"
    From public."Tags"
    Where "tgIdTag" = p_axIdTag;                                -- [RÉPARÉ V4] Indexation B-Tree directe.
End; $$;

Create Or Replace Function public."TrouverTagParNom"(p_axUserId UUID, p_sLibelle Character Varying)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgLibelle" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone)
Language plpgsql as $$
Begin
    Return Query
    Select "tgIdTag", "tgUserId", "tgLibelle", "tgCreatedAt", "tgUpdatedAt"
    From public."Tags"
    Where "tgUserId" = p_axUserId
      And Lower("tgLibelle") = Lower(Trim(p_sLibelle));        -- Isolation propre sans "Bin-UUID".
End; $$;


-- ----------------------------------------------------------------------------
-- 🏛️ 4. Extractions Massives Paginées
-- ----------------------------------------------------------------------------
Drop Function if exists public."ToutesLesEtiquettesDunActeur"(UUID, Integer, Integer, Character Varying, Character Varying);
Drop Function if exists public."ToutesLesEtiquettesDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesEtiquettesDunActeur"(
    p_axUserId    UUID,
    p_iLimit      Integer,
    p_iOffset     Integer,
    p_sColonneTri Character Varying,
    p_sOrdreTri   Character Varying
)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgLibelle" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone, "rNbLignesTotal" BigInt)
Language plpgsql as $$
Declare
    l_sRequete Text;
Begin
    l_sRequete := 'Select "tgIdTag", "tgUserId", "tgLibelle", "tgCreatedAt", "tgUpdatedAt", Count(*) Over() From public."Tags" Where "tgUserId" = \$1 Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || ' Limit \$2 Offset \$3';
    Return Query Execute l_sRequete Using p_axUserId, p_iLimit, p_iOffset;
End; $$;

Create Or Replace Function public."ToutesLesEtiquettesDuChateau"(
    p_iLimit      Integer,
    p_iOffset     Integer,
    p_sColonneTri Character Varying,
    p_sOrdreTri   Character Varying
)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgLibelle" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone, "rNbLignesTotal" BigInt)
Language plpgsql as $$
Declare
    l_sRequete Text;
Begin
    l_sRequete := 'Select "tgIdTag", "tgUserId", "tgLibelle", "tgCreatedAt", "tgUpdatedAt", Count(*) Over() From public."Tags" Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || ' Limit \$1 Offset \$2';
    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End; $$;


-- ----------------------------------------------------------------------------
-- 🏛️ 5. Lecture par Lot : ToutesLesEtiquettesParIds
-- ----------------------------------------------------------------------------
Drop Function if exists public."ToutesLesEtiquettesParIds"(UUID[], Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."ToutesLesEtiquettesParIds"(
    p_axIds       UUID[],
    p_iLimit      Integer,
    p_iOffset     Integer,
    p_sColonneTri Character Varying,
    p_sOrdreTri   Character Varying
)
Returns Table ("tgIdTag" Uuid, "tgUserId" Uuid, "tgLibelle" Character Varying, "tgCreatedAt" TimeStamp Without Time Zone, "tgUpdatedAt" TimeStamp Without Time Zone, "rNbLignesTotal" BigInt)
Language plpgsql as $$
Declare
    l_sRequete Text;
Begin
    l_sRequete := 'Select "tgIdTag", "tgUserId", "tgLibelle", "tgCreatedAt", "tgUpdatedAt", Count(*) Over() From public."Tags" Where "tgIdTag" = Any(\$1) Order By ' || quote_ident(p_sColonneTri) || ' ' || p_sOrdreTri || ' Limit \$2 Offset \$3';
    Return Query Execute l_sRequete Using p_axIds, p_iLimit, p_iOffset;
End; $$;

Comment On Function public."ToutesLesEtiquettesDunActeur"(UUID, Integer, Integer, Character Varying, Character Varying) Is 'Extraction relationnelle ordonnée et paginée par acteur en UUID natif pur.';
