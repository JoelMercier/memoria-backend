// ——— fichier : src/dto/user/ChangePasswordDto.ts

import { type ChangePasswordSchemaType,
         UserValidation             } from '@/validation/zod/UserValidation';

/**
 * 📦 Classe ChangePasswordDto
 * ----------------------------
 * Objet de transfert de données pour le renouvellement du mot de passe de l'utilisateur.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class ChangePasswordDto
 * @author Joël, Gaïa & Co
 */
export class ChangePasswordDto {

  /** 🔐 Ancien mot de passe de l'utilisateur à vérifier par l'infrastructure */
  public readonly currentPassword : string;

  /** 🔐 Nouveau mot de passe sécurisé à appliquer après validation */
  public readonly newPassword     : string;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : ChangePasswordSchemaType = UserValidation.validateChangePassword(data);

    this.currentPassword = validated.currentPassword;
    this.newPassword     = validated.newPassword;
  }

}
