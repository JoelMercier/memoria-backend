// ——— fichier : src/controllers/AuthController.ts

import type { NextFunction, Request, Response } from 'express';
import { LoggerSingleton } from '@/config/LoggerSingleton';
import { CreateUserDto } from '@/dto/user/CreateUserDto';
import { LoginDto } from '@/dto/user/auth/LoginDto';
import { RefreshTokenDto } from '@/dto/user/auth/RefreshTokenDto';
import { ResponseUserDto } from '@/dto/user/ResponseUserDto';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import type { IAuthController } from '@/interfaces/controllers/IAuthController';
import type { IUserRepository } from '@/interfaces/repositories/PostGres/IUserRepository';
import type { IAuthService } from '@/interfaces/services/IAuthService';
import { ApiResponseFactory } from '@/utils/ApiResponseFactory';
import { RequestIdGenerator } from '@/utils/RequestIdGenerator';
import { UserId } from '@/domain/value-objects/ids';

/**
 * 🏛️ Classe AuthController
 * ------------------------
 * Contrôleur d'aiguillage pour les flux d'authentification et de session.
 * Agit comme poste de douane en convertissant les payloads HTTP en objets typés.
 *
 * @class AuthController
 * @implements {IAuthController}
 * @author Joël, Gaïa & Co
 */
export class AuthController implements IAuthController {
  /** 🔔 Service de journalisation unifié */
  private readonly m_rLogger = LoggerSingleton.getInstance();

  /** 🛡️ Service de gestion de la logique d'authentification */
  private readonly m_rAuthService: IAuthService;

  /** 🗄️ Entrepôt de persistance des utilisateurs */
  private readonly m_rUserRepository: IUserRepository;

  /**
   * Initialise le contrôleur avec ses dépendances requises (DI).
   *
   * @constructor
   * @param {IAuthService} authService - Logique métier de sécurité
   * @param {IUserRepository} userRepository - Accès à la persistance
   */
  public constructor(authService: IAuthService, userRepository: IUserRepository) {
    this.m_rAuthService = authService;
    this.m_rUserRepository = userRepository;
  }

  /**
   * 👥 Inscription nominale d'un nouvel utilisateur dans le système.
   * POST /v1/auth/register
   *
   * @param {Request} req - Requête Express
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);
      const dto: CreateUserDto = new CreateUserDto(req.body);

      this.m_rLogger.info(
        { requestId, email: dto.courriel, pseudo: dto.pseudo },
        'register attempt'
      );
      const user = await this.m_rAuthService.register(dto);

      res
        .status(201)
        .json(
          ApiResponseFactory.success(
            'Inscription réussie. Vous pouvez maintenant vous connecter.',
            { user: ResponseUserDto.fromUser(user) },
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🔑 Ouverture de session sécurisée (Génération du couple Access/Refresh tokens).
   * POST /v1/auth/login
   *
   * @param {Request} req - Requête Express
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);
      const dto: LoginDto = new LoginDto(req.body);
      const result = await this.m_rAuthService.login(dto);

      res.status(200).json(
        ApiResponseFactory.success(
          'Connexion réussie',
          {
            user: ResponseUserDto.fromUser(result.user),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
          },
          requestId
        )
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🔄 Régénération des jetons d'accès par validation du Refresh Token.
   * POST /v1/auth/refresh
   *
   * @param {Request} req - Requête Express
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);
      const dto: RefreshTokenDto = new RefreshTokenDto(req.body);
      const result = await this.m_rAuthService.refresh(dto);

      res
        .status(200)
        .json(
          ApiResponseFactory.success(
            'Tokens régénérés',
            { accessToken: result.accessToken, refreshToken: result.refreshToken },
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🚪 Révocation de session et destruction légale du jeton de rafraîchissement.
   * POST /v1/auth/logout
   *
   * @param {Request} req - Requête Express
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);
      const dto: RefreshTokenDto = new RefreshTokenDto(req.body);
      await this.m_rAuthService.logout(dto.refreshToken);

      res.status(200).json(ApiResponseFactory.success('Déconnexion réussie', undefined, requestId));
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🔎 Récupération autonome de la fiche d'identité de l'utilisateur connecté.
   * GET /v1/auth/me
   *
   * @param {Request} req - Requête Express
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId: string = RequestIdGenerator.getFromRequest(req);

      // 🪓 ALIGNEMENT INDUSTRIEL : Récupération directe sans forcer le type string primitif
      const idDuUser = req.user?.id;

      if (!idDuUser) {
        throw UserErrorFactory.invalidCredentials();
      }

      // 🪓 ALIGNEMENT INDUSTRIEL : Adaptation polymorphe identique au TagController
      const cibleUserId: UserId = idDuUser instanceof UserId ? idDuUser : new UserId(idDuUser);

      const user = await this.m_rUserRepository.findById(cibleUserId);
      if (!user) {
        throw UserErrorFactory.notFound(cibleUserId);
      }

      res
        .status(200)
        .json(
          ApiResponseFactory.success(
            'Profil utilisateur',
            { user: ResponseUserDto.fromUser(user) },
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }
}
