// ——— fichier : src/dto/event/CreateEventDto.ts

import { AppEventAction     } from '@/constants/AppEventAction';
import { AppEventCategory   } from '@/constants/AppEventCategory';
import { AppEventSecteur    } from '@/constants/AppEventSecteur';
import { AppEventSeverity   } from '@/constants/AppEventSeverity';
import { UserId, AppEventId } from '@/domain/value-objects/ids';
import { type CreateAppEventSchemaType, AppEventValidation } from '@/validation/zod/AppEventValidation';

/**
 * 📦 Classe CreateEventDto (Version Pure Hexagonale)
 * ---------------------------------------------------
 * Objet de transfert de données pour la création d'un événement d'audit.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 * Armé avec les cailloux de couleur (Value Objects) pour la sécurité nominale.
 *
 * @class CreateEventDto
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class CreateEventDto {

  /** 📂 Caillou de couleur : Catégorie générale de l'événement système */
  public readonly eventCategory : AppEventCategory;

  /** 🔔 Caillou de couleur : Identifiant unique et fort de l'événement */
  public readonly idEvent       : AppEventId;

  /** 👥 Caillou de couleur : Propriétaire rattaché à l'action d'audit */
  public readonly userId        : UserId | null;

  /** 💻 Caillou de couleur : Contexte fonctionnel de l'opération (Char(4)) */
  public readonly eventSecteur  : AppEventSecteur;

  /** ⚙️ Caillou de couleur : Action technique précise exécutée (Char(4)) */
  public readonly eventAction   : AppEventAction;

  /** ⚠️ Caillou de couleur : Niveau de criticité opérationnelle typé */
  public readonly severity      : AppEventSeverity;

  /** 💬 Corps du message ou description descriptive */
  public readonly message       : string | null;

  /** 🎛️ Métadonnées d'infrastructure ou contexte additionnel */
  public readonly metadata      : Record<string, any>;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   * Effectue le scellage nominal immédiat vers nos Value Objects et Constantes.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : CreateAppEventSchemaType = AppEventValidation.validateCreate(data);

    // Cast simples, légitimes et sécurisés par l'amont du .refine() de Zod
    this.eventCategory = validated.eventCategory as unknown as AppEventCategory;
    this.idEvent       = new AppEventId(validated.idAppEvent);
    this.userId        = validated.userId ? new UserId(validated.userId) : null;

    // 🗲 Raccordement V4 : Hydratation étanche depuis les deux propriétés éclatées de Zod
    this.eventSecteur  = validated.eventContext as unknown as AppEventSecteur;
    this.eventAction   = validated.eventAction as unknown as AppEventAction;

    this.severity      = (validated.severity ?? 'INFO') as unknown as AppEventSeverity;
    this.message       = validated.message;
    this.metadata      = validated.metadata as Record<string, any>;
  }

}
