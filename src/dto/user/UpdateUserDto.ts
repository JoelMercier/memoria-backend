// ——— fichier : src/dto/user/UpdateUserDto.ts

import { type UpdateUserSchemaType,
         UserValidation             } from '@/validation/zod/UserValidation';

/**
 * 📦 Classe UpdateUserDto
 * -----------------------
 * Objet de transfert de données pour la modification des informations d'un compte utilisateur.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class UpdateUserDto
 * @author Joël, Gaïa & Co
 */
export class UpdateUserDto {

  /** 📧 Nouvelle adresse électronique de correspondance optionnelle */
  public readonly email? : string;

  /** 🔐 Nouveau mot de passe sécurisé optionnel à hacher */
  public readonly password? : string;

  /** 👤 Nouveau pseudonyme d'affichage public optionnel */
  public readonly pseudo? : string;

  /** 🗄️ Configuration optionnelle des préférences de l'interface graphique */
  public readonly settingsUser? : Record<string, unknown>;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : UpdateUserSchemaType = UserValidation.validateUpdate(data);

    this.email        = validated.email;
    this.password     = validated.password;
    this.pseudo       = validated.pseudo;
    this.settingsUser = validated.settingsUser;
  }

}
