// ——— fichier : src/dto/user/DeleteUserDto.ts

import { type DeleteUserSchemaType,
         UserValidation             } from '@/validation/zod/UserValidation';

/**
 * 📦 Classe DeleteUserDto
 * -----------------------
 * Objet de transfert de données pour l'action d'infrastructure de suppression d'un utilisateur.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class DeleteUserDto
 * @author Joël, Gaïa & Co
 */
export class DeleteUserDto {

  /** 🔐 Mot de passe requis pour valider l'effacement de l'entité */
  public readonly password : string;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : DeleteUserSchemaType = UserValidation.validateDelete(data);

    this.password = validated.password;
  }

}
