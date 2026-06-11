-- ============================================================================
-- 👥 INFRASTRUCTURE : ANONYMISATION ET SABOTAGE RGPD D'UN ACTEUR
-- Fonction: "AnonymiserActeurSysteme"
-- Version: 1.0.2 (PostgreSQL 17+)
-- Description: Anonymisation irréversible - Préservation de l'intégrité physique [Mémoria]
-- ============================================================================

Set search_path To Public;

Create Or Replace Function "AnonymiserActeurSysteme"(p_hUserId UUID)
Returns Void As $$
Begin
    -- 1. Sécurité physique : vérification de l'existence de l'acteur avant sabotage
    if Not Exists (Select 1 From "Users" Where "usIdUser" = p_hUserId) Then
        Raise Exception 'Échec RGPD : aucun acteur ne correspond à l''identifiant fourni.';
    End if;

    -- 2. Sabotage chirurgical du profil de l'acteur dans la table Users [Mémoria]
    Update "Users"
    Set
        "usCourriel"     = 'purge.rgpd.' || encode("UUID-Bin"(p_hUserId), 'hex') || '@memoria.com', -- Courriel fantôme unique
        "usPasswordHash" = '$2b$10$NON_RECONNECTABLE_' || encode(gen_random_bytes(16), 'hex'),     -- Mot de passe cassé
        "usPseudo"       = 'Utilisateur Anonymisé',
        "usRgpdConsent"  = False, -- Révocation contractuelle légale francisée V4
        "usRgpdDate"     = Current_Timestamp
    Where "usIdUser" = p_hUserId;

    -- 3. Sabotage des adresses de destinataires liées dans la table Shares [Mémoria]
    -- Nettoie les liens au même millième de seconde pour valider le contrôle CNIL
    Update "Shares"
    Set "shCourrielDest" = 'anonyme@memoria.com'
    Where "shItemId" In (
        Select "itIdItem"
        From "Items"
        Where "itUserId" = p_hUserId
    );

    -- 4. Rupture de la traçabilité nominative dans le journal d'audit [Mémoria]
    -- Bascule les pointeurs à Null pour anonymiser les actions tout en préservant les statistiques machine
    Update "Events"
    Set "aeUserId" = Null
    Where "aeUserId" = p_hUserId;
End;
$$ Language Plpgsql Volatile Strict;

Comment On Function "AnonymiserActeurSysteme"(UUID) Is 'Fonction d''infrastructure écrasant irréversiblement les données privées d''un acteur, de ses partages et de ses traces d''audit pour conformité RGPD.';
