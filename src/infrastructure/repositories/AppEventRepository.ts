// ——— fichier : src/infrastructure/repositories/AppEventRepository.ts

import type { QueryResult, QueryResultRow } from 'pg';

import type { IDatabaseConnection  } from '@/interfaces/database/IDatabaseConnection';
import type { IAppEventData        } from '@/interfaces/entities/event/IAppEventData';
import type { IAppEventListOptions,
              IAppEventListResult,
              IAppEventRepository  } from "@/interfaces/repositories/IAppEventRepository";

import { BaseRepository       } from '@/infrastructure/repositories/BaseRepositories';
import { AppEvent             } from "@/entities/AppEvent";
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { AppEventErrorFactory } from '@/exceptions/AppEventErrorFactory';
import { AppEventSeverity     } from '@/constants/AppEventSeverity';
import { AppEventCategory     } from '@/constants/AppEventCategory';
import { AppEventSecteur      } from '@/constants/AppEventSecteur'
import { AppEventAction       } from '@/constants/AppEventAction'
import { UserId, AppEventId   } from '@/domain/value-objects/ids';

/**
 * 🗄️ Interface interne calée au bit près sur le stockage physique de la table "Events"
 */
/**
 * 📦 Interface IAppEventRow
 * Miroir exact et rigoureux au caractère près de la table physique "Events" V4.
 */
interface IAppEventRow {
  aeIdEvent: any;        // Bytea 16 octets
  aeUserId: any;         // Bytea 16 octets ou NULL
  aeCreatedAt: Date;     // Timestamp 8 octets
  aeCategoryId: string;  // Char(4) -> Clé vers table Cathegory
  aeSeverityId: string;  // Char(4) -> Clé vers table Severites
  aeSecteurId: string;   // Char(4) -> Clé vers table EventSecteurs
  aeActionId: string;    // Char(4) -> Clé vers table EventActions
  aeMessage: string;     // Text
  aeMetadata: any;       // Jsonb
}

