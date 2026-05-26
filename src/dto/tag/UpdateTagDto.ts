// ——— fichier : src/dto/tag/UpdateTagDto.ts

import { type UpdateTagSchemaType,
         TagValidation        } from '@/validation/zod/TagValidation';

/**
 * 📦 Classe UpdateTagDto
 * ----------------------
 * Objet de transfert de données pour la modification d'une étiquette (Tag).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class UpdateTagDto
 * @author Joël, Gaïa & Co
 */
export class UpdateTagDto {

  /** 📝 Nouveau libellé textuel unique de l'étiquette métier */
  public readonly tagName : string;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : UpdateTagSchemaType = TagValidation.validateUpdate(data);

    this.tagName = validated.tagName;
  }

}
