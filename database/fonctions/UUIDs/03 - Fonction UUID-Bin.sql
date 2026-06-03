-- ——— fichier : database\fonctions\Fonction UUID-Hex.sql

-- 🪓 LE SOUPIRAIL : Fonction d'usine stockée dans PostgreSQL
-- Reçoit un UUID et extrait directement sa représentation binaire interne de 16 octets (BYTEA) sans aucun transtypage textuel
Drop Function if Exists "UUID-Bin"(UUID);

Create or Replace Function "UUID-Bin"(p_uuUUID UUID) Returns ByteA AS $Body$
Begin
    -- Utilisation de la fonction interne native de PostgreSQL qui extrait le flux binaire de 16 octets
    -- Évite le double transtypage UUID => String, puis, String => ByteA.
    Return uuid_send(p_uuUUID);
End;
$Body$ Language plpgsql Immutable Strict;

Comment on Function "UUID-Bin"(UUID) is 'Convertit un UUID directement en segment binaire de 16 octets (Bytea) via l''exportateur interne du moteur PostgreSQL sans transit textuel.';
