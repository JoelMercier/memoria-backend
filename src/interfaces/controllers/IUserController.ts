// ——— fichier : src/interfaces/controllers/IUserController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';

/**
 * 🔒 Interface IUserController
 * ----------------------------
 * Contrat d'exposition privé régissant la gestion du profil et de la sécurité de l'utilisateur.
 * Encapsule les actions de révision d'identité, de protection des secrets et d'extraction légale.
 *
 * @interface IUserController
 * @author Joël, Gaïa & Co
 */
export interface IUserController {

  /** 👤 Applique une modification partielle sur le pseudonyme ou l'adresse email de l'acteur connecté. */
  updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🔐 Remplace le mot de passe actuel après une double vérification de sécurité par l'infrastructure. */
  changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🗑️ Clôture définitivement le compte et déclenche la suppression de toutes les données associées. */
  deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** ⚖️ Extraction de masse RGPD (Art. 20) compilant l'intégralité de l'empreinte numérique de l'utilisateur. */
  exportData(req: Request, res: Response, next: NextFunction): Promise<void>;
}
