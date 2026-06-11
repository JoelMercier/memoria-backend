-- ——— fichier : database/fonctions/Fonction Bin-UUID.sql

-- ============================================================================
-- 🪓 Mémoria - Fonction Bin-UUID
-- Version: 1.1.0 (PostgreSQL 17+)
-- Description: Reçoit un buffer de 16 octets et le convertit en UUID visuel
-- ============================================================================

Set search_path To Public;

Drop Function if Exists "Bin-UUID"(ByteA);

Create Or Replace Function "Bin-UUID"(p_xBuffer ByteA)
Returns UUID As $$
Begin
    -- Utilisation de l'encodeur de soute natif pour un saut à coût CPU nul
    Return Encode(p_xBuffer, 'hex')::UUID;
End;
$$ Language Plpgsql Immutable Strict;

Comment on Function "Bin-UUID"(ByteA) is 'Convertit un Buffer ou ByteA de 16 octets directement via l''exportateur interne du moteur PostgreSQL sans transit textuel.';
