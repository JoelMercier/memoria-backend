// ——— fichier : src/interfaces/repositories/IAppEventRepository.ts

import type { AppEventCategory   } from '@/constants/AppEventCategory';
import type { AppEventSeverity   } from '@/constants/AppEventSeverity';
import type { AppEventType       } from '@/constants/AppEventType';
import type { UserId, AppEventId } from '@/domain/value-objects/IdMetier';
import type { AppEvent           } from '@/entities/AppEvent';
import type { IAppEventData      } from '@/interfaces/entities/event/IAppEventData';
import type { IBaseRepository    } from '@/interfaces/repositories/IBaseRepository';
import type { IListOptions       } from '@/interfaces/shared/IListOptions';

/**
 * 📋 Interface IAppEventListOptions
 * ---------------------------------
 * Options de filtrage spécifiques pour le journal d'audit.
 * Hérite des propriétés de pagination universelles (NbLignesMax, IndexDepart, search).
 *
 * @interface IAppEventListOptions
 * @extends {IListOptions}
 * @author Joël, Gaïa & Co
 */
export interface IAppEventListOptions extends IListOptions {

  /** 🏷️ Filtre optionnel ciblant un type d'action métier précis */
  eventType? : AppEventType;

  /** 📂 Filtre optionnel ciblant une catégorie logique d'événement */
  eventCategory? : AppEventCategory;

  /** ⚠️ Filtre optionnel ciblant un niveau de criticité opérationnelle */
  severity? : AppEventSeverity;
}

/**
 * 📦 Interface IAppEventListResult
 * --------------------------------
 * Structure de restitution normalisée pour les listes paginées de logs d'audit.
 *
 * @interface IAppEventListResult
 * @author Joël, Gaïa & Co
 */
export interface IAppEventListResult {

  /** 🧾 Collection d'instances vivantes d'événements extraites du stockage */
  items : AppEvent[];

  /** 📊 Nombre total cumulé d'enregistrements correspondants trouvés en base */
  total : number;
}

/**
 * 🗄️ Interface IAppEventRepository
 * --------------------------------
 * Contrat d'accès aux données pour la journalisation et l'audit système (logs).
 *
 * @interface IAppEventRepository
 * @extends {IBaseRepository<AppEvent, IAppEventData, EventId>}
 * @author Joël, Gaïa & Co
 */
export interface IAppEventRepository extends IBaseRepository<AppEvent, IAppEventData, AppEventId> {

  /** 🔎 Récupère l'intégralité d'un log d'audit par son identifiant unique fort. */
  findById(eventId: AppEventId): Promise<AppEvent | null>;

  /** 👥 Extrait la liste brute des derniers logs rattachés à un utilisateur spécifique. */
  findByUserId(userId: UserId, limit?: number): Promise<AppEvent[] | null>;

  /** 📜 Extrait la liste paginée, filtrée et indexée des logs d'un utilisateur donné. */
  listByUserId(userId: UserId, options?: IAppEventListOptions): Promise<IAppEventListResult>;

  /** ⚠️ Extrait les derniers logs correspondant à un niveau de sévérité précis. */
  findBySeverity(severity: AppEventSeverity, limit?: number): Promise<AppEvent[] | null>;

  /** 🗂️ Extrait les derniers logs correspondant à une catégorie fonctionnelle spécifique. */
  findByCategory(category: AppEventCategory, limit?: number): Promise<AppEvent[] | null>;

  /** 🚨 Récupère en priorité absolue les derniers logs critiques du système. */
  findCritical(limit?: number): Promise<AppEvent[] | null>;
}
