// ——— fichier : src/domain/value-objects/ids/SeverityId.ts

import { IdChoupy }   from '@/domain/base/idCore/IdChoupy';
import { ChoupyEnum } from '@/domain/base/idCore/ChoupyEnum';

/**
 * 🚨 Classe SeverityId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fixe nominal représentant la sévérité d'un événement d'audit (ex: 'INFO').
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule une chaîne de transport fixe de 4 octets au standard SQL Char(4).
 *
 * @class SeverityId
 * @extends {IdChoupy<'SEVERITY_ID', string>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 */
export class SeverityId extends IdChoupy<'SEVERITY_ID', string> {

  /**
   * Encapsule le quadrigramme d'une sévérité d'événement d'audit.
   * La maman IdChoupy se charge d'appliquer les majuscules et la douane DIM_4.
   *
   * @constructor
   * @param {string} p_sCodeSeverity - Le code textuel de la sévérité (ex: 'INFO', 'CRIT')
   */
  public constructor(p_sCodeSeverity: string) {
    // Unification DRY : Alignement sur le calibre fixe de 4 octets
    super(p_sCodeSeverity, ChoupyEnum.DIM_4);
  }
}
