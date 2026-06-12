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
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class UpdateProfileDto {

  /** 👤 Nouveau pseudonyme d'affichage public optionnel */
  public readonly pseudo?       : string;

  /** 📧 Nouvelle adresse électronique de correspondance optionnelle */
  public readonly email?        : string;

  /** 🗄️ Configuration optionnelle des préférences utilisateur de l'interface */
  public readonly settingsUser? : Record<string, unknown>;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    // 🪓 ALIGNEMENT D'ACIER : Protection du portier Zod via transtypage Record étanche
    const l_oRawBody : Record<string, unknown> = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const validated  : UpdateProfileSchemaType = UserValidation.validateUpdateProfile(l_oRawBody);

    this.pseudo       = validated.pseudo;
    this.email        = validated.email;
    this.settingsUser = validated.settingsUser;
  }
}