// ——— fichier : src/interfaces/controllers/IShareController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';

/**
 * 🔒 Interface IShareController
 * ----------------------------
 * Contrat d'exposition privé régissant la gestion du cycle de vie des liens de partage (Shares).
 * Délimite les actions sécurisées de consultation, de création et de révocation des accès.
 *
 * @interface IShareController
 * @author Joël, Gaïa & Co
 */
export interface IShareController {

  /** 📜 Extrait la liste complète ou filtrée des partages actifs de l'utilisateur connecté. */
  list(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🔗 Valide le payload et engendre un nouveau lien de partage sécurisé pour une pépite. */
  create(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🔎 Récupère les métadonnées et restrictions d'un partage via son identifiant unique. */
  findById(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🎛️ Modifie les restrictions ou le destinataire d'un droit d'accès existant. */
  update(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🗑️ Révoque et détruit définitivement un lien de partage (Fermeture des accès). */
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
