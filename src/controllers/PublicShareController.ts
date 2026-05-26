// ——— fichier : src/controllers/PublicShareController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';
import      { PublicShareDto     } from '@/dto/share/PublicShareDto';
import type { IPublicShareController } from '@/interfaces/controllers/IPublicShareController';
import type { IShareService      } from '@/interfaces/services/IShareService';
import      { ApiResponseFactory } from '@/utils/ApiResponseFactory';
import      { RequestIdGenerator } from '@/utils/RequestIdGenerator';
import      { ShareValidation    } from '@/validation/zod';

/**
 * 🏛️ Classe PublicShareController
 * ------------------------------
 * Contrôleur d'accès public pour la récupération des pépites partagées via token.
 * Point d'entrée hors-session (Public) convertissant les primitives HTTP en objets sécurisés.
 *
 * @class PublicShareController
 * @implements {IPublicShareController}
 * @author Joël, Gaïa & Co
 */
export class PublicShareController implements IPublicShareController {

  /** 🛡️ Service métier régissant la logique des partages */
  private readonly m_rShareService : IShareService;

  /**
   * Initialise le contrôleur avec ses dépendances injectées (DI).
   *
   * @constructor
   * @param {IShareService} shareService - Logique métier de gestion des partages
   */
  public constructor(shareService: IShareService) {
    this.m_rShareService = shareService;
  }

  /**
   * 🔗 Récupère le contenu d'une Pépite partagée publiquement via son jeton unique.
   * GET /v1/public/shares/:token
   *
   * @param {Request} req - Requête Express
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async getByToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string = RequestIdGenerator.getFromRequest(req);

      // ——— 🛡️ Douane Zod : Interception, validation et purification chirurgicale du token d'URL
      const sToken : string = ShareValidation.validateToken(req.params.token);

      // ——— ⚙️ Exécution de la logique métier sécurisée
      const item = await this.m_rShareService.findItemByToken(sToken);

      res.status(200).json(
        ApiResponseFactory.success(
          'Contenu partagé',
          { item: PublicShareDto.fromItem(item) },
          requestId
        )
      );
    } catch (err) {
      next(err);
    }
  }
}
