// ——— fichier : src/dto/event/ResponseEventDto.ts

import type { AppEventCategory } from '@/constants/AppEventCategory';
import type { AppEventSeverity } from '@/constants/AppEventSeverity';
import type { AppEventType     } from '@/constants/AppEventType';
import { UserId,
         EventId               } from '@/domain/value-objects/IdMetier';
import type { IAppEvent         } from '@/interfaces/entities/event/IAppEvent';

/**
 * 📦 Classe ResponseEventDto
 * --------------------------
 * Objet de transfert de données pour l'exposition sortante d'un événement d'audit.
 * Totalement purifié des scories de la table des pépites (Items).
 *
 * @class ResponseEventDto
 * @author Joël, Gaïa & Co
 */
export class ResponseEventDto {

  /** 🔔 Caillou de couleur : Identifiant unique immuable de l'événement */
  public readonly idEvent : EventId;

  /** 👥 Caillou de couleur : Identifiant unique de l'utilisateur rattaché */
  public readonly userId : UserId | null;

  /** 📂 Caillou de couleur : Catégorie logique de l'événement */
  public readonly eventCategory : AppEventCategory;

  /** 🏷️ Caillou de couleur : Action chirurgicale tracée */
  public readonly eventType : AppEventType;

  /** ⚠️ Caillou de couleur : Niveau de gravité opérationnel */
  public readonly severity : AppEventSeverity;

  /** 💬 Message textuel descriptif de l'événement */
  public readonly message : string | null;

  /** 🎛️ Métadonnées d'infrastructure contextuelles */
  public readonly metadata : Record<string, unknown>;

  /** 📅 Horodatage de création dans le système de persistance */
  public readonly createdAt? : Date;

  /** 📅 Horodatage de la dernière révision d'infrastructure */
  public readonly updatedAt? : Date;

  /**
   * Construit le DTO de réponse en extrayant les données réelles de l'audit.
   *
   * @private
   * @constructor
   * @param {IAppEvent} event - Le contrat de données brut de l'événement d'audit
   */
  private constructor(event: IAppEvent) {
    // Correction chirurgicale : event.idAppEvent devient event.idEvent !
    this.idEvent       = event.idEvent as unknown as EventId;
    this.userId        = event.userId ? (event.userId as unknown as UserId) : null;
    this.eventCategory = event.eventCategory as unknown as AppEventCategory;
    this.eventType     = event.eventType as unknown as AppEventType;
    this.severity      = event.severity as unknown as AppEventSeverity;
    this.message       = event.message;
    this.metadata      = event.metadata as Record<string, unknown>;
    this.createdAt     = event.createdAt;
    this.updatedAt     = event.updatedAt;
  }


  /**
   * 🏭 Fabrique statique : Transforme un contrat de données d'audit en DTO de sortie.
   *
   * @static
   * @function fromEvent
   * @param {IAppEvent} event - L'entité source d'infrastructure
   * @returns {ResponseEventDto} Le DTO d'audit sérialisé conforme
   */
  public static fromEvent(event: IAppEvent): ResponseEventDto {
    return new ResponseEventDto(event);
  }

  /**
   * 🏭 Fabrique statique : Transforme une collection de contrats en liste de DTOs d'audit.
   *
   * @static
   * @function fromEvents
   * @param {IAppEvent[]} events - La liste des structures sources d'audit
   * @returns {ResponseEventDto[]} La collection de DTOs d'audit purifiés
   */
  public static fromEvents(events: IAppEvent[]): ResponseEventDto[] {
    return events.map((i): ResponseEventDto => ResponseEventDto.fromEvent(i));
  }
}
