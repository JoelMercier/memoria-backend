// ——— fichier : src/interfaces/entities/event/IAppEvent.ts

import { AppEventCategory } from '@/constants/AppEventCategory';
import { AppEventSeverity } from '@/constants/AppEventSeverity';
import { AppEventType     } from '@/constants/AppEventType';
import type { UserId,
              EventId     } from '@/domain/value-objects/IdMetier';
import type { IEntity      } from '@/interfaces/entities/IEntity';
import type { IAppEventData } from '@/interfaces/entities/event/IAppEventData';

/**
 * 🔒 Interface IAppEvent
 * ----------------------
 * Contrat de comportement public en lecture pour l'entité vivante AppEvent (Logs d'audit).
 * Sécurisée par l'armure nominale et alignée sur la structure d'infrastructure BaseEntity.
 *
 * @interface IAppEvent
 * @extends {IEntity<IAppEventData>}
 * @author Joël, Gaïa & Co
 */
export interface IAppEvent extends IEntity<IAppEventData> {

  /** 🔔 Accesseur en lecture vers l'identifiant unique et fort de l'événement */
  get idEvent(): EventId;

  /** 👥 Accesseur en lecture vers l'identifiant fort de l'auteur de l'action ou NULL si système */
  get userId(): UserId | null;

  /** 📂 Accesseur en lecture vers l'instance de Smart Enum représentant la catégorie */
  get eventCategory(): AppEventCategory;

  /** 🏷️ Accesseur en lecture vers l'instance de Smart Enum qualifiant le type précis */
  get eventType(): AppEventType;

  /** ⚠️ Accesseur en lecture vers l'instance de Smart Enum fixant le niveau de gravité */
  get severity(): AppEventSeverity;

  /** 💬 Accesseur en lecture vers la description textuelle explicite stockée */
  get message(): string;

  /** 🎛️ Accesseur en lecture vers le sac de métadonnées contextuelles */
  get metadata(): Record<string, any>;

  /** 📅 Accesseur en lecture vers l'horodatage précis d'ancrage en persistance */
  get createdAt(): Date;
}
