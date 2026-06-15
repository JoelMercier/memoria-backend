-- ============================================================================
-- 👥 INFRASTRUCTURE : DECONTAMINATION ET ANONYMISATION SOUVERAINE RGPD
-- Fichier: database/functions/AnonymiserActeurSysteme.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Jojo-Style Compliant Strict)
-- Description: Anonymisation irréversible avec maintien de l'intégrité référentielle
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Create Or Replace Function public."AnonymiserActeurSysteme"(p_hUserId UUID)
Returns Void As $$
Begin
    -- 1. Sécurité physique : vérification de l'existence de l'acteur avant sabotage
    if Not Exists (Select 1 From public."Users" Where "usIdUser" = p_hUserId) Then
        Raise Exception '🚨 [Échec RGPD] Aucun acteur ne correspond à l''identifiant fourni dans la Forteresse.';
    End if;

    -- 2. Sabotage chirurgical du profil dans la table Users (Doctrine de l'Acteur Fantôme)
    Update public."Users"
    Set
        "usCourriel"     = 'anonyme.' || p_hUserId::varchar || '@memoria.internal', -- Concaténation directe de l''UUID natif.
        "usPasswordHash" = '$argon2id$v=19$m=65536,t=3,p=4$SABOTAGE_RGPD_IRREVERSIBLE', -- Empreinte Argon2id brisée anti-reconnexion.
        "usPseudo"       = 'Acteur Effacé',                                         -- Libellé générique d''anonymisation.
        "usRgpdConsent"  = False,                                                   -- Révocation contractuelle légale immédiate.
        "usRgpdDate"     = Current_Timestamp                                        -- Horodatage UTC du scellage de la purge.
    Where "usIdUser" = p_hUserId;

    -- 3. Sabotage des adresses de destinataires liées dans la table Shares
    Update public."Shares"
    Set "shCourrielDest" = 'anonyme@memoria.internal'
    Where "shItemId" In (
        Select "itIdItem"
        From public."Items"
        Where "itUserId" = p_hUserId
    );

    -- 🪓 APPLIQUE LA LOI MARTIALE V4 : ZÉRO NULL VOLANT DANS JOURNAL D'AUDIT !
    -- L''intégrité référentielle de la table "Events" est préservée à 100%.
    -- Le aeUserId pointe toujours vers l''UUID fantôme décontaminé de la table Users.
    -- Les statistiques et l''historique de la Forteresse restent intacts.

End;
$$ Language plpgsql Volatile Strict;

Comment On Function public."AnonymiserActeurSysteme"(UUID) Is 'Fonction d''infrastructure écrasant irréversiblement les données privées d''un acteur et de ses partages, tout en maintenant l''intégrité référentielle des journaux d''audit.';
