// ——— fichier : src/services/http/HandlerService.ts

import type { NextFunction, Request, Response } from 'express';
import type { IHandlerService                } from '@/interfaces/http/IHandlerService';

import { LoggerSingleton    } from '@/config/LoggerSingleton';
import { ApiError           } from '@/exceptions/ApiError';
import { ApiResponseFactory } from '@/utils/ApiResponseFactory';
import { RequestIdGenerator } from '@/utils/RequestIdGenerator';

/**
 * 🏛️ Classe HandlerService
 * ------------------------
 * Service d'infrastructure assurant la capture globale et la centralisation des anomalies HTTP.
 * Formate et encapsule les erreurs volantes à l'aide de l'enveloppe universelle unifiée.
 *
 * À monter impérativement EN DERNIER dans la chaîne d'infrastructure Express (après les routes).
 *
 * @class HandlerService
 * @implements {IHandlerService}
 * @author Directrice du Silicium : Joël (Abstrait' Obsession)
 * @author Graveuse de Pépites : Gaïa (Trébuchet lourd V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Garde d'élite)
 */
export class HandlerService implements IHandlerService {
  /** 🪵 Instance immuable du journal applicatif global */
  private readonly m_rLogger = LoggerSingleton.getInstance();

  /**
   * 🚨 Intercepte, journalise et formate de manière unifiée toutes les exceptions volantes de l'API.
   * Différencie les anomalies maîtrisées du domaine des pannes d'infrastructure brutes.
   *
   * @public
   * @param {unknown} error - L'exception capturée à la volée
   * @param {Request} req - L'objet de requête HTTP Express
   * @param {Response} res - L'objet de réponse HTTP Express
   * @param {NextFunction} _next - Le maillon suivant du pipeline Express (inutilisé)
   * @returns {void}
   */
  public handleError(error: unknown, req: Request, res: Response, _next: NextFunction): void {
    const requestId: string = RequestIdGenerator.getFromRequest(req);

    if (error instanceof ApiError) {
      error.log();
      res
        .status(error.statusCode)
        .json(
          ApiResponseFactory.error(
            error.message,
            error.additionalInfo.code ?? error.name,
            undefined,
            error.additionalInfo.field,
            requestId
          )
        );
      return;
    }

    // Capture défensive des tréfonds d'une panne d'infrastructure non gérée par le domaine
    this.m_rLogger.error({ err: error, requestId }, 'Erreur non gérée par les handlers métiers');

    res
      .status(500)
      .json(
        ApiResponseFactory.error(
          'Erreur interne du serveur',
          'INTERNAL_ERROR',
          undefined,
          undefined,
          requestId
        )
      );
  }

  /**
   * 🔍 Intercepte les requêtes en échec de routage pour lever une anomalie 404 standardisée.
   *
   * @public
   * @param {Request} req - L'objet de requête HTTP Express
   * @param {Response} res - L'objet de réponse HTTP Express
   * @param {NextFunction} _next - Le maillon suivant du pipeline Express (inutilisé)
   * @returns {void}
   */
  public handleNotFound(req: Request, res: Response, _next: NextFunction): void {
    const requestId: string = RequestIdGenerator.getFromRequest(req);
    res
      .status(404)
      .json(
        ApiResponseFactory.error(
          `Route non trouvée : ${req.method} ${req.originalUrl}`,
          'ROUTE_NOT_FOUND',
          undefined,
          undefined,
          requestId
        )
      );
  }
}
