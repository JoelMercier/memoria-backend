// ——— fichier : src/constants/AppEventSeverity.ts

import { SmartEnum } from './base/SmartEnum';

/**
 * 🏛️ Classe AppEventSeverity (Smart Enum Symétrique)
 * --------------------------------------------------
 * Gère les niveaux de gravité des journaux d'audit.
 * Version alignée strictement sur la casse physique de PostgreSQL (Minuscules).
 *
 * @class AppEventSeverity
 * @extends SmartEnum<string>
 */
export class AppEventSeverity extends SmartEnum<string> {

  /** ⚠️ Constante de gravité pour les informations informatives simples */
  public static readonly aesInfo     = new AppEventSeverity('aesInfo',     'info',     1);

  /** ⚠️ Constante de gravité pour les avertissements et anomalies mineures */
  public static readonly aesWarning  = new AppEventSeverity('aesWarning',  'warning',  2);

  /** ⚠️ Constante de gravité pour les erreurs applicatives standards */
  public static readonly aesError    = new AppEventSeverity('aesError',    'error',    3);

  /** ⚠️ Constante de gravité pour les alertes critiques et blocages système */
  public static readonly aesCritical = new AppEventSeverity('aesCritical', 'critical', 4);

  /** ⚖️ Poids numérique ou niveau d'importance arithmétique de la gravité */
  private readonly m_nPoids : number;

  /**
   * Le constructeur privé associe le libellé, le code SQL et son poids numérique.
   *
   * @private
   * @constructor
   * @param {string} libelle - Identifiant textuel de la constante
   * @param {string} codeSql - Chaîne de caractères exacte attendue par PostgreSQL
   * @param {number} poids - Valeur d'importance pour les tris et filtrages
   */
  private constructor(libelle: string, codeSql: string, poids: number) {
    super(libelle, codeSql);
    this.m_nPoids = poids;
  }

  /**
   * ⚖️ Obtient le poids numérique associé à la sévérité.
   *
   * @returns {number} Le poids arithmétique.
   */
  public get poids(): number {
    return this.m_nPoids;
  }

  /**
   * ⚠️ Retourne la liste exhaustive des sévérités validées en BDD.
   *
   * @static
   * @returns {AppEventSeverity[]} Tableau des instances de constantes autorisées
   */
  public static values(): AppEventSeverity[] {
    return [
      AppEventSeverity.aesInfo,
      AppEventSeverity.aesWarning,
      AppEventSeverity.aesError,
      AppEventSeverity.aesCritical
    ];
  }

  /**
   * ⚖️ Comparaison arithmétique : Détermine si le niveau actuel surpasse ou égale un autre.
   *
   * @param {AppEventSeverity} autreSeverity - Le palier comparatif à évaluer
   * @returns {boolean} True si la sévérité courante est hiérarchiquement supérieure ou égale
   */
  public estSuperieurOuEgalA(autreSeverity: AppEventSeverity): boolean {
    return this.poids >= autreSeverity.poids;
  }

  /**
   * 🗄️ Passerelle d'infrastructure : Convertit une chaîne brute PostgreSQL en instance typée.
   *
   * @static
   * @param {string} codeSql - Le jeton textuel extrait de la ligne SQL
   * @throws {Error} Si la sévérité lue en base est inconnue du dictionnaire
   * @returns {AppEventSeverity} L'instance de classe Smart Enum correspondante
   */
  public static fromSql(codeSql: string): AppEventSeverity {
    const bEstValide : boolean = this.isValidCode(codeSql);

    if (!bEstValide) {
      throw new Error(`Sévérité SQL invalide : ${codeSql}`);
    }

    return this.values().find(s => s.code === codeSql)!;
  }
}
