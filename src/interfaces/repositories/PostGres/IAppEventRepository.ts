// ——— fichier : src/interfaces/repositories/IAppEventRepository.ts

import type { UserId, EventId,
              SecteurId, SeveriteId,
              CategorieId, ActionId  } from '@/domain/value-objects/ids';
import type { AppEvent               } from '@/entities/AppEvent';
import type { IListOptions           } from '@/interfaces/shared/IListOptions';
import type { IBaseRepository        } from '@/interfaces/repositories/IBaseRepository';
import type { IAppEventData          } from '@/interfaces/entities/event/IAppEventData';


/**
 * 📋 Interface IAppEventListOptions 🧮 (Le Calibreur d'Options d'Audit 🤖)
 * Filtre les trames d'historique à la volée de façon nominale et sécurisée.
 *
 * @interface IAppEventListOptions
 * @extends {IListOptions}
 */
export interface IAppEventListOptions extends IListOptions {
  /** 👥 Filtre optionnel ciblant les traces d'un acteur spécifique */
  userId?        : UserId;
  /** 📥 Filtre optionnel sur le Secteur fonctionnel de soute */
  secteurId?   : SecteurId;
  /** ⚙️ Filtre optionnel sur l'action technique unitaire */
  actionId?    : ActionId;
  /** 📂 Filtre optionnel sur la catégorie fonctionnelle parente */
  categorieId? : CategorieId;
  /** ⚠️ Filtre optionnel sur le palier de sévérité critique minimal (Filtre incrémental) */
  severiteId?  : SeveriteId;
}

/**
 * 📦 Interface IAppEventListResult 🧮 (Le Restituteur Normalisé de Traces 🤖)
 * Structure d'enveloppe retournant la page de données et la volumétrie absolue.
 *
 * @interface IAppEventListResult
 */
export interface IAppEventListResult {
  /** 📜 La collection d'entités d'événements d'audit de la page courante */
  AppEvents   : AppEvent[];
  /** 📊 Le nombre total absolu d'enregistrements correspondants présents en base */
  TotalEvents : number;
}

/**
 * 🗲 Interface IAppEventRepository 🧮 (Le Gardien du Registre d'Audit 🤖)
 * ----------------------------------------------------------------------------
 * Contrat d'infrastructure gérant les flux d'écriture et de lecture de l'audit.
 * Verrouillé contre les extractions massives anarchiques destructrices de RAM.
 * Connected explicitly to the universal maman IBaseRepository framework V4.
 *
 * @interface IAppEventRepository
 * @extends {IBaseRepository<AppEvent, IAppEventData, AppEventId>}
 */
export interface IAppEventRepository extends IBaseRepository<AppEvent, IAppEventData, EventId> {
  /**
   * 🔎 Extrait un événement d'audit unique par son identifiant de soute.
   *
   * @async
   * @param { EventId } p_axEventId - L'identifiant fort de l'événement recherché
   * @returns {Promise<AppEvent | null>} L'entité hydratée ou null si introuvable
   */
  findById(p_axEventId: EventId): Promise<AppEvent | null>;

  /**
   * 📊 Calcule la volumétrie totale absolue de tous les journaux stockés sur le disque.
   * Utilisé par le tableau de bord d'administration macro.
   *
   * @async
   * @returns {Promise<number>} Le nombre total d'enregistrements dans la table Events
   */
  count(): Promise<number>;

  /**
   * 📜 Extrait une population filtrée et obligatoirement paginée via notre fonction stockée d'élite.
   * Protecteur officiel de la RAM contre les requêtes massives illimitées.
   *
   * @async
   * @param {IAppEventListOptions} p_oOptions - Le dictionnaire de filtres et de pagination (NbLignes, LigneDebut)
   * @returns {Promise<IAppEventListResult>} L'enveloppe normalisée contenant les entités et le compte total
   */
  listByOptions(p_oOptions: IAppEventListOptions): Promise<IAppEventListResult>;

  /**
   * 🪙 Extraction historique ciblée par acteur restreinte par un gabarit maximal de sécurité.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort de l'utilisateur cible
   * @param {number} [p_iNbLignesMax] - Le garde-fou optionnel de taille de tableau remonté
   * @returns {Promise<AppEvent[] | null>} La liste des logs de l'acteur ou null
   */
  findByUserId(p_axUserId: UserId, p_oOptions: IListOptions) : Promise<IAppEventListResult>;

  /**
   * 🪙 Extraction historique filtrée par sévérité stricte assortie d'une limite physique.
   *
   * @async
   * @param {AppEventSeverity} p_eSeverity - L'objet sévérité cible à filtrer
   * @param {number} [p_iNbLignesMax] - Le garde-fou optionnel de taille de tableau remonté
   * @returns {Promise<AppEvent[] | null>} La collection filtrée ou null
   */

  findBySeverite(p_axSeveriteId: SeveriteId, p_oOptions: IListOptions) : Promise<IAppEventListResult>;

  /**
   * 🪙 Extraction historique filtrée par catégorie fonctionnelle avec limite physique.
   *
   * @async
   * @param {AppEventCategory} p_eCategory - La catégorie d'audit à isoler
   * @param {number} [p_iNbLignesMax] - Le garde-fou optionnel de taille de tableau remonté
   * @returns {Promise<AppEvent[] | null>} La collection filtrée ou null
   */
  findByCategorie(p_axCategorieId: CategorieId, p_oOptions: IListOptions) : Promise<IAppEventListResult>;

  /**
   * 🪙 Extrait les alertes d'incidents critiques du système dans la limite du gabarit.
   * Remplace l'ancienne vue de contrebande par un appel sécurisé.
   *
   * @async
   * @param {number} [p_iNbLignesMax] - Le garde-fou de lignes maximales autorisées en RAM
   * @returns {Promise<AppEvent[] | null>} La collection des anomalies ou null
   */
  findBySeverite(p_axSeveriteId: SeveriteId, p_oOptions: IListOptions) : Promise<IAppEventListResult>


  /**
   * 👥 Rompt le lien ombilical avec l'acteur pour les logs de plus de 6 mois (Anonymisation RGPD).
   *
   * @async
   * @param {Date} p_dDateCutoff - La date pivot au-delà de laquelle les IDs acteurs sont effacés
   * @returns {Promise<number>} Le nombre de lignes modifiées en base
   */
  anonymiserLogsActeurs(p_dDateCutoff: Date): Promise<number>;

  /**
   * 🪓 Destruction physique définitive de toutes les traces de plus d'un an du disque.
   *
   * @async
   * @param {Date} p_dDateCutoff - La date pivot au-delà de laquelle tout est carbonisé
   * @returns {Promise<number>} Le nombre de lignes d'audit supprimées sur PostgreSQL
   */
  deleteOlderThan(p_dDateCutoff: Date): Promise<number>;

}
