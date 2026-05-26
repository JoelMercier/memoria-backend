// ——— fichier : src/dto/event/UpdateEventDto.ts

import { AppEventCategory    } from '@/constants/AppEventCategory';
import { AppEventSeverity    } from '@/constants/AppEventSeverity';
import { AppEventType        } from '@/constants/AppEventType';
import { UserId, EventId     } from '@/domain/value-objects/IdMetier';
import { type UpdateAppEventSchemaType,
         AppEventValidation  } from '@/validation/zod/AppEventValidation';

/**
 * 📦 Classe UpdateEventDto
 * -------------------------
 * Objet de transfert de données pour la mise à jour d'un événement d'audit.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 * Armé avec les cailloux de couleur (Value Objects) et synchronisé sur les vraies constantes.
 *
 * @class UpdateEventDto
 * @author Joël, Gaïa & Co
 */
export class UpdateEventDto {

  /** 📂 Caillou de couleur : Catégorie logique de l'événement */
  public readonly eventCategory : AppEventCategory;

  /** 🔔 Caillou de couleur : Identifiant unique et fort de l'événement */
  public readonly idEvent       : EventId;

  /** 👥 Caillou de couleur : Propriétaire rattaché à l'action d'audit */
  public readonly userId        : UserId | null;

  /** 🏷️ Caillou de couleur : Type d'action métier tracé */
  public readonly eventType     : AppEventType;

  /** ⚠️ Caillou de couleur : Niveau de criticité opérationnelle typé */
  public readonly severity      : AppEventSeverity;

  /** 💬 Message textuel descriptif de l'événement */
  public readonly message       : string | null;

  /** 🎛️ Métadonnées d'infrastructure contextuelles */
  public readonly metadata      : Record<string, unknown>;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   * Effectue le scellage nominal immédiat vers nos Value Objects et Constantes.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : UpdateAppEventSchemaType = AppEventValidation.validateUpdate(data);

    // Extraction et double cast légitimes pour s'aligner sur notre architecture réelle
    this.eventCategory = validated.eventCategory as unknown as AppEventCategory;
    this.idEvent       = new EventId(validated.idAppEvent);
    this.userId        = validated.userId ? new UserId(validated.userId) : null;
    this.eventType     = validated.eventType as unknown as AppEventType;
    this.severity      = (validated.severity ?? 'INFO') as unknown as AppEventSeverity;
    this.message       = validated.message;
    this.metadata      = validated.metadata as Record<string, unknown>;
  }

}
