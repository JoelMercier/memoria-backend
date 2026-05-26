// ——— fichier : src/interfaces/controllers/ITagController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';

/**
 * 🔒 Interface ITagController
 * ---------------------------
 * Contrat d'exposition privé régissant la gestion du cycle de vie des étiquettes (Tags).
 * Délimite les barrières de sécurité pour l'organisation et le classement des pépites.
 *
 * @interface ITagController
 * @author Joël, Gaïa & Co
 */
export interface ITagController {

  /** 📜 Extrait la collection exhaustive de toutes les étiquettes créées par l'acteur connecté. */
  list(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🏷️ Valide le libellé textuel unique et scelle la création d'une nouvelle étiquette métier. */
  create(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🔎 Récupère les métadonnées complètes d'un tag spécifique via son identifiant unique. */
  findById(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🎛️ Applique une modification ou une correction sur le nom de l'étiquette métier. */
  update(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🗑️ Supprime de manière destructive un tag et détache ses liaisons avec les pépites. */
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
