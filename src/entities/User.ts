// ——— fichier : src/entities/User.ts

import { BaseEntity    } from '@/entities/BaseEntity';
import type { IUser    } from '@/interfaces/entities/user/IUser';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import type { UserId   } from '@/domain/value-objects/IdMetier';
import type { Role     } from '@/constants/Role';
import type { AuthProvider } from '@/constants/AuthProvider';

/**
 * 🏛️ Classe User
 * --------------
 * Modèle métier immuable représentant un utilisateur de la plateforme.
 * Protégé par l'armure de la notation hongroise et piloté par les Smart Enums.
 *
 * @class User
 * @extends {BaseEntity<'user', IUserData, UserId>}
 * @implements {IUser}
 * @author Joël, Gaïa & Co
 */
export class User extends BaseEntity<'user', IUserData, UserId> implements IUser {

  /** 🔔 Caillou de couleur : Identifiant unique immuable de l'utilisateur */
  private readonly m_idUser           : UserId;

  /** 📧 Adresse électronique unique servant d'identifiant de connexion */
  private readonly m_sEmail           : string;

  /** 🔐 Empreinte cryptographique du mot de passe haché */
  private readonly m_sPasswordHash    : string;

  /** 👤 Pseudonyme public d'affichage de l'utilisateur */
  private readonly m_sPseudo          : string;

  /** 🗂️ Instance de Smart Enum gérant les privilèges de sécurité hiérarchiques */
  private readonly m_eRole            : Role;

  /** 🌐 Instance de Smart Enum fixant le fournisseur d'identité d'origine */
  private readonly m_eAuthProvider    : AuthProvider;

  /** 🗄️ Dictionnaire de configuration des préférences de l'interface utilisateur */
  private readonly m_rSettingsUser    : Record<string, any>;

  /** 🛡️ Indicateur légal d'approbation des conditions d'utilisation */
  private readonly m_bGdprConsent     : boolean;

  /** ⏱️ Horodatage précis du scellage du consentement aux règles RGPD */
  private readonly m_dGdprConsentDate : Date | null;

  /**
   * Instancie un utilisateur immuable à partir de son contrat de données.
   *
   * @constructor
   * @param {IUserData} data - Payload brut ou typé issu de l'infrastructure ou des DTO
   */
  public constructor(data: IUserData) {
    super(data);
    this.m_idUser           = data.idUser;
    this.m_sEmail           = data.email;
    this.m_sPasswordHash    = data.passwordHash;
    this.m_sPseudo          = data.pseudo;
    this.m_eRole            = data.role;
    this.m_eAuthProvider    = data.authProvider;
    this.m_rSettingsUser    = data.settingsUser || {};
    this.m_bGdprConsent     = data.gdprConsent;
    this.m_dGdprConsentDate = data.gdprConsentDate ?? null;
  }

  /**
   * 🆔 Identifiant unique et fortement typé du profil utilisateur.
   * Réaligné fidèlement sur notre contrat d'interface sémantique unifié.
   *
   * @public
   * @function getUserId
   * @returns {UserId} Le Value Object de l'identifiant utilisateur.
   */
  public getUserId(): UserId {
    return this.m_idUser;
  }

  /**
   * 🆔 Identifiant unique du contrat IUser (Rétrocompatibilité d'infrastructure d'accès).
   * Alias transitoire redirigeant vers le type nominal scellé getUserId().
   *
   * @public
   * @returns {UserId} Le Value Object de l'identifiant utilisateur.
   */
  public get idUser(): UserId {
    return this.getUserId();
  }

  /**
   * 📧 Adresse email unique (Conforme IUser).
   *
   * @public
   * @returns {string} L'adresse email de l'utilisateur.
   */
  public get Email(): string {
    return this.m_sEmail;
  }

  /**
   * 🔑 Empreinte cryptographique du mot de passe (Conforme IUser).
   *
   * @public
   * @returns {string} Le hash sécurisé du mot de passe.
   */
  public get PasswordHash(): string {
    return this.m_sPasswordHash;
  }

  /**
   * 👤 Pseudonyme public de l'utilisateur (Conforme IUser).
   *
   * @public
   * @returns {string} Le nom d'affichage public.
   */
  public get Pseudo(): string {
    return this.m_sPseudo;
  }

  /**
   * 🗂️ Rôle de sécurité hiérarchique (Conforme IUser).
   *
   * @public
   * @returns {Role} Le Smart Enum représentant le rôle utilisateur.
   */
  public get Role(): Role {
    return this.m_eRole;
  }

  /**
   * 🌐 Fournisseur d'authentification d'origine (Conforme IUser).
   *
   * @public
   * @returns {AuthProvider} Le type de fournisseur d'identité.
   */
  public get AuthProvider(): AuthProvider {
    return this.m_eAuthProvider;
  }

  /**
   * 🗄️ Dictionnaire des préférences d'interface (Conforme IUser).
   *
   * @public
   * @returns {Record<string, any>} Bloc JSON contenant la configuration utilisateur.
   */
  public get SettingsUser(): Record<string, any> {
    return this.m_rSettingsUser;
  }

  /**
   * 🛡️ Statut du consentement aux règles RGPD (Conforme IUser).
   *
   * @public
   * @returns {boolean} True si les conditions d'utilisation sont validées.
   */
  public get GdprConsent(): boolean {
    return this.m_bGdprConsent;
  }

  /**
   * ⏱️ Horodatage du consentement RGPD (Conforme IUser).
   *
   * @public
   * @returns {Date | null} Date précise de la signature ou NULL.
   */
  public get GdprConsentDate(): Date | null {
    return this.m_dGdprConsentDate;
  }

  /**
   * 🛡️ Sécurité Nominale : Vérifie les privilèges d'accès de l'utilisateur.
   * Exploite directement la comparaison sémantique de ton Smart Enum Role.
   *
   * @public
   * @function aLeDroitAccederA
   * @param {Role} roleMinimalRequis - Le palier de sécurité minimal exigé pour l'action
   * @returns {boolean} True si l'utilisateur dispose des droits suffisants
   */
  public aLeDroitAccederA(roleMinimalRequis: Role): boolean {
    return this.m_eRole.estSuperieurOuEgalA(roleMinimalRequis);
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   *
   * @public
   * @function toData
   * @returns {IUserData} Structure de données brute d'infrastructure
   */
  public toData(): IUserData {
    return {
      idUser          : this.getUserId(),
      email           : this.Email,
      passwordHash    : this.PasswordHash,
      pseudo          : this.Pseudo,
      role            : this.Role,
      authProvider    : this.AuthProvider,
      settingsUser    : this.SettingsUser,
      gdprConsent     : this.GdprConsent,
      gdprConsentDate : this.GdprConsentDate,
      createdAt       : this.createdAt,
      updatedAt       : this.updatedAt
    };
  }

  /**
   * 🖨️ Sérialise textuellement l'entité utilisateur au format de texte JSON.
   *
   * @public
   * @override
   * @function toString
   * @returns {string} Chaîne JSON formatée
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
