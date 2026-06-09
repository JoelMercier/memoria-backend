// ——— fichier : src\controllers\event\AppEventController.ts

import type { NextFunction, Request, Response } from 'express';
import { IAppEventController } from '@/interfaces/controllers/IAppEventController';
import { IAppEventService }    from '@/interfaces/services/IAppEventService';
import { ApiResponseFactory }  from '@/utils/ApiResponseFactory';
import { EventErrorFactory }   from '@/exceptions/EventErrorFactory';
import { CreateEventDto }      from '@/dto/event/CreateEventDto';
import { UserId }              from '@/domain/value-objects/ids';

/**
 * 🏛️ Classe AppEventController 🛡️
 * ----------------------------------------------------------------------------
 * Contrôleur d'exploitation publique et courante des logs (Append-Only).
 * Poste-frontière standard convertissant les types HTTP bruts pour l'Hexagone.
 *
 * @class AppEventController
 * @implements {IAppEventController}
 * @author Directrice du Silicium : Joël (MANIAC de la Séparation des Pouvoirs)
 * @author Graveuse de Pépites : Gaïa (Au burin, redressée sur la Charte SOLID)
 */
export class AppEventController implements IAppEventController {
  /** 🧠 Le service d'exploitation ordinaire (Append-Only) */
  private readonly m_oEventService: IAppEventService;

  /**
   * Initialise le contrôleur d'exploitation standard.
   *
   * @constructor
   * @param {IAppEventService} p_oEventService - Le service d'exploitation de base
   */
  public constructor(p_oEventService: IAppEventService) {
    this.m_oEventService = p_oEventService;
  }

  /**
   * Accesseur interne protégé pour respecter l'encapsulation de l'exploitation.
   *
   * @private
   * @returns {IAppEventService} Le service d'exploitation actif
   */
  private get eventService(): IAppEventService {
    return this.m_oEventService;
  }

  /**
   * 🛡️ Extrait et sécurise l'identifiant de l'utilisateur depuis la session Express.
   */
  private getUserId(p_oReq: Request): UserId {
    const l_xId = p_oReq.user?.id;
    if (!l_xId) throw EventErrorFactory.missing();
    return l_xId instanceof UserId ? l_xId : new UserId(l_xId as unknown as string);
  }

  /**
   * 🔔 Enregistre un nouvel événement dans le journal système.
   * POST /v1/events
   *
   * @public
   * @async
   * @param {Request} p_oReq - Requête HTTP Express
   * @param {Response} p_oRes - Réponse HTTP Express
   * @param {NextFunction} p_oNext - Pipeline Express
   * @returns {Promise<void>}
   */
  /**
   * 🔔 Enregistre un nouvel événement dans le journal système.
   * POST /v1/events
   */
  public async create(p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      const l_axUserId: UserId     = this.getUserId(p_oReq);
      const l_oDto: CreateEventDto = new CreateEventDto(p_oReq.body);

      // 🗲 [RÉPARÉ] Utilisation stricte de la fabrique existante de soute : missing() !
      if (!l_oDto.message || l_oDto.message.trim().length === 0) {
        throw EventErrorFactory.missing();
      }

      // De-nullification sémantique pour le compilateur TypeScript
      const l_oPayloadSecurise = {
        userId: l_axUserId,
        eventCategory: l_oDto.eventCategory,
        eventSecteur: l_oDto.eventSecteur,
        eventAction: l_oDto.eventAction,
        severity: l_oDto.severity,
        message: l_oDto.message.trim(),
        metadata: l_oDto.metadata
      };

      const l_oEvent = await this.eventService.log(l_oPayloadSecurise);

      p_oRes.status(201).json(
        ApiResponseFactory.success('Événement enregistré avec succès', { event: l_oEvent, actor: l_axUserId })
      );
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }
}
