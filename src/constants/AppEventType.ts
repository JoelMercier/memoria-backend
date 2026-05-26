// ——— fichier : src/constants/AppEventType.ts

import { SmartEnum        } from './base/SmartEnum';
import { AppEventCategory } from './AppEventCategory';

/**
 * 🏛️ Classe AppEventType (Smart Enum Extensible)
 * -----------------------------------------------
 * Verrouille les chaînes de caractères autorisées pour les types d'événements.
 * Liée fonctionnellement aux catégories parentes pour le monitoring.
 *
 * @class AppEventType
 * @extends SmartEnum<string>
 */
export class AppEventType extends SmartEnum<string> {

  // 🔐 Événements du module AUTH
  public static readonly AUTH_LOGIN_SUCCESS = new AppEventType('AUTH_LOGIN_SUCCESS', 'auth.login_success', AppEventCategory.aecAudit);
  public static readonly AUTH_LOGIN_FAILURE = new AppEventType('AUTH_LOGIN_FAILURE', 'auth.login_failure', AppEventCategory.aecAudit);

  // 📦 Événements du module ITEM
  public static readonly ITEM_CREATED       = new AppEventType('ITEM_CREATED',       'item.created',       AppEventCategory.aecAnalytics);
  public static readonly ITEM_DELETED       = new AppEventType('ITEM_DELETED',       'item.deleted',       AppEventCategory.aecAnalytics);

  /** 🗂️ Catégorie sémantique parente associée à ce type d'événement */
  private readonly m_rCategorie : AppEventCategory;

  /**
   * Le constructeur privé associe le libellé, le code SQL et la catégorie parente.
   *
   * @private
   * @constructor
   * @param {string} libelle - Identifiant textuel de la constante
   * @param {string} codeSql - Chaîne de caractères exacte attendue par PostgreSQL
   * @param {AppEventCategory} categorie - Catégorie d'audit de rattachement
   */
  private constructor(libelle: string, codeSql: string, categorie: AppEventCategory) {
    super(libelle, codeSql);
    this.m_rCategorie = categorie;
  }

  /**
   * 🗂️ Obtient la catégorie parente de l'événement d'audit.
   *
   * @returns {AppEventCategory} La catégorie rattachée.
   */
  public get categorie(): AppEventCategory {
    return this.m_rCategorie;
  }

  /**
   * 🎯 Retourne la liste exhaustive des types d'événements validés en BDD.
   *
   * @static
   * @returns {AppEventType[]} Tableau des instances de constantes autorisées
   */
  public static values(): AppEventType[] {
    return [
      AppEventType.AUTH_LOGIN_SUCCESS,
      AppEventType.AUTH_LOGIN_FAILURE,
      AppEventType.ITEM_CREATED,
      AppEventType.ITEM_DELETED
    ];
  }

  /**
   * 🗄️ Passerelle d'infrastructure : Convertit une chaîne brute PostgreSQL en instance typée.
   * Exploite l'indexation dynamique du registre de notre classe de base SmartEnum.
   *
   * @static
   * @param {string} codeSql - Le jeton textuel extrait de la ligne SQL
   * @throws {Error} Si le type d'événement lu en base est inconnu du dictionnaire
   * @returns {AppEventType} L'instance de classe Smart Enum correspondante
   */
  public static fromSql(codeSql: string): AppEventType {
    const bEstValide : boolean = this.isValidCode(codeSql);

    if (!bEstValide) {
      throw new Error(`Type d'événement SQL inconnu : ${codeSql}`);
    }

    return this.values().find(t => t.code === codeSql)!;
  }
}
