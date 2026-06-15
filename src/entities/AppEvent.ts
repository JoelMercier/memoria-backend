// ——— fichier : src/entities/AppEvent.ts

import { BaseEntity } from '@/entities/BaseEntity';
import { Categorie  } from '@/constants/Categories';
import { Severite   } from '@/constants/Severites';
import { IAppEvent  } from '@/interfaces/entities/event/IAppEvent';
import { Secteur    } from '@/constants/Secteurs';
import { Action     } from '@/constants/Actions';

import type { UserId, EventId } from '@/domain/value-objects/ids';
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
export class AppEvent extends BaseEntity<'Event', IAppEventData, EventId> implements IAppEvent {

  /** 🔔 Caillou de couleur : Identifiant technique unique de l'événement */
  private readonly m_idEvent        : EventId;

  /** 👥 Caillou de couleur : Identifiant de l'auteur de l'action ou NULL si système */
  private readonly m_sUserId        : UserId | null;

  /** 📂 Instance de Smart Enum représentant la catégorie de l'action */
  private readonly m_eCategorie : Categorie;

  /** 🏷️ Instance de Smart Enum qualifiant le secteur de l'événement */
  private readonly m_eSecteur  : Secteur;

  /** 🏷️ Instance de Smart Enum qualifiant le type de l'événement */
  private readonly m_eAction   : Action;

  /** ⚠️ Instance de Smart Enum fixant le niveau de gravité opérationnelle */
  private readonly m_eSeverite      : Severite;

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
    this.m_idEvent    = data.idEvent;
    this.m_sUserId    = data.userId;
    this.m_eCategorie = data.categorie;
    this.m_eSecteur   = data.secteur;
    this.m_eAction    = data.action;
    this.m_eSeverite  = data.severite;
    this.m_sMessage   = data.message;
    this.m_rMetadata  = data.metadata || {};
  }

  /**
   * 🆔 Identifiant unique et fortement typé de l'événement d'audit.
   */
  public get EventId(): EventId {
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
  public get Categorie(): Categorie {
    return this.m_eCategorie;
  }

  /**
   * 🎯 Type d'action précis et qualifié (Smart Enum).
   */
  public get Secteur(): Secteur {
    return this.m_eSecteur;
  }

  /**
   * 🎯 Type d'action précis et qualifié (Smart Enum).
   */
  public get Action():Action {
    return this.m_eAction;
  }

  /**
   * ⚠️ Niveau de gravité de la trace d'audit (Smart Enum).
   */
  public get Severite(): Severite {
    return this.m_eSeverite;
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
      idEvent   : this.EventId,
      userId    : this.UserId,
      categorie : this.Categorie,
      secteur   : this.Secteur,
      action    : this.Action,
      severite  : this.Severite,
      message   : this.Message,
      metadata  : this.Metadata,
      createdAt : this.createdAt,
    };
  }

  /**
   * 🖨️ Sérialise textuellement l'entité d'audit au format JSON.
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
