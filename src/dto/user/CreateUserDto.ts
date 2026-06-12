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
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class CreateUserDto {

  /** 📧 Adresse électronique d'identification de l'utilisateur */
  public readonly email       : string;

  /** 🔐 Mot de passe brut à hacher par l'infrastructure */
  public readonly password    : string;

  /** 👤 Pseudonyme public ou nom d'affichage convivial */
  public readonly pseudo      : string;

  /** ⚖️ Consentement explicite aux conditions RGPD et politiques de confidentialité */
  public readonly rgpdConsent : boolean;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    // 🪓 ALIGNEMENT D'ACIER : Protection du portier Zod via transtypage Record étanche
    const l_oRawBody : Record<string, unknown> = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const validated  : CreateUserSchemaType = UserValidation.validateCreate(l_oRawBody);

    this.email       = validated.email;
    this.password    = validated.password;
    this.pseudo      = validated.pseudo;
    this.rgpdConsent = validated.gdprConsent; // 🪓 ALIGNEMENT NOMINAL : Raccordement étanche GDPR -> RGPD
  }
}
