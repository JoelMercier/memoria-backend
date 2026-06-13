// ——— fichier : src/dto/auth/LoginDto.ts

import { type LoginSchemaType,
         AuthValidation     } from '@/validation/zod/AuthValidation';

/**
 * 📦 Classe LoginDto
 * ------------------
 * Objet de transfert de données pour l'authentification initiale (Connexion).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class LoginDto
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class LoginDto {

  /** 📧 Adresse électronique d'identification de l'utilisateur */
  public readonly courriel    : string;

  /** 🔐 Mot de passe brut à soumettre à l'infrastructure de hachage */
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
    const validated  : LoginSchemaType = AuthValidation.validateLogin(l_oRawBody);

    this.courriel = validated.courriel;
    this.password = validated.password;
  }
}