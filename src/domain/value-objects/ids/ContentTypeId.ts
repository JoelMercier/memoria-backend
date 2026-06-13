// ——— fichier : src/domain/value-objects/ids/ContentTypeId.ts

import { IdChoupy   } from '@/constants/Choupy/IdChoupy';
import { ChoupyEnum } from '@/constants/Choupy/ChoupyEnum';

/**
 * 📦 Classe ContentTypeId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fixe nominal représentant le format de contenu d'une pépite (ex: 'NOTE').
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule une chaîne de transport fixe de 4 octets au standard SQL Char(4).
 *
 * @class ContentTypeId
 * @extends {IdChoupy<'CONTENT_TYPE_ID', string>}
 * @author Directeur du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 */
export class ContentTypeId extends IdChoupy<'CONTENT_TYPE_ID', string> {

  /**
   * Encapsule le quadrigramme du format de contenu d'une pépite.
   * La maman IdChoupy se charge d'appliquer les majuscules et la douane DIM_4.
   *
   * @constructor
   * @param {string} p_sCodeContentType - Le code textuel du format de pépite (ex: 'NOTE', 'ARTI')
   */
  public constructor(p_sCodeContentType: string) {
    // Unification DRY : Alignement sur le calibre fixe de 4 octets
    super(p_sCodeContentType, ChoupyEnum.DIM_4);
  }
}
