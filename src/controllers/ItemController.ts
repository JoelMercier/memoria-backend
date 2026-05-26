// ——— fichier : src/controllers/ItemController.ts

import type { NextFunction, Request, Response } from 'express';
import type { UserId } from '@/domain/value-objects/IdMetier';
import { CreateItemDto } from '@/dto/item/CreateItemDto';
import { UpdateItemDto } from '@/dto/item/UpdateItemDto';
import { ResponseItemDto } from '@/dto/item/ResponseItemDto';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import type { IItemController } from '@/interfaces/controllers/IItemController';
import type { IItemService } from '@/interfaces/services/IItemService';
import { ApiResponseFactory } from '@/utils/ApiResponseFactory';
import { RequestIdGenerator } from '@/utils/RequestIdGenerator';

/**
 * 🏛️ Classe ItemController
 * ------------------------
 * Contrôleur d'aiguillage pour le cycle de vie des pépites (Items).
 * Gère l'interception des flux HTTP, le décodage et la sécurisation des frontières.
 *
 * @class ItemController
 * @implements {IItemController}
 * @author Joël, Gaïa & Co
 */
export class ItemController implements IItemController {
  /** 🛡️ Service gérant la logique métier des pépites */
  private readonly m_rItemService: IItemService;

  /**
   * Initialise le contrôleur avec son service dédié (DI).
   *
   * @constructor
   * @param {IItemService} itemService - Logique métier des items
   */
  public constructor(itemService: IItemService) {
    this.m_rItemService = itemService;
  }

  /**
   * 📜 Extrait la collection exhaustive ou filtrée des pépites de l'acteur connecté.
   * GET /v1/items
   */
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);
      const userMetierId: UserId | undefined = req.user?.id;

      if (!userMetierId) {
        throw UserErrorFactory.invalidCredentials();
      }
      // Extraction des critères de pagination et filtres optionnels avec protection contre les objets complexes
      const options = {
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
        contentType: typeof req.query.contentType === 'string' ? req.query.contentType : undefined,
        search: typeof req.query.search === 'string' ? req.query.search : undefined
      };

      const result = await this.m_rItemService.listByUser(userMetierId.valeur, options);

      res.status(200).json(
        ApiResponseFactory.paginated(
          'Liste des pépites récupérée',
          result.items.map((item) => ResponseItemDto.fromItem(item)),
          options.offset && options.limit ? Math.floor(options.offset / options.limit) + 1 : 1,
          options.limit ?? 50,
          result.total,
          requestId
        )
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🔔 Valide le payload et scelle la création d'une nouvelle pépite métier.
   * POST /v1/items
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);
      const userMetierId: UserId | undefined = req.user?.id;

      if (!userMetierId) {
        throw UserErrorFactory.invalidCredentials();
      }

      const dto = new CreateItemDto(req.body);
      const item = await this.m_rItemService.create(userMetierId.valeur, dto);

      res
        .status(201)
        .json(
          ApiResponseFactory.success(
            'Pépite créée avec succès',
            ResponseItemDto.fromItem(item),
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🔎 Récupère le détail complet d'une pépite spécifique via son identifiant unique.
   * GET /v1/items/:id
   */
  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);
      const userMetierId: UserId | undefined = req.user?.id;

      if (!userMetierId) {
        throw UserErrorFactory.invalidCredentials();
      }

      // 🪓 Transtypage défensif contre la versatilité des types Express de req.params
      const sParamsId: string = String(req.params.id);

      const item = await this.m_rItemService.findById(userMetierId.valeur, sParamsId);

      res
        .status(200)
        .json(
          ApiResponseFactory.success('Pépite récupérée', ResponseItemDto.fromItem(item), requestId)
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🎛️ Applique une modification partielle ou totale sur les attributs de la pépite.
   * PUT /v1/items/:id
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);
      const userMetierId: UserId | undefined = req.user?.id;

      if (!userMetierId) {
        throw UserErrorFactory.invalidCredentials();
      }

      // 🪓 Transtypage défensif contre la versatilité des types Express de req.params
      const sParamsId: string = String(req.params.id);

      const dto = new UpdateItemDto(req.body);
      const item = await this.m_rItemService.update(userMetierId.valeur, sParamsId, dto);

      res
        .status(200)
        .json(
          ApiResponseFactory.success(
            'Pépite mise à jour avec succès',
            ResponseItemDto.fromItem(item),
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🗑️ Supprime de manière destructive une pépite de l'espace de stockage.
   * DELETE /v1/items/:id
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);
      const userMetierId: UserId | undefined = req.user?.id;

      if (!userMetierId) {
        throw UserErrorFactory.invalidCredentials();
      }

      // 🪓 Transtypage défensif contre la versatilité des types Express de req.params
      const sParamsId: string = String(req.params.id);

      await this.m_rItemService.delete(userMetierId.valeur, sParamsId);

      res
        .status(200)
        .json(ApiResponseFactory.success('Pépite supprimée avec succès', undefined, requestId));
    } catch (err) {
      next(err);
    }
  }
}
