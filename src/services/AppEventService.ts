// ——— fichier : src/services/AppEventService.ts

import type { ItemId, ShareId, UserId } from '@/domain/value-objects/ids';
import type { IAppEventService        } from '@/interfaces/services/IAppEventService';
import type { JsonLégitime            } from '@/types/shared/JsonLégitime';
import type { AppEventRepository      } from '@/infrastructure/repositories/PostGres/AppEventRepository';
import type { AppEvent                } from '@/entities/AppEvent';

import { Categorie } from '@/constants/Categories';
import { Severite  } from '@/constants/Severites';
import { Secteur   } from '@/constants/Secteurs';
import { Action    } from '@/constants/Actions';
import { IdForge   } from '@/domain/utils/IdForge';
import { EventId   } from '@/domain/value-objects/ids';

/**
 * 🏛️ Classe AppEventService
 * -------------------------
 * Service transverse automatique de journalisation et d'audit applicatif.
 */
export class AppEventService implements IAppEventService {
  /** 🗄️ Dépôt d'infrastructure d'audit unique injecté par la Forge */
  private readonly m_oAppEventRepository : AppEventRepository;

  /**
   * Initialise le service d'audit avec ses dépendances d'infrastructure unifiées.
   */
  public constructor(p_oAppEventRepository: AppEventRepository) {
    this.m_oAppEventRepository = p_oAppEventRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   */
  public get repository() : AppEventRepository {
    return this.m_oAppEventRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat historique IBaseEventService.
   */
  public get eventRepository() : AppEventRepository {
    return this.m_oAppEventRepository;
  }

  /**
   * 🔔 Log générique interne du système.
   */
  public async log(p_oData: {
    userId?        : UserId | null;
    eventCategorie : Categorie;
    eventSecteur   : Secteur;
    eventAction    : Action;
    eventSeverite  : Severite;
    message        : string;
    metadata?      : JsonLégitime;                                    //-- [SCELLÉ V4] Connexion sur l'armure geek récursive [Mémoria] !
  }) : Promise<AppEvent> {

    //-- [RÉPARÉ V4] Alignement nominal strict sur le contrat épuré IAppEventData du Domaine [Mémoria]
    return await this.repository.create({
      idEvent   : new EventId(IdForge.genererUuidV7()),               //-- Propriété pure du Domaine [Mémoria].
      userId    : p_oData.userId ?? null,
      categorie : p_oData.eventCategorie,
      severite  : p_oData.eventSeverite || Severite.INFO,
      secteur   : p_oData.eventSecteur,
      action    : p_oData.eventAction,
      message   : p_oData.message,
      metadata  : p_oData.metadata || {},
      createdAt : new Date()
    });
  }

  /**
   * 🔐 Traçabilité d'une connexion réussie au sein du module d'authentification.
   */
  public async authSuccess(p_axUserId: UserId) : Promise<AppEvent> {
    return await this.log({
      userId         : p_axUserId,                                    //-- Aligné au burin [Mémoria].
      eventCategorie : Categorie.SECU,
      eventSecteur   : Secteur.AUTH,
      eventAction    : Action.CONN,
      eventSeverite  : Severite.INFO,
      message        : 'Connexion réussie'
    });
  }

  /**
   * ⚠️ Traçabilité d'un échec d'authentification (Tentative de brute-force).
   */
  public async authFailure(p_sEmail: string) : Promise<AppEvent> {
    return await this.log({
      eventCategorie : Categorie.SECU,
      eventSecteur   : Secteur.AUTH,
      eventAction    : Action.ECHE,
      eventSeverite  : Severite.WARN,
      message        : 'Échec de connexion',
      metadata       : { email: p_sEmail }
    });
  }

  /**
   * 📦 Traçabilité de création d'une nouvelle ressource (Pépite).
   */
  public async itemCreated(p_axUserId: UserId, p_axItemId: ItemId) : Promise<AppEvent> {
    return await this.log({
      userId         : p_axUserId,
      eventCategorie : Categorie.ANAL,
      eventSecteur   : Secteur.PEPI,
      eventAction    : Action.CREA,
      eventSeverite  : Severite.INFO,
      message        : 'Pépite créée',
      metadata       : { itemId: p_axItemId.valeur }
    });
  }

  /**
   * 🔗 Traçabilité de génération d'un lien de partage sécurisé.
   */
  public async shareCreated(p_axUserId: UserId, p_axShareId: ShareId) : Promise<AppEvent> {
    return await this.log({
      userId         : p_axUserId,
      eventCategorie : Categorie.ANAL,
      eventSecteur   : Secteur.PEPI,
      eventAction    : Action.PART,
      eventSeverite  : Severite.INFO,
      message        : 'Pépite partagée',
      metadata       : { shareId: p_axShareId.valeur }
    });
  }
}
