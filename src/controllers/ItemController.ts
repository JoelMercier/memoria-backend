// ——— fichier : src/controllers/ItemController.ts

import type { NextFunction, Request, Response } from 'express';
import type { IItemController } from '@/interfaces/controllers/IItemController';
import type { IItemService    } from '@/interfaces/services/IItemService';

import { UserId, ContentTypeId } from '@/domain/value-objects/ids';
import { CreateItemDto         } from '@/dto/item/CreateItemDto';
import { UpdateItemDto         } from '@/dto/item/UpdateItemDto';
import { ResponseItemDto       } from '@/dto/item/ResponseItemDto';
import { UserErrorFactory      } from '@/exceptions/UserErrorFactory';
import { ApiResponseFactory    } from '@/utils/ApiResponseFactory';
import { RequestIdGenerator    } from '@/utils/RequestIdGenerator';
import OrdreTriEnum from '@/constants/OrdreTriEnum';
import { IItemRepositoryListOptions } from '@/interfaces/repositories/PostGres/IItemRepository';


/**
 * 🏛️ Classe ItemController 📦
 * ----------------------------------------------------------------------------
 * Contrôleur d'aiguillage pour le cycle de vie des pépites (Items).
 * Gère l'interception des flux HTTP, le décodage et la sécurisation des frontières.
 *
 * @class ItemController
 * @implements {IItemController}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Anti-Bâclage)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur le standard V4)
 */
export class ItemController implements IItemController {
  /** 🛡️ Service gérant la logique métier des pépites */
  private readonly m_rItemService: IItemService;

  /**
   * Initialise le contrôleur avec son service dédié (DI).
   *
   * @constructor
   * @param {IItemService} p_oItemService - Logique métier des items
   */
  public constructor(p_oItemService: IItemService) {
    this.m_rItemService = p_oItemService;
  }

  /**
   * Accesseur privé interne pour respecter l'encapsulation de la soute.
   *
   * @private
   * @returns {IItemService} Le service des pépites actif
   */
  private get itemService(): IItemService {
    return this.m_rItemService;
  }

  /**
   * 📜 Extrait la collection filtrée et paginée des pépites de l'acteur connecté.
   * GET /v1/items
   */
  public async list(p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      const l_sRequestId: string = RequestIdGenerator.getFromRequest(p_oReq);
      const l_axUserId: UserId | undefined = p_oReq.user?.id;

      if (!l_axUserId) {
        throw UserErrorFactory.invalidCredentials();
      }

      // Application immédiate de vos variables sacrées de contrôle Choupy
      const l_nNbLignes: number   = p_oReq.query.limit ? Number(p_oReq.query.limit) : 50;
      const l_nLigneDebut: number = p_oReq.query.offset ? Number(p_oReq.query.offset) : 0;

      const l_oOptions: IItemRepositoryListOptions = {
        NbLignes      : l_nNbLignes,
        LigneDebut    : l_nLigneDebut,
        contentTypeId : typeof p_oReq.query.contentType === 'string' ? new ContentTypeId(p_oReq.query.contentType) : undefined,
        MotsCles      : typeof p_oReq.query.search      === 'string' ? p_oReq.query.search : undefined,
        ColonneTri    : typeof p_oReq.query.tri         === 'string' ? p_oReq.query.tri : '',
        OrdreAff      : OrdreTriEnum.fromSql(typeof p_oReq.query.ordreAff === 'string' ? p_oReq.query.ordreAff : ''),
      };

      const l_oResult = await this.itemService.listByUser(l_axUserId.valeur, l_oOptions);

      p_oRes.status(200).json(
        ApiResponseFactory.paginated(
          'Liste des pépites récupérée',
          l_oResult.Lignes.map((l_oItem) => ResponseItemDto.fromItem(l_oItem)),
          l_nLigneDebut && l_nNbLignes ? Math.floor(l_nLigneDebut / l_nNbLignes) + 1 : 1,
          l_nNbLignes,
          l_oResult.NbLignesTotal,
          l_sRequestId
        )
      );
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }

  /**
   * 🔔 Valide le payload et scelle la création d'une nouvelle pépite métier.
   * POST /v1/items
   */
  public async create(p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      const l_sRequestId: string = RequestIdGenerator.getFromRequest(p_oReq);
      const l_axUserId: UserId | undefined = p_oReq.user?.id;

      if (!l_axUserId) {
        throw UserErrorFactory.invalidCredentials();
      }

      const l_oDto = new CreateItemDto(p_oReq.body);
      // 🗲 [RÉPARÉ TS2345] Transtypage en .valeur pour satisfaire la signature du service
      const l_oItem = await this.itemService.create(l_axUserId.valeur, l_oDto);

      p_oRes.status(201).json(
        ApiResponseFactory.success(
          'Pépite créée avec succès',
          ResponseItemDto.fromItem(l_oItem),
          l_sRequestId
        )
      );
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }

  /**
   * 🔎 Récupère le détail complet d'une pépite spécifique via son identifiant unique.
   * GET /v1/items/:id
   */
  public async findById(p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      const l_sRequestId: string = RequestIdGenerator.getFromRequest(p_oReq);
      const l_axUserId: UserId | undefined = p_oReq.user?.id;

      if (!l_axUserId) {
        throw UserErrorFactory.invalidCredentials();
      }

      const l_sParamsId: string = String(p_oReq.params.id);
      // 🗲 [RÉPARÉ TS2345] Extraction de la chaîne nominale par .valeur
      const l_oItem = await this.itemService.findById(l_axUserId.valeur, l_sParamsId);

      p_oRes.status(200).json(
        ApiResponseFactory.success('Pépite récupérée', ResponseItemDto.fromItem(l_oItem), l_sRequestId)
      );
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }

  /**
   * 🎛️ Applique une modification partielle ou totale sur les attributs de la pépite.
   * PUT /v1/items/:id
   */
  public async update(p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      const l_sRequestId: string = RequestIdGenerator.getFromRequest(p_oReq);
      const l_axUserId: UserId | undefined = p_oReq.user?.id;

      if (!l_axUserId) {
        throw UserErrorFactory.invalidCredentials();
      }

      const l_sParamsId: string = String(p_oReq.params.id);
      const l_oDto = new UpdateItemDto(p_oReq.body);
      // 🗲 [RÉPARÉ TS2345] Transtypage en .valeur pour la couche service
      const l_oItem = await this.itemService.update(l_axUserId.valeur, l_sParamsId, l_oDto);

      p_oRes.status(200).json(
        ApiResponseFactory.success(
          'Pépite mise à jour avec succès',
          ResponseItemDto.fromItem(l_oItem),
          l_sRequestId
        )
      );
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }

  /**
   * 🗑️ Supprime de manière destructive une pépite de l'espace de stockage.
   * DELETE /v1/items/:id
   */
  public async delete(p_oReq: Request, p_oRes: Response, p_oNext: NextFunction): Promise<void> {
    try {
      const l_sRequestId: string = RequestIdGenerator.getFromRequest(p_oReq);
      const l_axUserId: UserId | undefined = p_oReq.user?.id;

      if (!l_axUserId) {
        throw UserErrorFactory.invalidCredentials();
      }

      const l_sParamsId: string = String(p_oReq.params.id);

      await this.itemService.delete(l_axUserId.valeur, l_sParamsId);

      p_oRes.status(200).json(ApiResponseFactory.success('Pépite supprimée avec succès', undefined, l_sRequestId));
    } catch (l_oError) {
      p_oNext(l_oError);
    }
  }
}
