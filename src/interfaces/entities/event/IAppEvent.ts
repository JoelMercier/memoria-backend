// ——— fichier : src/interfaces/entities/event/IAppEvent.ts

import { AppEventCategory } from '@/constants/AppEventCategory';
import { AppEventSeverity } from '@/constants/AppEventSeverity';
import { AppEventType     } from '@/constants/AppEventType';
// 🪓 ALIGNEMENT INDUSTRIEL : Importation du véritable type nominal fort AppEventId
import type { UserId,
              AppEventId  } from '@/domain/value-objects/IdMetier';
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
  getAppEventId(): AppEventId;

  /** 👥 Signature sémantique vers l'identifiant fort de l'auteur de l'action ou NULL si système */
  getUserId(): UserId | null;

  /** 📂 Signature sémantique vers l'instance de Smart Enum représentant la catégorie */
  getEventCategory(): AppEventCategory;

  /** 🏷️ Signature sémantique vers l'instance de Smart Enum qualifiant le type précis */
  getEventType(): AppEventType;

  /** ⚠️ Signature sémantique vers l'instance de Smart Enum fixant le niveau de gravité */
  getSeverity(): AppEventSeverity;

  /** 💬 Signature sémantique vers la description textuelle explicite stockée */
  getMessage(): string;

  /** 🎛️ Signature sémantique vers le sac de métadonnées contextuelles */
  getMetadata(): Record<string, any>;
}
