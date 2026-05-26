// ——— fichier : src/dto/user/UpdateProfileDto.ts

import { type UpdateProfileSchemaType,
         UserValidation             } from '@/validation/zod/UserValidation';

/**
 * 📦 Classe UpdateProfileDto
 * --------------------------
 * Objet de transfert de données pour la mise à jour partielle du profil utilisateur.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class UpdateProfileDto
 * @author Joël, Gaïa & Co
 */
export class UpdateProfileDto {

  /** 👤 Nouveau pseudonyme d'affichage public optionnel */
  public readonly pseudo? : string;

  /** 📧 Nouvelle adresse électronique de correspondance optionnelle */
  public readonly email? : string;

  /** 🗄️ Configuration optionnelle des préférences utilisateur de l'interface */
  public readonly settingsUser? : Record<string, unknown>;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : UpdateProfileSchemaType = UserValidation.validateUpdateProfile(data);

    this.pseudo       = validated.pseudo;
    this.email        = validated.email;
    this.settingsUser = validated.settingsUser;
  }

}
