// ——— fichier : src/dto/share/UpdateShareDto.ts

import type { IAccessConfig  } from '@/interfaces/entities/share/IAccessConfig';
import { type UpdateShareSchemaType,
         ShareValidation     } from '@/validation/zod/ShareValidation';

/**
 * 📦 Classe UpdateShareDto
 * -------------------------
 * Objet de transfert de données pour la mise à jour partielle d'un partage (Share).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class UpdateShareDto
 * @author Joël, Gaïa & Co
 */
export class UpdateShareDto {

  /** 📧 Adresse électronique optionnelle du destinataire cible à modifier */
  public readonly recipientEmail? : string | null;

  /** ⚙️ Configuration d'infrastructure optionnelle des restrictions d'accès (Expiration, etc.) */
  public readonly accessConfig? : IAccessConfig;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : UpdateShareSchemaType = ShareValidation.validateUpdate(data);

    this.recipientEmail = validated.recipientEmail;
    this.accessConfig   = validated.accessConfig;
  }

}
