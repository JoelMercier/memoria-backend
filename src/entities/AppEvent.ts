// ——— fichier : src/entities/AppEvent.ts

import { BaseEntity       } from '@/entities/BaseEntity';
import { AppEventCategory } from '@/constants/AppEventCategory';
import { AppEventSeverity } from '@/constants/AppEventSeverity';
import { AppEventType     } from '@/constants/AppEventType';
import { IAppEvent        } from '@/interfaces/entities/event/IAppEvent';
import type { UserId,
              EventId     } from '@/domain/value-objects/IdMetier';
import type { IAppEventData } from '@/interfaces/entities/event/IAppEventData';

/**
 * 🏛️ Classe AppEvent (Partie 1/2 - Version Hongroise Restaurée)
 * -------------------------------------------------------------
 * Modèle métier immuable d'événement d'audit.
 * Encapsule ses attributs derrière la notation m_ et l'armure nominale.
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

  /** 🎛️ Sac de données dynamiques contextuelles */
  private readonly m_rMetadata      : Record<string, any>;

  /** 📅 Horodatage précis de l'ancrage en persistance */
  private readonly m_dCreatedAt     : Date;

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
    this.m_dCreatedAt     = data.createdAt || new Date();
  }

  /**
   * 🆔 Identifiant unique et fortement typé de l'événement d'audit.
   *
   * @returns {EventId} Le caillou de couleur de l'événement.
   */
  public get idEvent(): EventId {
    return this.m_idEvent;
  }

  /**
   * 👤 Identifiant de l'utilisateur ou NULL s'il s'agit d'une action purement système.
   *
   * @returns {UserId | null} Le caillou de l'utilisateur ou NULL.
   */
  public get userId(): UserId | null {
    return this.m_sUserId;
  }

  /**
   * 🗂️ Catégorie sémantique de l'événement (Smart Enum).
   *
   * @returns {AppEventCategory} L'instance de catégorie.
   */
  public get eventCategory(): AppEventCategory {
    return this.m_eEventCategory;
  }

  /**
   * 🎯 Type d'action précis et qualifié (Smart Enum).
   *
   * @returns {AppEventType} L'instance de type d'action.
   */
  public get eventType(): AppEventType {
    return this.m_eEventType;
  }

  /**
   * ⚠️ Niveau de gravité de la trace d'audit (Smart Enum).
   *
   * @returns {AppEventSeverity} L'instance de sévérité.
   */
  public get severity(): AppEventSeverity {
    return this.m_eSeverity;
  }

  /**
   * 💬 Message textuel explicite associé au log d'audit.
   *
   * @returns {string} Le libellé du message.
   */
  public get message(): string {
    return this.m_sMessage;
  }

  /**
   * 🗄️ Données contextuelles complémentaires (Dictionnaire JSON).
   *
   * @returns {Record<string, any>} L'objet de métadonnées.
   */
  public get metadata(): Record<string, any> {
    return this.m_rMetadata;
  }

  /**
   * ⏱️ Horodatage précis de l'enregistrement en base de données.
   *
   * @returns {Date} La date de création de l'enregistrement.
   */
  public get createdAt(): Date {
    return this.m_dCreatedAt;
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   * Aligné rigoureusement sur la clé primaire d'infrastructure idAppEvent.
   *
   * @function toData
   * @returns {IAppEventData} La structure de données plate
   */
  public toData(): IAppEventData {
    return {
      idAppEvent    : this.idEvent,
      userId        : this.userId,
      eventCategory : this.eventCategory,
      eventType     : this.eventType,
      severity      : this.severity,
      message       : this.message,
      metadata      : this.metadata,
      createdAt     : this.createdAt,
    };
  }

  /**
   * 🖨️ Sérialise textuellement l'entité d'audit au format JSON.
   *
   * @override
   * @function toString
   * @returns {string} La chaîne JSON représentative du sac de données
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
