// ——— fichier : src/domain/value-objects/ids/ProviderId.ts

import { IdChoupy   } from '@/constants/Choupy/IdChoupy';
import { ChoupyEnum } from '@/constants/Choupy/ChoupyEnum';

/**
 * 🌐 Classe ProviderId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fixe nominal représentant le fournisseur d'authentification de l'acteur (ex: 'LOCA').
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule une chaîne de transport fixe de 4 octets au standard SQL Char(4).
 *
 * @class ProviderId
 * @extends {IdChoupy<'PROVIDER_ID', string>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 */
export class ProviderId extends IdChoupy<'PROVIDER_ID', string> {

  /**
   * Encapsule le quadrigramme du fournisseur sous l'armure nominale du domaine.
   * La maman IdChoupy se charge d'appliquer les majuscules et la douane DIM_4.
   *
   * @constructor
   * @param {string} p_sCodeProvider - Le code textuel du fournisseur d'accès (ex: 'LOCA', 'GOOG')
   */
  public constructor(p_sCodeProvider: string) {
    // Unification DRY : Alignement sur le calibre fixe de 4 octets
    super(p_sCodeProvider, ChoupyEnum.DIM_4);
  }
}
