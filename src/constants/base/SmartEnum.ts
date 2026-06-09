// ——— fichier : src/constants/base/SmartEnum.ts

/**
 * 🤖 Classe Abstraite SmartEnum 🧮 (Le Calibreur de Quadrigrammes Système 🔌)
 * ----------------------------------------------------------------------------
 * Base universelle, immuable et fortement typée pour concevoir des enums riches.
 * Contrairement aux enums TypeScript natifs (volages et limités à des couples clés/valeurs),
 * le SmartEnum est un véritable objet du Domaine capable d'embarquer des libellés humains,
 * des positions d'affichage IHM, et de s'auto-enregistrer en RAM dès l'allumage du serveur.
 *
 * ⚙️ CINÉMATIQUE INTERNE ET INVERSION DE CONTRÔLE (DI) :
 * 1. À l'allumage, le routeur ou l'infrastructure importe une classe fille (ex: OrdreTriEnum).
 * 2. Lors de l'évaluation du script, les instances statiques de la fille exécutent le constructeur `super()`.
 * 3. Le constructeur intercepte le nom de la classe fille courante via `this.constructor.name`.
 * 4. L'instance s'auto-injecte immédiatement dans le registre global privé statique `m_rRegistre`.
 * 5. Désormais, n'importe quelle couche (Contrôleurs, Repositories) peut interroger le dictionnaire
 *    via les méthodes statiques de soute `DeCode()` ou `ObtenirToutes()` sans jamais devoir réinstancier.
 *
 * @abstract
 * @class SmartEnum
 * @template TCode - Le type physique ou sémantique affecté au code de l'énumération (string | number)
 * @author Conception & Vision : Joël (C++ Framework Architect - Metaprogramming Master)
 * @author Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
 */
export abstract class SmartEnum<TCode extends string | number> {

  /**
   * 🗄️ Registre statique global indexant toutes les instances de l'application en RAM.
   * Clé primaire (string) ➔ Le nom de la classe fille (ex: 'OrdreTriEnum', 'ContentType').
   * Valeur (Map)         ➔ Un sous-dictionnaire liant le code technique (TCode) à l'instance vivante.
   * @private
   * @static
   * @readonly
   */
  private static readonly m_rRegistre = new Map<string, Map<string | number, any>>();

  /** 💬 Libellé textuel destiné aux DTOs de surface, exports CSV et affichages graphiques (ex: 'Ascendant') */
  private readonly m_sLibelle: string;

  /** 🆔 Code technique fixe, immuable, de stockage ou d'infrastructure en base (ex: 'DESC', 'NOTE', 'ARTI') */
  private readonly m_code: TCode;

  /** 🛂 Position numérique d'indexation pour le tri automatique dans les composants IHM */
  private readonly m_nOrdreAff: number;

  /**
   * Orchestre l'initialisation immuable du Smart Enum et gère l'auto-enregistrement en RAM.
   * [SCELLÉ C++] Capture dynamiquement le contexte de l'appelant pour l'indexer dans le dictionnaire central.
   *
   * @protected
   * @constructor
   * @param {string} p_sLibelle - Le nom d'affichage humain de la constante
   * @param {TCode} p_code - La clé d'infrastructure binaire ou textuelle (Varchar/Char) de la base de données
   * @param {number} p_nOrdreAff - Le rang numérique dévolu au tri d'affichage graphique
   */
  protected constructor(p_sLibelle: string, p_code: TCode, p_nOrdreAff: number) {
    this.m_sLibelle = p_sLibelle;
    // Forçage constitutionnel de la casse pour les chaînes de caractères (Standardisation des quadrigrammes)
    this.m_code = typeof p_code === 'string' ? (p_code.toUpperCase() as TCode) : p_code;
    this.m_nOrdreAff = Math.floor(p_nOrdreAff);

    // 🪓 Extraction dynamique du nom de la classe dérivée (Polymorphisme de derrière les fagots)
    const l_sNomClasse = this.constructor.name;

    if (!SmartEnum.m_rRegistre.has(l_sNomClasse)) {
      SmartEnum.m_rRegistre.set(l_sNomClasse, new Map());
    }

    // Injection immédiate de l'objet vivant dans le casier de sa propre famille
    SmartEnum.m_rRegistre.get(l_sNomClasse)!.set(this.m_code, this);
  }

