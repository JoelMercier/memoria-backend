-- ——— fichier : database/fonctions/Partages/TousLesPartagesDunePepite.sql

Drop Function If Exists public."TousLesPartagesDunePepite"(UUID, Integer, Integer, Character Varying, Character Varying);

Create Or Replace Function public."TousLesPartagesDunePepite"(
    p_axItemId    UUID,                                         -- L'identifiant 128 bits natif de la pépite.
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
    l_sRequete Text;                                            -- Variable locale : Requête textuelle dynamique.
    l_sOrdre   Text;                                            -- Sécurisation de l'ordre de tri.
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
            "shItemId" = $1
        Order By ' || quote_ident(p_sColonneTri) || ' ' || l_sOrdre || '
        Limit $2
        Offset $3';

    Return Query Execute l_sRequete Using p_axItemId, p_iLimit, p_iOffset;
End;
$$;

Comment On Function public."TousLesPartagesDunePepite"(UUID, Integer, Integer, Character Varying, Character Varying) Is 'Extracteur relationnel paginé et sécurisé des passerelles URL-Safe rattachées à une ressource en UUID natif pur [Mémoria].';
