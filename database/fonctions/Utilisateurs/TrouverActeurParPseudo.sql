-- ——— fichier : database/fonctions/Utilisateurs/TrouverActeurParPseudo.sql

Drop Function if Exists "TrouverActeurParPseudo"(p_sPseudoActeur Character Varying);

Create Or Replace Function public."TrouverActeurParPseudo"(
    p_sPseudoActeur Character Varying -- Paramètre : Pseudonyme d'affichage recherché.
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
    where Lower("usPseudo") = Lower(Trim(p_sPseudoActeur)); -- Recherche insensible à la casse.
End;
$$;

Comment On Function public."TrouverActeurParPseudo"(Character Varying)   is 'Extrait un acteur via son pseudonyme unique en RAM.';
