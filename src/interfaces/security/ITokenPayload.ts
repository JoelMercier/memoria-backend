// ——— fichier : src/interfaces/security/ITokenPayload.ts

import type { Role   } from '@/constants/Role';
import type { UserId } from '@/domain/value-objects/IdMetier';

/**
 * 📜 Interface ITokenPayload
 * --------------------------
 * Charge utile d'un jeton JWT généré par notre TokenManager.
 * Étend les claims standards JWT (sub, iat, exp, jti) avec nos données métier sécurisées.
 *
 * @interface ITokenPayload
 * @author Joël, Gaïa & Co
 */
export interface ITokenPayload {
  /** 🆔 Identifiant unique fort du sujet (JWT standard claim 'sub' lié à l'UserId) */
  sub : UserId;

  /** 📧 Adresse électronique de correspondance de l'utilisateur connecté */
  email : string;

  /** 👤 Pseudonyme public d'affichage de l'utilisateur */
  pseudo : string;

  /** 🗂️ Instance de Smart Enum représentant les privilèges de sécurité de l'acteur */
  role : Role;

  /** 🏷️ Nature et usage structurel du jeton sur le réseau d'infrastructure */
  type : 'access' | 'refresh';

  /** 📅 Horodatage d'émission du jeton (Issued At - Unix Timestamp en secondes) */
  iat? : number;

  /** 📅 Horodatage précis de péremption chronologique du jeton (Expires At) */
  exp? : number;

  /** 🔑 Identifiant universel unique du jeton dédié au mécanisme de quarantaine (Blacklisting) */
  jti? : string;
}
