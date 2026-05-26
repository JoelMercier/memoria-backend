// ——— fichier : src/interfaces/controllers/IPublicShareController.ts

import type { NextFunction,
              Request,
              Response           } from 'express';

/**
 * 🔒 Interface IPublicShareController
 * -----------------------------------
 * Contrat d'exposition publique non authentifiée pour la consultation des partages.
 * Gère l'accès anonyme des invités via la validation sémantique des jetons d'URL.
 *
 * 💡 JUSTIFICATION DE L'EXISTENCE DE CE CONTRAT UNIQUE (ISP - SOLID) :
 * Ce fichier applique rigoureusement le principe de ségrégation des interfaces (ISP).
 * Contrairement aux autres contrôleurs privés qui exigent une session authentifiée,
 * ce contrat est l'unique poste frontière public de l'application (accès invité anonyme).
 * L'isoler dans sa propre interface permet de découpler totalement la logique publique
 * des politiques de sécurité privées, facilitant l'application de middlewares dédiés
 * (rate-limiting agressif contre le bruteforce, traçabilité d'audit anonyme) sans polluer
 * le reste de l'infrastructure d'administration ou de gestion des pépites.
 *
 * @interface IPublicShareController
 * @author Joël, Gaïa & Co
 */
export interface IPublicShareController {

  /** 🔎 Récupère et affiche le contenu d'une pépite partagée via son jeton secret unique. */
  getByToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}
