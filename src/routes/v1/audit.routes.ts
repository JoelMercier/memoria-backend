// ——— fichier : src/routes/v1/audit.routes.ts

import { Router } from 'express';
import { AppEventAdminController } from '@/controllers/event/AppEventAdminController';

/**
 * 🛣️ Fonction de Forgeage du Routeur d'Audit Système
 * ----------------------------------------------------------------------------
 * Poste-frontière d'infrastructure gérant les flux d'extraction et de supervision macro.
 *
 * @function createAuditRouter
 * @param {AppEventAdminController} p_oAdminController - Le contrôleur d'administration de l'audit
 * @returns {Router} L'instance du routeur Express configurée
 */
export function createAuditRouter(p_oAdminController: AppEventAdminController): Router {
  const l_oRouter = Router();

  // Enregistrement des routes d'extraction de masse
  l_oRouter.get('/logs', (req, res, next) => p_oAdminController.getEvents(req, res, next));
  l_oRouter.post('/purge', (req, res, next) => p_oAdminController.cleanup(req, res, next));

  return l_oRouter;
}
