// ——— fichier : src/controllers/UserController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';
import      { UserId             } from '@/domain/value-objects/IdMetier';
import      { ChangePasswordDto  } from '@/dto/user/ChangePasswordDto';
import      { DeleteAccountDto   } from '@/dto/user/DeleteAccountDto';
import      { ResponseUserDto    } from '@/dto/user/ResponseUserDto';
import      { UpdateProfileDto   } from '@/dto/user/UpdateProfileDto';
import      { UserErrorFactory   } from '@/exceptions/UserErrorFactory';
import type { IUserController    } from '@/interfaces/controllers/IUserController';
import type { IUserExportService } from '@/interfaces/services/IUserExportService';
import type { IUserService       } from '@/interfaces/services/IUserService';
import      { ApiResponseFactory } from '@/utils/ApiResponseFactory';
import      { RequestIdGenerator } from '@/utils/RequestIdGenerator';

/**
 * 🎛️ Classe UserController
 * -----------------------
 * Contrôleur HTTP Express pour la gestion des comptes utilisateurs et de la conformité RGPD.
 * Sécurise les actions de profil en convertissant les jetons d'infrastructure en types nominaux.
 *
 * @class UserController
 * @implements {IUserController}
 * @author Joël, Gaïa & Co
 */
export class UserController implements IUserController {

  /** 🧠 Service applicatif de gestion des profils */
  private readonly m_rUserService : IUserService;

  /** 🧠 Service applicatif d'extraction et d'export des données privées */
  private readonly m_rUserExportService : IUserExportService;

  /**
   * Initialise le contrôleur avec ses services dépendants (DI).
   *
   * @constructor
   * @param {IUserService} userService - Service des utilisateurs
   * @param {IUserExportService} userExportService - Service d'exportation RGPD
   */
  public constructor(
    userService       : IUserService,
    userExportService : IUserExportService
  ) {
    this.m_rUserService       = userService;
    this.m_rUserExportService = userExportService;
  }

  /**
   * 🛡️ Accesseur privé vers le service des utilisateurs.
   *
   * @private
   * @returns {IUserService} L'instance du service.
   */
  private get userService(): IUserService {
    return this.m_rUserService;
  }

  /**
   * 🛡️ Accesseur privé vers le service d'exportation.
   *
   * @private
   * @returns {IUserExportService} L'instance du service.
   */
  private get userExportService(): IUserExportService {
    return this.m_rUserExportService;
  }

  /**
   * 🔏 Extrait l'identifiant utilisateur depuis la session HTTP Express.
   * Scelle l'identité sous l'armure du type nominal du domaine.
   *
   * @private
   * @param {Request} req - La requête HTTP
   * @throws {UserErrorFactory} Si les identifiants de session sont altérés ou absents
   * @returns {UserId} L'identifiant immuable fortement typé
   */
  private getUserId(req: Request): UserId {
    const id = req.user?.id;
    if (!id) {
      throw UserErrorFactory.invalidCredentials();
    }
    // 🪓 ALIGNEMENT INDUSTRIEL : Check polymorphe étanche si Express transporte déjà un UserId
    return id instanceof UserId ? id : new UserId(id as unknown as string);
  }

  /**
   * 🎛️ PUT /users/profile
   * Modifie les informations publiques ou de contact du profil utilisateur.
   *
   * @param {Request} req - Requête HTTP Express
   * @param {Response} res - Réponse HTTP Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string           = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId           = this.getUserId(req);
      const dto       : UpdateProfileDto = new UpdateProfileDto(req.body);

      const user = await this.userService.updateProfile(userId, dto);

      res
        .status(200)
        .json(
          ApiResponseFactory.success(
            'Profil mis à jour',
            { user: ResponseUserDto.fromUser(user) },
            requestId
          )
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🔏 PATCH /users/password
   * Valide et applique le renouvellement sécurisé du mot de passe de l'acteur.
   *
   * @param {Request} req - Requête HTTP Express
   * @param {Response} res - Réponse HTTP Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string            = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId            = this.getUserId(req);
      const dto       : ChangePasswordDto = new ChangePasswordDto(req.body);

      await this.userService.changePassword(userId, dto);

      res
        .status(200)
        .json(ApiResponseFactory.success('Mot de passe modifié', undefined, requestId));
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🗑️ DELETE /users/account
   * Clôture et purge définitivement le compte de l'utilisateur après confirmation.
   *
   * @param {Request} req - Requête HTTP Express
   * @param {Response} res - Réponse HTTP Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string           = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId           = this.getUserId(req);
      const dto       : DeleteAccountDto = new DeleteAccountDto(req.body);

      await this.userService.deleteAccount(userId, dto);

      res
        .status(200)
        .json(ApiResponseFactory.success('Compte supprimé', undefined, requestId));
    } catch (err) {
      next(err);
    }
  }

  /**
   * 📦 GET /users/export
   * Génère une archive au format JSON contenant toutes les données personnelles de l'acteur (RGPD).
   *
   * @param {Request} req - Requête HTTP Express
   * @param {Response} res - Réponse HTTP Express
   * @param {NextFunction} next - Passerelle d'erreurs Express
   * @returns {Promise<void>}
   */
  public async exportData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId : string = RequestIdGenerator.getFromRequest(req);
      const userId    : UserId = this.getUserId(req);

      const exportData = await this.userExportService.exportUserData(userId);

      const dateStr : string = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Disposition', `attachment; filename="memoria-export-${dateStr}.json"`);

      res
        .status(200)
        .json(ApiResponseFactory.success('Export RGPD généré', { export: exportData }, requestId));
    } catch (err) {
      next(err);
    }
  }
}
