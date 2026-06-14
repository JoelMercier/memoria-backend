// ——— fichier : src/constants/Choupy/SmartEnum.ts

/**
 * 🤖 Classe Abstraite SmartEnum 🧮 (Le Calibreur de Quadrigrammes Système 🔌)
 * ----------------------------------------------------------------------------
 * Base universelle, immuable et fortement typée pour concevoir des enums riches.
 *
 * @abstract
 * @class SmartEnum
 * @template TCode - Le type physique ou sémantique affecté au code de l'énumération (string | number)
 * @author Conception & Vision : Joël (C++ Framework Architect - Metaprogramming Master)
 * @author Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers en surchauffe de la V4)
 */
export abstract class SmartEnum<TCode extends string | number> {
  /** 🗄️ Registre statique global indexant toutes les instances de l'application en RAM */
  private static readonly m_rRegistre = new Map<
    string,
    Map<string | number, SmartEnum<string | number>>
  >();

  /** 💬 Libellé textuel destiné aux DTOs de surface et affichages graphiques */
  private readonly m_sLibelle: string;

  /** 🆔 Code technique fixe, immuable, de stockage ou d'infrastructure en base (ex: 'DESC') */
  private readonly m_code: TCode;

  /** 🛂 Position numérique d'indexation pour le tri automatique dans les composants IHM */
  private readonly m_nOrdreAff: number;

  /**
   * Orchestre l'initialisation immuable du Smart Enum et gère l'auto-enregistrement en RAM.
   */
  protected constructor(p_sLibelle: string, p_code: TCode, p_nOrdreAff: number) {
    this.m_sLibelle = p_sLibelle;
    this.m_code = typeof p_code === 'string' ? (p_code.toUpperCase() as TCode) : p_code;
    this.m_nOrdreAff = Math.floor(p_nOrdreAff);

    const l_sNomClasse = this.constructor.name;

    if (!SmartEnum.registre.has(l_sNomClasse)) {
      SmartEnum.registre.set(l_sNomClasse, new Map());
    }

    SmartEnum.registre.get(l_sNomClasse)!.set(this.m_code, this);
  }

  /** 🗄️ VRAI ACCESSEUR STATIQUE : Unique porte d'entrée souveraine vers le registre central */
  public static get registre(): Map<string, Map<string | number, SmartEnum<string | number>>> {
    return SmartEnum.m_rRegistre;
  }

  /** @public @returns {string} Le libellé textuel humain */
  public get libelle(): string {
    return this.m_sLibelle;
  }

  /** @public @returns {TCode} Le code technique brut d'infrastructure */
  public get code(): TCode {
    return this.m_code;
  }

  /** @public @returns {number} L'index numérique d'ordonnancement graphique */
  public get ordreAff(): number {
    return this.m_nOrdreAff;
  }

  /**
   * 🔍 Extracteur statique universel d'instance riche par son code de base de données.
   * [SCELLÉ C++ COMPLIANT] L'accès par prototype libère les constructeurs privés de toute contrainte !
   */
  public static DeCode<E extends SmartEnum<string | number>>(
    this: { prototype: E; name: string },
    p_vCode: string | number
  ): E {
    const l_sNomClasse = this.name;
    const l_rSousMap = SmartEnum.registre.get(l_sNomClasse);
    const l_vCleNormalisee = typeof p_vCode === 'string' ? p_vCode.toUpperCase() : p_vCode;
    const l_rInstance = l_rSousMap ? l_rSousMap.get(l_vCleNormalisee) : null;

    if (!l_rInstance) {
      throw new Error(
        `[Erreur Sémantique 🚨] Code d'infrastructure inconnu pour ${l_sNomClasse} : ${p_vCode}`
      );
    }
    return l_rInstance as E;
  }

  /**
   * 🛡️ Douane de surface : Vérifie si un code brut appartient légitimement à la famille d'énumération.
   */
  public static isValidCode(p_vCode: string | number): boolean {
    const l_sNomClasse = this.name;
    const l_rSousMap = SmartEnum.registre.get(l_sNomClasse);
    const l_vCleNormalisee = typeof p_vCode === 'string' ? p_vCode.toUpperCase() : p_vCode;

    return l_rSousMap ? l_rSousMap.has(l_vCleNormalisee) : false;
  }

  /**
   * 🚀 Récupère l'intégralité des instances du dictionnaire ordonnées pour l'écran.
   * [SCELLÉ C++ COMPLIANT] L'accès par prototype libère les constructeurs privés de toute contrainte !
   */
  public static ObtenirToutes<E extends SmartEnum<string | number>>(this: {
    prototype: E;
    name: string;
  }): E[] {
    const l_sNomClasse = this.name;
    const l_rSousMap = SmartEnum.registre.get(l_sNomClasse);
    if (!l_rSousMap) return [];

    const l_asFluxFiltre = Array.from(l_rSousMap.values()) as E[];
    return l_asFluxFiltre.sort((a, b) => a.ordreAff - b.ordreAff);
  }

  /**
   * Sérialise textuellement l'instance au format JSON en ne retournant que son code brut.
   */
  public toString(): string {
    return JSON.stringify(this.code);
  }
}

export default SmartEnum;
