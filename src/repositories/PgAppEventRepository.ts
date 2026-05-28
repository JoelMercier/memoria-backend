// ——— fichier : src/repositories/PgAppEventRepository.ts

import type { QueryResult, QueryResultRow } from 'pg';
import { BaseRepository } from '@/repositories/base/BaseRepository';
import { DatabaseConnection } from '@/config/DatabaseConnection';
import { AppEvent } from "@/entities/AppEvent";
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { AppEventErrorFactory } from '@/exceptions/AppEventErrorFactory';
import { AppEventSeverity } from '@/constants/AppEventSeverity';
import { AppEventCategory } from '@/constants/AppEventCategory';
import { AppEventType } from '@/constants/AppEventType';
import { UserId, AppEventId } from '@/domain/value-objects/IdMetier';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IAppEventData } from '@/interfaces/entities/event/IAppEventData';
import type { IAppEventListOptions, IAppEventListResult, IAppEventRepository } from "@/interfaces/repositories/IAppEventRepository";

interface IAppEventRow extends QueryResultRow {
  id_event       : Buffer;
  user_id        : Buffer | null;
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
 *
 * @class PgAppEventRepository
 * @extends {BaseRepository}
 * @implements {IAppEventRepository}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class PgAppEventRepository extends BaseRepository implements IAppEventRepository {

  /** 🎛️ Connexion physique à l'infrastructure de données */
  private readonly db : IDatabaseConnection;

  /**
   * Initialise le dépôt de persistance via injection de dépendance et hérite de l'usine.
   *
   * @constructor
   */
  public constructor(db: IDatabaseConnection) {
    super();
    this.db = db;
  }

  /**
   * Mappe une ligne PostgreSQL brute (snake_case) vers une entité typée AppEvent (camelCase).
   *
   * @private
   */
  private rowToAppEvent(row: IAppEventRow): AppEvent {
    return new AppEvent({
      idAppEvent    : this.toDomainId(row.id_event, AppEventId),
      userId        : this.toDomainId(row.user_id, UserId),
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
   *
   * @private
   */
  private rowsToAppEvents(result: QueryResult<IAppEventRow>): AppEvent[] {
    return result.rows.map((row) => this.rowToAppEvent(row));
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un log d'audit par son identifiant unique.
   *
   * @public
   * @async
   */
  public async findById(eventId: AppEventId): Promise<AppEvent | null> {
    try {
      const result = await this.db.query<IAppEventRow>(
        'SELECT * FROM app_events WHERE id_event = fn_bin_to_uuid($1)',
        [this.toBuffer(eventId)]
      );
      return result.rows[0] ? this.rowToAppEvent(result.rows[0]) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findById', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 📜 Filtre l'historique global selon un niveau de gravité spécifique.
   *
   * @public
   * @async
   */
  public async findBySeverity(severity: AppEventSeverity, limit: number = 50): Promise<AppEvent[] | null> {
    try {
      const result = await this.db.query<IAppEventRow>(
        'SELECT * FROM app_events WHERE severity = $1 ORDER BY created_at DESC LIMIT $2',
        [severity.code, limit]
      );
      return result.rows.length > 0 ? this.rowsToAppEvents(result) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findBySeverity', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 📜 Extrait les lignes d'audit rattachées à une catégorie métier précise.
   *
   * @public
   * @async
   */
  public async findByCategory(category: AppEventCategory, limit: number = 50): Promise<AppEvent[] | null> {
    try {
      const result = await this.db.query<IAppEventRow>(
        'SELECT * FROM app_events WHERE event_category = $1 ORDER BY created_at DESC LIMIT $2',
        [category.code, limit]
      );
      return result.rows.length > 0 ? this.rowsToAppEvents(result) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findByCategory', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 🚨 Extrait les événements d'alerte cumulés pour le monitoring système.
   *
   * @public
   * @async
   */
  public async findCritical(limit: number = 100): Promise<AppEvent[] | null> {
    try {
      const codes = AppEventSeverity.values().filter(s => s.estSuperieurOuEgalA(AppEventSeverity.aesWarning)).map(s => s.code);
      const result = await this.db.query<IAppEventRow>(
        `SELECT * FROM app_events WHERE severity::text = ANY($1) ORDER BY created_at DESC LIMIT $2`,
        [codes, limit]
      );
      return result.rows.length > 0 ? this.rowsToAppEvents(result) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findCritical', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 👥 Extrait la totalité des traces d'activité d'un utilisateur cible.
   *
   * @public
   * @async
   */
  public async findByUserId(userId: UserId, limit: number = 50): Promise<AppEvent[] | null> {
    try {
      const result = await this.db.query<IAppEventRow>(
        `SELECT * FROM app_events WHERE user_id = fn_bin_to_uuid($1) ORDER BY created_at DESC LIMIT $2`,
        [this.toBuffer(userId), limit]
      );
      return result.rows.length > 0 ? this.rowsToAppEvents(result) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findByUserId', err instanceof Error ? err.message : 'unknown');
    }
  }
  /**
   * 🎛️ Moteur de recherche et de pagination dynamique par utilisateur.
   *
   * @public
   * @async
   */
  public async listByUserId(userId: UserId, options?: IAppEventListOptions): Promise<IAppEventListResult> {
    const limit = options?.NbLignesMax ?? 20;
    const offset = options?.IndexDepart ?? 0;
    const conditions = ['user_id = fn_bin_to_uuid($1)'];
    const params: unknown[] = [this.toBuffer(userId)];

    if (options?.eventType) {
      params.push(options.eventType);
      conditions.push(`event_type = $${params.length}`);
    }
    if (options?.search) {
      params.push(`%${options.search}%`);
      conditions.push(`message ILIKE $${params.length}`);
    }

    try {
      const appEventsResult = await this.db.query<IAppEventRow>(
        `SELECT * FROM app_events WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      );
      const countResult = await this.db.query<{ count: string } & QueryResultRow>(
        `SELECT COUNT(*)::text AS count FROM app_events WHERE ${conditions.join(' AND ')}`, params
      );
      return {
        items: this.rowsToAppEvents(appEventsResult),
        total: Number(countResult.rows[0]?.count ?? 0)
      };
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('listByUserId', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 🪓 Écriture concrète : Enregistre un nouvel événement applicatif (Append-only).
   * Verrouille l'intégrité de la contrainte de clé étrangère PostgreSQL face aux acteurs anonymes.
   *
   * @public
   * @async
   * @param {IAppEventData} data - Le contrat passif contenant les métadonnées de l'événement
   * @returns {Promise<AppEvent>} L'entité vivante d'audit générée par le domaine
   * @throws {AppEventErrorFactory} Si l'identifiant de l'acteur est inconnu des remparts
   */
  public async create(data: IAppEventData): Promise<AppEvent> {
    try {
      const result = await this.db.query<IAppEventRow>(
        `INSERT INTO app_events (user_id, event_category, event_type, severity, message, metadata)
         VALUES (fn_bin_to_uuid($1), $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          this.toBuffer(data.userId ?? null), // 📥 Envoi d'un vrai NULL SQL sur le disque (Clé étrangère sauve !)
          data.eventCategory.code,
          data.eventType.code,
          data.severity.code,
          data.message,
          data.metadata ?? {}
        ]
      );
      if (!result.rows) throw AppEventErrorFactory.creation('No row returned from INSERT in app_events');
      return this.rowToAppEvent(result.rows[0]);
    } catch (err) {
      if (err instanceof AppEventErrorFactory) throw err;
      const msg = err instanceof Error ? err.message : 'unknown';

      if (msg.includes('app_events_user_id_fkey')) {
        // 🪓 ALIGNEMENT ACADÉMIQUE : ID fantôme en RAM uniquement pour alimenter l'usine d'erreur sans string !
        const idInconnu = data.userId ?? new UserId('00000000-0000-0000-0000-000000000000');
        throw AppEventErrorFactory.userIdUnknown(idInconnu);
      }
      throw AppEventErrorFactory.creation(msg);
    }
  }

  /**
   * 📜 Contrat d'infrastructure : Récupère l'intégralité absolue des lignes du journal.
   * Requis par IBaseRepository dont hérite IAppEventRepository.
   *
   * @public
   * @async
   */
  public async findAll(): Promise<AppEvent[]> {
    try {
      const result = await this.db.query<IAppEventRow>('SELECT * FROM app_events ORDER BY created_at DESC');
      return result.rows.map((row) => this.rowToAppEvent(row));
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findAll', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 📊 Compte le nombre total de lignes (Statique pour le service Admin).
   *
   * @public
   * @static
   * @async
   */
  public static async count(): Promise<number> {
    const { rows } = await DatabaseConnection.getInstance().query(`SELECT COUNT(*) as total FROM app_events;`);
    return Number(rows[0]?.total ?? 0);
  }

  /**
   * 📊 Répartition des événements par type (Statique pour le service Admin).
   *
   * @public
   * @static
   * @async
   */
  public static async countByType(): Promise<any[]> {
    const { rows } = await DatabaseConnection.getInstance().query(`SELECT event_type as type, COUNT(*) as count FROM app_events GROUP BY event_type;`);
    return rows;
  }

  /**
   * 📅 Historique des volumes sur les 30 derniers jours (Statique pour le service Admin).
   *
   * @public
   * @static
   * @async
   */
  public static async countByDay(options: { days: number }): Promise<any[]> {
    const { rows } = await DatabaseConnection.getInstance().query(
      `SELECT created_at::date as day, COUNT(*) as count FROM app_events WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * $1 GROUP BY created_at::date ORDER BY day DESC;`,
      [options.days]
    );
    return rows;
  }

  /**
   * 👥 Top 10 des utilisateurs les plus actifs (Statique pour le service Admin).
   *
   * @public
   * @static
   * @async
   */
  public static async topUsers(options: { limit: number }): Promise<any[]> {
    const { rows } = await DatabaseConnection.getInstance().query(
      `SELECT user_id, COUNT(*) as count FROM app_events WHERE user_id IS NOT NULL GROUP BY user_id ORDER BY count DESC LIMIT $1;`,
      [options.limit]
    );
    return rows;
  }

  /**
   * 🚨 Liste des dernières erreurs système enregistrées (Statique pour le service Admin).
   *
   * @public
   * @static
   * @async
   */
  public static async findErrors(options: { limit: number }): Promise<any[]> {
    const { rows } = await DatabaseConnection.getInstance().query(
      `SELECT * FROM app_events WHERE severity IN ('error', 'critical') ORDER BY created_at DESC LIMIT $1;`,
      [options.limit]
    );
    return rows;
  }

  /**
   * 🧹 Purge historique automatique (Conformité RGPD - Statique pour le service Admin).
   *
   * @public
   * @static
   * @async
   */
  public static async deleteOlderThan(cutoffDate: Date): Promise<number> {
    const result = await DatabaseConnection.getInstance().query(`DELETE FROM app_events WHERE created_at < $1;`, [cutoffDate]);
    return result.rowCount || 0;
  }
}
