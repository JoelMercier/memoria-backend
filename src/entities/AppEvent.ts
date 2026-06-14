// ——— fichier : src/entities/AppEvent.ts

import { BaseEntity       } from '@/entities/BaseEntity';
import { AppEventCategory } from '@/constants/Categories';
import { AppEventSeverity } from '@/constants/Severity';
import { IAppEvent        } from '@/interfaces/entities/event/IAppEvent';
import { AppEventSecteur  } from '@/constants/Secteur';
import { AppEventAction   } from '@/constants/Actions';

import type { UserId, AppEventId } from '@/domain/value-objects/ids';
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
export class AppEvent extends BaseEntity<'appEvent', IAppEventData, AppEventId> implements IAppEvent {

  /** 🔔 Caillou de couleur : Identifiant technique unique de l'événement */
  private readonly m_idEvent        : AppEventId;

  /** 👥 Caillou de couleur : Identifiant de l'auteur de l'action ou NULL si système */
  private readonly m_sUserId        : UserId | null;

  /** 📂 Instance de Smart Enum représentant la catégorie de l'action */
  private readonly m_eEventCategory : AppEventCategory;

  /** 🏷️ Instance de Smart Enum qualifiant le secteur de l'événement */
  private readonly m_eEventSecteur  : AppEventSecteur;

  /** 🏷️ Instance de Smart Enum qualifiant le type de l'événement */
  private readonly m_eEventAction   : AppEventAction;

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
    this.m_idEvent        = data.idAppEvent;
    this.m_sUserId        = data.userId;
    this.m_eEventCategory = data.eventCategory;
    this.m_eEventSecteur  = data.eventSecteur;
    this.m_eEventAction   = data.eventAction;
    this.m_eSeverity      = data.severity;
    this.m_sMessage       = data.message;
    this.m_rMetadata      = data.metadata || {};
  }

  /**
   * 🆔 Identifiant unique et fortement typé de l'événement d'audit.
   */
  public get AppEventId(): AppEventId {
    return this.m_idEvent;
  }

  /**
   * 👤 Identifiant de l'utilisateur ou NULL s'il s'agit d'une action purement système.
   */
  public get UserId(): UserId | null {
    return this.m_sUserId;
  }

  /**
   * 🗂️ Catégorie sémantique de l'événement (Smart Enum).
   */
  public get EventCategory(): AppEventCategory {
    return this.m_eEventCategory;
  }

  /**
   * 🎯 Type d'action précis et qualifié (Smart Enum).
   */
  public get EventSecteur(): AppEventSecteur {
    return this.m_eEventSecteur;
  }

  /**
   * 🎯 Type d'action précis et qualifié (Smart Enum).
   */
  public get EventAction(): AppEventAction {
    return this.m_eEventAction;
  }

  /**
   * ⚠️ Niveau de gravité de la trace d'audit (Smart Enum).
   */
  public get Severity(): AppEventSeverity {
    return this.m_eSeverity;
  }

  /**
   * 💬 Message textuel explicite associé au log d'audit.
   */
  public get Message(): string {
    return this.m_sMessage;
  }

  /**
   * 🗄️ Données contextuelles complémentaires (Dictionnaire JSON).
   */
  public get Metadata(): Record<string, any> {
    return this.m_rMetadata;
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   */
  public toData(): IAppEventData {
    return {
      idAppEvent    : this.AppEventId,
      userId        : this.UserId,
      eventCategory : this.EventCategory,
      eventSecteur  : this.EventSecteur,
      eventAction   : this.EventAction,
      severity      : this.Severity,
      message       : this.Message,
      metadata      : this.Metadata,
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
