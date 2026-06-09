// ——— fichier : src/controllers/event/AppEventAdminController.ts

import type { NextFunction, Request, Response } from 'express';
import { IAppEventAdminController } from '@/interfaces/controllers/IAppEventAdminController';
import { IAppEventAdminService }    from '@/interfaces/services/IAppEventAdminService';
import { ApiResponseFactory }       from '@/utils/ApiResponseFactory';
import { EventErrorFactory }        from '@/exceptions/EventErrorFactory';
import { AppEventId }               from '@/domain/value-objects/ids';

/**
 * 🎛️ Classe AppEventAdminController 🚨
 * ----------------------------------------------------------------------------
 * Contrôleur HTTP d'interface de surface réservé exclusivement à la supervision.
 * Assure le routage réseau étanche vers le service d'administration de l'audit.
 *
 * @class AppEventAdminController
 * @implements {IAppEventAdminController}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - SRP Clinique)
 * @author Graveuse de Pépites : Gaïa (Au burin, alignée sur le standard V4 de IAppEventAdminService)
 */
export class AppEventAdminController implements IAppEventAdminController {
  /** 🧠 Le port d'accès métier vers le service d'administration de l'audit */
  private readonly m_oAdminService: IAppEventAdminService;

  /**
   * @constructor
   * @param {IAppEventAdminService} p_oAdminService - Le service d'administration de l'audit
   */
  public constructor(p_oAdminService: IAppEventAdminService) {
    this.m_oAdminService = p_oAdminService;
  }

  /**
   * Accesseur interne protégé pour respecter l'encapsulation de l'administration.
   *
   * @private
   * @returns {IAppEventAdminService} Le service d'administration actif
   */
  private get adminService(): IAppEventAdminService {
    return this.m_oAdminService;
  }

  /**
   * 🔍 Extrait un paramètre obligatoire de l'URL Express de manière sécurisée.
   */
  private getRequiredParam(p_oReq: Request, p_sParamName: string): string {
    const l_vParam = p_oReq.params[p_sParamName];
    if (!l_vParam) throw EventErrorFactory.missing();

    return Array.isArray(l_vParam) ? l_vParam[0] : l_vParam;
  }

  /**
   * 🔔 Méthode héritée de l'ancêtre public : Interdite en zone d'administration pure.
   * L'écriture de log direct passe obligatoirement par le contrôleur public.
   */
  public async create(_p_oReq: Request, p_oRes: Response, _p_oNext: NextFunction): Promise<void> {
    p_oRes.status(405).json({ error: 'Opération non autorisée sur le poste-frontière d\'administration.' });
  }

  /** 📊 GET /v1/admin/events/stats */
  public async getStats(_p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      // 🗲 [SOUDURE CHIRURGICALE] Transtypage explicite de l'interface pour garantir la présence de count()
      // Évite les caprices de l'héritage de IBaseEventService sur les types concrets
      const l_oRepoSoute = this.adminService.repository as any;
      const l_nTotalLogs = await l_oRepoSoute.count();

      p_oRes.status(200).json(ApiResponseFactory.success('Statistiques récupérées', { total: l_nTotalLogs }));
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }


  /** 📜 GET /v1/admin/events */
  public async getEvents(p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      const l_nLimit: number  = Number(p_oReq.query.limit) || 50;
      const l_nOffset: number = Number(p_oReq.query.offset) || 0;

      // 🗲 RACCORDÉ V4 : Appel de getAllLogs() exigé nominalement par votre contrat d'administration !
      const l_aEvents = await this.adminService.getAllLogs();

      p_oRes.status(200).json(ApiResponseFactory.success('Journal récupéré', {
        limit: l_nLimit,
        offset: l_nOffset,
        count: l_aEvents.length,
        events: l_aEvents
      }));
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }

  /** 🔎 GET /v1/admin/events/:id */
  public async getById(p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      const l_sIdBrut: string          = this.getRequiredParam(p_oReq, 'id');
      const l_axCibleEventId: AppEventId = new AppEventId(l_sIdBrut);

      // 🗲 RACCORDÉ V4 : Appel de getById() nominal du service d'administration
      const l_oEvent = await this.adminService.getById(l_axCibleEventId);
      p_oRes.status(200).json(ApiResponseFactory.success('Détail récupéré', { event: l_oEvent }));
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }

  /** 🧹 POST /v1/admin/events/cleanup */
  public async cleanup(p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      const l_nDays: number = Number(p_oReq.body.days) || 180;
      const l_dCutoffDate = new Date();
      l_dCutoffDate.setDate(l_dCutoffDate.getDate() - l_nDays);

      // 🗲 RACCORDÉ V4 : Appel de purgeOlderThan() nominal du service d'administration
      const l_nLinesPurgated = await this.adminService.purgeOlderThan(l_dCutoffDate);
      p_oRes.status(200).json(ApiResponseFactory.success('Purge effectuée', { deletedCount: l_nLinesPurgated }));
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }
}
