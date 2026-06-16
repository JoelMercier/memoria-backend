-- ——— fichier : database/fonctions/Utilisateurs/TrouverActeurParId.sql
Drop Function if Exists "TrouverActeurParCle"(p_axIdActeur Uuid);

Create Or Replace Function public."TrouverActeurParCle"(
    p_axIdActeur Uuid  -- Paramètre : L'identifiant 128 bits natif de l'acteur (Rule 1 & 4).
)
Returns Table (
    "usIdUser"       Uuid,                        -- 16 octets fixes.
    "usCreatedAt"    TimeStamp Without Time Zone, -- 8 octets fixes.
    "usRgpdDate"     TimeStamp Without Time Zone, -- 8 octets fixes.
    "usUpdatedAt"    TimeStamp Without Time Zone, -- 8 octets fixes.
    "usCourriel"     Character Varying,           -- Chaînes variables en fin de tas.
    "usPasswordHash" Character Varying,
    "usPseudo"       Character Varying,
    "usRoleId"       Character Varying,           -- Quadrigramme dictionnaire.
    "usProviderId"   Character Varying,           -- Quadrigramme dictionnaire.
    "usSettingsUser" JsonB,                       -- Conteneur flexible.
    "usRgpdConsent"  Boolean                      -- 1 octet de queue.
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
    where "usIdUser" = "Bin-UUID"(p_axIdActeur);
End;
$$;

Comment On Function public."TrouverActeurParCle"(Uuid)              is 'Extrait un acteur via son UUID binaire de 16 octets.';
