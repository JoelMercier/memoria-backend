// ——— fichier : src/interfaces/services/IAppEventService.ts

import type { IBaseEventService       } from '@/interfaces/services/IBaseEventService';
import type { Categorie               } from '@/constants/Categories';
import type { Severite                } from '@/constants/Severites';
import type { Secteur                 } from '@/constants/Secteurs';
import type { Action                  } from '@/constants/Actions';
import type { UserId, ItemId, ShareId } from '@/domain/value-objects/ids';
import type { JsonLégitime            } from '@/types/shared/JsonLégitime';
import type { AppEvent                } from '@/entities/AppEvent'; //-- [INSÉRÉ V4] Le retour de l'entité vivante forte [Mémoria] !

/**
 * 🏛️ Interface IAppEventService 🛡️
 * ----------------------------------------------------------------------------
 * Contrat d'émission des flux de traces de sécurité et d'analytique système.
 * Éradication totale de AppEventType au profit du triptyque 3NF éclaté.
 *
 * @interface IAppEventService
 * @extends {IBaseEventService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, allergique au void capillaire)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets)
 */
export interface IAppEventService extends IBaseEventService {

  /**
   * 🔔 Log générique interne du système.
   * Point de passage unique pour la frappe des lignes d'audit éclatées.
   *
   * @param {Object} data - Le dictionnaire de structure de l'événement.
   * @param {UserId | null} [data.userId] - L'identifiant de l'acteur responsable.
   * @param {Categorie} data.eventCategorie - La catégorie d'infrastructure.
   * @param {Secteur} data.eventSecteur - Le contexte fonctionnel (Char(4)).
   * @param {Action} data.eventAction - L'opération technique menée (Char(4)).
   * @param {Severite} [data.eventSeverite] - Le niveau de gravité opérationnel.
   * @param {string} data.message - La description claire pour les administrateurs.
   * @param {JsonLégitime} [data.metadata] - Le contexte technique lourd JSONB sécurisé récursif.
   * @returns {Promise<AppEvent>} Le log généré réhydraté.
   */
  log(data: {
    userId?        : UserId | null;
    eventCategorie : Categorie;
    eventSecteur   : Secteur;
    eventAction    : Action;
    eventSeverite  : Severite;
    message        : string;
    metadata?      : JsonLégitime;
  }) : Promise<AppEvent>; //-- [RÉPARÉ V4] Fin du any clandestin !

  /**
   * 🔐 Traçabilité d'une connexion réussie au sein du module d'authentification.
   *
   * @param {UserId} p_axUserId - L'identifiant de l'utilisateur connecté.
   * @returns {Promise<AppEvent>} Le log d'audit généré.
   */
  authSuccess(p_axUserId: UserId) : Promise<AppEvent>; //-- [RÉPARÉ V4] Forte typisation nominale !

  /**
   * ⚠️ Traçabilité d'un échec d'authentification (Tentative de brute-force).
   *
   * @param {string} p_sEmail - L'adresse courriel ayant échoué à s'authentifier.
   * @returns {Promise<AppEvent>} Le log d'audit généré.
   */
  authFailure(p_sEmail: string) : Promise<AppEvent>; //-- [RÉPARÉ V4] Forte typisation nominale !

  /**
   * 📦 Traçabilité de création d'une nouvelle ressource (Pépite).
   *
   * @param {UserId} p_axUserId - L'auteur de la création.
   * @param {ItemId} p_axItemId - L'identifiant de la pépite générée.
   * @returns {Promise<AppEvent>} Le log d'audit généré.
   */
  itemCreated(p_axUserId: UserId, p_axItemId: ItemId) : Promise<AppEvent>; //-- [RÉPARÉ V4] Forte typisation nominale !

  /**
   * 🔗 Traçabilité de génération d'un lien de partage sécurisé.
   *
   * @param {UserId} p_axUserId - L'auteur du partage.
   * @param {ShareId} p_axShareId - L'identifiant du jeton de partage généré.
   * @returns {Promise<AppEvent>} Le log d'audit généré.
   */
  shareCreated(p_axUserId: UserId, p_axShareId: ShareId) : Promise<AppEvent>; //-- [RÉPARÉ V4] Forte typisation nominale !
}