  /** @public @returns {string} Le libellé textuel humain */
  public get libelle() : string { return this.m_sLibelle;  }

  /** @public @returns {TCode} Le code technique brut d'infrastructure */
  public get code()    : TCode  { return this.m_code;      }

  /** @public @returns {number} L'index numérique d'ordonnancement graphiques */
  public get ordreAff(): number { return this.m_nOrdreAff; }

  /**
   * 🔍 Extracteur statique universel d'instance riche par son code de base de données.
   * Foudroie les structures de aiguillage switch/case ou les requêtes de dictionnaires inutiles.
   *
   * @static
   * @template E - La classe fille étendant explicitement SmartEnum
   * @param {string | number} p_vCode - Le code technique ou quadrigramme recherché (Insensible à la casse)
   * @throws {Error} Si le code fourni ne correspond à aucune constante enregistrée pour cette famille
   * @returns {E} L'instance riche correspondante, pleinement hydratée en mémoire vive
   */
  public static DeCode<E extends SmartEnum<any>>(this: any, p_vCode: string | number): E {
    const l_sNomClasse = this.name; // Capture le nom de la classe sur laquelle la méthode statique est appelée
    const l_rSousMap = SmartEnum.m_rRegistre.get(l_sNomClasse);
    const l_vCleNormalisee = typeof p_vCode === 'string' ? p_vCode.toUpperCase() : p_vCode;
    const l_rInstance = l_rSousMap ? l_rSousMap.get(l_vCleNormalisee) : null;

    if (!l_rInstance) {
      throw new Error(`[Erreur Sémantique 🚨] Code d''infrastructure inconnu pour ${l_sNomClasse} : ${p_vCode}`);
    }
    return l_rInstance as E;
  }

  /**
   * 🛡️ Douane de surface : Vérifie si un code brut appartient légitimement à la famille d'énumération.
   * Utilisé massivement dans les validateurs d'IHM ou les middlewares Zod avant franchissement de soute.
   *
   * @static
   * @param {string | number} p_vCode - Le code d'infrastructure à éprouver
   * @returns {boolean} True si le code est référencé et sécurisé dans le registre
   */
  public static isValidCode(p_vCode: string | number): boolean {
    const l_sNomClasse = this.name;
    const l_rSousMap = SmartEnum.m_rRegistre.get(l_sNomClasse);
    const l_vCleNormalisee = typeof p_vCode === 'string' ? p_vCode.toUpperCase() : p_vCode;

    return l_rSousMap ? l_rSousMap.has(l_vCleNormalisee) : false;
  }

  /**
   * 🚀 Récupère l'intégralité des instances du dictionnaire ordonnées pour l'écran.
   * Évite les requêtes lourdes sur les tables de constantes et centralise les catalogues.
   *
   * @static
   * @template E - La classe fille étendant SmartEnum
   * @returns {E[]} Le tableau trié de toutes les instances selon leur propriété ordreAff
   */
  public static ObtenirToutes<E extends SmartEnum<any>>(this: any): E[] {
    const l_sNomClasse = this.name;
    const l_rSousMap = SmartEnum.m_rRegistre.get(l_sNomClasse);
    if (!l_rSousMap) return [];

    const l_asFluxFiltre = Array.from(l_rSousMap.values()) as E[];
    // Tri déterministe en RAM basé sur l'ordre d'affichage désiré en interface
    return l_asFluxFiltre.sort((a, b) => a.ordreAff - b.ordreAff);
  }

  /**
   * Sérialise textuellement l'instance au format JSON en ne retournant que son code brut.
   * Assure l'étanchéité lors des exports réseau ou des sérialisations automatiques.
   *
   * @public
   * @returns {string} Le code brut sérialisé sous forme de chaîne de caractères
   */
  public toString(): string {
    return JSON.stringify(this.code);
  };
}
