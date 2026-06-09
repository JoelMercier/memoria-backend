// ——— fichier : src/domain/value-objects/ids/EventSecteurId.ts

import { IdChoupy }   from '@/domain/base/idCore/IdChoupy';
import { ChoupyEnum } from '@/domain/base/idCore/ChoupyEnum';

/**
 * 🗺️ Classe SecteurId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fixe nominal représentant le Secteur fonctionnel d'un log (ex: 'AUTH').
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule une chaîne de transport fixe de 4 octets au standard SQL Char(4).
 *
 * @class SecteurId
 * @extends {IdChoupy<'SECTEUR_ID', string>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 */
export class EventSecteurId extends IdChoupy<'SECTEUR_ID', string> {

  /**
   * Moule une instance immuable d'identifiant de secteur d'audit.
   * La maman IdChoupy se charge d'appliquer les majuscules et la douane DIM_4.
   *
   * @constructor
   * @param {string} p_sValeur - Le code de secteur fixe à 4 lettres (ex: 'AUTH', 'PEPI')
   */
  public constructor(p_sValeur: string) {
    // Unification DRY : Délégation immédiate avec le calibre strict des quadrigrammes
    super(p_sValeur, ChoupyEnum.DIM_4);
  }
}
