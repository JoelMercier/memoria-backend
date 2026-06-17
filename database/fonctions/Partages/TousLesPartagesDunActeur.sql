-- ——— fichier : database/fonctions/Partages/TousLesPartagesDunActeur.sql

Drop Function If Exists public."TousLesPartagesDunActeur"(UUID, Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesPartagesDunActeur"(
    p_axUserId    UUID,                                         -- Tir direct sur la colonne dé-normalisée.
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
        Where
            "shItemOwnerId" = $1
        Order By ' || quote_ident(p_sColonneTri) || ' ' || l_sOrdre || '
        Limit $2
        Offset $3';

    Return Query Execute l_sRequete Using p_axUserId, p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesPartagesDunActeur"(UUID, Integer, Integer, Character Varying, Character Varying) Is 'Extracteur de performance paginé et sécurisé exploitant l''index d''ownership dé-normalisé sans jointure [Mémoria].';
