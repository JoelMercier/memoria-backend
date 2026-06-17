-- ——— fichier : database/fonctions/Partages/ModifierPartage.sql

Drop Function if exists public."ModifierPartage"(UUID, Character Varying, JsonB);

Create Or Replace Function public."ModifierPartage"(
    p_axIdShare     UUID,
    p_sCourrielDest Character Varying,
    p_rAccesConfig  JsonB
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"   Character Varying,
    "shAccesConfig"  JsonB
)
Language plpgsql
as $$
Begin
    Return Query
    Update public."Shares"
    Set
        "shCourrielDest" = Coalesce(NullIf(Lower(Trim(p_sCourrielDest)), ''), "shCourrielDest"), -- Normalisation et repli sécurisé [Mémoria].
        "shAccesConfig"  = Coalesce(p_rAccesConfig, "shAccesConfig")
    Where
        "shIdShare" = p_axIdShare
    Returning
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCreatedAt", "shUpdatedAt", "shCourrielDest",
        "shAccesJeton", "shAccesConfig";                        -- Déclenche de force le trigger de mise à jour temporelle.
End;
$$;

Comment On Function public."ModifierPartage"(UUID, Character Varying, JsonB) Is 'Applique des révisions partielles sur les restrictions d''accès shAccesConfig en UUID natif avec normalisation [Mémoria].';
