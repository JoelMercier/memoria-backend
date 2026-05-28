// ——— fichier : src/dto/user/ResponseUserDto.ts

import { UserId } from '@/domain/value-objects/IdMetier';
import type { IUser  } from '@/interfaces/entities/user/IUser';

/**
 * 👥 Classe ResponseUserDto
 * -------------------------
 * Objet de transfert de données (DTO) purgeant l'empreinte cryptographique
 * du mot de passe avant l'exposition des profils utilisateurs sur le réseau Web.
 *
 * @class ResponseUserDto
 * @author Joël, Gaïa & Co
 */
export class ResponseUserDto {

  /** 🆔 Identifiant unique et fortement typé de l'utilisateur (UserId) */
  public readonly id : UserId;

  /** 📧 Adresse e-mail de correspondance unique */
  public readonly email : string;

  /** 👤 Pseudonyme public d'affichage */
  public readonly pseudo : string;

  /** 🗂️ Jeton textuel du rôle hiérarchique de sécurité (Code SQL minuscules) */
  public readonly role : string;

  /** 🌐 Jeton textuel du fournisseur d'authentification d'origine (Code SQL minuscules) */
  public readonly authProvider : string;

  /** 🗄️ Dictionnaire de configuration des préférences de l'interface */
  public readonly settingsUser : Record<string, any>;

  /** 🛡️ Statut légal du consentement aux règles de protection des données (RGPD) */
  public readonly gdprConsent : boolean;

  /** ⏱️ Horodatage précis de la création du compte utilisateur */
  public readonly createdAt? : Date;

  /** ⏱️ Horodatage précis de la dernière modification du compte utilisateur */
  public readonly updatedAt? : Date;

  /**
   * Initialise de manière immuable le payload de transfert à partir du contrat IUser.
   * Exploite les getters métiers capitalisés officiels de l'interface ou les accesseurs de structure.
   *
   * @constructor
   * @param {IUser} user - L'interface métier immuable de référence
   */
  private constructor(user: IUser) {
    // 🪓 ALIGNEMENT INDUSTRIEL : Raccordement via les fonctions nominales unifiées
    this.id           = user.getUserId();
    this.email        = user.getEmail();
    this.pseudo       = user.getPseudo();
    this.role         = user.getRole().code;
    this.authProvider = user.getAuthProvider().code;
    this.settingsUser = user.getSettingsUser();
    this.gdprConsent  = user.getGdprConsent();
    this.createdAt    = user.createdAt;
    this.updatedAt    = user.updatedAt;
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
   * @param {IUser[]} users - Le tableau de profils à convertir
   * @returns {ResponseUserDto[]} La collection de DTOs formatée
   */
  public static fromUsers(users: IUser[]): ResponseUserDto[] {
    return users.map((u): ResponseUserDto => ResponseUserDto.fromUser(u));
  }
}
