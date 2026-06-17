-- ——— fichier : database/fonctions/Partages/TrouverPartageParJeton.sql

Drop Function if exists public."TrouverPartageParJeton"(Character Varying);

Create Or Replace Function public."TrouverPartageParJeton"(
    p_sAccesJeton Character Varying
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
    Select
        "shIdShare", "shItemId", "shItemOwnerId",
        "shCreatedAt", "shUpdatedAt", "shCourrielDest",
        "shAccesJeton", "shAccesConfig"
    From
        public."Shares"
    Where
        "shAccesJeton" = Trim(p_sAccesJeton);                   -- Nettoyage de sécurité anti-espaces invisibles d'URL.
End;
$$;

Comment On Function public."TrouverPartageParJeton"(Character Varying) Is 'Tir laser indexé extrayant une passerelle unique via son jeton d''accès d''URL avec nettoyage de soute.';
