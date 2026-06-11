-- ——— fichier : database/fonctions/Fonction UUID-Bin.sql

-- ============================================================================
-- 🪓 Mémoria - Fonction UUID-Bin
-- Version: 1.1.0 (PostgreSQL 17+)
-- Description: Reçoit un UUID et extrait son flux binaire interne de 16 octets
-- ============================================================================

Set search_path To Public;

Drop Function if Exists "UUID-Bin"(UUID);

Create Or Replace Function "UUID-Bin"(p_hUuid UUID)
Returns ByteA As $$
Begin
    -- Utilisation de la fonction interne native qui extrait le flux binaire de 16 octets
    Return Uuid_send(p_hUuid);
End;
$$ Language Plpgsql Immutable Strict;

Comment on Function "UUID-Bin"(UUID) is 'Convertit un UUID directement en segment binaire de 16 octets (Bytea) via l''exportateur interne du moteur PostgreSQL sans transit textuel.';
