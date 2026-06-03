// ——— fichier : src/infrastructure/repositories/AppEventRepository.ts

import type { QueryResult, QueryResultRow } from 'pg';
import { BaseRepository } from '@/infrastructure/repositories/BaseRepositories';
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

/**
 * 🗄️ Interface interne calée au bit près sur le stockage physique décroissant de la table "Events"
 */
interface IAppEventRow extends QueryResultRow {
  aeIdEvent    : Buffer;
  aeUserId     : Buffer | null;
  aeCreatedAt  : Date;
  aeIdCategory : string;
  aeSeverityId : string;
  aeType       : string;
  aeMessage    : string;
  aeMetadata   : Record<string, unknown>;
}

/**
 * 🗄️ Classe AppEventRepository 🧮 (Le Fort de Persistance des Traces d'Audit 🤖)
 * ----------------------------------------------------------------------------
 * Implémentation PostgreSQL du stockage et de l'analyse des journaux d'audit.
 * Repose exclusivement sur l'unicité absolue des zones du Jojo-Style d'infrastructure.
 *
 * @class AppEventRepository
 * @extends {BaseRepository}
 * @implements {IAppEventRepository}
 * @author Vision : Joël (Compilateur de l'Ancien Temps)
 * @author Frapperie du code : Gaïa (Alchimiste des structures)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export class AppEventRepository extends BaseRepository implements IAppEventRepository {

  /**
   * Initialise le dépôt de persistance via l'interface abstraite de connexion.
   *
   * @constructor
   */
  public constructor(p_oDb: IDatabaseConnection) {
    // Raccordement d'acier : On transmet le pool brut extrait de l'interface au parent historique
    super(p_oDb);
  }

  /**
   * Mappe une ligne PostgreSQL brute (Jojo-Style V4) vers une entité typée AppEvent (camelCase).
   *
   * @private
   */
  private rowToAppEvent(p_oRow: IAppEventRow): AppEvent {
    return new AppEvent({
      idAppEvent    : this.toDomainId(p_oRow.aeIdEvent, AppEventId),
      userId        : this.toDomainId(p_oRow.aeUserId, UserId),
      eventCategory : AppEventCategory.DeCode<AppEventCategory>(p_oRow.aeIdCategory),
      eventType     : AppEventType.DeCode<AppEventType>(p_oRow.aeType),
      severity      : AppEventSeverity.DeCode<AppEventSeverity>(p_oRow.aeSeverityId),
      message       : p_oRow.aeMessage,
      metadata      : p_oRow.aeMetadata,
      createdAt     : p_oRow.aeCreatedAt
    });
  }

  /**
   * Transforme un jeu de résultats SQL complet en tableau d'entités métiers.
   *
   * @private
   */
  private rowsToAppEvents(p_rResult: QueryResult<IAppEventRow>): AppEvent[] {
    return p_rResult.rows.map((l_oRow: IAppEventRow) => this.rowToAppEvent(l_oRow));
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un log d'audit par son identifiant unique binaire.
   */
  public async findById(p_axEventId: AppEventId): Promise<AppEvent | null> {
    try {
      const l_rResult = await this.db.query<IAppEventRow>(
        'Select * From "Events" Where "aeIdEvent" = $1',
        [this.toBuffer(p_axEventId)]
      );
      return l_rResult.rows[0] ? this.rowToAppEvent(l_rResult.rows[0]) : null;
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('findById', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

  /**
   * 📜 Filtre l'historique global selon un niveau de gravité spécifique.
   */
  public async findBySeverity(p_eSeverity: AppEventSeverity, p_iNbLignesMax: number = 50): Promise<AppEvent[] | null> {
    try {
      const l_rResult = await this.db.query<IAppEventRow>(
        'Select * From "Events" Where "aeSeverityId" = $1 Order By "aeCreatedAt" Desc Limit $2',
        [p_eSeverity.code, p_iNbLignesMax]
      );
      return l_rResult.rows.length > 0 ? this.rowsToAppEvents(l_rResult) : null;
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('findBySeverity', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

  /**
   * 📜 Extrait les lignes d'audit rattachées à une catégorie métier précise.
   */
  public async findByCategory(p_eCategory: AppEventCategory, p_iNbLignesMax: number = 50): Promise<AppEvent[] | null> {
    try {
      const l_rResult = await this.db.query<IAppEventRow>(
        'Select * From "Events" Where "aeIdCategory" = $1 Order By "aeCreatedAt" Desc Limit $2',
        [p_eCategory.code, p_iNbLignesMax]
      );
      return l_rResult.rows.length > 0 ? this.rowsToAppEvents(l_rResult) : null;
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('findByCategory', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

  /**
   * 🚨 Extrait les événements d'alerte cumulés pour le monitoring système.
   */
  public async findCritical(p_iNbLignesMax: number = 100): Promise<AppEvent[] | null> {
    try {
      const l_asCodes = AppEventSeverity.ObtenirToutes<AppEventSeverity>()
        .filter((l_oSeverity: AppEventSeverity) => l_oSeverity.estSuperieurOuEgalA(AppEventSeverity.WARN))
        .map((l_oSeverity: AppEventSeverity) => l_oSeverity.code);

      const l_rResult = await this.db.query<IAppEventRow>(
        'Select * From "Events" Where "aeSeverityId"::text = any($1) Order By "aeCreatedAt" Desc Limit $2',
        [l_asCodes, p_iNbLignesMax]
      );
      return l_rResult.rows.length > 0 ? this.rowsToAppEvents(l_rResult) : null;
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('findCritical', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

  /**
   * 👥 Extrait la totalité des traces d'activité d'un utilisateur cible.
   */
  public async findByUserId(p_axUserId: UserId, p_iNbLignesMax: number = 50): Promise<AppEvent[] | null> {
    try {
      const l_rResult = await this.db.query<IAppEventRow>(
        'Select * From "Events" Where "aeUserId" = $1 Order By "aeCreatedAt" Desc Limit $2',
        [this.toBuffer(p_axUserId), p_iNbLignesMax]
      );
      return l_rResult.rows.length > 0 ? this.rowsToAppEvents(l_rResult) : null;
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('findByUserId', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

  /**
   * 🎛️ Moteur de recherche et de pagination dynamique par utilisateur.
   */
  public async listByUserId(p_axUserId: UserId, p_oOptions?: IAppEventListOptions): Promise<IAppEventListResult> {
    const l_iLimit = p_oOptions?.NbLignesMax ?? 20;
    const l_iOffset = p_oOptions?.IndexDepart ?? 0;
    const l_asConditions = ['"aeUserId" = $1'];
    const l_aParams: unknown[] = [this.toBuffer(p_axUserId)];

    if (p_oOptions?.eventType) {
      l_aParams.push(p_oOptions.eventType.code);
      l_asConditions.push(`"aeType" = $${l_aParams.length}`);
    }
    if (p_oOptions?.search) {
      l_aParams.push(`%${p_oOptions.search}%`);
      l_asConditions.push(`"aeMessage" ilike $${l_aParams.length}`);
    }

    const l_iIdxLimit = l_aParams.length + 1;
    const l_iIdxOffset = l_aParams.length + 2;

    try {
      const l_rAppEventsResult = await this.db.query<IAppEventRow>(
        `Select * From "Events" Where ${l_asConditions.join(' and ')} Order By "aeCreatedAt" Desc Limit $${l_iIdxLimit} Offset $${l_iIdxOffset}`,
        [...l_aParams, l_iLimit, l_iOffset]
      );

      const l_rCountResult = await this.db.query<{ count: string } & QueryResultRow>(
        `Select Count(*)::text as count From "Events" Where ${l_asConditions.join(' and ')}`,
        l_aParams
      );

      return {
        items: this.rowsToAppEvents(l_rAppEventsResult),
        total: Number(l_rCountResult.rows[0]?.count ?? 0)
      };
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('listByUserId', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

  /**
   * 🪓 Enregistre un nouvel événement applicatif (Append-only).
   */
  public async create(p_oData: IAppEventData): Promise<AppEvent> {
    try {
      const l_binIdEvent = this.toBuffer(p_oData.idAppEvent);

      const l_rResult = await this.db.query<IAppEventRow>(
        `Insert Into "Events" ("aeIdEvent", "aeUserId", "aeIdCategory", "aeType", "aeSeverityId", "aeMessage", "aeMetadata")
         Values ($1, $2, $3, $4, $5, $6, $7)
         returning *`,
        [
          l_binIdEvent,
          p_oData.userId ? this.toBuffer(p_oData.userId) : null,
          p_oData.eventCategory.code,
          p_oData.eventType.code,
          p_oData.severity.code,
          p_oData.message,
          p_oData.metadata ?? {}
        ]
      );
      if (!l_rResult.rows[0]) throw AppEventErrorFactory.creation('No row returned from INSERT in Events');
      return this.rowToAppEvent(l_rResult.rows[0]);
    } catch (l_oErr) {
      if (l_oErr instanceof AppEventErrorFactory) throw l_oErr;
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';

      if (l_sMsg.includes('Events_aeUserId_Fkey')) {
        const l_oIdInconnu = p_oData.userId ?? new UserId(Buffer.from('00000000000000000000000000000000', 'hex'));
        throw AppEventErrorFactory.userIdUnknown(l_oIdInconnu);
      }
      throw AppEventErrorFactory.creation(l_sMsg);
    }
  }
  /**
   * 📜 Contrat d'infrastructure : Récupère l'intégralité absolue des lignes du journal.
   */
  public async findAll(): Promise<AppEvent[]> {
    try {
      // Injection du type générique d'acier <IAppEventRow> pour éteindre le crash de type
      const l_rResult = await this.db.query<IAppEventRow>('Select * From "Events" Order By "aeCreatedAt" Desc');
      return this.rowsToAppEvents(l_rResult);
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('findAll', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

// ——— fichier : src/infrastructure/repositories/AppEventRepository.ts

  /**
   * 🧹 Purge historique physique des lignes d'audit obsolètes (Conformité RGPD).
   *
   * @public
   * @async
   * @param {Date} p_dCutoffDate - La date pivot au-delà de laquelle tout est carbonisé.
   * @returns {Promise<number>} Le nombre exact de lignes d'audit purgées.
   */
  public async deleteOlderThan(p_dCutoffDate: Date): Promise<number> {
    const l_oResult = await this.db.query(
      `Delete From "Events" Where "aeCreatedAt" < $1`,
      [p_dCutoffDate]
    );

    return l_oResult.rowCount ?? 0;
  }

}