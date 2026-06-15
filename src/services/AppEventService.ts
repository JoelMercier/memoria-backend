// ——— fichier : src/services/AppEventService.ts

import type { IAppEventService } from '@/interfaces/services/IAppEventService';
import { AppEventCategory } from '@/constants/Categories';
import { AppEventSeverity } from '@/constants/Severites';
import { AppEventSecteur } from '@/constants/Secteurs';
import { AppEventAction } from '@/constants/Actions';
import type { UserId, ItemId, ShareId } from '@/domain/value-objects/ids';
import type { AppEventRepository } from '@/infrastructure/repositories/PostGres/AppEventRepository';
import type { AppEvent } from '@/entities/AppEvent';

/**
 * 🏛️ Classe AppEventService
 * -------------------------
 * Service transverse automatique de journalisation et d'audit applicatif.
 * Centralise l'émission de toutes les traces de sécurité et d'analytique.
 *
 * @class AppEventService
 * @implements {IAppEventService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, allergique au void capillaire)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Ouvriers du Code : La Vague Initiale (Trébuchet de syntaxe purifié V4)
 */
export class AppEventService implements IAppEventService {
  /** 🗄️ Dépôt d'infrastructure d'audit unique injecté par la Forge */
  private readonly m_oAppEventRepository: AppEventRepository;

  /**
   * Initialise le service d'audit avec ses dépendances d'infrastructure unifiées.
   */
  public constructor(p_oAppEventRepository: AppEventRepository) {
    this.m_oAppEventRepository = p_oAppEventRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   */
  public get repository(): AppEventRepository {
    return this.m_oAppEventRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat historique IBaseEventService.
   */
  public get eventRepository(): AppEventRepository {
    return this.m_oAppEventRepository;
  }

  /**
   * 🔔 Log générique interne du système.
   * [SCELLÉ RÉALINÉ V4] Le type de retour lâche Promise<any> est balayé au profit de Promise<AppEvent> !
   */
  public async log(p_oData: {
    userId?: UserId | null;
    eventCategory: AppEventCategory;
    eventSecteur: AppEventSecteur;
    eventAction: AppEventAction;
    severity?: AppEventSeverity;
    message: string;
    metadata?: Record<string, unknown>; // 🪓 [RÉPARÉ V4] Standard unknown strict
  }): Promise<AppEvent> {
    const { AppEventId, EventSecteurId, EventActionId } =
      await import('@/domain/value-objects/ids');
    const { IdForge } = await import('@/domain/utils/IdForge');

    return await this.repository.create({
      aeIdAppEvent: new AppEventId(IdForge.genererUuidV7()),
      aeUserId: p_oData.userId ?? null,
      aeCategoryId: p_oData.eventCategory,
      aeSecteurId: new EventSecteurId(p_oData.eventSecteur.code),
      aeActionId: new EventActionId(p_oData.eventAction.code),
      aeSeverityId: p_oData.severity || AppEventSeverity.INFO,
      aeMessage: p_oData.message,
      aeMetadata: p_oData.metadata || {}, // Câblage binaire natif
      aeCreatedAt: new Date()
    });
  }

  /**
   * 🔐 Traçabilité d'une connexion réussie au sein du module d'authentification.
   */
  public async authSuccess(p_axUserId: UserId): Promise<AppEvent> {
    return await this.log({
      userId: p_axUserId,
      eventCategory: AppEventCategory.AUDI,
      eventSecteur: AppEventSecteur.AUTH,
      eventAction: AppEventAction.CONN,
      message: 'Connexion réussie'
    });
  }

  /**
   * ⚠️ Traçabilité d'un échec d'authentification (Tentative de brute-force).
   */
  public async authFailure(p_sEmail: string): Promise<AppEvent> {
    return await this.log({
      eventCategory: AppEventCategory.AUDI,
      eventSecteur: AppEventSecteur.AUTH,
      eventAction: AppEventAction.ECHE,
      severity: AppEventSeverity.WARN,
      message: 'Échec de connexion',
      metadata: { email: p_sEmail }
    });
  }

  /**
   * 📦 Traçabilité de création d'une nouvelle ressource (Pépite).
   */
  public async itemCreated(p_axUserId: UserId, p_axItemId: ItemId): Promise<AppEvent> {
    return await this.log({
      userId: p_axUserId,
      eventCategory: AppEventCategory.ANAL,
      eventSecteur: AppEventSecteur.PEPI,
      eventAction: AppEventAction.CREA,
      message: 'Pépite créée',
      metadata: { itemId: p_axItemId.valeur }
    });
  }

  /**
   * 🔗 Traçabilité de génération d'un lien de partage sécurisé.
   */
  public async shareCreated(p_axUserId: UserId, p_axShareId: ShareId): Promise<AppEvent> {
    return await this.log({
      userId: p_axUserId,
      eventCategory: AppEventCategory.ANAL,
      eventSecteur: AppEventSecteur.PEPI,
      eventAction: AppEventAction.PART,
      message: 'Pépite partagée',
      metadata: { shareId: p_axShareId.valeur }
    });
  }
}
