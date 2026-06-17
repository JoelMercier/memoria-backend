
-- ----------------------------------------------------------------------------
-- 🏛️ 4. Lecture Directe par Clé Primaire : TrouverPartageParId
-- ----------------------------------------------------------------------------
Drop Function if exists public."TrouverPartageParId"(UUID);

Create Or Replace Function public."TrouverPartageParId"(
    p_axIdShare UUID
)
Returns Table (
    "shIdShare"      UUID,
    "shItemId"       UUID,
    "shItemOwnerId"  UUID,
    "shCreatedAt"    TimeStamp Without Time Zone,
    "shUpdatedAt"    TimeStamp Without Time Zone,
    "shCourrielDest" Character Varying,
    "shAccesJeton"  Character Varying,
    "shAccesConfig" JsonB
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
        "shIdShare" = p_axIdShare;                               -- [RÉPARÉ V4] Tir laser sur index de clé primaire.
End;
$$;

Comment On Function public."TrouverPartageParId"(UUID) Is 'Tir laser indexé extrayant une passerelle unique via sa clé primaire binaire UUID.';
