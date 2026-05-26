// ——— fichier : src/dto/auth/LoginDto.ts

import { type LoginSchemaType,
         AuthValidation     } from '@/validation/zod/AuthValidation';

/**
 * 📦 Classe LoginDto
 * ------------------
 * Objet de transfert de données pour l'authentification initiale (Connexion).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class LoginDto
 * @author Joël, Gaïa & Co
 */
export class LoginDto {

  /** 📧 Adresse électronique d'identification de l'utilisateur */
  public readonly email : string;

  /** 🔐 Mot de passe brut à soumettre à l'infrastructure de hachage */
  public readonly password : string;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : LoginSchemaType = AuthValidation.validateLogin(data);

    this.email    = validated.email;
    this.password = validated.password;
  }

}
