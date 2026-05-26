// ——— fichier : src/interfaces/controllers/IAppEventAdminController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';
import type { IAppEventController } from '@/interfaces/controllers/IAppEventController';

/**
 * 🛠️ Interface IAppEventAdminController
 * -------------------------------------
 * Contrat d'exploitation étendu réservé exclusivement aux administrateurs.
 * Hérite de la fonction d'émission de base `IAppEventController`.
 *
 * ⚠️ SÉCURITÉ : Ce contrat DOIT impérativement être protégé en amont
 * par le middleware d'accès de sécurité `requireAdmin`.
 *
 * @interface IAppEventAdminController
 * @extends {IAppEventController}
 * @author Joël, Gaïa & Co
 */
export interface IAppEventAdminController extends IAppEventController {

  /** 🔎 Récupère l'intégralité du détail d'un événement par son identifiant unique. */
  getById(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 📜 Extrait la liste paginée et filtrable des logs système. */
  getEvents(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🧹 Nettoyage de masse RGPD (Purge selon le seuil de rétention). */
  cleanup(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 📊 Calcule les métriques et statistiques globales pour le tableau de bord d'audit. */
  getStats(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   * 🎛️ Modification technique d'un log.
   * @deprecated Réservé exclusivement à l'environnement de développement (Debug/Local).
   */
  update(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   * 🗑️ Suppression destructive d'une ligne de journal.
   * @deprecated Réservé exclusivement à l'environnement de développement (Debug/Local).
   */
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
