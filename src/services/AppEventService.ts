// ——— fichier : src/services/AppEventService.ts

import { IAppEventService   } from '@/interfaces/services/IAppEventService';
import { AppEventCategory   } from '@/constants/AppEventCategory';
import { AppEventSeverity   } from '@/constants/AppEventSeverity';
import { AppEventSecteur    } from '@/constants/AppEventSecteur';
import { AppEventAction     } from '@/constants/AppEventAction';
import { UserId,
         ItemId, ShareId    } from '@/domain/value-objects/ids';
import { AppEventRepository } from '@/infrastructure/repositories/AppEventRepository';

/**
 * 🏛️ Classe AppEventService
 * -------------------------
 * Service transverse automatique de journalisation et d'audit applicatif.
 * Centralise l'émission de toutes les traces de sécurité et d'analytique.
 *
 * @sealed Règle d'or : Append-only (Émission stricte, éclatée en 3NF)
 * @class AppEventService
 * @implements {IAppEventService}
 *
 * @author Directrice du Silicium : Joël (DR-DOS maniac, allergique au void capillaire)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets)
 * @author Ouvriers du Code : La Vague Initiale (Trébuchet de syntaxe purifié V4)
 */
export class AppEventService implements IAppEventService {
  /** 🗄️ Dépôt d'infrastructure d'audit unique injecté par la Forge */
  private readonly m_oAppEventRepository: AppEventRepository;

  /**
   * Initialise le service d'audit avec ses dépendances d'infrastructure unifiées.
   *
   * @constructor
   * @param {AppEventRepository} p_oAppEventRepository - Le dépôt d'infrastructure d'audit
   */
  public constructor(p_oAppEventRepository: AppEventRepository) {
    this.m_oAppEventRepository = p_oAppEventRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   * Centralise la souveraineté d'accès au dépôt d'infrastructure d'audit.
   *
   * @public
   * @returns {AppEventRepository} L'instance du dépôt d'infrastructure
   */
  public get repository(): AppEventRepository {
    return this.m_oAppEventRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat historique IBaseEventService.
   *
   * @public
   * @returns {AppEventRepository} Le dépôt d'infrastructure.
   */
  public get eventRepository(): AppEventRepository {
    return this.m_oAppEventRepository;
  }

  /**
   * 🔔 Log générique interne du système.
   * Point de passage obligatoire pour l'insertion sécurisée en base de données.
   *
   * @public
   * @async
   * @param {Object} p_oData - Le dictionnaire de structure de l'événement
   * @param {UserId | null} [p_oData.userId] - L'identifiant de l'acteur responsable
   * @param {AppEventCategory} p_oData.eventCategory - La catégorie d'infrastructure
   * @param {AppEventSecteur} p_oData.eventSecteur - Le Secteur fonctionnel (Char(4))
   * @param {AppEventAction} p_oData.eventAction - L'opération technique menée (Char(4))
   * @param {AppEventSeverity} [p_oData.severity] - Le niveau de gravité opérationnel
   * @param {string} p_oData.message - La description claire pour la supervision
   * @param {Record<string, any>} [p_oData.metadata] - Le Secteur technique lourd JSONB
   * @returns {Promise<any>} Le résultat brut de l'écriture en base de données
   */
  public async log(p_oData: {
    userId?        : UserId | null;
    eventCategory  : AppEventCategory;
    eventSecteur   : AppEventSecteur;
    eventAction    : AppEventAction;
    severity?      : AppEventSeverity;
    message        : string;
    metadata?      : Record<string, any>;
  }): Promise<any> {
    return this.m_oAppEventRepository.create({
      idAppEvent    : undefined as any,
      userId        : p_oData.userId ?? null,
      eventCategory : p_oData.eventCategory,
      eventSecteur  : p_oData.eventSecteur,
      eventAction   : p_oData.eventAction,
      severity      : p_oData.severity || AppEventSeverity.INFO,
      message       : p_oData.message,
      metadata      : p_oData.metadata || {},
      createdAt     : new Date()
    });
  }

  /**
   * 🔐 Traçabilité d'une connexion réussie au sein du module d'authentification.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant de l'utilisateur connecté
   * @returns {Promise<any>} Le log d'audit généré après insertion
   */
  public async authSuccess(p_axUserId: UserId): Promise<any> {
    return this.log({
      userId        : p_axUserId,
      eventCategory : AppEventCategory.AUDI,
      eventSecteur  : AppEventSecteur.AUTH,
      eventAction   : AppEventAction.CONN,
      message       : 'Connexion réussie'
    });
  }

  /**
   * ⚠️ Traçabilité d'un échec d'authentification (Tentative de brute-force).
   *
   * @public
   * @async
   * @param {string} p_sEmail - L'adresse courriel ayant échoué à s'authentifier
   * @returns {Promise<any>} Le log d'audit généré après insertion
   */
  public async authFailure(p_sEmail: string): Promise<any> {
    return this.log({
      eventCategory : AppEventCategory.AUDI,
      eventSecteur  : AppEventSecteur.AUTH,
      eventAction   : AppEventAction.ECHE,
      severity      : AppEventSeverity.WARN,
      message       : 'Échec de connexion',
      metadata      : { email: p_sEmail }
    });
  }

  /**
   * 📦 Traçabilité de création d'une nouvelle ressource (Pépite).
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'auteur de la création de la pépite
   * @param {ItemId} p_axItemId - L'identifiant fort de la pépite générée
   * @returns {Promise<any>} Le log d'audit généré après insertion
   */
  public async itemCreated(p_axUserId: UserId, p_axItemId: ItemId): Promise<any> {
    return this.log({
      userId        : p_axUserId,
      eventCategory : AppEventCategory.ANAL,
      eventSecteur  : AppEventSecteur.PEPI,
      eventAction   : AppEventAction.CREA,
      message       : 'Pépite créée',
      metadata      : { itemId: p_axItemId.valeur }
    });
  }

  /**
   * 🔗 Traçabilité de génération d'un lien de partage sécurisé.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'auteur du partage de la pépite
   * @param {ShareId} p_axShareId - L'identifiant fort du jeton de partage généré
   * @returns {Promise<any>} Le log d'audit généré après insertion
   */
  public async shareCreated(p_axUserId: UserId, p_axShareId: ShareId): Promise<any> {
    return this.log({
      userId        : p_axUserId,
      eventCategory : AppEventCategory.ANAL,
      eventSecteur  : AppEventSecteur.PEPI,
      eventAction   : AppEventAction.PART,
      message       : 'Pépite partagée',
      metadata      : { shareId: p_axShareId.valeur }
    });
  }
}
