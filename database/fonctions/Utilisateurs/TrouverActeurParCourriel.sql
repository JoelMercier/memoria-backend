-- ——— fichier : database/fonctions/Utilisateurs/TrouverActeurParCourriel.sql

Drop Function if Exists "TrouverActeurParCourriel"( p_sCourrielActeur Character Varying);

Create Or Replace Function public."TrouverActeurParCourriel"(
    p_sCourrielActeur Character Varying -- Paramètre : Adresse électronique de recherche.
)
Returns Table (
    "usIdUser"       Uuid,
    "usCreatedAt"    TimeStamp Without Time Zone,
    "usRgpdDate"     TimeStamp Without Time Zone,
    "usUpdatedAt"    TimeStamp Without Time Zone,
    "usCourriel"     Character Varying,
    "usPasswordHash" Character Varying,
    "usPseudo"       Character Varying,
    "usRoleId"       Character Varying,
    "usProviderId"   Character Varying,
    "usSettingsUser" JsonB,
    "usRgpdConsent"  Boolean
)
Language plpgsql
as $$
Begin
    Return Query
    Select
        "usIdUser",
        "usCreatedAt",
        "usRgpdDate",
        "usUpdatedAt",
        "usCourriel",
        "usPasswordHash",
        "usPseudo",
        "usRoleId",
        "usProviderId",
        "usSettingsUser",
        "usRgpdConsent"
    From public."Users"
    where "usCourriel" = Lower(Trim(p_sCourrielActeur)); -- Index unique de Cour Basse.
End;
$$;

Comment On Function public."TrouverActeurParCourriel"(Character Varying) is 'Extrait un acteur via son adresse électronique nettoyée.';
