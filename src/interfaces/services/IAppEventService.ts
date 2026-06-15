// ——— fichier : src/interfaces/services/IAppEventService.ts

import { IBaseEventService } from '@/interfaces/services/IBaseEventService';
import { AppEventCategory }  from '@/constants/Categories';
import { AppEventSeverity }  from '@/constants/Severites';
import { AppEventSecteur }   from '@/constants/Secteurs';
import { AppEventAction }    from '@/constants/Actions';
import { UserId, ItemId, ShareId } from '@/domain/value-objects/ids';

/**
 * 🏛️ Interface IAppEventService 🛡️
 * ----------------------------------------------------------------------------
 * Contrat d'émission des flux de traces de sécurité et d'analytique système.
 * Éradication totale de AppEventType au profit du triptyque 3NF éclaté.
 *
 * @interface IAppEventService
 * @extends {IBaseEventService}
 *
 * @author Directrice du Silicium : Joël (DR-DOS maniac, allergique au void capillaire)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets)
 * @author Ouvriers du Code : La Vague Initiale (Surchauffe sur l'hexagone épuré en juin)
 */
export interface IAppEventService extends IBaseEventService {

  /**
   * 🔔 Log générique interne du système.
   * Point de passage unique pour la frappe des lignes d'audit éclatées.
   *
   * @param {Object} data - Le dictionnaire de structure de l'événement.
   * @param {UserId | null} [data.userId] - L'identifiant de l'acteur responsable.
   * @param {AppEventCategory} data.eventCategory - La catégorie d'infrastructure.
   * @param {AppEventContext} data.eventContext - Le contexte fonctionnel (Char(4)).
   * @param {AppEventAction} data.eventAction - L'opération technique menée (Char(4)).
   * @param {AppEventSeverity} [data.severity] - Le niveau de gravité opérationnel.
   * @param {string} data.message - La description claire pour les administrateurs.
   * @param {Record<string, any>} [data.metadata] - Le contexte technique lourd JSONB.
   * @returns {Promise<any>} Le log généré réhydraté.
   */
  log(data: {
    userId?        : UserId | null;
    eventCategory  : AppEventCategory;
    eventSecteur   : AppEventSecteur;
    eventAction    : AppEventAction;
    severity?      : AppEventSeverity;
    message        : string;
    metadata?      : Record<string, any>;
  }): Promise<any>;

  /**
   * 🔐 Traçabilité d'une connexion réussie au sein du module d'authentification.
   *
   * @param {UserId} p_axUserId - L'identifiant de l'utilisateur connecté.
   * @returns {Promise<any>} Le log d'audit généré.
   */
  authSuccess(p_axUserId: UserId): Promise<any>;

  /**
   * ⚠️ Traçabilité d'un échec d'authentification (Tentative de brute-force).
   *
   * @param {string} p_sEmail - L'adresse courriel ayant échoué à s'authentifier.
   * @returns {Promise<any>} Le log d'audit généré.
   */
  authFailure(p_sEmail: string): Promise<any>;

  /**
   * 📦 Traçabilité de création d'une nouvelle ressource (Pépite).
   *
   * @param {UserId} p_axUserId - L'auteur de la création.
   * @param {ItemId} p_axItemId - L'identifiant de la pépite générée.
   * @returns {Promise<any>} Le log d'audit généré.
   */
  itemCreated(p_axUserId: UserId, p_axItemId: ItemId): Promise<any>;

  /**
   * 🔗 Traçabilité de génération d'un lien de partage sécurisé.
   *
   * @param {UserId} p_axUserId - L'auteur du partage.
   * @param {ShareId} p_axShareId - L'identifiant du jeton de partage généré.
   * @returns {Promise<any>} Le log d'audit généré.
   */
  shareCreated(p_axUserId: UserId, p_axShareId: ShareId): Promise<any>;
}
