// ——— fichier : src/interfaces/repositories/IAppEventRepository.ts

import { AppEventCategory }     from '@/constants/AppEventCategory';
import { AppEventSeverity }     from '@/constants/AppEventSeverity';
import { AppEventType }         from '@/constants/AppEventType';
import { UserId, AppEventId }   from '@/domain/value-objects/IdMetier';
import { AppEvent }             from '@/entities/AppEvent';
import { IListOptions }         from '@/interfaces/shared/IListOptions';

/**
 * 📋 Interface exclusive pour le sac de données brutes de l'événement d'audit.
 * ----------------------------------------------------------------------------
 * Alignée au bit près sur la structure physique décroissante de la table "Events".
 *
 * @interface IAppEventData
 * @author Vision : Joël (C++ Addict)
 * @author Forgerie logicielle : Gaïa (Graveuse de lignes d'acier)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export interface IAppEventData {
  /** 🤖 L'identifiant binaire fort obligatoire pour l'entité [Mémoria] */
  idAppEvent     : AppEventId;
  /** 👥 L'identifiant unique de l'acteur (Peut être null pour le système ou le RGPD) */
  userId         : UserId | null;
  /** 🏷️ Le type d'action métier qualifié (ex: 'authentification.echec') */
  eventType      : AppEventType;
  /** 📂 La catégorie fonctionnelle parente du log au format quadrigramme */
  eventCategory  : AppEventCategory;
  /** ⚠️ L'objet sévérité riche contenant le poids numérique machine */
  severity       : AppEventSeverity;
  /** 📦 Libellé textuel ou message intelligible de l'événement pour l'écran */
  message        : string;
  /** 🗄️ Le dictionnaire Jsonb de contexte technique (IP, user-agent) [Mémoria] */
  metadata       : Record<string, unknown>;
  /** 📅 La date d'enregistrement immuable calculée par la RAM du Domaine */
  createdAt?     : Date;
}

/**
 * 📋 Interface IAppEventListOptions 🧮 (Le Calibreur d'Options d'Audit 🤖)
 */
export interface IAppEventListOptions extends IListOptions {
  eventType?     : AppEventType;
  eventCategory? : AppEventCategory;
  severity?      : AppEventSeverity;
}

/**
 * 📦 Interface IAppEventListResult 🧮 (Le Restituteur Normalisé de Traces 🤖)
 */
export interface IAppEventListResult {
  items          : AppEvent[];
  total          : number;
}

/**
 * 🗄️ Interface IAppEventRepository 🧮 (Le Gardien du Registre d'Audit 🤖)
 */
export interface IAppEventRepository {
  findById(p_axEventId: AppEventId): Promise<AppEvent | null>;
  findByUserId(p_axUserId: UserId, p_iNbLignesMax?: number): Promise<AppEvent[] | null>;
  listByUserId(p_axUserId: UserId, p_oOptions?: IAppEventListOptions): Promise<IAppEventListResult>;
  findBySeverity(p_eSeverity: AppEventSeverity, p_iNbLignesMax?: number): Promise<AppEvent[] | null>;
  findByCategory(p_eCategory: AppEventCategory, p_iNbLignesMax?: number): Promise<AppEvent[] | null>;
  findCritical(p_iNbLignesMax?: number): Promise<AppEvent[] | null>;
  findAll(): Promise<AppEvent[]>;
}
