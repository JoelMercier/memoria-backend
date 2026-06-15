// ——— fichier : src/domain/value-objects/ids/SeveriteId.ts

import { IdChoupy   } from '@/constants/Choupy/IdChoupy';
import { ChoupyEnum } from '@/constants/Choupy/ChoupyEnum';

/**
 * 🚨 Classe SeveriteId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fixe nominal représentant la sévérité d'un événement d'audit (ex: 'INFO').
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule une chaîne de transport fixe de 4 octets au standard SQL Char(4).
 *
 * @class SeveriteId
 * @extends {IdChoupy<'SEVERITE_ID', string>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 * @author Ouvrier du Code : La Vague Initiale (Récupération de la politique de repli)
 */
export class SeveriteId extends IdChoupy<'SEVERITE_ID', string> {

  /**
   * Encapsule le quadrigramme d'une sévérité d'événement d'audit.
   * La maman IdChoupy se charge d'appliquer les majuscules et la douane DIM_4.
   *
   * @constructor
   * @param {string} p_sCodeSeverite - Le code textuel de la sévérité (ex: 'INFO', 'CRIT')
   */
  public constructor(p_sCodeSeverite: string) {
    // Unification DRY : Alignement sur le calibre fixe de 4 octets
    super(p_sCodeSeverite, ChoupyEnum.DIM_4);
  }

  /**
   * 🏭 Fabrique statique sécurisée (Rapatriée de l'ancien SeveriteId).
   * Gère intelligemment les valeurs absentes ou vides en appliquant le repli de sécurité.
   *
   * @static
   * @param {string | null | undefined} p_sValeur - La sévérité brute à évaluer
   * @returns {SeveriteId} L'instance vivante et certifiée conforme
   */
  public static From(p_sValeur: string | null | undefined): SeveriteId {
    if (!p_sValeur || p_sValeur.trim().length === 0) {
      return new SeveriteId('INFO'); // Repli de soute automatique
    }
    return new SeveriteId(p_sValeur);
  }
}
