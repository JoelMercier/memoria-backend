-- ——— fichier : database\fonctions\Événements\ToutesLesTraces.sql

-- ----------------------------------------------------------------------------
-- 🏛️ 3. Extraction Filtrée : ToutesLesTraces
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
