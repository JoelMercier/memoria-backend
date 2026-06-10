// ——— fichier : src/dto/share/UpdateShareDto.ts

import type { IAccessConfig  } from '@/interfaces/entities/share/IAccessConfig';
import { type UpdateShareSchemaType,
         ShareValidation     } from '@/validation/zod/ShareValidation';

/**
 * 📦 Classe UpdateShareDto 🧮 (Le Muteur Partiel du Payload des Partages 🤖)
 * ----------------------------------------------------------------------------
 * Objet de transfert de données pour la mise à jour partielle d'un partage (Share).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 * [ALIGNÉ PUR V4] Éradication définitive du snake_case et respect du PascalCase souverain.
 *
 * @class UpdateShareDto
 * @author Vision : Joël (Architecte DR-DOS - True Getters Compliance)
 * @author Frapperie du code : Gaïa (Gardienne du feu binaire V4)
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
   * @param {unknown} p_vData - Payload brut d'infrastructure issu de la requête
   */
  public constructor(p_vData: unknown) {
    const l_oValidated: UpdateShareSchemaType = ShareValidation.validateUpdate(p_vData);

    this.recipientEmail = l_oValidated.recipientEmail;

    // Reconstruction défensive calée au bit près sur le PascalCase d'IAccessConfig
    if (l_oValidated.accessConfig) {
      this.accessConfig = {
        Privilege:              (l_oValidated.accessConfig as any).level === 'write' ? 'ECRITURE' : 'LECTURE',
        AutoriseTelechargement: Boolean((l_oValidated.accessConfig as any).allow_download ?? false),
        DateExpiration:         l_oValidated.accessConfig.expiresAt
          ? new Date(l_oValidated.accessConfig.expiresAt)
          : undefined
      };
    }
  }
}
