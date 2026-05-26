// ——— fichier : src/services/AppEventAdminService.ts

import { AppEventCategory     } from '@/constants/AppEventCategory';
import { AppEventSeverity     } from '@/constants/AppEventSeverity';
import { AppEventType         } from '@/constants/AppEventType';
import type { UserId,
              EventId         } from '@/domain/value-objects/IdMetier';
import type { CreateEventDto  } from '@/dto/event/CreateEventDto';
import type { UpdateEventDto  } from '@/dto/event/UpdateEventDto';
import { AppEventErrorFactory } from '@/exceptions/AppEventErrorFactory';
import { PgAppEventRepository } from '@/repositories/PgAppEventRepository';

/**
 * 🏛️ Classe AppEventAdminService
 * ------------------------------
 * Service unifié pour la gestion et l'exploitation des événements d'audit (Admin).
 * Version 100% purifiée des primitives anonymes selon la charte Jojo.
 *
 * @class AppEventAdminService
 * @author Joël, Gaïa & Co
 */
export class AppEventAdminService {

  /** 🔔 Émission et centralisation des logs d'audit système. */
  public static async createEvent(userId: UserId, dto: CreateEventDto): Promise<any> {
    // 🪓 Les DTOs portent déjà les instances de Smart Enums validées par la douane Zod !
    // Plus besoin de refaire un double .fromSql(), on passe directement les objets typés forts.
    const typeEnum = dto.eventType as unknown as AppEventType;
    const catEnum  = dto.eventCategory as unknown as AppEventCategory;
    const sevEnum  = (dto.severity as unknown as AppEventSeverity) || AppEventSeverity.fromSql('info');

    const repo = new PgAppEventRepository();

    return repo.create({
      idAppEvent    : undefined as any,
      userId        : userId,
      eventCategory : catEnum,
      eventType     : typeEnum,
      severity      : sevEnum,
      message       : dto.message || '',
      metadata      : (dto.metadata || {}) as Record<string, any>
    });
  }

  /** 🎛️ Modification technique d'un événement (Développement / Debug uniquement). */
  public static async updateEvent(_userId: UserId, eventId: EventId, dto: UpdateEventDto): Promise<any> {
    const repo = new PgAppEventRepository();

    return repo.update(eventId, {
      message  : dto.message ?? undefined,
      metadata : dto.metadata as Record<string, any>
    });
  }

  /** 📊 Extraction des métriques et statistiques globales du tableau de bord d'audit. */
  public static async getStats(): Promise<any> {
    const [totalEvents, eventsByType, eventsByDay, topUsers, recentErrors] =
      await Promise.all([
        PgAppEventRepository.count(),
        PgAppEventRepository.countByType(),
        PgAppEventRepository.countByDay({ days: 30 }),
        PgAppEventRepository.topUsers({ limit: 10 }),
        PgAppEventRepository.findErrors({ limit: 50 }),
      ]);

    return {
      totalEvents,
      eventsByType,
      eventsByDay,
      topUsers,
      recentErrors,
    };
  }

  /** 📜 Extraction de la liste paginée et filtrable des logs système. */
  public static async listEvents({ limit = 50, offset = 0 } = {}): Promise<any[]> {
    return PgAppEventRepository.findAll({
      limit,
      offset
    });
  }

  /** 🔎 Récupère l'intégralité d'un log d'audit par son identifiant unique fort. */
  public static async getEventById(eventId: EventId): Promise<any> {
    const repo  = new PgAppEventRepository();
    const event = await repo.findById(eventId);

    if (!event) {
      throw AppEventErrorFactory.notFound(eventId);
    }
    return event;
  }

  /** 🗑️ Suppression destructive d'une ligne de journal (Debug local uniquement). */
  public static async deleteEvent(eventId: EventId, actorUserId: UserId | null): Promise<any> {
    const repo  = new PgAppEventRepository();
    const event = await repo.findById(eventId);

    if (!event) {
      throw AppEventErrorFactory.notFound(eventId);
    }

    await repo.delete(eventId, actorUserId);
    return event;
  }

  /** 🧹 Nettoyage de masse RGPD (Purge selon le seuil de rétention). */
  public static async cleanupOldEvents({ days }: { days: number }): Promise<{ deletedCount: number, cutoffDate: Date }> {
    if (!Number.isInteger(days) || days < 1) {
      throw new Error("Nombre de jours invalide");
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const deletedCount = await PgAppEventRepository.deleteOlderThan(cutoffDate);

    return {
      deletedCount,
      cutoffDate,
    };
  }
}
