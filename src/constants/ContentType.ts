// ——— fichier : src/constants/ContentType.ts

import { SmartEnum } from './base/SmartEnum';

/**
 * 🏛️ Classe ContentType (Smart Enum)
 * ----------------------------------
 * Gère de manière nominale et sécurisée les types de contenus (pépites) du système.
 * Fait le pont entre les valeurs physiques PostgreSQL et l'affichage utilisateur.
 *
 * @class ContentType
 * @extends {SmartEnum<string>}
 * @author Joël, Gaïa & Co
 */
export class ContentType extends SmartEnum<string> {

  /** 📚 Type de contenu : Ouvrage ou document écrit */
  public static readonly LIVRE   = new ContentType('LIVRE',   'livre',   '📚 Livre');

  /** 🎙️ Type de contenu : Flux ou enregistrement audio */
  public static readonly PODCAST = new ContentType('PODCAST', 'podcast', '🎙️ Podcast');

  /** 📰 Type de contenu : Publication ou billet textuel web */
  public static readonly ARTICLE = new ContentType('ARTICLE', 'article', '📰 Article');

  /** 🎥 Type de contenu : Séquence vidéo ou filmée */
  public static readonly VIDEO   = new ContentType('VIDEO',   'video',   '🎥 Vidéo');

  /** 📝 Type de contenu : Annotation ou mémo textuel libre */
  public static readonly NOTE    = new ContentType('NOTE',    'note',    '📝 Note Personnelle');

  /** 💬 Libellé enrichi destiné à l'interface utilisateur (Mme Fontaine) */
  private readonly m_sLibelleAffichage : string;

  /**
   * Constructeur privé assurant l'immuabilité et l'étanchéité des instances.
   *
   * @private
   * @constructor
   * @param {string} libelle - Identifiant textuel interne de l'instance (ex: 'LIVRE')
   * @param {string} codeSql - Valeur brute attendue en base de données par PostgreSQL (Minuscules, ex: 'livre')
   * @param {string} libelleAffichage - Libellé enrichi destiné à l'interface utilisateur
   */
  private constructor(libelle: string, codeSql: string, libelleAffichage: string) {
    super(libelle, codeSql);
    this.m_sLibelleAffichage = libelleAffichage;
  }

  /**
   * 🛡️ Accesseur public vers le libellé d'affichage convivial destiné à l'interface utilisateur.
   *
   * @returns {string} Le texte d'affichage graphique.
   */
  public get libelleAffichage(): string {
    return this.m_sLibelleAffichage;
  }

  /**
   * 📦 Retourne la liste exhaustive de toutes les instances disponibles.
   *
   * @static
   * @function values
   * @returns {ContentType[]} Tableau indexé des instances
   */
  public static values(): ContentType[] {
    return [
      ContentType.LIVRE,
      ContentType.PODCAST,
      ContentType.ARTICLE,
      ContentType.VIDEO,
      ContentType.NOTE
    ];
  }

  /**
   * 🗄️ Convertit une chaîne brute PostgreSQL ou issue du transport en instance typée et sécurisée.
   * Exploite l'indexation dynamique du registre de notre classe de base SmartEnum.
   *
   * @static
   * @function fromSql
   * @param {string} codeSql - Le code brut (code informatique) à évaluer
   * @throws {Error} Si le code SQL ne correspond à aucune valeur physique valide
   * @returns {ContentType} L'instance correspondante du Smart Enum
   */
  public static fromSql(codeSql: string): ContentType {
    const bEstValide : boolean = this.isValidCode(codeSql);

    if (!bEstValide) {
      throw new Error(`[Erreur Sémantique] Type de contenu SQL inconnu : '${codeSql}'`);
    }

    return this.values().find((t): boolean => t.code === codeSql)!;
  }

  /**
   * 🏷️ Liste exhaustive des codes informatiques de persistance (SQL).
   * Sert de pont d'alimentation natif pour les schémas de validation (Zod).
   *
   * @static
   * @function codes
   * @returns {string[]} Liste des codes littéraux autorisés (ex: ['livre', 'podcast', ...])
   */
  public static codes(): [string, ...string[]] {
    const arr : string[] = this.values().map((t): string => t.code);
    return [arr[0], ...arr.slice(1)] as [string, ...string[]];
  }
}

export default ContentType;
