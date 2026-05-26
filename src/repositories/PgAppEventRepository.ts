// ——— fichier : src/repositories/PgAppEventRepository.ts

import type { QueryResult,
              QueryResultRow       } from 'pg';
import      { DatabaseConnection   } from "@/config/DatabaseConnection";
import      { AppEvent             } from "@/entities/AppEvent";
import      { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import type { IDatabaseConnection  } from '@/interfaces/database/IDatabaseConnection';
import      { AppEventErrorFactory } from '@/exceptions/AppEventErrorFactory';
import type { IAppEventData        } from '@/interfaces/entities/event/IAppEventData';
import type { IAppEventListOptions,
              IAppEventListResult,
              IAppEventRepository  } from "@/interfaces/repositories/IAppEventRepository";
import      { AppEventSeverity     } from '@/constants/AppEventSeverity';
import      { AppEventCategory     } from '@/constants/AppEventCategory';
import      { AppEventType         } from '@/constants/AppEventType';
import type { UserId, EventId      } from '@/domain/value-objects/IdMetier';

/**
 * 📦 Interface IAppEventRow
 * -------------------------
 * Représente la structure brute d'une ligne physique extraite de PostgreSQL (snake_case).
 */
interface IAppEventRow extends QueryResultRow {
  id_event       : string;
  user_id        : string | null;
  event_category : string;
  event_type     : string;
  severity       : string;
  message        : string;
  metadata       : Record<string, unknown>;
  created_at     : Date;
}

/**
 * 🗄️ Classe PgAppEventRepository
 * ------------------------------
 * Implémentation PostgreSQL du stockage et de l'analyse des journaux d'audit.
 * Utilise la contrainte de type template stricte sur l'entité 'appEvent'.
 */
export class PgAppEventRepository implements IAppEventRepository {

  private readonly db : IDatabaseConnection;

  /**
   * Initialise le dépôt de persistance via injection de dépendance.
   */
  public constructor(db: IDatabaseConnection = DatabaseConnection.getInstance()) {
    this.db = db;
  }

  /**
   * Mappe une ligne PostgreSQL brute (snake_case) vers une entité typée AppEvent (camelCase).
   * Intègre les passerelles de conversion statiques fromSql() de tes Smart Enums.
   */
  private rowToAppEvent(row: IAppEventRow): AppEvent {
    return new AppEvent({
      idAppEvent    : row.id_event as any, // Cast sécurisé vers EventId via le template
      userId        : row.user_id as any,  // Cast sécurisé vers UserId via le template
      eventCategory : AppEventCategory.fromSql(row.event_category),
      eventType     : AppEventType.fromSql(row.event_type),
      severity      : AppEventSeverity.fromSql(row.severity),
      message       : row.message,
      metadata      : row.metadata,
      createdAt     : row.created_at
    });
  }

  /**
   * Transforme un jeu de résultats SQL complet en tableau d'entités métiers.
   */
  private rowsToAppEvents(result: QueryResult<IAppEventRow>): AppEvent[] {
    return result.rows.map((row) => this.rowToAppEvent(row));
  }

  /**
   * 🔎 Récupère un log d'audit par son identifiant unique de table.
   */
  public async findById(eventId: EventId): Promise<AppEvent | null> {
    try {
      const result = await this.db.query<IAppEventRow>('SELECT * FROM app_events WHERE id_event = $1', [eventId.valeur]);
      return result.rows[0] ? this.rowToAppEvent(result.rows[0]) : null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findById', msg);
    }
  }

  /**
   * 📜 Filtre l'historique global selon un niveau de gravité spécifique.
   */
  public async findBySeverity(severity: AppEventSeverity, limit: number = 50): Promise<AppEvent[] | null> {
    try {
      const result = await this.db.query<IAppEventRow>(
        'SELECT * FROM app_events WHERE severity = $1 ORDER BY created_at DESC LIMIT $2',
        [severity.code, limit]
      );
      return result.rows.length > 0 ? this.rowsToAppEvents(result) : null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findBySeverity', msg);
    }
  }

  /**
   * 📜 Extrait les lignes d'audit rattachées à une catégorie métier précise.
   */
  public async findByCategory(category: AppEventCategory, limit: number = 50): Promise<AppEvent[] | null> {
    try {
      const result = await this.db.query<IAppEventRow>(
        'SELECT * FROM app_events WHERE event_category = $1 ORDER BY created_at DESC LIMIT $2',
        [category.code, limit]
      );
      return result.rows.length > 0 ? this.rowsToAppEvents(result) : null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findByCategory', msg);
    }
  }
  /**
   * 🚨 Extrait les événements d'alerte cumulés pour le monitoring système.
   * Exploite le poids de ton Smart Enum AppEventSeverity.
   */
  public async findCritical(limit: number = 100): Promise<AppEvent[] | null> {
    try {
      const severitesCritiques = AppEventSeverity.values()
        .filter(s => s.estSuperieurOuEgalA(AppEventSeverity.aesWarning))
        .map(s => s.code);

      const result = await this.db.query<IAppEventRow>(
        `SELECT * FROM app_events
         WHERE severity::text = ANY($1)
         ORDER BY created_at DESC LIMIT $2`,
        [severitesCritiques, limit]
      );

      return result.rows.length > 0 ? this.rowsToAppEvents(result) : null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findCritical', msg);
    }
  }

  /**
   * 👥 Extrait la totalité des traces d'activité d'un utilisateur cible.
   */
  public async findByUserId(userId: UserId, limit: number = 50): Promise<AppEvent[] | null> {
    try {
      const result = await this.db.query<IAppEventRow>(
        `SELECT * FROM app_events WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
        [userId.valeur, limit]
      );
      return this.rowsToAppEvents(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findByUserId', msg);
    }
  }

  /**
   * 🎛️ Moteur de recherche et de pagination dynamique par utilisateur.
   * Version Jojo-Style : Utilisation de NbLignesMax et IndexDepart.
   */
  public async listByUserId(userId: UserId, options?: IAppEventListOptions): Promise<IAppEventListResult> {
    const limiteSql = options?.NbLignesMax ?? 20;
    const sautSql   = options?.IndexDepart ?? 0;
    const conditions = ['user_id = $1'];
    const params: unknown[] = [userId.valeur];

    if (options?.eventType) {
      params.push(options.eventType);
      conditions.push(`event_type = $${params.length}`);
    }

    if (options?.search) {
      params.push(`%${options.search}%`);
      conditions.push(`message ILIKE $${params.length}`);
    }

    const whereClause = conditions.join(' AND ');

    try {
      const appEventsResult = await this.db.query<IAppEventRow>(
        `SELECT * FROM app_events
         WHERE ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limiteSql, sautSql]
      );

      const countResult = await this.db.query<{ count: string } & QueryResultRow>(
        `SELECT COUNT(*)::text AS count FROM app_events WHERE ${whereClause}`, params
      );

      return {
        items: this.rowsToAppEvents(appEventsResult),
        total: Number(countResult.rows[0]?.count ?? 0)
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('listByUserId', msg);
    }
  }

  /**
   * 🔔 Enregistre un nouvel événement applicatif (Append-only).
   * Verrouille l'intégrité de la contrainte de clé étrangère PostgreSQL.
   */
  public async create(data: IAppEventData): Promise<AppEvent> {
    try {
      const result = await this.db.query<IAppEventRow>(
        `INSERT INTO app_events (user_id, event_category, event_type, severity, message, metadata)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id_event, user_id, event_category, event_type, severity, message, metadata, created_at`,
        [
          data.userId ? data.userId.valeur : null,
          data.eventCategory.code,
          data.eventType.code,
          data.severity.code,
          data.message,
          data.metadata ?? {}
        ]
      );

      const row = result.rows;
      if (!row) {
        throw AppEventErrorFactory.creation('No row returned from INSERT in app_events');
      }
      return this.rowToAppEvent(row[0]);
    } catch (err) {
      if (err instanceof AppEventErrorFactory) {
        throw err;
      } else {
        const msg = err instanceof Error ? err.message : 'unknown';

        if (msg.includes('app_events_user_id_fkey')) {
          throw AppEventErrorFactory.userIdUnknown(data.userId ? data.userId.valeur : 'userId');
        } else {
          throw AppEventErrorFactory.creation(msg);
        }
      }
    }
  }

  /**
   * 📊 Compte le nombre total de lignes (Statique pour le service Admin).
   */
  public static async count(): Promise<number> {
    const { rows } = await DatabaseConnection.getInstance().query(`SELECT COUNT(*) as total FROM app_events;`);
    return Number(rows[0]?.total ?? 0);
  }

  /**
   * 📊 Répartition des événements par type (Statique pour le service Admin).
   */
  public static async countByType(): Promise<any[]> {
    const { rows } = await DatabaseConnection.getInstance().query(`SELECT event_type as type, COUNT(*) as count FROM app_events GROUP BY event_type;`);
    return rows;
  }

  /**
   * 📅 Historique des volumes sur les 30 derniers jours (Statique pour le service Admin).
   */
  public static async countByDay(options: { days: number }): Promise<any[]> {
    const { rows } = await DatabaseConnection.getInstance().query(
      `SELECT created_at::date as day, COUNT(*) as count
       FROM app_events
       WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * $1
       GROUP BY created_at::date
       ORDER BY day DESC;`, [options.days]
    );
    return rows;
  }

  /**
   * 👥 Top 10 des utilisateurs les plus actifs (Statique pour le service Admin).
   */
  public static async topUsers(options: { limit: number }): Promise<any[]> {
    const { rows } = await DatabaseConnection.getInstance().query(
      `SELECT user_id, COUNT(*) as count
       FROM app_events
       WHERE user_id IS NOT NULL
       GROUP BY user_id
       ORDER BY count DESC
       LIMIT $1;`, [options.limit]
    );
    return rows;
  }

  /**
   * 🚨 Liste des dernières erreurs système enregistrées (Statique pour le service Admin).
   */
  public static async findErrors(options: { limit: number }): Promise<any[]> {
    const { rows } = await DatabaseConnection.getInstance().query(
      `SELECT * FROM app_events
       WHERE severity IN ('error', 'critical')
       ORDER BY created_at DESC
       LIMIT $1;`, [options.limit]
    );
    return rows;
  }

  /**
   * 📜 Extrait la liste paginée globale (Statique pour le service Admin).
   */
  public static async findAll(options: { limit: number; offset: number }): Promise<any[]> {
    const { rows } = await DatabaseConnection.getInstance().query(
      `SELECT * FROM app_events ORDER BY created_at DESC LIMIT $1 OFFSET $2;`, [options.limit, options.offset]
    );
    return rows;
  }

  /**
   * 🎛️ Modifie dynamiquement les champs textuels d'un log.
   * @deprecated Destiné uniquement au nettoyage de l'environnement de développement local.
   */
  public async update(idEvent: EventId, data: Partial<IAppEventData>): Promise<AppEvent | null> {
    const fields: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    const columnsMap: Record<string, string> = {
      message: 'message',
      metadata: 'metadata'
    };

    for (const [key, col] of Object.entries(columnsMap)) {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined) {
        fields.push(`${col} = $${i++}`);
        params.push(value);
      }
    }

    if (fields.length === 0) {
      return await this.findById(idEvent);
    }

    params.push(idEvent.valeur);

    try {
      const result = await this.db.query<IAppEventRow>(
        `UPDATE app_events SET ${fields.join(', ')} WHERE id_event = $${i} RETURNING *`, params
      );
      return result.rows ? this.rowToAppEvent(result.rows[0]) : null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('update', msg);
    }
  }

  /**
   * 🗑️ Supprime de manière destructive une ligne du journal d'audit.
   * @deprecated Destiné uniquement au nettoyage de l'environnement de développement local.
   */
  public async delete(idEvent: EventId, _actorUserId: UserId | null): Promise<boolean> {
    try {
      // Le Repository possède bien 'this.db', le compilateur est heureux !
      const result = await this.db.query('DELETE FROM app_events WHERE id_event = $1', [idEvent.valeur]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('delete', msg);
    }
  }

  /**
   * 🧹 Purge historique automatique (Conformité RGPD - Statique pour le service Admin).
   */
  public static async deleteOlderThan(cutoffDate: Date): Promise<number> {
    const result = await DatabaseConnection.getInstance().query(`DELETE FROM app_events WHERE created_at < $1;`, [cutoffDate]);
    return result.rowCount || 0;
  }
}