/**
 * 🗄️ Classe AppEventRepository 🧮 (Le Fort de Persistance des Traces d'Audit 🤖)
 * ----------------------------------------------------------------------------
 * Implémentation PostgreSQL du stockage et de l'analyse des journaux d'audit.
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
   * 🪓 Enregistre un nouvel événement applicatif (Append-only).
   * Aligné au bit près sur la structure physique 3NF et l'ordre machine de la table "Events" V4.
   *
   * @public
   * @async
   * @param {IAppEventData} p_oData - La structure passive des données de l'événement
   * @returns {Promise<AppEvent>} L'entité riche réhydratée après l'insertion réussie
   */
  public async create(p_oData: IAppEventData): Promise<AppEvent> {
    try {
      const l_binIdEvent = this.toBuffer(p_oData.idAppEvent);

      // 🗲 Requête apaisée en PascalCase Jojo-Style
      const l_rResult = await this.db.query<IAppEventRow>(
        `Insert Into "Events" (
          "aeIdEvent",
          "aeUserId",
          "aeCategoryId",
          "aeSeverityId",
          "aeContextId",
          "aeActionId",
          "aeMessage",
          "aeMetadata"
         ) Values ($1, $2, $3, $4, $5, $6, $7, $8)
         Returning *`,
        [
          l_binIdEvent,
          p_oData.userId ? this.toBuffer(p_oData.userId) : null,
          p_oData.eventCategory.code,
          p_oData.severity.code,
          p_oData.eventSecteur.code,
          p_oData.eventAction.code,
          p_oData.message,
          p_oData.metadata ?? {}
        ]
      );

      // l_rResult.rows est un tableau, on doit cibler le premier enregistrement
      if (!l_rResult.rows || l_rResult.rows.length === 0) {
        throw AppEventErrorFactory.creation(`Aucun enregistrement renvoyé lors de l''insertion dans la table Events`);
      }

      // 🗲 Alignement parfait : On passe la ligne unique à rowToAppEvent
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



import { EventSecteurId, EventActionId } from '@/domain/value-objects/ids';

import { IAppEventEnrichedRow } from '@/dto/event/ResponseEventDto';

/**
 * 🗄️ Classe AppEventRepository 🧮
 * ----------------------------------------------------------------------------
 * Implémentation physique du dépôt d'infrastructure pour la gestion des logs.
 * Connectée en direct sur la fonction stockée d'élite "FiltrerJournaux".
 * Verrouille la RAM face aux extractions massives anarchiques de Phase 1.
 *
 * @class AppEventRepository
 * @implements {IAppEventRepository}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Anti-Bâclage)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur le standard V4)
 */
export class AppEventRepository implements IAppEventRepository {
  /** 🧠 Le pilote ou l'instance de connexion à la base de données PostgreSQL */
  private readonly m_oDb: any;

  /**
   * @constructor
   * @param {any} p_oDb - L'instance de connexion d'infrastructure basse
   */
  public constructor(p_oDb: any) {
    this.m_oDb = p_oDb;
  }

  /**
   * Accesseur interne protégé pour respecter l'encapsulation de la base de données.
   */
  private get db(): any {
    return this.m_oDb;
  }

  /**
   * Mappe une ligne PostgreSQL brute vers une entité typée AppEvent.
   *
   * @private
   * @param {IAppEventRow} p_oRow - La ligne de données brute extraite du pool SQL
   * @returns {AppEvent} L'entité riche du Domaine hydratée et scellée
   */
  private rowToAppEvent(p_oRow: IAppEventRow): AppEvent {
    return new AppEvent({
      idAppEvent    : this.toDomainId(p_oRow.aeIdEvent, AppEventId),
      userId        : this.toDomainId(p_oRow.aeUserId , UserId    ),

      eventCategory : AppEventCategory.DeCode<AppEventCategory>(p_oRow.aeCategoryId),
      eventSecteur  : AppEventSecteur .DeCode<AppEventSecteur >(p_oRow.aeSecteurId ),
      eventAction   : AppEventAction  .DeCode<AppEventAction  >(p_oRow.aeActionId  ),
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
   * 📊 Calcule la volumétrie totale absolue des journaux stockés sur le disque.
   */
  public async count(): Promise<number> {
    try {
      const l_rResult = await this.db.query('Select Count(*)::text as count From "Events"');
      return Number(l_rResult.rows[0]?.count ?? 0);
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('count', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

  /**
   * 🔎 Extrait un événement unique par son identifiant de soute.
   */
  public async findById(p_axEventId: AppEventId): Promise<AppEvent | null> {
    try {
      const l_rResult = await this.db.query(
        'Select * From "Events" Where "aeIdEvent" = $1',
        [p_axEventId.valeur] // Utilisation native de .valeur pour le type UUID de soute
      );
      if (l_rResult.rows.length === 0) return null;
      return l_rResult.rows[0]; // Remplacer par votre méthode d'hydratation rowToEntity s'il y a lieu
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('findById', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

  /**
   * 📜 Extracteur universel et paginé par Options (Souveraineté Fonctions Stockées V4)
   * Exploite les index unitaires et composites pour garantir les performances O(log N).
   */
    /**
   * 📜 Extracteur universel et paginé par Options (Souveraineté Fonctions Stockées V4)
   */
  public async listByOptions(p_oOptions?: IAppEventListOptions): Promise<IAppEventListResult> {
    const l_nNbLignes   = p_oOptions?.NbLignes ?? 50;
    const l_nLigneDebut = p_oOptions?.LigneDebut ?? 0;

    const l_rUserIdBin = p_oOptions?.userId ? p_oOptions.userId.binaire : null;

    // Les codes de dictionnaires restent de nature textuelle courte Char(4)
    const l_sSecteur  = p_oOptions?.aeSecteurId ? p_oOptions.aeSecteurId.valeur : null;
    const l_sAction   = p_oOptions?.aeActionId ? p_oOptions.aeActionId.valeur : null;
    const l_sCategory = p_oOptions?.aeCategoryId ? p_oOptions.aeCategoryId : null;
    const l_sSeverity = p_oOptions?.aeSeverityId ? p_oOptions.aeSeverityId : null;

    try {
      // L'appel SQL reste choupy, car c'est la fonction "FiltrerJournaux" qui applique le "Bin-UUID"
      // sur le paramètre $1 binaire qu'elle reçoit, protégeant l'index partiel de la base !
      const l_rResult = await this.db.query<IAppEventEnrichedRow & { totalCount: string }>(
        'Select * From "FiltrerJournaux"($1, $2, $3, $4, $5, $6, $7)',
        [l_rUserIdBin, l_sSecteur, l_sAction, l_sCategory, l_sSeverity, l_nNbLignes, l_nLigneDebut]
      );

      const l_nTotalAbsolu = Number(l_rResult.rows[0]?.totalCount ?? 0);

      return {
        items: this.rowsToEntities(l_rResult.rows),
        total: l_nTotalAbsolu
      };
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed('listByOptions', l_oErr instanceof Error ? l_oErr.message : 'unknown');
    }
  }

  public async findByUserId(p_axUserId: UserId, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_oResult = await this.listByOptions({ userId: p_axUserId, NbLignes: p_iNbLignesMax });
    return l_oResult.items;
  }

  public async findBySeverity(p_eSeverity: AppEventSeverity, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_oResult = await this.listByOptions({ aeSeverityId: p_eSeverity, NbLignes: p_iNbLignesMax });
    return l_oResult.items;
  }

  public async findByCategory(p_eCategory: AppEventCategory, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_oResult = await this.listByOptions({ aeCategoryId: p_eCategory, NbLignes: p_iNbLignesMax });
    return l_oResult.items;
  }

  public async findCritical(p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_oResult = await this.listByOptions({ NbLignes: p_iNbLignesMax });
    return l_oResult.items;
  }

  /**
   * 🧹 Purge historique physique des lignes d'audit obsolètes (Conformité RGPD).
   * Satisfait nominalement le contrat d'infrastructure de soute.
   *
   * @public
   * @async
   * @param {Date} p_dCutoffDate - La date pivot au-delà de laquelle tout est carbonisé.
   * @returns {Promise<number>} Le nombre exact de lignes d'audit purgées sur le disque.
   */
  public async purgeOlderThan(p_dCutoffDate: Date): Promise<number> {
    try {
      const l_oResult = await this.db.query(
        'Delete From "Events" Where "aeCreatedAt" < $1',
        [p_dCutoffDate]
      );

      // Sécurisation du retour : rowCount peut être null ou undefined selon les pilotes
      return l_oResult.rowCount ?? 0;
    } catch (l_oErr) {
      throw DatabaseErrorFactory.queryFailed(
        'purgeOlderThan',
        l_oErr instanceof Error ? l_oErr.message : 'unknown'
      );
    }
  }

}
