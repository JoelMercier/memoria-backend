-- ——— fichier : database/fonctions/Partages/RevoquerPartage.sql

Drop Function if exists public."RevoquerPartage"(UUID);

Create Or Replace Function public."RevoquerPartage"(
    p_axIdShare UUID
)
Returns Boolean
Language plpgsql
as $$
Declare
    l_bImpacted Boolean;                                        -- Variable locale de traçabilité.
Begin
    Delete From public."Shares"
    Where "shIdShare" = p_axIdShare;                            -- [RÉPARÉ V4] Révocation directe sans "Bin-UUID".

    Get Diagnostics l_bImpacted = Row_Count;                    -- Extrait l'impact réel de la désintégration de soute.
    Return l_bImpacted;
End;
$$;

Comment On Function public."RevoquerPartage"(UUID) Is 'Révocation destructive immédiate d''une passerelle URL-Safe via son UUID natif avec diagnostic d''impact.';
