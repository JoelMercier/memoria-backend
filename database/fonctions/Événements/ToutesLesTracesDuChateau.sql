-- ——— fichier : database\fonctions\Événements\ToutesLesTracesDuChateau.sql

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
