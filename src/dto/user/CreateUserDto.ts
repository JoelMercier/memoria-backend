// ——— fichier : src/dto/user/CreateUserDto.ts

import { type CreateUserSchemaType,
         UserValidation             } from '@/validation/zod/UserValidation';

/**
 * 📦 Classe CreateUserDto
 * -----------------------
 * Objet de transfert de données pour l'inscription d'un nouvel utilisateur.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class CreateUserDto
 * @author Joël, Gaïa & Co
 */
export class CreateUserDto {

  /** 📧 Adresse électronique d'identification de l'utilisateur */
  public readonly email : string;

  /** 🔐 Mot de passe brut à hacher par l'infrastructure */
  public readonly password : string;

  /** 👤 Pseudonyme public ou nom d'affichage convivial */
  public readonly pseudo : string;

  /** ⚖️ Consentement explicite aux conditions RGPD et politiques de confidentialité */
  public readonly rgpdConsent : boolean;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : CreateUserSchemaType = UserValidation.validateCreate(data);

    this.email       = validated.email;
    this.password    = validated.password;
    this.pseudo      = validated.pseudo;
    this.rgpdConsent = validated.gdprConsent;
  }

}
