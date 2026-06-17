-- ——— fichier : database/fonctions/Partages/CreerPartage.sql

Drop Function if exists public."CreerPartage"(UUID, UUID, UUID, Character Varying, Character Varying, JsonB);

Create Or Replace Function public."CreerPartage"(
    p_axIdShare      UUID,                                      -- L'identifiant 128 bits natif du partage (Rule 1).
    p_axItemId       UUID,                                      -- Clé étrangère liée à la table Items.
    p_axItemOwnerId  UUID,                                      -- Colonne dé-normalisée de performance pure.
    p_sCourrielDest  Character Varying,
    p_sAccesJeton    Character Varying,                         -- Paramètre réaligné sur shAccesJeton.
    p_rAccesConfig   JsonB                                      -- Paramètre réaligné sur shAccesConfig.
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"   Character Varying,                          -- [RÉPARÉ V4] Alignement nominal.
    "shAccesConfig"  JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Insert Into public."Shares" (
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCourrielDest", "shAccesJeton", "shAccesConfig"
    )
    Values (
        p_axIdShare,
        p_axItemId,
        p_axItemOwnerId,
        NullIf(Lower(Trim(p_sCourrielDest)), ''),               -- Normalisation de sécurité de l'e-mail [Mémoria].
        Trim(p_sAccesJeton),                                    -- Nettoyage des espaces blancs.
        Coalesce(p_rAccesConfig, '{}'::jsonb)                   -- Protection anti-null sur le JSONB [Mémoria].
    )
    Returning
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCreatedAt", "shUpdatedAt", "shCourrielDest",
        "shAccesJeton", "shAccesConfig";
End;
$$;

Comment On Function public."CreerPartage"(UUID, UUID, UUID, Character Varying, Character Varying, JsonB) Is 'Fondeur d''écriture sécurisé injectant une nouvelle passerelle d''accès en UUID natif pur [Mémoria].';
