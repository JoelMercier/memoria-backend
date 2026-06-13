// ——— fichier : src/domain/value-objects/ids/RoleId.ts

import { IdChoupy   } from '@/constants/Choupy/IdChoupy';
import { ChoupyEnum } from '@/constants/Choupy/ChoupyEnum';

/**
 * 🗂️ Classe RoleId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fixe nominal représentant le profil de privilèges d'un acteur (ex: 'CUST').
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule une chaîne de transport fixe de 4 octets au standard SQL Char(4).
 *
 * @class RoleId
 * @extends {IdChoupy<'ROLE_ID', string>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 */
export class RoleId extends IdChoupy<'ROLE_ID', string> {

  /**
   * Moule une instance immuable d'identifiant de privilèges de sécurité.
   * La maman IdChoupy se charge d'appliquer les majuscules et le trim réglementaires.
   *
   * @constructor
   * @param {string} p_sValeur - Le code de privilège fixe à 4 lettres (ex: 'CUST', 'ADMN')
   */
  public constructor(p_sValeur: string) {
    // Unification DRY : Délégation immédiate avec le calibre strict des quadrigrammes
    super(p_sValeur, ChoupyEnum.DIM_4);
  }
}
