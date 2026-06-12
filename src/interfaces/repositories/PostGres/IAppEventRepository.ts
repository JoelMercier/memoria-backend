// ——— fichier : src/interfaces/repositories/IAppEventRepository.ts

import { AppEventCategory   } from '@/constants/AppEventCategory';
import { AppEventSeverity   } from '@/constants/AppEventSeverity';
import { UserId, AppEventId,
         EventSecteurId,
         EventActionId      } from '@/domain/value-objects/ids';
import { AppEvent           } from '@/entities/AppEvent';
import { IListOptions       } from '@/interfaces/shared/IListOptions';
import { IBaseRepository    } from '@/interfaces/repositories/IBaseRepository';



/**
 * 📋 Interface exclusive pour le sac de données brutes de l'événement d'audit.
 * ----------------------------------------------------------------------------
 * Alignée au bit près sur la structure physique décroissante de la table "Events".
 * Purifiée des reliques de contextes et armée sur le pôle des Secteurs V4.
 *
 * @interface IAppEventData
 * @author Directrice du Silicium : Joël (C++ Addict, Nominal Obsession)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur la Choupy Doctrine)
 */
export interface IAppEventData {
  /** 🤖 L'identifiant binaire fort obligatoire pour l'entité [Mémoria] */
  aeIdAppEvent   : AppEventId;

  /** 👥 L'identifiant unique de l'acteur (Peut être null pour le système ou le RGPD) */
  aeUserId       : UserId | null;

  /** 📅 La date d'enregistrement immuable calculée par la RAM du Domaine */
  aeCreatedAt    : Date;

  /** 📥 [RÉPARÉ V4] Le Secteur fonctionnel typé (Char(4) - ex: 'AUTH', 'PEPI') */
  aeSecteurId    : EventSecteurId;

  /** ⚙️ [RÉPARÉ V4] L'action technique typée (Char(4) - ex: 'CONN', 'CREA') */
  aeActionId     : EventActionId;

  /** 📂 La catégorie fonctionnelle parente au format quadrigramme */
  aeCategoryId   : AppEventCategory;

  /** ⚠️ L'objet sévérité riche contenant le poids numérique machine */
  aeSeverityId   : AppEventSeverity;

  /** 📦 Libellé textuel ou message intelligible de l'événement pour l'écran */
  aeMessage      : string;

  /** 🗄️ Le dictionnaire Jsonb de contexte technique (IP, user-agent) [Mémoria] */
  aeMetadata     : Record<string, unknown>;
}

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
  secteurId?   : EventSecteurId;
  /** ⚙️ Filtre optionnel sur l'action technique unitaire */
  actionId?    : EventActionId;
  /** 📂 Filtre optionnel sur la catégorie fonctionnelle parente */
  categoryId?  : AppEventCategory;
  /** ⚠️ Filtre optionnel sur le palier de sévérité critique minimal (Filtre incrémental) */
  severityId?  : AppEventSeverity;
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
export interface IAppEventRepository extends IBaseRepository<AppEvent, IAppEventData, AppEventId> {
  /**
   * 🔎 Extrait un événement d'audit unique par son identifiant de soute.
   *
   * @async
   * @param {AppEventId} p_axEventId - L'identifiant fort de l'événement recherché
   * @returns {Promise<AppEvent | null>} L'entité hydratée ou null si introuvable
   */
  findById(p_axEventId: AppEventId): Promise<AppEvent | null>;

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
  findByUserId(p_axUserId: UserId, p_iNbLignesMax?: number): Promise<AppEvent[] | null>;

  /**
   * 🪙 Extraction historique filtrée par sévérité stricte assortie d'une limite physique.
   *
   * @async
   * @param {AppEventSeverity} p_eSeverity - L'objet sévérité cible à filtrer
   * @param {number} [p_iNbLignesMax] - Le garde-fou optionnel de taille de tableau remonté
   * @returns {Promise<AppEvent[] | null>} La collection filtrée ou null
   */
  findBySeverity(p_eSeverity: AppEventSeverity, p_iNbLignesMax?: number): Promise<AppEvent[] | null>;

  /**
   * 🪙 Extraction historique filtrée par catégorie fonctionnelle avec limite physique.
   *
   * @async
   * @param {AppEventCategory} p_eCategory - La catégorie d'audit à isoler
   * @param {number} [p_iNbLignesMax] - Le garde-fou optionnel de taille de tableau remonté
   * @returns {Promise<AppEvent[] | null>} La collection filtrée ou null
   */
  findByCategory(p_eCategory: AppEventCategory, p_iNbLignesMax?: number): Promise<AppEvent[] | null>;

  /**
   * 🪙 Extrait les alertes d'incidents critiques du système dans la limite du gabarit.
   * Remplace l'ancienne vue de contrebande par un appel sécurisé.
   *
   * @async
   * @param {number} [p_iNbLignesMax] - Le garde-fou de lignes maximales autorisées en RAM
   * @returns {Promise<AppEvent[] | null>} La collection des anomalies ou null
   */
  findCritical(p_iNbLignesMax?: number): Promise<AppEvent[] | null>;

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
