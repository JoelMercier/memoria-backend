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
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class UpdateUserDto {

  /** 📧 Nouvelle adresse électronique de correspondance optionnelle */
  public readonly email?        : string;

  /** 🔐 Nouveau mot de passe sécurisé optionnel à hacher */
  public readonly password?     : string;

  /** 👤 Nouveau pseudonyme d'affichage public optionnel */
  public readonly pseudo?       : string;

  /** 🗄️ Configuration optionnelle des préférences de l'interface graphique */
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
    const validated  : UpdateUserSchemaType = UserValidation.validateUpdate(l_oRawBody);

    this.email        = validated.email;
    this.password     = validated.password;
    this.pseudo       = validated.pseudo;
    this.settingsUser = validated.settingsUser;
  }
}
