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
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
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
    // 🪓 ALIGNEMENT D'ACIER : Protection du portier Zod via transtypage Record étanche
    const l_oRawBody : Record<string, unknown> = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const validated  : ChangePasswordSchemaType = UserValidation.validateChangePassword(l_oRawBody);

    this.currentPassword = validated.currentPassword;
    this.newPassword     = validated.newPassword;
  }
}