// ——— fichier : src/services/AppEventAdminService.ts

import      { DatabaseConnection   } from '@/config/DatabaseConnection';
import      { PgAppEventRepository } from '@/infrastructure/repositories/AppEventRepository';
import      { AppEventId           } from '@/domain/value-objects/IdMetier';
import type { AppEvent             } from '@/entities/AppEvent';

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
   */
  public static async getById(idEvent: AppEventId): Promise<AppEvent | null> {
    const db = DatabaseConnection.getInstance();
    const repo = new PgAppEventRepository(db);
    return repo.findById(idEvent);
  }

  /**
   * 🚨 Opération interdite : Les journaux d'audit ne peuvent pas être modifiés.
   * Lever un Fail-Fast direct si l'administration tente un piratage d'état.
   *
   * @public
   * @static
   * @async
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
   */
  public static async getAllLogs(): Promise<AppEvent[]> {
    const db = DatabaseConnection.getInstance();
    const repo = new PgAppEventRepository(db);
    return repo.findAll();
  }

  /**
   * 📊 Récupère les métriques volumétriques de la table des logs.
   *
   * @public
   * @static
   * @async
   */
  public static async getStats(): Promise<{ total: number; parType: any[] }> {
    const total = await PgAppEventRepository.count();
    const parType = await PgAppEventRepository.countByType();
    return { total, parType };
  }

  /**
   * 📅 Récupère l'historique des volumes d'audit sur une période donnée.
   *
   * @public
   * @static
   * @async
   */
  public static async getVolumeHistory(days: number): Promise<any[]> {
    return PgAppEventRepository.countByDay({ days });
  }

  /**
   * 🚨 Opération interdite : Les suppressions unitaires de logs sont prohibées.
   *
   * @public
   * @static
   * @async
   */
  public static async deleteLog(): Promise<never> {
    throw new Error('[Erreur Sécurité] Violation d\'intégrité : L\'administration n\'a pas le droit de supprimer un log unitaire.');
  }

  /**
   * 🧹 Purge historique réglementaire automatique (Conformité RGPD).
   * Seul outil de nettoyage de masse autorisé sur l'infrastructure d'audit.
   *
   * @public
   * @static
   * @async
   */
  public static async purgeOlderThan(cutoffDate: Date): Promise<number> {
    return PgAppEventRepository.deleteOlderThan(cutoffDate);
  }
}
