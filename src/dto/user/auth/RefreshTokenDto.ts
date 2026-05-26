// ——— fichier : src/dto/auth/RefreshTokenDto.ts

import { type RefreshTokenSchemaType,
         AuthValidation             } from '@/validation/zod/AuthValidation';

/**
 * 📦 Classe RefreshTokenDto
 * -------------------------
 * Objet de transfert de données pour le renouvellement sécurisé des sessions applicatives.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class RefreshTokenDto
 * @author Joël, Gaïa & Co
 */
export class RefreshTokenDto {

  /** 🔑 Jeton d'infrastructure de rafraîchissement (Refresh Token) */
  public readonly refreshToken : string;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : RefreshTokenSchemaType = AuthValidation.validateRefreshToken(data);

    this.refreshToken = validated.refreshToken;
  }

}
