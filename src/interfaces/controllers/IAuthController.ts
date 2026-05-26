// ——— fichier : src/interfaces/controllers/IAuthController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';

/**
 * 🔒 Interface IAuthController
 * ----------------------------
 * Contrat de sécurité régissant les points d'accès publics et privés d'authentification.
 * Orchestre l'accueil, le scellage des sessions et la protection des secrets.
 *
 * @interface IAuthController
 * @author Joël, Gaïa & Co
 */
export interface IAuthController {

  /** 📝 Enregistre et initialise le compte d'un nouvel utilisateur (Inscription). */
  register(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🔐 Valide les secrets d'authentification et forge les jetons de session (Connexion). */
  login(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🔄 Renouvelle la validité des jetons d'accès via le jeton de rafraîchissement. */
  refresh(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 🗑️ Révoque la session active et purge les jetons d'infrastructure (Déconnexion). */
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;

  /** 👤 Récupère l'identité et le profil sécurisé de l'acteur actuellement connecté. */
  me(req: Request, res: Response, next: NextFunction): Promise<void>;
}
