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
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
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
    // 🪓 ALIGNEMENT D'ACIER : Protection du portier Zod via transtypage Record étanche
    const l_oRawBody : Record<string, unknown> = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const validated  : DeleteUserSchemaType = UserValidation.validateDelete(l_oRawBody);

    this.password = validated.password;
  }
}
