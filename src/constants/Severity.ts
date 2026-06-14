// ——— fichier : src/constants/Severite.ts

import { SmartEnum } from '@/constants/Choupy/SmartEnum';

/**
 * 🚨 Classe Severite 🧮 (L'Armure des Gravités Système 🤖)
 * ----------------------------------------------------------------------------
 * Gère de manière immuable les niveaux de gravité des journaux d'audit "Events".
 * Intègre notre double niveau d'infrastructure : niveau (machine) et ordreAff (humain).
 *
 * @class Severite
 * @extends {SmartEnum<string>}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans de la Vague Alpha)
 */
export class Severite extends SmartEnum<string> {
  /** 🤖 Le poids numérique unique pour les calculs de comparaison logique (ex: 10, 20, 30, 40) [Mémoria] */
  private readonly m_nNiveau: number;

  /**
   * Moule une instance immuable de sévérité dans la RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - Libellé complet et intelligible destiné à l'interface
   * @param {string} p_sCode - Le quadrigramme d'infrastructure obligatoire (4 majuscules) [Mémoria]
   * @param {number} p_nNiveau - Poids numérique d'importance pour la logique machine [Mémoria]
   * @param {number} p_nOrdreAff - Position numérique unique pour le tri visuel [Mémoria]
   * @param {boolean} p_bDefaut - Drapeau de repli nominal V4 Pro pour la base locale
   */
  private constructor(p_sLibelle: string, p_sCode: string, p_nNiveau: number, p_nOrdreAff: number, p_bDefaut: boolean = false) {
    super(p_sLibelle, p_sCode, p_nOrdreAff, p_bDefaut);
    this.m_nNiveau = Math.floor(p_nNiveau);
  }

  /**
   * ⚖️ Obtient le poids numérique associé à la sévérité pour les filtres machines.
   *
   * @public
   * @returns {number} Le niveau numérique de sévérité brute
   */
  public get niveau(): number {
    return this.m_nNiveau;
  }

  /**
   * ⚖️ Comparaison mathématique : Détermine si le niveau actuel surpasse ou égale un autre [Mémoria].
   * Foudroie l'utilisation des chaînes de caractères brutes dans le Domaine.
   *
   * @public
   * @param {Severite} p_oAutreSeverity - Le palier comparatif à évaluer
   * @returns {boolean} Vrai si la sévérité courante est hiérarchiquement supérieure ou égale
   */
  public estSuperieurOuEgalA(p_oAutreSeverity: Severite): boolean {
    return this.m_nNiveau >= p_oAutreSeverity.niveau;
  }

  /**
   * 🗄️ Convertisseur d'infrastructure historique branché sur le décodeur central [Mémoria].
   *
   * @public
   * @static
   * @param {string} p_sCodeSql - Le code binaire ou textuel brut extrait du disque
   * @returns {Severite} L'instance typée de sévérité correspondante extraite de la RAM
   */
  public static fromSql(p_sCodeSql: string): Severite {
    return this.DeCode<Severite>(p_sCodeSql);
  }

  // ----------------------------------------------------------------------------
  // 🏺 ENSEMENCEMENT DE LA RAM (Les cinq piliers de la sécurité - Format 4 lettres)
  // ----------------------------------------------------------------------------

  /** 🪙 INFO - Niveau Information : Traces d'exploitation standards (Le Choupy de repli !) */
  public static readonly INFO = new Severite('Information', 'INFO', 10, 10, true); // 🔒 Bit True nominal !

  /** 💾 WARN - Niveau Avertissement : Comportements suspects ou requêtes lentes */
  public static readonly WARN = new Severite('Avertissement', 'WARN', 20, 20);

  /** 💽 ERRO - Niveau Erreur : Dysfonctionnements applicatifs bloquants */
  public static readonly ERRO = new Severite('Erreur', 'ERRO', 30, 30);

  /** ⛓️ CRIT - Niveau Critique : Alertes maximales exigeant une intervention immédiate */
  public static readonly CRIT = new Severite('Critique', 'CRIT', 40, 40);

  /** 🧨 FATA - Niveau Fatal : Explosion critique du réacteur de soute [Mémoria] */
  public static readonly FATA = new Severite('Fatal', 'FATA', 50, 50);
}

export default Severite;
