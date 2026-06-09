// ——— fichier : src\constants\base\SmartEnum.ts

/**
 * 🤖 Classe Abstraite SmartEnum 🧮 (Le Calibreur de Trigrammes Système 🔌)
 * ----------------------------------------------------------------------------
 * Base universelle immuable pour créer des énumérations riches, typées et sécurisées.
 * Centralise les registres de RAM et intègre la colonne de tri ordreAff.
 *
 * @abstract
 * @class SmartEnum
 * @template TCode - Le type physique ou sémantique affecté au code de l énumération
 * @author Conception : Joël (Virtual worker)
 * @author Moulage binaire : Gaïa (Métallurgiste des octets)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export abstract class SmartEnum<TCode extends string | number> {
  /** 🗄️ Registre statique global indexant les instances par classe fille en RAM 🧠 */
  private static readonly m_rRegistre = new Map<string, Map<string | number, any>>();

  /** 💬 Libellé textuel destiné aux DTOs de surface et aux affichages graphiques */
  private readonly m_sLibelle: string;

  /** 🆔 Code technique ou quadrigramme fixe de stockage en base (ex: 'CUST', 'CRIT') */
  private readonly m_code: TCode;

  /** 🛂 Position numérique unique pour le tri logique des interfaces graphiques [Mémoria] */
  private readonly m_nOrdreAff: number;

  /**
   * Initialise les fondations immuables du Smart Enum et enregistre l'instance ⛓️.
   */
  protected constructor(p_sLibelle: string, p_code: TCode, p_nOrdreAff: number) {
    this.m_sLibelle = p_sLibelle;
    this.m_code = typeof p_code === 'string' ? (p_code.toUpperCase() as TCode) : p_code;
    this.m_nOrdreAff = Math.floor(p_nOrdreAff);

    const l_sNomClasse = this.constructor.name;
    if (!SmartEnum.m_rRegistre.has(l_sNomClasse)) {
      SmartEnum.m_rRegistre.set(l_sNomClasse, new Map());
    }
    SmartEnum.m_rRegistre.get(l_sNomClasse)!.set(this.m_code, this);
  }

  public get libelle(): string { return this.m_sLibelle; }
  public get code(): TCode { return this.m_code; }
  public get ordreAff(): number { return this.m_nOrdreAff; }

  /**
   * 🔍 Extracteur universel d'instance riche par son code de Cour Basse ⚙️.
   *
   */
  public static DeCode<E extends SmartEnum<any>>(this: any, p_vCode: string | number): E {
    const l_sNomClasse = this.name;
    const l_rSousMap = SmartEnum.m_rRegistre.get(l_sNomClasse);
    const l_vCleNormalisee = typeof p_vCode === 'string' ? p_vCode.toUpperCase() : p_vCode;
    const l_rInstance = l_rSousMap ? l_rSousMap.get(l_vCleNormalisee) : null;

    if (!l_rInstance) {
      throw new Error(`[Erreur Sémantique 🚨] Code d''infrastructure inconnu pour ${l_sNomClasse} : ${p_vCode}`);
    }
    return l_rInstance as E;
  }

  /**
   * 🛡️ Vérifie statiquement si un code donné appartient à l énumération (Douane Zod).
   */
  public static isValidCode(p_vCode: string | number): boolean {
    const l_sNomClasse = this.name;
    const l_rSousMap = SmartEnum.m_rRegistre.get(l_sNomClasse);
    const l_vCleNormalisee = typeof p_vCode === 'string' ? p_vCode.toUpperCase() : p_vCode;
    return l_rSousMap ? l_rSousMap.has(l_vCleNormalisee) : false;
  }

  /**
   * 🚀 Récupère l'intégralité des lignes du dictionnaire ordonnées pour l'écran 🌐.
   */
  public static ObtenirToutes<E extends SmartEnum<any>>(this: any): E[] {
    const l_sNomClasse = this.name;
    const l_rSousMap = SmartEnum.m_rRegistre.get(l_sNomClasse);
    if (!l_rSousMap) return [];

    const l_asFluxFiltre = Array.from(l_rSousMap.values()) as E[];
    return l_asFluxFiltre.sort((a, b) => a.ordreAff - b.ordreAff);
  }

  public toString(): string { return JSON.stringify(this.code); }

}
