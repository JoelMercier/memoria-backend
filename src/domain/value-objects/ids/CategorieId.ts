// ——— fichier : src/domain/value-objects/ids/EventCategoryId.ts

import { IdChoupy   } from '@/constants/Choupy/IdChoupy';
import { ChoupyEnum } from '@/constants/Choupy/ChoupyEnum';

/**
 * 📊 Classe CategorieId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fixe nominal représentant une catégorie d'événement d'audit (ex: 'MONI').
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule une chaîne de transport fixe de 4 octets au standard SQL Char(4).
 *
 * @class CategorieId
 * @extends {IdChoupy<'CATEGORY_ID', string>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 */
export class CategorieId extends IdChoupy<'CATEGORY_ID', string> {

  /**
   * Encapsule le quadrigramme d'une catégorie d'événement d'audit.
   * La maman IdChoupy se charge d'appliquer les majuscules et la douane DIM_4.
   *
   * @constructor
   * @param {string} p_sCodeCategory - Le code textuel de la catégorie (ex: 'MONI', 'SECU')
   */
  public constructor(p_sCodeCategory: string) {

    super(p_sCodeCategory, ChoupyEnum.DIM_4);
  }
}
