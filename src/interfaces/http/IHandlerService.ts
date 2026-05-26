// ——— fichier : src/interfaces/http/IHandlerService.ts

import type { NextFunction,
              Request,
              Response           } from 'express';

/**
 * 🔒 Interface IHandlerService
 * ----------------------------
 * Contrat d'infrastructure régissant la capture globale et la centralisation des anomalies HTTP.
 * Permet d'injecter des implémentations alternatives pour l'environnement de test (Mocking).
 *
 * SOLID :
 *  - DIP (Dependency Inversion Principle) : Le cycle de vie Express dépend d'une abstraction de capture.
 *
 * @interface IHandlerService
 * @author Joël, Gaïa & Co
 */
export interface IHandlerService {

  /** 🚨 Intercepte, journalise et formate de manière unifiée toutes les exceptions volantes de l'API. */
  handleError(error: unknown, req: Request, res: Response, next: NextFunction): void;

  /** 🔍 Intercepte les requêtes en échec de routage pour lever une anomalie 404 standardisée. */
  handleNotFound(req: Request, res: Response, next: NextFunction): void;
}
