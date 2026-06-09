// ——— fichier : src/interfaces/security/ITokenPayload.ts

import type { Role   } from '@/constants/Role';
import type { UserId } from '@/domain/value-objects/ids';

/**
 * 📜 Interface ITokenPayload 🛡️
 * ----------------------------------------------------------------------------
 * Charge utile d'un jeton JWT généré par notre TokenManager.
 * Étend les claims standards JWT (sub, iat, exp, jti) avec nos données métier sécurisées.
 *
 * @interface ITokenPayload
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface ITokenPayload {

  /**
   * 🆔 Identifiant unique fort du sujet (JWT standard claim 'sub' lié à l'UserId).
   *
   * @type {UserId}
   */
  sub : UserId;

  /**
   * 📧 Adresse électronique de correspondance de l'utilisateur connecté.
   *
   * @type {string}
   */
  email : string;

  /**
   * 👤 Pseudonyme public d'affichage de l'utilisateur.
   *
   * @type {string}
   */
  pseudo : string;

  /**
   * 🗂️ Instance de Smart Enum représentant les privilèges de sécurité de l'acteur.
   *
   * @type {Role}
   */
  role : Role;

  /**
   * 🏷️ Nature et usage structurel du jeton sur le réseau d'infrastructure.
   *
   * @type {'access' | 'refresh'}
   */
  type : 'access' | 'refresh';

  /**
   * 📅 Horodatage d'émission du jeton (Issued At - Unix Timestamp en secondes).
   *
   * @type {number}
   */
  iat? : number;

  /**
   * 📅 Horodatage précis de péremption chronologique du jeton (Expires At).
   *
   * @type {number}
   */
  exp? : number;

  /**
   * 🔑 Identifiant universel unique du jeton dédié au mécanisme de quarantaine (Blacklisting).
   *
   * @type {string}
   */
  jti? : string;
}
