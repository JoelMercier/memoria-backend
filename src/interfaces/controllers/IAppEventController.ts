// ——— fichier : src\interfaces\controllers\IAppEventController.ts


import type { NextFunction, Request, Response } from 'express';

/**
 * 🔒 Interface IAppEventController
 * --------------------------------
 * Gère l'émission transverse et automatisée des événements système (logs).
 *
 * ⚠️ Règle métier : Cette interface est STRICTEMENT immuable (Append-only).
 * Aucun traitement humain direct ne doit passer par ce contrat.
 *
 * @see docs/backend/08-app-events.md
 */
export interface IAppEventController {
  /**
   * 🔔 Enregistre un nouvel événement dans le journal système.
   * Intercepté automatiquement par la logique applicative (Auth, Share, etc.).
   *
   * @param req - Objet de requête Express contenant le payload du log
   * @param res - Objet de réponse Express
   * @param next - Fonction de chaînage du middleware Express
   * @returns Une promesse vide (restitution via flux JSON 201)
   */
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
}
