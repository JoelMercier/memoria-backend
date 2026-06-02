// ——— fichier : src/services/AppEventService.ts

import { AppEventCategory } from '@/constants/AppEventCategory';
import { AppEventSeverity } from '@/constants/AppEventSeverity';
import { AppEventType } from '@/constants/AppEventType';
import { UserId, ItemId, ShareId } from '@/domain/value-objects/IdMetier';
import { DatabaseConnection } from '@/config/DatabaseConnection';
import { AppEventRepository } from '@/infrastructure/repositories/AppEventRepository';

/**
 * 🏛️ Classe AppEventService
 * -------------------------
 * Service transverse automatique de journalisation et d'audit applicatif.
 * Centralise l'émission de toutes les traces de sécurité et d'analytique.
 *
 * @sealed Règle d'or : Append-only (Émission stricte, aucune modification autorisée)
 * @class AppEventService
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class AppEventService {

  /**
   * 🔔 Log générique interne du système.
   * Point de passage obligatoire pour l'insertion sécurisée en base de données.
   *
   * @public
   * @static
   * @async
   */
  public static async log(data: {
    userId?        : UserId | null;
    eventCategory  : AppEventCategory;
    eventType      : AppEventType;
    severity?      : AppEventSeverity;
    message        : string;
    metadata?      : Record<string, any>;
  }): Promise<any> {
    const db = DatabaseConnection.getInstance();
    const repo = new AppEventRepository(db);

    return repo.create({
      idAppEvent    : undefined as any,
      userId        : data.userId ?? null,
      eventCategory : data.eventCategory,
      eventType     : data.eventType,
      severity      : data.severity || AppEventSeverity.fromSql('info'),
      message       : data.message,
      metadata      : data.metadata || {}
    });
  }

  /**
   * 🔐 Traçabilité d'une connexion réussie au sein du module d'authentification.
   *
   * @public
   * @static
   * @async
   */
  public static async authSuccess(userId: UserId): Promise<any> {
    return this.log({
      userId,
      eventCategory : AppEventCategory.aecAudit,
      eventType     : AppEventType.AUTH_LOGIN_SUCCESS,
      message       : 'Connexion réussie'
    });
  }

  /**
   * ⚠️ Traçabilité d'un échec d'authentification (Tentative de brute-force).
   *
   * @public
   * @static
   * @async
   */
  public static async authFailure(email: string): Promise<any> {
    return this.log({
      eventCategory : AppEventCategory.aecAudit,
      eventType     : AppEventType.AUTH_LOGIN_FAILURE,
      severity      : AppEventSeverity.fromSql('warning'),
      message       : 'Échec de connexion',
      metadata      : { email }
    });
  }

  /**
   * 📦 Traçabilité de création d'une nouvelle ressource (Pépite).
   *
   * @public
   * @static
   * @async
   */
  public static async itemCreated(userId: UserId, itemId: ItemId): Promise<any> {
    return this.log({
      userId,
      eventCategory : AppEventCategory.aecAnalytics,
      eventType     : AppEventType.ITEM_CREATED,
      message       : 'Pépite créée',
      metadata      : { itemId: itemId.valeur }
    });
  }

  /**
   * 🔗 Traçabilité de génération d'un lien de partage sécurisé.
   *
   * @public
   * @static
   * @async
   */
  public static async shareCreated(userId: UserId, shareId: ShareId): Promise<any> {
    return this.log({
      userId,
      eventCategory : AppEventCategory.aecAnalytics,
      eventType     : AppEventType.ITEM_DELETED,
      message       : 'Pépite partagée',
      metadata      : { shareId: shareId.valeur }
    });
  }
}
