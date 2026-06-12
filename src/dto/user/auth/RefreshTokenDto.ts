// ——— fichier : src\dto\user\auth\RefreshTokenDto.ts


import { type RefreshTokenSchemaType,
         AuthValidation             } from '@/validation/zod/AuthValidation';

/**
 * 📦 Classe RefreshTokenDto
 * -------------------------
 * Objet de transfert de données pour le renouvellement sécurisé des sessions applicatives.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class RefreshTokenDto
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
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
    // 🪓 ALIGNEMENT D'ACIER : Protection du portier Zod via transtypage Record étanche
    const l_oRawBody : Record<string, unknown> = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const validated  : RefreshTokenSchemaType = AuthValidation.validateRefreshToken(l_oRawBody);

    this.refreshToken = validated.refreshToken;
  }
}