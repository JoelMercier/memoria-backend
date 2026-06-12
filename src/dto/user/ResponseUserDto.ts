// ——— fichier : src/dto/user/ResponseUserDto.ts

import { UserId } from '@/domain/value-objects/ids';
import type { IUser  } from '@/interfaces/entities/user/IUser';

/**
 * 👥 Classe ResponseUserDto
 * -------------------------
 * Objet de transfert de données (DTO) purgeant l'empreinte cryptographique
 * du mot de passe avant l'exposition des profils utilisateurs sur le réseau Web.
 *
 * @class ResponseUserDto
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class ResponseUserDto {

  /** 🆔 Identifiant unique et fortement typé de l'utilisateur (UserId) */
  public readonly idUser          : UserId;

  /** 📧 Adresse e-mail de correspondance unique */
  public readonly courriel        : string;

  /** 👤 Pseudonyme public d'affichage */
  public readonly pseudo          : string;

  /** 🗂️ Jeton textuel du rôle hiérarchique de sécurité (Code SQL minuscules) */
  public readonly role            : string;

  /** 🌐 Jeton textuel du fournisseur d'authentification d'origine (Code SQL minuscules) */
  public readonly authProvider    : string;

  /** 🗄️ Dictionnaire de configuration des préférences de l'interface */
  public readonly settingsUser    : Record<string, any>;

  /** 🛡️ Statut légal du consentement aux règles de protection des données (RGPD) */
  public readonly rgpdConsent     : boolean;

  /** ⏱️ Horodatage précis du consentement aux règles RGPD */
  public readonly rgpdConsentDate : Date | null;

  /** ⏱️ Horodatage précis de la création du compte utilisateur */
  public readonly createdAt?      : Date;

  /** ⏱️ Horodatage précis de la dernière modification du compte utilisateur */
  public readonly updatedAt?      : Date;

  /**
   * Initialise de manière immuable le payload de transfert à partir du contrat IUser.
   *
   * @constructor
   * @param {IUser} user - L'interface métier immuable de référence
   */
  private constructor(user: IUser) {
    // 🪓 ALIGNEMENT INDUSTRIEL : Raccordement via les propriétés de surface de l'interface
    this.idUser          = user.idUser;
    this.courriel        = user.courriel;
    this.pseudo          = user.pseudo;
    this.role            = user.role.code;
    this.authProvider    = user.authProvider.code;
    this.settingsUser    = user.settingsUser;
    this.rgpdConsent     = user.rgpdConsent;
    this.rgpdConsentDate = user.rgpdConsentDate;
    this.createdAt       = user.createdAt;
    this.updatedAt       = user.updatedAt;
  }

  /**
   * 🗺️ Factory Individuelle : Transforme un contrat IUser en DTO d'exposition sécurisé.
   *
   * @static
   * @function fromUser
   * @param {IUser} user - L'entité vivante issue des services ou repositories
   * @returns {ResponseUserDto} Le sac de données passif expurgé du mot de passe
   */
  public static fromUser(user: IUser): ResponseUserDto {
    return new ResponseUserDto(user);
  }

  /**
   * 🗺️ Factory de Collection : Transforme un tableau de contrats en liste de DTOs sécurisés.
   *
   * @static
   * @function fromUsers
   * @param {IUser[]} users - Le tableau de profils à conversion
   * @returns {ResponseUserDto[]} La collection de DTOs formatée
   */
  public static fromUsers(users: IUser[]): ResponseUserDto[] {
    return users.map((u): ResponseUserDto => ResponseUserDto.fromUser(u));
  }
}
