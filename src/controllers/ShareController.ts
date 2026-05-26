// ——— fichier : src/controllers/ShareController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';
import      { CreateShareDto     } from '@/dto/share/CreateShareDto';
import      { ResponseShareDto   } from '@/dto/share/ResponseShareDto';
import      { UpdateShareDto     } from '@/dto/share/UpdateShareDto';
import      { UserErrorFactory   } from '@/exceptions/UserErrorFactory';
import type { IShareController   } from '@/interfaces/controllers/IShareController';
import type { IShareService      } from '@/interfaces/services/IShareService';
import      { ApiResponseFactory } from '@/utils/ApiResponseFactory';
import      { RequestIdGenerator } from '@/utils/RequestIdGenerator';
import      { UserId,
              ShareId            } from '@/domain/value-objects/IdMetier';
import      { ShareValidation    } from '@/validation/zod';

/**
 * 🏛️ Classe ShareController
 * -------------------------
 * Contrôleur d'aiguillage pour la gestion sécurisée des liens de partages.
 *
 * @class ShareController
 * @implements {IShareController}
 * @author Joël, Gaïa & Co
 */
export class ShareController implements IShareController {

  /** 🛡️ Service métier régissant la logique des partages (Variable de stockage) */
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
   * 🛡️ Accesseur privé vers le service des partages.
      *
   * @private
   * @returns {IShareService} L'instance du service métier.
   */
  private get shareService(): IShareService {
    return this.m_rShareService;
  }

  /**
   * 🛡️ Extrait et sécurise l'identifiant de l'utilisateur depuis la session Express.
   *
   * @private
   * @param {Request} req - L'objet de requête Express
   * @throws {UserErrorFactory} Si les identifiants de session sont invalides
   * @returns {UserId} Le Value Object d'identification utilisateur
   */
  private getUserId(req: Request): UserId {
    const sIdBrut = req.user?.id;
    if (!sIdBrut) {
      throw UserErrorFactory.invalidCredentials();
    }
    return new UserId(sIdBrut);
  }

  /**
   * 🔍 Extrait un paramètre obligatoire de l'URL Express ou lève une exception.
   *
   * @private
   * @param {Request} req - L'objet de requête Express
   * @param {string} name - Le nom du paramètre d'URL attendu (ex: 'id')
   * @throws {Error} Si le paramètre est manquant ou vide
   * @returns {string} La chaîne brute purifiée
   */
  private getRequiredParam(req: Request, name: string): string {
    const value = req.params[name];
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Path parameter "${name}" is missing or invalid`);
    }
    return value.trim();
  }

  /**
   * 🌐 Construit l'URL absolue de l'API à partir du contexte de la requête HTTP.
   *
   * @private
   * @param {Request} req - L'objet de requête Express
   * @returns {string} L'URL de base absolue
   */
  private buildBaseUrl(req: Request): string {
    return `${req.protocol}://${req.get('host') ?? 'localhost'}`;
  }

  /**
   * 📜 Liste l'intégralité des partages détenus par l'utilisateur connecté.
   * GET /v1/shares
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId = this.getUserId(req);
      const baseUrl   : string = this.buildBaseUrl(req);

      // ——— Utilisation de l'accesseur propre au lieu du membre brut
      const shares = await this.shareService.listByUser(userId);

      res.status(200).json(
        ApiResponseFactory.success(
          'Liste des partages',
          { shares: ResponseShareDto.fromShares(shares, baseUrl) },
          requestId
        )
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🔗 Crée un nouveau lien de partage sécurisé pour une pépite donnée.
   * POST /v1/shares
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId = this.getUserId(req);
      const baseUrl   : string = this.buildBaseUrl(req);

      const validatedBody = ShareValidation.validateCreate(req.body);
      const dto           = new CreateShareDto(validatedBody);

      // ——— Utilisation de l'accesseur propre
      const share = await this.shareService.create(userId, dto);

      res.status(201).json(
        ApiResponseFactory.success(
          'Partage créé',
          { share: ResponseShareDto.fromShare(share, baseUrl) },
          requestId
        )
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🔎 Récupère le détail complet d'un partage unique via son identifiant.
   * GET /v1/shares/:id
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId    : string  = RequestIdGenerator.getFromRequest(req);
      const userId       : UserId  = this.getUserId(req);
      const baseUrl      : string  = this.buildBaseUrl(req);
      const sIdBrut      : string  = this.getRequiredParam(req, 'id');
      const cibleShareId : ShareId = new ShareId(sIdBrut);

      // ——— Utilisation de l'accesseur propre
      const share = await this.shareService.findById(userId, cibleShareId);

      res.status(200).json(
        ApiResponseFactory.success(
          'Partage récupéré',
          { share: ResponseShareDto.fromShare(share, baseUrl) },
          requestId
        )
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🎛️ Met à jour les restrictions ou le destinataire d'un partage existant.
   * PUT /v1/shares/:id
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId    : string          = RequestIdGenerator.getFromRequest(req);
      const userId       : UserId          = this.getUserId(req);
      const baseUrl      : string          = this.buildBaseUrl(req);
      const sIdBrut      : string          = this.getRequiredParam(req, 'id');
      const cibleShareId : ShareId         = new ShareId(sIdBrut);
      const validatedBody                  = ShareValidation.validateUpdate(req.body);
      const dto          : UpdateShareDto = new UpdateShareDto(validatedBody);

      // ——— Utilisation de l'accesseur propre
      const share = await this.shareService.update(userId, cibleShareId, dto);

      res.status(200).json(
        ApiResponseFactory.success(
          'Partage mis à jour',
          { share: ResponseShareDto.fromShare(share, baseUrl) },
          requestId
        )
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🗑️ Révoque définitivement un lien de partage (Suppression destructive).
   * DELETE /v1/shares/:id
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId    : string  = RequestIdGenerator.getFromRequest(req);
      const userId       : UserId  = this.getUserId(req);
      const sIdBrut      : string  = this.getRequiredParam(req, 'id');
      const cibleShareId : ShareId = new ShareId(sIdBrut);

      await this.shareService.delete(userId, cibleShareId);

      res.status(200).json(
        ApiResponseFactory.success('Partage révoqué', undefined, requestId)
      );
    } catch (err) {
      next(err);
    }
  }
}
