// ——— fichier : src/interfaces/entities/user/IUser.ts

import type { UserId }       from '@/domain/value-objects/ids';
import type { Role }         from '@/constants/Roles';
import type { AuthProvider } from '@/constants/AuthProviders';
import type { IEntity }      from '@/interfaces/entities/IEntity';
import type { IUserData }    from '@/interfaces/entities/user/IUserData';

/**
 * 📜 Interface IUser 🧮 (Le Contrat Métier des Acteurs V4)
 * ----------------------------------------------------------------------------
 * Contrat d'accès métier pour l'entité User (Utilisateurs).
 * Entièrement convertie en propriétés de surface pures (True Getters).
 *
 * @interface IUser
 * @extends {IEntity<IUserData, UserId>}
 * @author Vision : Joël (C++ Framework Architect - True Getters Alignement)
 * @author Frapperie du code : Gaïa (Au burin, lavée de toute parenthèse)
 */
export interface IUser extends IEntity<IUserData, UserId> {

  /** 🆔 Identifiant unique et fortement typé du profil utilisateur (idUser). */
  get idUser(): UserId;

  /** 📧 Adresse électronique unique servant d'identifiant de connexion (email). */
  get courriel(): string;

  /** 🔐 Empreinte cryptographique du mot de passe haché (passwordHash). */
  get passwordHash(): string;

  /** 👤 Pseudonyme public d'affichage de l'utilisateur (pseudo). */
  get pseudo(): string;

  /** 🗂️ Instance de Smart Enum gérant les privilèges de sécurité (role). */
  get role(): Role;

  /** 🌐 Instance de Smart Enum fixant le fournisseur d'identité (authProvider). */
  get authProvider(): AuthProvider;

  /** 🗄️ Dictionnaire de configuration des préférences de l'interface (settingsUser). */
  get settingsUser(): Record<string, any>;

  /** 🛡️ Indicateur légal d'approbation des conditions d'utilisation (rgpdConsent). */
  get rgpdConsent(): boolean;

  /** ⏱️ Horodatage précis du scellage du consentement aux règles (rgpdConsentDate). */
  get rgpdConsentDate(): Date | null;

  /** 🛡️ Sécurité Nominale : Vérifie les privilèges d'accès de l'utilisateur. */
  aLeDroitAccederA(p_oRoleMinimalRequis: Role): boolean;
}
