// ——— fichier : src/constants/AppEventSeverity.ts

import { SmartEnum } from './base/SmartEnum';

/**
 * 🚨 Classe AppEventSeverity 🧮 (L Armure des Gravités Système 🤖)
 * ----------------------------------------------------------------------------
 * Gère de manière immuable les niveaux de gravité des journaux d audit "Events".
 * Intègre notre double niveau d infrastructure : niveau (machine) et ordreAff (humain).
 *
 * @class AppEventSeverity
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (Compilateur de l'Ancien Temps)
 * @author Frapperie du code : Gaïa (Graveuse de lignes d'acier)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans de la Vague Alpha)
 */
export class AppEventSeverity extends SmartEnum<string> {
  /** 🤖 Le poids numérique unique pour les calculs de comparaison logique (ex: 10, 20, 30, 40) [Mémoria] */
  private readonly m_nNiveau: number;

  /**
   * Moule une instance immuable de sévérité dans la RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - Libellé complet et intelligible destiné à l interface
   * @param {string} p_sCode - Le quadrigramme d infrastructure obligatoire (4 majuscules) [Mémoria]
   * @param {number} p_nNiveau - Poids numérique d importance pour la logique machine [Mémoria]
   * @param {number} p_nOrdreAff - Position numérique unique pour le tri visuel [Mémoria]
   */
  private constructor(p_sLibelle: string, p_sCode: string, p_nNiveau: number, p_nOrdreAff: number) {
    super(p_sLibelle, p_sCode, p_nOrdreAff);
    this.m_nNiveau = Math.floor(p_nNiveau);
  }

  /**
   * ⚖️ Obtient le poids numérique associé à la sévérité pour les filtres machines.
   */
  public get niveau(): number {
    return this.m_nNiveau;
  }

  /**
   * ⚖️ Comparaison mathématique : Détermine si le niveau actuel surpasse ou égale un autre [Mémoria].
   * Foudroie l utilisation des chaînes de caractères brutes dans le Domaine.
   *
   * @param {AppEventSeverity} p_oAutreSeverity - Le palier comparatif à évaluer
   * @returns {boolean} True si la sévérité courante est hiérarchiquement supérieure ou égale
   */
  public estSuperieurOuEgalA(p_oAutreSeverity: AppEventSeverity): boolean {
    return this.m_nNiveau >= p_oAutreSeverity.niveau;
  }

  // ----------------------------------------------------------------------------
  // 🏺 ENSEMENCEMENT DE LA RAM (Les quatre piliers de la sécurité - Format 4 lettres)
  // ----------------------------------------------------------------------------

  /** 🪙 INFO - Niveau Information : Traces d'exploitation standards */
  public static readonly INFO = new AppEventSeverity('Information', 'INFO', 10, 10);

  /** 💾 WARN - Niveau Avertissement : Comportements suspects ou requêtes lentes */
  public static readonly WARN = new AppEventSeverity('Avertissement', 'WARN', 20, 20);

  /** 💽 ERRO - Niveau Erreur : Dysfonctionnements applicatifs bloquants */
  public static readonly ERRO = new AppEventSeverity('Erreur', 'ERRO', 30, 30);

  /** ⛓️ CRIT - Niveau Critique : Alertes maximales exigeant une intervention immédiate */
  public static readonly CRIT = new AppEventSeverity('Critique', 'CRIT', 40, 40);
}
