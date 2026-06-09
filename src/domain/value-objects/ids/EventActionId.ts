// ——— fichier : src/domain/value-objects/ids/EventActionId.ts

import { IdChoupy }   from '@/domain/base/idCore/IdChoupy';
import { ChoupyEnum } from '@/domain/base/idCore/ChoupyEnum';

/**
 * 👥 Classe EventActionId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fixe nominal représentant l'action d'un événement d'audit (ex: 'CONN').
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule une chaîne de transport fixe de 4 octets au standard SQL Char(4).
 *
 * @class EventActionId
 * @extends {IdChoupy<'EVENT_ACTION_ID', string>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 */
export class EventActionId extends IdChoupy<'EVENT_ACTION_ID', string> {

  /**
   * Encapsule le quadrigramme fixe de l'action d'un événement d'audit.
   * La maman IdChoupy se charge d'appliquer les majuscules et la douane DIM_4.
   *
   * @constructor
   * @param {string} p_sCodeAction - Le code textuel (Char(4)) de l'action d'événement (ex: 'CONN', 'CREA')
   */
  public constructor(p_sCodeAction: string) {
    // Unification DRY : Alignement sur le calibre fixe de 4 octets
    super(p_sCodeAction, ChoupyEnum.DIM_4);
  }
}
