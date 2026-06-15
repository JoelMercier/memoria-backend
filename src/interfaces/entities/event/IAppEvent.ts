// ——— fichier : src/interfaces/entities/event/IAppEvent.ts

import { AppEventAction } from '@/constants/Actions';
import { AppEventCategory } from '@/constants/Categories';
import { AppEventSecteur } from '@/constants/Secteurs';
import { AppEventSeverity } from '@/constants/Severites';
import type { UserId,
              AppEventId  } from '@/domain/value-objects/ids';
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

  /** 🔔 Signature sémantique vers l'identifiant unique et fort de l'événement */
  get AppEventId(): AppEventId;

  /** 👥 Signature sémantique vers l'identifiant fort de l'auteur de l'action ou NULL si système */
  get UserId(): UserId | null;

  /** 📂 Signature sémantique vers l'instance de Smart Enum représentant la catégorie */
  get EventCategory(): AppEventCategory;

  /** 🏷️ Signature sémantique vers l'instance de Smart Enum qualifiant le Secteur */
  get EventAction(): AppEventAction;

  /** 🏷️ Signature sémantique vers l'instance de Smart Enum qualifiant l'action */
  get EventSecteur(): AppEventSecteur;

  /** ⚠️ Signature sémantique vers l'instance de Smart Enum fixant le niveau de gravité */
  get Severity(): AppEventSeverity;

  /** 💬 Signature sémantique vers la description textuelle explicite stockée */
  get Message(): string;

  /** 🎛️ Signature sémantique vers le sac de métadonnées contextuelles */
  get Metadata(): Record<string, any>;
}
