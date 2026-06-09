// ——— fichier : src/entities/User.ts

import      { BaseEntity         } from '@/entities/BaseEntity';
import      { Role               } from '@/constants/Role';
import      { AuthProvider       } from '@/constants/AuthProvider';
import      { RoleId, ProviderId } from '@/domain/value-objects/ids';
import type { IUser              } from '@/interfaces/entities/user/IUser';
import type { IUserData          } from '@/interfaces/entities/user/IUserData';
import type { UserId             } from '@/domain/value-objects/ids';

/**
 * 🏛️ Classe User 👥 (Le Modèle Métier Immuable de l'Acteur)
 * ----------------------------------------------------------------------------
 * Représente un utilisateur authentifié au sein du Domaine de Mémoria.
 * Protégé nominalement par la notation hongroise et piloté par les Smart Enums.
 *
 * SOLID :
 *  - SRP 📐 : Unique responsabilité de piloter le cycle de vie et les droits de l'acteur.
 *
 * @class User
 * @extends {BaseEntity<'user', IUserData, UserId>}
 * @implements {IUser}
 * @author Conception & Vision : Joël (Purement infonctionnel et Void capillaire)
 * @author Rabotage du Code : Gaïa (Vigilante du silicium et du creuset)
 * @author Garde d Élite des Types : La Vague Initiale (Artisans du code de la V4)
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

    // 🪓 TRADUCTION CHIRURGICALE : Conversion des nouveaux IDs d'infrastructure en SmartEnums vivants
    // (Passe la chaîne de caractères brute via .valeur ou .code selon l'implémentation du SmartEnum)
    this.m_eRole            = Role.fromSql ? Role.fromSql(data.roleId.valeur) : (data as any).role;
    this.m_eAuthProvider    = AuthProvider.fromSql(data.authProviderId.valeur);

    this.m_rSettingsUser    = data.settingsUser || {};
    this.m_bGdprConsent     = data.rgpdConsent;
    this.m_dGdprConsentDate = data.rgpdConsentDate ?? null;
  }

  /**
   * 🆔 Identifiant unique et fortement typé du profil utilisateur.
   *
   * @public
   * @function getUserId
   * @returns {UserId} Le Value Object de l'identifiant utilisateur.
   */
  public getUserId(): UserId {
    return this.m_idUser;
  }

  /**
   * 📧 Adresse email unique.
   *
   * @public
   * @returns {string} L'adresse email de l'utilisateur.
   */
  public getEmail(): string {
    return this.m_sEmail;
  }

  /**
   * 🔑 Empreinte cryptographique du mot de passe.
   *
   * @public
   * @returns {string} Le hash sécurisé du mot de passe.
   */
  public getPasswordHash(): string {
    return this.m_sPasswordHash;
  }

  /**
   * 👤 Pseudonyme public de l'utilisateur.
   *
   * @public
   * @returns {string} Le nom d'affichage public.
   */
  public getPseudo(): string {
    return this.m_sPseudo;
  }

  /**
   * 🗂️ Rôle de sécurité hiérarchique.
   *
   * @public
   * @returns {Role} Le Smart Enum représentant le rôle utilisateur.
   */
  public getRole(): Role {
    return this.m_eRole;
  }

  /**
   * 🌐 Fournisseur d'authentification d'origine.
   *
   * @public
   * @returns {AuthProvider} Le type de fournisseur d'identité.
   */
  public getAuthProvider(): AuthProvider {
    return this.m_eAuthProvider;
  }

  /**
   * 🗄️ Dictionnaire des préférences d'interface.
   *
   * @public
   * @returns {Record<string, any>} Bloc JSON contenant la configuration utilisateur.
   */
  public getSettingsUser(): Record<string, any> {
    return this.m_rSettingsUser;
  }

  /**
   * 🛡️ Statut du consentement aux règles RGPD.
   *
   * @public
   * @returns {boolean} True si les conditions d'utilisation sont validées.
   */
  public getGdprConsent(): boolean {
    return this.m_bGdprConsent;
  }

  /**
   * ⏱️ Horodatage du consentement RGPD.
   *
   * @public
   * @returns {Date | null} Date précise de la signature ou NULL.
   */
  public getGdprConsentDate(): Date | null {
    return this.m_dGdprConsentDate;
  }

  /**
   * 🛡️ Sécurité Nominale : Vérifie les privilèges d'accès de l'utilisateur.
   */
  public aLeDroitAccederA(roleMinimalRequis: Role): boolean {
    return this.m_eRole.estSuperieurOuEgalA(roleMinimalRequis);
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   */
  public toData(): IUserData {
    return {
      idUser          : this.getUserId(),
      email           : this.getEmail(),
      passwordHash    : this.getPasswordHash(),
      pseudo          : this.getPseudo(),
      roleId          : new RoleId(this.getRole().code.toString()),
      authProviderId  : new ProviderId(this.getAuthProvider().code.toString()),
      settingsUser    : this.getSettingsUser(),
      rgpdConsent     : this.getGdprConsent(),
      rgpdConsentDate : this.getGdprConsentDate() ?? new Date(),
      createdAt       : this.createdAt,
      updatedAt       : this.updatedAt
    };
  }

  /**
   * 🖨️ Sérialise textuellement l'entité utilisateur au format de texte JSON.
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
