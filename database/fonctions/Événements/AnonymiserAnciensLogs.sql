-- ——— fichier : database\fonctions\Événements\AnonymiserAnciensLogs.sql

-- ============================================================================
-- 🚨 INFRASTRUCTURE : ANONYMISATION TEMPATIONNELLE RGPD DE MASSE
-- Version: 4.2.1 (PostgreSQL 17+)
-- Description: Rompt le lien ombilical des acteurs pour les logs de plus de 6 mois.
--              [SCELLÉ SÉCURITÉ] Garde-fou interne absolu de 6 mois via l'horloge système.
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."AnonymiserAnciensLogs"(Timestamp);

Create Or Replace Function public."AnonymiserAnciensLogs"(
    p_dDateCutoff Timestamp
)
Returns Integer As $$
Declare
    l_nLignesModifiees Integer;
    l_dLimiteReglementaire Timestamp;
Begin
    -- 1. Calcul mathématique de la frontière absolue des 6 mois (Horloge serveur immuable)
    l_dLimiteReglementaire := now() - Interval '6 months';

    -- 2. Garde-fou souverain : si la date passée par l'IHM est trop récente, on la recale de force
    If p_dDateCutoff > l_dLimiteReglementaire Then
        p_dDateCutoff := l_dLimiteReglementaire;
    End If;

    -- 3. Mutation de soute sécurisée
    Update public."Events"
    Set "aeUserId" = Null
    Where "aeCreatedAt" < p_dDateCutoff
      And "aeUserId" Is Not Null;

    Get Diagnostics l_nLignesModifiees = Row_Count;
    Return l_nLignesModifiees;
End;
$$ Language plpgsql Security Definer; -- 🔒 Privilège admin requis pour modifier la table d'audit.

