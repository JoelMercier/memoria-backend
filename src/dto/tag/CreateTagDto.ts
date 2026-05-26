// ——— fichier : src/dto/tag/CreateTagDto.ts

import { type CreateTagSchemaType,
         TagValidation        } from '@/validation/zod/TagValidation';

/**
 * 📦 Classe CreateTagDto
 * ----------------------
 * Objet de transfert de données pour la création d'une étiquette (Tag).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 *
 * @class CreateTagDto
 * @author Joël, Gaïa & Co
 */
export class CreateTagDto {

  /** 📝 Libellé textuel unique de l'étiquette métier */
  public readonly tagName : string;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : CreateTagSchemaType = TagValidation.validateCreate(data);

    this.tagName = validated.tagName;
  }

}
