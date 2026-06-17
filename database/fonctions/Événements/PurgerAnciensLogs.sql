-- ——— fichier : database\fonctions\Événements\PurgerAnciensLogs.sql

-- ============================================================================
-- 🚨 INFRASTRUCTURE : PURGE ET CARBONISATION PHYSIQUE DE LA TABLE EVENTS
-- Version: 4.2.1 (PostgreSQL 17+)
-- Description: Destruction définitive des logs de plus d'un an du disque dur.
--              [SCELLÉ SECURITY DEFINER] Seule porte d'entrée pour le rôle Mémoria.
--              [GARDER-FOU SOUVERAIN] Limite absolue d'un an via l'horloge serveur.
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."PurgerAnciensLogs"(Timestamp);

Create Or Replace Function public."PurgerAnciensLogs"(
    p_dDateCutoff Timestamp
)
Returns Integer As $$
Declare
    l_nLignesSupprimees Integer;
    l_dLimiteReglementaire Timestamp;
Begin
    -- 1. Calcul mathématique de la frontière absolue d'un an (Horloge serveur immuable)
    l_dLimiteReglementaire := now() - Interval '1 year';

    -- 2. Garde-fou souverain : si la date passée est trop récente, on s'aligne de force sur 1 an
    If p_dDateCutoff > l_dLimiteReglementaire Then
        p_dDateCutoff := l_dLimiteReglementaire;
    End If;

    -- 3. Destruction physique définitive sur le disque
    Delete From public."Events"
    Where "aeCreatedAt" < p_dDateCutoff;

    Get Diagnostics l_nLignesSupprimees = Row_Count;
    Return l_nLignesSupprimees;
End;
$$ Language plpgsql Security Definer; -- 🔒 [DECRET JOEL] Security Definer obligatoire pour passer le mur !

Comment On Function public."PurgerAnciensLogs"(Timestamp) Is 'Détruit physiquement et définitivement du disque les journaux d''audit de plus d''un an.';
