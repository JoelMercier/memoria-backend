// ——— fichier : src/dto/user/DeleteAccountDto.ts

import { type DeleteAccountSchemaType,
         UserValidation             } from '@/validation/zod/UserValidation';

/**
 * 📦 Classe DeleteAccountDto
 * --------------------------
 * Objet de transfert de données pour la demande de suppression définitive d'un compte.
 * Exige la confirmation du mot de passe pour valider l'action critique.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class DeleteAccountDto
 * @author Joël, Gaïa & Co
 */
export class DeleteAccountDto {

  /** 🔐 Mot de passe de confirmation requis pour la destruction du compte */
  public readonly password : string;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : DeleteAccountSchemaType = UserValidation.validateDeleteAccount(data);

    this.password = validated.password;
  }

}
