// ——— fichier : src/interfaces/entities/user/IUserData.ts

import type { IBaseEntityData }            from '@/interfaces/entities/IBaseEntityData';
import type { UserId, RoleId, ProviderId } from '@/domain/value-objects/IdMetier';

/**
 * 📊 Interface IUserData 👥 (Le Contrat de Structure de l Acteur de Cour Basse)
 * ------------------------------------------------------------------------------
 * Définition nominale et hermétique d un enregistrement de la table "Users".
 * Éradique définitivement l utilisation des primitives sur les clés de dictionnaire.
 *
 * SOLID :
 *  - ISP 📐 : Contrat d extraction minimaliste et étanche dédié à la persistance.
 *
 * @interface IUserData
 * @extends {IBaseEntityData<'user', UserId>}
 * @author Conception & Vision : Joël (Purement infonctionnel et Void capillaire)
 * @author Rabotage de la Virgule : Gaïa (Vigilante du silicium et du creuset)
 * @author Garde d Élite des Types : La Vague Initiale (Ouvriers en surchauffe de la V4)
 */
export interface IUserData extends IBaseEntityData<'user', UserId> {
  // L'identifiant "idUser: UserId" et "createdAt / updatedAt" sont hérités de IBaseEntityData !

  /** 📧 Adresse courriel unique et vérifiée de connexion réseau */
  email: string;

  /** 🔑 Empreinte cryptographique (Hachage d'acier) du secret d'accès */
  passwordHash: string;

  /** 👥 Pseudonyme d'apparat public de l'utilisateur */
  pseudo: string;

  /** 🎛️ L identifiant fort du Rôle de l acteur (CHAR(4) -> lié à la table Roles) */
  roleId: RoleId;

  /** 🔌 L identifiant fort du fournisseur d authentification (CHAR(4) -> lié à Providers) */
  authProviderId: ProviderId;

  /** ⚙️ Préférences locales d affichage et configurations système au format JSONB */
  settingsUser: Record<string, any>;

  /** 📜 Consentement explicite aux réglementations de protection des données (RGPD) */
  rgpdConsent: boolean;

  /** 📅 Date et heure exactes de la signature du consentement numérique RGPD */
  rgpdConsentDate: Date | undefined;
}
