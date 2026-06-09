// ——— fichier : src/interfaces/services/IAppEventAdminService.ts

import { IBaseEventService } from '@/interfaces/services/IBaseEventService';
import { AppEventId }        from '@/domain/value-objects/ids';
import type { AppEvent }     from '@/entities/AppEvent';

/**
 * 🏛️ Interface IAppEventAdminService 🚨
 * ----------------------------------------------------------------------------
 * Contrat de supervision macro, d'extraction et de maintenance réglementaire.
 * Verrouille la sécurité et l'immuabilité de la table d'audit de Mémoria.
 *
 * @interface IAppEventAdminService
 * @extends {IBaseEventService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Garde d'élite en surchauffe)
 */
export interface IAppEventAdminService extends IBaseEventService {

  /**
   * 🔎 Récupère un log d'audit spécifique par son identifiant unique fort ("aeIdEvent").
   *
   * @async
   * @param {AppEventId} p_axIdEvent - L'identifiant unique fort de l'événement recherché
   * @returns {Promise<AppEvent | null>} L'entité de l'événement d'audit hydratée ou null
   */
  getById(p_axIdEvent: AppEventId): Promise<AppEvent | null>;

  /**
   * 🚨 Opération interdite : Les journaux d'audit ne peuvent pas être modifiés.
   * Le Fail-Fast direct garantit la sécurité et l'immuabilité de la table Events.
   *
   * @async
   * @throws {Error} Systématiquement pour sceller l'intégrité de la Forge
   * @returns {Promise<never>}
   */
  updateLog(): Promise<never>;

  /**
   * 📊 Extrait la liste complète des journaux pour le tableau de bord d'administration.
   *
   * @async
   * @returns {Promise<AppEvent[]>} La collection complète des entités d'événement d'audit
   */
  getAllLogs(): Promise<AppEvent[]>;

  /**
   * 🚨 Opération interdite : Les suppressions unitaires de logs sont prohibées.
   *
   * @async
   * @throws {Error} Systématiquement pour verrouiller la sécurité de production
   * @returns {Promise<never>}
   */
  deleteLog(): Promise<never>;

  /**
   * 🧹 Purge historique réglementaire automatique (Conformité RGPD).
   * Seul outil de nettoyage de masse autorisé sur l'infrastructure d'audit.
   *
   * @async
   * @param {Date} p_dCutoffDate - La date pivot d'ancienneté maximale autorisée pour les logs nominatifs
   * @throws {Error} Si la date pivot viole la durée minimale légale de rétention de 180 jours de la CNIL
   * @returns {Promise<number>} Le nombre réel de lignes purgées sur le disque PostgreSQL
   */
  purgeOlderThan(p_dCutoffDate: Date): Promise<number>;
}
