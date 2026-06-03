// ——— fichier : src/services/AppEventAdminService.ts

import      { DatabaseConnection } from '@/config/DatabaseConnection';
import      { AppEventRepository } from '@/infrastructure/repositories/AppEventRepository';
import      { AppEventId         } from '@/domain/value-objects/IdMetier';
import type { AppEvent           } from '@/entities/AppEvent';

/**
 * 🏛️ Classe AppEventAdminService
 * ------------------------------
 * Service de haut niveau réservé à l'administration et au monitoring système.
 * Exploite les fonctions statistiques et de purge de l'infrastructure d'audit.
 *
 * @class AppEventAdminService
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class AppEventAdminService {

  /**
   * 🔎 Récupère un log d'audit spécifique par son identifiant unique fort.
   *
   * @public
   * @static
   * @async
   * @param {AppEventId} idEvent - L'identifiant fort du log d'audit.
   * @returns {Promise<AppEvent | null>} Le log trouvé ou nul s'il n'existe pas.
   */
  public static async getById(idEvent: AppEventId): Promise<AppEvent | null> {
    const db = DatabaseConnection.getInstance();
    const repo = new AppEventRepository(db);
    return repo.findById(idEvent);
  }

  /**
   * 🚨 Opération interdite : Les journaux d'audit ne peuvent pas être modifiés.
   * Lever un Fail-Fast direct si l'administration tente un piratage d'état.
   *
   * @public
   * @static
   * @async
   * @throws {Error} Systématiquement pour verrouiller la sécurité.
   */
  public static async updateLog(): Promise<never> {
    throw new Error('[Erreur Sécurité] Violation d\'intégrité : L\'administration n\'a pas le droit de modifier un log d\'audit.');
  }

  /**
   * 📊 Extrait la liste complète des journaux pour le tableau de bord.
   *
   * @public
   * @static
   * @async
   * @returns {Promise<AppEvent[]>} La liste exhaustive des logs d'audit.
   */
  public static async getAllLogs(): Promise<AppEvent[]> {
    const db = DatabaseConnection.getInstance();
    const repo = new AppEventRepository(db);
    return repo.findAll();
  }

  /**
   * 🚨 Opération interdite : Les suppressions unitaires de logs sont prohibées.
   *
   * @public
   * @static
   * @async
   * @throws {Error} Systématiquement pour verrouiller la sécurité.
   */
  public static async deleteLog(): Promise<never> {
    throw new Error('[Erreur Sécurité] Violation d\'intégrité : L\'administration n\'a pas le droit de supprimer un log unitaire.');
  }

// ——— fichier : src/services/AppEventAdminService.ts

  /**
   * 🧹 Purge historique réglementaire automatique (Conformité RGPD).
   * Seul outil de nettoyage de masse autorisé sur l'infrastructure d'audit.
   *
   * @public
   * @static
   * @async
   * @param {Date} cutoffDate - La date pivot d'ancienneté maximale autorisée.
   * @returns {Promise<number>} Le nombre d'enregistrements purgés sur le disque.
   * @throws {Error} Si la date pivot viole la durée minimale de conservation de 6 mois de la CNIL.
   */
  public static async purgeOlderThan(cutoffDate: Date): Promise<number> {
    // 🛡️ REMPART RGPD (CNIL) DU DOMAINE : Calcul de la date limite légale (180 jours)
    const l_nSixMoisEnMillisecondes = 180 * 24 * 60 * 60 * 1000;
    const l_dDateMinimumLegale = new Date(Date.now() - l_nSixMoisEnMillisecondes);

    if (cutoffDate.getTime() > l_dDateMinimumLegale.getTime()) {
      throw new Error('[Erreur RGPD] Violation de conformité CNIL : Il est interdit de purger des journaux d\'audit de moins de 6 mois (180 jours).');
    }

    const db = DatabaseConnection.getInstance();
    const repo = new AppEventRepository(db);

    return repo.deleteOlderThan(cutoffDate);
  }
}
