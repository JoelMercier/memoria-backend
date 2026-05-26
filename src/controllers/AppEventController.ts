// ——— fichier : src/controllers/AppEventController.ts

import type { NextFunction,
              Request,
              Response }           from 'express';
import type { IAppEventAdminController } from '@/interfaces/controllers/IAppEventAdminController';
import      { AppEventAdminService     } from '../services/AppEventAdminService.js';
import      { ApiResponseFactory       } from '@/utils/ApiResponseFactory.js';
import      { EventErrorFactory        } from '@/exceptions/EventErrorFactory.js';
import      { CreateEventDto           } from '@/dto/event/CreateEventDto.js';
import      { UpdateEventDto           } from '@/dto/event/UpdateEventDto.js';
import      { EventId,
              UserId                   } from '@/domain/value-objects/IdMetier.js';

/**
 * 🏛️ Classe AppEventController
 * ----------------------------
 * Contrôleur d'exploitation des événements applicatifs (logs).
 * Implémente l'interface de sécurité étendue IAppEventAdminController.
 * Agit comme le poste de douane de l'Hexagone en convertissant les types HTTP bruts.
 *
 * @class AppEventController
 * @implements {IAppEventAdminController}
 * @author Joël, Gaïa & Co
 */
export class AppEventController implements IAppEventAdminController {

  /**
   * 🛡️ Extrait et sécurise l'identifiant de l'utilisateur depuis la session Express.
   * Transforme la primitive brute du Web en un véritable objet-valeur du Domaine.
   *
   * @private
   * @param {Request} req - L'objet de requête Express entrante
   * @throws {EventErrorFactory} Si l'utilisateur n'est pas authentifié dans le contexte
   * @returns {UserId} Le Value Object d'identification d'utilisateur
   */
  private getUserId(req: Request): UserId {
    const id = req.user?.id;

    if (!id) {
      throw EventErrorFactory.missing();
    }

    return new UserId(id);
  }

  /**
   * 🔍 Extrait un paramètre obligatoire de l'URL Express ou lève une exception.
   * Garantit un retour de type string pur et nettoyé.
   *
   * @private
   * @param {Request} req - L'objet de requête Express entrante
   * @param {string} paramName - Le nom de la variable d'URL attendue (ex: 'id')
   * @throws {EventErrorFactory} Si le paramètre est introuvable ou vide
   * @returns {string} La chaîne brute extraite
   */
  private getRequiredParam(req: Request, paramName: string): string {
    const param = req.params[paramName];

    if (!param) {
      throw EventErrorFactory.missing();
    }

    if (Array.isArray(param)) {
      return param[0];
    }

    return param;
  }

  /**
   * 🔔 Émission et enregistrement automatique d'un log système d'audit.
   * Enregistre l'action couplée à un utilisateur ou à un automate.
   *
   * POST /admin/events
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'aiguillage d'erreurs Express
   * @returns {Promise<void>}
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId : UserId         = this.getUserId(req);
      const dto    : CreateEventDto = new CreateEventDto(req.body);
      const event                   = await AppEventAdminService.createEvent(userId, dto);

      res.status(201).json(
        ApiResponseFactory.success('Événement enregistré avec succès', { event })
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 📊 Métriques et statistiques globales pour le tableau de bord d'audit.
   *
   * GET /admin/events/stats
   *
   * @param {Request} _req - Requête HTTP anonymisée
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'aiguillage d'erreurs Express
   * @returns {Promise<void>}
   */
  public async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AppEventAdminService.getStats();

      res.status(200).json(
        ApiResponseFactory.success('Statistiques d\'audit récupérées', stats)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * 📜 Liste paginée et filtrable des journaux d'audit système.
   *
   * GET /admin/events
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'aiguillage d'erreurs Express
   * @returns {Promise<void>}
   */
  public async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit  : number = Number(req.query.limit) || 50;
      const offset : number = Number(req.query.offset) || 0;
      const events          = await AppEventAdminService.listEvents({ limit, offset });

      res.status(200).json(
        ApiResponseFactory.success('Journal d\'événements récupéré', {
          limit,
          offset,
          count: events.length,
          events
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * 🔎 Détail complet d’un événement d'audit unique.
   *
   * GET /admin/events/:id
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'aiguillage d'erreurs Express
   * @returns {Promise<void>}
   */
  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idBrut       : string  = this.getRequiredParam(req, 'id');
      const cibleEventId : EventId = new EventId(idBrut);
      const event                  = await AppEventAdminService.getEventById(cibleEventId);

      res.status(200).json(
        ApiResponseFactory.success('Détail de l\'événement récupéré', { event })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * 🎛️ Modification technique d'un log.
   *
   * @deprecated Réservé exclusivement à l'environnement de développement (Debug/Local).
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'aiguillage d'erreurs Express
   * @returns {Promise<void>}
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId       : UserId         = this.getUserId(req);
      const idBrut       : string         = this.getRequiredParam(req, 'id');
      const cibleEventId : EventId        = new EventId(idBrut);
      const dto          : UpdateEventDto = new UpdateEventDto(req.body);
      const event                         = await AppEventAdminService.updateEvent(userId, cibleEventId, dto);

      res.status(200).json(
        ApiResponseFactory.success('Événement modifié (mode debug)', { event })
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🗑️ Suppression destructive exceptionnelle d'un événement.
   *
   * @deprecated Réservé exclusivement à l'environnement de développement (Debug/Local).
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'aiguillage d'erreurs Express
   * @returns {Promise<void>}
   */
  /**
   * 🗑️ Suppression destructive exceptionnelle d'un événement.
   *
   * @deprecated Réservé exclusivement à l'environnement de développement (Debug/Local).
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'aiguillage d'erreurs Express
   * @returns {Promise<void>}
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId       : UserId  = this.getUserId(req);
      const idBrut       : string  = this.getRequiredParam(req, 'id');
      const cibleEventId : EventId = new EventId(idBrut);

      // ——— Correction Jojo-Style : Envoi des deux arguments distincts réclamés par le service
      await AppEventAdminService.deleteEvent(cibleEventId, userId);

      res.status(200).json(
        ApiResponseFactory.success('Événement purgé de la base de données locale', undefined)
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * 🧹 Nettoyage de masse automatisé (Conformité RGPD / Rétention d'historique).
   *
   * POST /admin/events/cleanup
   *
   * @param {Request} req - Requête HTTP
   * @param {Response} res - Réponse HTTP
   * @param {NextFunction} next - Passerelle d'aiguillage d'erreurs Express
   * @returns {Promise<void>}
   */
  public async cleanup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const days   : number = Number(req.body.days) || 90;
      const result          = await AppEventAdminService.cleanupOldEvents({ days });

      res.status(200).json(
        ApiResponseFactory.success('Purge historique RGPD effectuée', result)
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AppEventController();
