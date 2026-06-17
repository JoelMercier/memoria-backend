-- ——— fichier : database/fonctions/Partages/TousLesPartagesDuChateau.sql

Drop Function If Exists public."TousLesPartagesDuChateau"(Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesPartagesDuChateau"(
    p_iLimit      Integer,
    p_iOffset     Integer,
    p_sColonneTri Character Varying,
    p_sOrdreTri   Character Varying
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"   Character Varying,
    "shAccesConfig"  JsonB,
    "rNbLignesTotal" BigInt
)
Language plpgsql
as $$
Declare
    l_sRequete Text;
    l_sOrdre   Text;
Begin
    -- Extraction et validation stricte de l'ordre de tri pour interdire l'injection SQL
    l_sOrdre := Case When Upper(Trim(p_sOrdreTri)) = 'DESC' Then 'DESC' Else 'ASC' End;

    l_sRequete := '
        Select
            "shIdShare",
            "shItemId",
            "shItemOwnerId",
            "shCreatedAt",
            "shUpdatedAt",
            "shCourrielDest",
            "shAccesJeton",
            "shAccesConfig",
            Count(*) Over()
        From
            public."Shares"
        Order By ' || quote_ident(p_sColonneTri) || ' ' || l_sOrdre || '
        Limit $1
        Offset $2';

    Return Query Execute l_sRequete Using p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesPartagesDuChateau"(Integer, Integer, Character Varying, Character Varying) Is 'Extracteur universel d''administration d''IHM pour le grand fichier des partages de soute, sécurisé et paginé [Mémoria].';
