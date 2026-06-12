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
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
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
    // 🪓 ALIGNEMENT D'ACIER : Protection du portier Zod via transtypage Record étanche
    const l_oRawBody : Record<string, unknown> = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const validated  : DeleteAccountSchemaType = UserValidation.validateDeleteAccount(l_oRawBody);

    this.password = validated.password;
  }
}
