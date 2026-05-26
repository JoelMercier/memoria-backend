// ——— fichier : src/constants/base/SmartEnum.ts

/**
 * 🏛️ Classe Abstraite SmartEnum
 * -----------------------------
 * Base universelle immuable pour créer des énumérations riches, typées et sécurisées.
 * Calquée sur les patterns système de haut niveau pour verrouiller le domaine.
 *
 * @abstract
 * @class SmartEnum
 * @template TCode - Le type physique ou sémantique affecté au code de l'énumération
 */
export abstract class SmartEnum<TCode extends string | number> {

  /** 🗄️ Registre statique global indexant les instances par classe fille */
  private static readonly m_rRegistre = new Map<string, Map<string | number, any>>();

  /** 💬 Libellé textuel explicite de la valeur de l'énumération */
  protected readonly m_sLibelle : string;

  /** 🆔 Code technique ou valeur arithmétique sous-jacente */
  protected readonly m_code     : TCode;

  /**
   * Initialise les fondations immuables du Smart Enum et enregistre l'instance.
   *
   * @protected
   * @constructor
   * @param {string} libelle - L'affichage textuel qualifié
   * @param {TCode} code - La valeur brute de stockage ou de comparaison
   */
  protected constructor(libelle: string, code: TCode) {
    this.m_sLibelle = libelle;
    this.m_code     = code;

    // Auto-enregistrement de l'instance dans le registre de la classe fille
    const sNomClasse = this.constructor.name;
    if (!SmartEnum.m_rRegistre.has(sNomClasse)) {
      SmartEnum.m_rRegistre.set(sNomClasse, new Map());
    }
    SmartEnum.m_rRegistre.get(sNomClasse)!.set(code, this);
  }

  /**
   * 💬 Obtient le libellé textuel de la valeur.
   */
  public get libelle(): string {
    return this.m_sLibelle;
  }

  /**
   * 🆔 Obtient le code ou la valeur technique brute.
   */
  public get code(): TCode {
    return this.m_code;
  }

  /**
   * 🛡️ Vérifie statiquement si un code donné appartient à l'énumération.
   * Appelée dynamiquement par les validateurs Zod.
   *
   * @static
   * @param {string | number} code - Le code brut à tester
   * @returns {boolean} True si le code correspond à une instance valide
   */
  public static isValidCode(code: string | number): boolean {
    const sNomClasse = this.name;
    const rSousMap   = SmartEnum.m_rRegistre.get(sNomClasse);
    return rSousMap ? rSousMap.has(code) : false;
  }

  /**
   * 🖨️ Sérialise la valeur de l'énumération au format de texte JSON.
   *
   * @returns {string} Représentation JSON brute du code
   */
  public toString(): string {
    return JSON.stringify(this.code);
  }
}
