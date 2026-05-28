// ——— fichier : src/entities/AppEvent.ts

import { BaseEntity       } from '@/entities/BaseEntity';
import { AppEventCategory } from '@/constants/AppEventCategory';
import { AppEventSeverity } from '@/constants/AppEventSeverity';
import { AppEventType     } from '@/constants/AppEventType';
import { IAppEvent        } from '@/interfaces/entities/event/IAppEvent';
// 🪓 ALIGNEMENT INDUSTRIEL : Correction de l'import de EventId vers AppEventId
import type { UserId,
              AppEventId as EventId } from '@/domain/value-objects/IdMetier';
import type { IAppEventData } from '@/interfaces/entities/event/IAppEventData';

/**
 * 🏛️ Classe AppEvent
 * ------------------
 * Modèle métier immuable d'événement d'audit.
 * Encapsule ses attributs derrière la notation m_ et l'armure nominale unifiée.
 *
 * @class AppEvent
 * @extends {BaseEntity<'appEvent', IAppEventData, EventId>}
 * @implements {IAppEvent}
 * @author Joël, Gaïa & Co
 */
export class AppEvent extends BaseEntity<'appEvent', IAppEventData, EventId> implements IAppEvent {

  /** 🔔 Caillou de couleur : Identifiant technique unique de l'événement */
  private readonly m_idEvent       : EventId;

  /** 👥 Caillou de couleur : Identifiant de l'auteur de l'action ou NULL si système */
  private readonly m_sUserId        : UserId | null;

  /** 📂 Instance de Smart Enum représentant la catégorie de l'action */
  private readonly m_eEventCategory : AppEventCategory;

  /** 🏷️ Instance de Smart Enum qualifiant le type de l'événement */
  private readonly m_eEventType     : AppEventType;

  /** ⚠️ Instance de Smart Enum fixant le niveau de gravité opérationnelle */
  private readonly m_eSeverity      : AppEventSeverity;

  /** 💬 Description textuelle explicite stockée dans la trace */
  private readonly m_sMessage       : string;

  /** 🗄️ Sac de données dynamiques contextuelles */
  private readonly m_rMetadata      : Record<string, any>;

  /**
   * Instancie un événement d'audit immuable à partir de son contrat de données.
   *
   * @constructor
   * @param {IAppEventData} data - Payload brut ou typé issu de l'infrastructure
   */
  public constructor(data: IAppEventData) {
    super(data);
    this.m_idEvent       = data.idAppEvent;
    this.m_sUserId        = data.userId;
    this.m_eEventCategory = data.eventCategory;
    this.m_eEventType     = data.eventType;
    this.m_eSeverity      = data.severity;
    this.m_sMessage       = data.message;
    this.m_rMetadata      = data.metadata || {};
    // 🪓 ALIGNEMENT INDUSTRIEL : m_dCreatedAt est supprimé car géré par BaseEntity via data
  }

  /**
   * 🆔 Identifiant unique et fortement typé de l'événement d'audit.
   */
  public getAppEventId(): EventId {
    return this.m_idEvent;
  }

  /**
   * 👤 Identifiant de l'utilisateur ou NULL s'il s'agit d'une action purement système.
   */
  public getUserId(): UserId | null {
    return this.m_sUserId;
  }

  /**
   * 🗂️ Catégorie sémantique de l'événement (Smart Enum).
   */
  public getEventCategory(): AppEventCategory {
    return this.m_eEventCategory;
  }

  /**
   * 🎯 Type d'action précis et qualifié (Smart Enum).
   */
  public getEventType(): AppEventType {
    return this.m_eEventType;
  }

  /**
   * ⚠️ Niveau de gravité de la trace d'audit (Smart Enum).
   */
  public getSeverity(): AppEventSeverity {
    return this.m_eSeverity;
  }

  /**
   * 💬 Message textuel explicite associé au log d'audit.
   */
  public getMessage(): string {
    return this.m_sMessage;
  }

  /**
   * 🗄️ Données contextuelles complémentaires (Dictionnaire JSON).
   */
  public getMetadata(): Record<string, any> {
    return this.m_rMetadata;
  }

  // =========================================================================
  // 🛡️ ALIAS DE TRANSITION : Satisfait l'ancienne interface IAppEvent historique
  // =========================================================================
  public get idEvent(): EventId { return this.getAppEventId(); }
  public get userId(): UserId | null { return this.getUserId(); }
  public get eventCategory(): AppEventCategory { return this.getEventCategory(); }
  public get eventType(): AppEventType { return this.getEventType(); }
  public get severity(): AppEventSeverity { return this.getSeverity(); }
  public get message(): string { return this.getMessage(); }
  public get metadata(): Record<string, any> { return this.getMetadata(); }
  // =========================================================================

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   */
  public toData(): IAppEventData {
    return {
      idAppEvent    : this.getAppEventId(),
      userId        : this.getUserId(),
      eventCategory : this.getEventCategory(),
      eventType     : this.getEventType(),
      severity      : this.getSeverity(),
      message       : this.getMessage(),
      metadata      : this.getMetadata(),
      createdAt     : this.createdAt,
    };
  }

  /**
   * 🖨️ Sérialise textuellement l'entité d'audit au format JSON.
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
