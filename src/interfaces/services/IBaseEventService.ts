// ——— fichier : src/interfaces/services/IBaseEventService.ts

import type { AppEvent            } from '@/entities/AppEvent';
import type { EventId             } from '@/domain/value-objects/ids';
import type { IAppEventRepository } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IAppEventData       } from '@/interfaces/entities/event/IAppEventData'; //-- [RÉPARÉ V4] Connexion directe Domaine sans "ae" !
import type { IBaseService        } from '@/interfaces/services/IBaseService';        //-- [RÉPARÉ V4] "import type" obligatoire !

/**
 * 🏛️ Interface IBaseEventService 🛡️
 * ----------------------------------------------------------------------------
 * Contrat racine centralisant l'accès à l'infrastructure d'audit de la Forge.
 */
export interface IBaseEventService extends IBaseService<AppEvent, IAppEventData, EventId, IAppEventRepository> {
  /**
   * Accesseur unique et immuable vers le dépôt d'infrastructure d'audit.
   *
   * @returns {IAppEventRepository} Le dépôt d'infrastructure configuré
   */
  get repository() : IAppEventRepository;
}
