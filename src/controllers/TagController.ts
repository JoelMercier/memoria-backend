// ——— fichier : src/controllers/TagController.ts

import type { NextFunction,
              Request,
              Response       } from 'express';
import { UserId,
         TagId               } from '@/domain/value-objects/ids';
import { CreateTagDto        } from '@/dto/tag/CreateTagDto';
import { ResponseTagDto      } from '@/dto/tag/ResponseTagDto';
import { UpdateTagDto        } from '@/dto/tag/UpdateTagDto';
import { UserErrorFactory    } from '@/exceptions/UserErrorFactory';
import type { ITagController } from '@/interfaces/controllers/ITagController';
import type { ITagService    } from '@/interfaces/services/ITagService';
import { ApiResponseFactory  } from '@/utils/ApiResponseFactory';
import { RequestIdGenerator  } from '@/utils/RequestIdGenerator';
import OrdreTriEnum from '@/constants/OrdreTriEnum';

/**
 * 🎛️ Classe TagController
 * -----------------------
 * Contrôleur HTTP Express pour l'orchestration des étiquettes (Tags).
 * Assure la transition étanche entre les primitives HTTP et l'armure nominale du domaine.
 *
 * @class TagController
 * @implements {ITagController}
 * @author Joël, Gaïa & Co
 */
export class TagController implements ITagController {

  /** 🧠 Service applicatif des étiquettes */
  private readonly m_rTagService : ITagService;

  /**
   * Initialise le contrôleur avec son service métier dédié (DI).
   *
   * @constructor
   * @param {ITagService} tagService - Le service des étiquettes
   */
  public constructor(tagService : ITagService) {
    this.m_rTagService = tagService;
  }

  /**
   * 🛡️ Accesseur privé vers le service métier.
   * Eliminazione dei tiri diretti sulle variabili m_.
   *
   * @private
   * @returns {ITagService} L'instance du service.
   */
  private get tagService(): ITagService {
    return this.m_rTagService;
  }


  /**
   * 🔏 Extrait et sécurise l'identifiant utilisateur depuis la session HTTP Express.
   * Effectue le transtypage d'infrastructure vers le type nominal du domaine.
   *
   * @private
   * @param {Request} req - La requête HTTP
   * @throws {UserErrorFactory} Si l'utilisateur n'est pas correctement authentifié
   * @returns {UserId} L'identifiant immuable fortement typé
   */
  private getUserId(req: Request): UserId {
    const id = req.user?.id;
    if (!id) {
      throw UserErrorFactory.invalidCredentials();
    }
    // 🪓 ALIGNEMENT INDUSTRIEL : Si c'est déjà un UserId, on le retourne, sinon on le forge
    return id instanceof UserId ? id : new UserId(id as unknown as string);
  }

  /**
   * 🛤️ Extrait et valide un paramètre obligatoire de la route HTTP (Path Parameter).
   *
   * @private
   * @param {Request} req - La requête HTTP
   * @param {string} name - Le nom du paramètre (ex: 'id')
   * @throws {Error} Si le paramètre est absent, altéré ou vide
   * @returns {string} Le paramètre extrait sous forme de chaîne purifiée
   */
  private getRequiredParam(req: Request, name: string): string {
    const value : string | string[] | undefined = req.params[name];
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(`Path parameter "${name}" is missing or invalid`);
    }
    return value;
  }
  /**
   * 📜 GET /tags
   * Récupère la collection filtrée, ordonnée et obligatoirement paginée des étiquettes détenues par l'appelant.
   * [SCELLÉ EXPOSITION V4] Extraction des critères réseau et déballage du français d'élite.
   *
   * @public
   * @async
   * @param {Request} req - Requête HTTP Express
   * @param {Response} res - Réponse HTTP Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId = this.getUserId(req);

      // 🗲 [INJECTÉ V4] Extraction et normalisation des curseurs de bridage depuis la Query String
      const { OrdreTriEnum } = await import('@/constants/OrdreTriEnum');
      const l_oOptions = {
        NbLignes:   req.query.NbLignes   ? Number(req.query.NbLignes)   : 50,
        LigneDebut:  req.query.LigneDebut ? Number(req.query.LigneDebut) : 0,
        ColonneTri:  (req.query.ColonneTri as string) || 'tgName',
        OrdreAff:    OrdreTriEnum.DeCode<OrdreTriEnum>((req.query.OrdreAff as string) || 'ASC')
      };

      // 🪓 [RÉPARÉ TS2554] Transmission impérative du bouclier anti-fuite de soute
      const l_oPackEtat = await this.tagService.listByUser(userId, l_oOptions);

      res
        .status(200)
        .json(
          ApiResponseFactory.success(
            'Liste des tags',
            // 🪓 [RÉPARÉ TS2345] On extrait uniquement le tableau d'entités vivantes de l'enveloppe d'état !
            { tags: ResponseTagDto.fromTags(l_oPackEtat.Lignes) },
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🎯 POST /tags
   * Crée et persiste une nouvelle étiquette métier pour l'utilisateur connecté.
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string       = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId       = this.getUserId(req);
      const dto       : CreateTagDto = new CreateTagDto(req.body);

      const tag = await this.tagService.create(userId, dto);

      res
        .status(201)
        .json(
          ApiResponseFactory.success(
            'Tag créé',
            { tag: ResponseTagDto.fromTag(tag) },
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🔎 GET /tags/:id
   * Extrait un tag spécifique après vérification bilatérale des privilèges.
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId = this.getUserId(req);
      const sIdBrut   : string = this.getRequiredParam(req, 'id');
      const tagId     : TagId  = new TagId(sIdBrut);

      const tag = await this.tagService.findById(userId, tagId);

      res
        .status(200)
        .json(
          ApiResponseFactory.success(
            'Tag récupéré',
            { tag: ResponseTagDto.fromTag(tag) },
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🎛️ PUT /tags/:id
   * Met à jour les propriétés configurables d'un tag existant.
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string       = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId       = this.getUserId(req);
      const sIdBrut   : string       = this.getRequiredParam(req, 'id');
      const tagId     : TagId        = new TagId(sIdBrut);
      const dto       : UpdateTagDto = new UpdateTagDto(req.body);

      const tag = await this.tagService.update(userId, tagId, dto);

      res
        .status(200)
        .json(
          ApiResponseFactory.success(
            'Tag mis à jour',
            { tag: ResponseTagDto.fromTag(tag) },
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🗑️ DELETE /tags/:id
   * Supprime définitivement l'étiquette spécifiée de l'infrastructure.
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId = this.getUserId(req);
      const sIdBrut   : string = this.getRequiredParam(req, 'id');
      const tagId     : TagId  = new TagId(sIdBrut);

      await this.tagService.delete(userId, tagId);

      res
        .status(200)
        .json(ApiResponseFactory.success('Tag supprimé', undefined, requestId));
    } catch (err) {
      next(err);
    }
  }
}
