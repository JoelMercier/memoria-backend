// ——— fichier : src/dto/event/CreateEventDto.ts

import { AppEventAction     } from '@/constants/Actions';
import { AppEventCategory   } from '@/constants/Categories';
import { AppEventSecteur    } from '@/constants/Secteurs';
import { AppEventSeverity   } from '@/constants/Severites';
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
  public readonly message       : string;

  /** 🎛️ Métadonnées d'infrastructure ou contexte additionnel */
  public readonly metadata      : Record<string, any>;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   * Effectue le scellage nominal immédiat vers nos Value Objects et Constantes.
   *
   * @constructor
   * @param {unknown} data - Charge utile brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const l_oRawBody : Record<string, unknown> = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const validated  : CreateAppEventSchemaType = AppEventValidation.validateCreate(l_oRawBody);

    this.idEvent       = new AppEventId(validated.idAppEvent);

    this.eventCategory = AppEventCategory.fromSql(validated.eventCategory);
    this.eventSecteur  = AppEventSecteur .fromSql(validated.eventSecteur);
    this.eventAction   = AppEventAction  .fromSql(validated.eventAction );
    this.severity      = AppEventSeverity.fromSql(validated.severity ?? 'INFO');

    this.userId        = validated.userId ? new UserId(validated.userId) : null;
    this.message       = validated.message;
    this.metadata      = validated.metadata as Record<string, any>;
  }

}