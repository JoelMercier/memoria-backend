// ——— fichier : src/constants/ContentType.ts

import { SmartEnum } from './Choupy/SmartEnum';

/**
 * 📦 Classe ContentType 🧮 (Le Calibreur de Formats Médias 🤖)
 * ----------------------------------------------------------------------------
 * Gère de manière nominale et sécurisée les types de contenus (pépites) du système.
 * Rétrocompatible avec les anciens mappers de la semaine dernière [Mémoria].
 *
 * @class ContentType
 * @extends {SmartEnum<string>}
 * @author Conception : Joël ((très)Abstract Class)
 * @author Sculpture d'octets : Gaïa (Sculptrice de silicium)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export class ContentType extends SmartEnum<string> {

  /**
   * Constructeur privé pour sceller les formats dans la RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - Libellé complet destiné à l'IHM
   * @param {string} p_sCode - Le quadrigramme d'infrastructure immuable (4 majuscules) [Mémoria]
   * @param {number} p_nOrdreAff - Position numérique unique pour le tri visuel [Mémoria]
   * @param {boolean} p_bDefaut - Drapeau de repli nominal V4 Pro pour la base locale
   */
  private constructor(p_sLibelle: string, p_sCode: string, p_nOrdreAff: number, p_bDefaut: boolean = false) {
    super(p_sLibelle, p_sCode, p_nOrdreAff, p_bDefaut);
  }

  // ----------------------------------------------------------------------------
  // 🏺 Ensemencement de la RAM (Les types officiels - Format 4 lettres)
  // ----------------------------------------------------------------------------
  public static readonly NOTE    = new ContentType('📝 Note Personnelle', 'NOTE', 10, true); // 🔒 Bit True nominal !
  public static readonly ARTICLE = new ContentType('📰 Article',          'ARTI', 20);
  public static readonly LIVRE   = new ContentType('📚 Livre',            'BOOK', 30);
  public static readonly PODCAST = new ContentType('🎙️ Podcast',          'PODC', 40);
  public static readonly VIDEO   = new ContentType('🎥 Vidéo',            'VIDE', 50);

  /** 🛡️ Accesseur rétrocompatible pour éviter de casser ton code existant [Mémoria] */
  public get libelleAffichage(): string { return this.libelle; }

  /** 🚀 Passerelle rétrocompatible pour tes DTOs existants [Mémoria] */
  public static values(): ContentType[] {
    return this.ObtenirToutes<ContentType>();
  }

  /** 🗄️ Passerelle d'infrastructure historique */
  public static fromSql(p_sCodeSql: string): ContentType {
    return this.DeCode<ContentType>(p_sCodeSql);
  }

  /** 🏷️ Tuple de validation strict pour tes anciens schémas (Maintenu pour transition) [Mémoria] */
  public static codes(): [string, ...string[]] {
    const l_asTableauCodes = this.values().map(t => t.code);
    return [l_asTableauCodes[0], ...l_asTableauCodes.slice(1)] as [string, ...string[]];
  }
}

export default ContentType;
