// ——— fichier : src/interfaces/entities/user/IUser.ts

import type { AuthProvider } from '@/constants/AuthProvider';
import type { Role         } from '@/constants/Role';
import type { UserId       } from '@/domain/value-objects/IdMetier';
import type { IEntity      } from '@/interfaces/entities/IEntity';
import type { IUserData    } from '@/interfaces/entities/user/IUserData';

/**
 * 📜 Interface IUser
 * -----------------
 * Contrat d'accès métier et barrière de sécurité pour l'entité Utilisateur.
 * Entièrement synchronisée sur nos Smart Enums, nos Value Objects et notre grille géométrique.
 *
 * @interface IUser
 * @extends {IEntity<IUserData, UserId>}
 * @author Joël, Gaïa & Co
 */
export interface IUser extends IEntity<IUserData, UserId> {

  /**
   * 🆔 Identifiant unique et fortement typé de l'utilisateur (idUser).
   *
   * @returns {UserId} Le Value Object de l'identifiant.
   */
  get idUser(): UserId;

  /**
   * 📧 Adresse email unique servant d'identifiant de connexion principale.
   *
   * @returns {string} L'adresse email normalisée.
   */
  get Email(): string;

  /**
   * 🔑 Empreinte cryptographique (Hachage) du mot de passe utilisateur.
   *
   * @returns {string} Le hash sécurisé du mot de passe.
   */
  get PasswordHash(): string;

  /**
   * 👤 Pseudonyme ou nom d'affichage public sur la plateforme.
   *
   * @returns {string} Le nom d'affichage public.
   */
  get Pseudo(): string;

  /**
   * 🗂️ Rôle de privilège hiérarchique (Smart Enum).
   *
   * @returns {Role} Le Smart Enum représentant le rôle.
   */
  get Role(): Role;

  /**
   * 🌐 Fournisseur d'authentification d'origine (Smart Enum).
   *
   * @returns {AuthProvider} Le type de fournisseur d'identité.
   */
  get AuthProvider(): AuthProvider;

  /**
   * 🗄️ Configurations et preferences de l'interface au format JSON.
   *
   * @returns {Record<string, unknown>} Bloc JSON contenant la configuration utilisateur.
   */
  get SettingsUser(): Record<string, unknown>;

  /**
   * 🛡️ Statut légal du consentement aux règles de protection des données (RGPD).
   *
   * @returns {boolean} True si le consentement est accordé.
   */
  get GdprConsent(): boolean;

  /**
   * ⏱️ Horodatage précis de la signature du consentement RGPD (Peut être NULL ou indéfini).
   *
   * @returns {Date | null | undefined} Date de signature ou NULL.
   */
  get GdprConsentDate(): Date | null | undefined;

}
