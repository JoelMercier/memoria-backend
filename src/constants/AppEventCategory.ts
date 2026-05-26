// ——— fichier : src/constants/AppEventCategory.ts

import { SmartEnum } from './base/SmartEnum';

/**
 * 🏛️ Classe AppEventCategory (Smart Enum Réel)
 * -----------------------------------------------
 * Centralise et sécurise les domaines fonctionnels de journalisation (logs).
 * Alignée strictement sur les types physiques de PostgreSQL (Minuscules).
 *
 * @class AppEventCategory
 * @extends SmartEnum<string>
 */
export class AppEventCategory extends SmartEnum<string> {

  /** 🗂️ Constante d'énumération pour le domaine analytique */
  public static readonly aecAnalytics  = new AppEventCategory('aecAnalytics',  'analytics' );

  /** 🗂️ Constante d'énumération pour le domaine d'audit strict */
  public static readonly aecAudit      = new AppEventCategory('aecAudit',      'audit'     );

  /** 🗂️ Constante d'énumération pour le monitoring applicatif */
  public static readonly aecMonitoring = new AppEventCategory('aecMonitoring', 'monitoring');

  /** 🗂️ Constante d'énumération pour la conformité et le RGPD */
  public static readonly aecGdpr       = new AppEventCategory('aecGdpr',       'gdpr'      );

  /**
   * Constructeur privé pour verrouiller la création d'instances volantes.
   *
   * @private
   * @constructor
   * @param {string} libelle - Identifiant textuel de la constante
   * @param {string} codeSql - Chaîne de caractères exacte attendue par PostgreSQL
   */
  private constructor(libelle: string, codeSql: string) {
    super(libelle, codeSql);
  }

  /**
   * 🗂️ Retourne la liste exhaustive des catégories physiques validées en BDD.
   *
   * @static
   * @returns {AppEventCategory[]} Tableau des instances de constantes autorisées
   */
  public static values(): AppEventCategory[] {
    return [
      AppEventCategory.aecAnalytics,
      AppEventCategory.aecAudit,
      AppEventCategory.aecMonitoring,
      AppEventCategory.aecGdpr
    ];
  }

  /**
   * 🗄️ Passerelle d'infrastructure : Convertit une chaîne brute PostgreSQL en instance typée.
   *
   * @static
   * @param {string} codeSql - Le jeton textuel extrait de la ligne SQL
   * @throws {Error} Si la catégorie lue en base est inconnue du dictionnaire
   * @returns {AppEventCategory} L'instance de classe Smart Enum correspondante
   */
  public static fromSql(codeSql: string): AppEventCategory {
    const bEstValide : boolean = this.isValidCode(codeSql);

    if (!bEstValide) {
      throw new Error(`Catégorie SQL invalide ou non synchronisée : ${codeSql}`);
    }

    return this.values().find(c => c.code === codeSql)!;
  }
}
