// ——— fichier : src/interfaces/controllers/IItemController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';

/**
 * 🔒 Interface IItemController
 * ----------------------------
 * Contrat d'exposition régissant la gestion du cycle de vie des pépites (Items).
 * Délimite les barrières d'accès pour la consultation, la création et la révision.
 *
 * @interface IItemController
 * @author Joël, Gaïa & Co
 */
export interface IItemController {

  /** 📜 Extrait la collection exhaustive ou filtrée des pépites de l'acteur connecté. */
  list(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🔔 Valide le payload et scelle la création d'une nouvelle pépite métier. */
  create(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🔎 Récupère le détail complet d'une pépite spécifique via son identifiant unique. */
  findById(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🎛️ Applique une modification partielle ou totale sur les attributs de la pépite. */
  update(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🗑️ Supprime de manière destructive une pépite de l'espace de stockage. */
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
