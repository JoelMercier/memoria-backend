-- ============================================================================
-- 👥 INFRASRUCTURE : ANONYMISATION ET SABOTAGE RGPD D'UN ACTEUR
-- Fonction: "AnonymiserActeurSysteme"
-- Version: 1.0.1 (PostgreSQL 17+)
-- Description: Anonymisation irréversible - Préservation de l intégrité physique [Mémoria]
-- ============================================================================

Set search_path To Public;

Create Or Replace Function "AnonymiserActeurSysteme"(p_usIdUser Bytea)
Returns Void As $$
Begin
    -- 1. Sécurité physique : verrouillage strict de la longueur du Buffer invité
    If octet_length(p_usIdUser) != 16 Then
        Raise Exception 'Identifiant binaire invalide : la clé doit comporter exactement 16 octets.';
    End If;

    -- 2. Sabotage chirurgical du profil de l acteur dans la table Users [Mémoria]
    Update "Users"
    Set
        "usCourriel" = 'purgue.rgpd.' || encode(p_usIdUser, 'hex') || '@memoria.com', -- Courriel fantôme unique
        "usPasswordHash" = '$2b$10$NON_RECONNECTABLE_' || encode(gen_random_bytes(16), 'hex'), -- Mot de passe cassé
        "usPseudo" = 'Utilisateur Anonymisé',
        "usGdprConsent" = False, -- Révocation contractuelle légale [Mémoria]
        "usGdprDate" = Current_Timestamp
    Where "usIdUser" = p_usIdUser;

    -- 3. Sabotage des adresses de destinataires liées dans la table Shares [Mémoria]
    -- Nettoie les liens au même millième de seconde pour valider le contrôle CNIL
    Update "Shares"
    Set "shCourrielDest" = 'anonyme@memoria.com'
    Where "shItemId" In (
        Select "itIdItem"
        From "Items"
        Where "itUserId" = p_usIdUser
    );
End;
$$ Language plpgsql Volatile Strict;

Comment On Function "AnonymiserActeurSysteme"(Bytea) Is 'Fonction d infrastructure écrasant irréversiblement les données privées d un acteur et de ses partages pour conformité RGPD.';
