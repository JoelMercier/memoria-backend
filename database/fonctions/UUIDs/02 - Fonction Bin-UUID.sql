-- ——— fichier : database\fonctions\Fonction Hex-UUID.sql

-- 🪓 LE SOUPIRAIL : Fonction d'usine stockée dans PostgreSQL
-- Reçoit un buffer de 16 octets (BYTEA) et le convertit directement en UUID sur le disque

Drop Function if Exists "Bin-UUID"(ByteA);

Create or Replace Function "Bin-UUID"(in p_hexBuffer BYTEA) RETURNS UUID AS $Body$
Begin
    Return encode(p_hexBuffer, 'hex')::uuid;
End;
$Body$ Language plpgsql Immutable Strict;

Comment on Function "Bin-UUID"(ByteA) is 'Convertit un Buffer[16] ou ByteA[16], un segment binaire de 16 octets directement via l exportateur interne du moteur PostgreSQL sans transit textuel.';
