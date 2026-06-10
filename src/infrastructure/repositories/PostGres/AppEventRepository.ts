// ——— fichier : src/infrastructure/repositories/AppEventRepository.ts

import type { QueryResultRow }        from 'pg';
import { BaseRepository }       from '@/infrastructure/repositories/BaseRepositories';
import { UserId, AppEventId }   from '@/domain/value-objects/ids';
import { AppEvent }             from '@/entities/AppEvent';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { AppEventErrorFactory } from '@/exceptions/AppEventErrorFactory';
import { AppEventSeverity }     from '@/constants/AppEventSeverity';
import { AppEventCategory }     from '@/constants/AppEventCategory';
import { AppEventSecteur }      from '@/constants/AppEventSecteur';
import { AppEventAction }       from '@/constants/AppEventAction';
import type { IDatabaseConnection }  from '@/interfaces/database/IDatabaseConnection';
import type { IAppEventData, IAppEventRepository, IAppEventListOptions, IAppEventListResult } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IListOptions }         from '@/interfaces/shared/IListOptions';
import type { IListResult }          from '@/interfaces/shared/IListResult';
import OrdreTriEnum             from '@/constants/OrdreTriEnum';

interface IAppEventRow extends QueryResultRow {
  IdEvent    : Buffer;
  UserId     : Buffer | null;
  CreatedAt  : Date;
  idCategory : string;
  idSeverity : string;
  idSecteur  : string;
  idAction   : string;
  Message    : string;
  Metadata   : Record<string, unknown>;
  NbLignesTotal?: string;
}

export class AppEventRepository extends BaseRepository implements IAppEventRepository {

  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);
  }

  private rowToAppEvent(p_oRow: IAppEventRow): AppEvent {
    return new AppEvent({
      idAppEvent    : new AppEventId(p_oRow.aeIdEvent),
      userId        : p_oRow.aeUserId ? new UserId(p_oRow.aeUserId) : null,
      eventCategory : AppEventCategory.DeCode<AppEventCategory>(p_oRow.CategoryId),
      severity      : AppEventSeverity.DeCode<AppEventSeverity>(p_oRow.SeverityId),
      eventSecteur  : AppEventSecteur.DeCode<AppEventSecteur>(p_oRow.SecteurId),
      eventAction   : AppEventAction.DeCode<AppEventAction>(p_oRow.ActionId),
      message       : p_oRow.aeMessage,
      metadata      : p_oRow.aeMetadata,
      createdAt     : p_oRow.aeCreatedAt
    } as any);
  }

  public async create(p_oData: IAppEventData): Promise<AppEvent> {
    try {
      const l_oResult = await this.db.query<IAppEventRow>(
        'Select * From public."ConsignerEvenement"($1, $2, $3, $4, $5, $6, $7, $8);',
        [
          p_oData.aeIdAppEvent,
          p_oData.aeUserId ?? null,
          p_oData.aeCategoryId,
          p_oData.aeSeverityId,
          p_oData.aeSecteurId,
          p_oData.aeActionId,
          p_oData.aeMessage,
          p_oData.aeMetadata ?? {}
        ]
      );
      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        throw AppEventErrorFactory.creation(`Aucun enregistrement renvoyé lors de la consignation`);
      }
      return this.rowToAppEvent(l_oResult.rows[0]);
    } catch (l_oErr) {
      if (l_oErr instanceof AppEventErrorFactory) throw l_oErr;
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      if (l_sMsg.includes('Events_aeUserId_Fkey')) {
        const l_oIdInconnu = p_oData.aeUserId ?? new UserId(Buffer.from('00000000000000000000000000000000', 'hex'));
        throw AppEventErrorFactory.userIdUnknown(l_oIdInconnu);
      }
      throw AppEventErrorFactory.creation(l_sMsg);
    }
  }

  public async findById(p_axEventId: AppEventId): Promise<AppEvent | null> {
    try {
      const l_oResult = await this.db.query<IAppEventRow>(
        'Select * From public."Events" Where "aeIdEvent" = "Bin-UUID"($1);',
        [p_axEventId]
      );
      return l_oResult.rows ? this.rowToAppEvent(l_oResult.rows[0]) : null;
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findById', l_sMsg);
    }
  }


  /**
   * 📜 EXTRACTEUR UNIVERSIEL : Retourne votre format historique AppEvents / TotalEvents.
   */
  public async listByOptions(p_oOptions: IAppEventListOptions): Promise<IAppEventListResult> {
    try {
      const l_nLimit    = p_oOptions.NbLignes ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';

      // 🪓 [RÉPARÉ TS2339] Extraction via .valeur de vos Value Objects d'écurie
      const l_sSecteurText = p_oOptions.secteurId ? p_oOptions.secteurId.valeur : null;
      const l_sActionText  = p_oOptions.actionId  ? p_oOptions.actionId.valeur  : null;

      const l_oResult = await this.db.query<IAppEventRow>(
        'Select * From "ToutesLesTraces"($1, $2, $3, $4, $5, $6, $7, $8, $9);',
        [
          p_oOptions.userId ?? null,
          l_sSecteurText,
          l_sActionText,
          p_oOptions.categoryId?.code ?? null,
          p_oOptions.severityId?.code ?? null,
          l_nLimit,
          l_nOffset,
          p_oOptions.ColonneTri ?? 'aeCreatedAt',
          l_sOrdreTri
        ]
      );

      const l_nTotal = Number(l_oResult.rows[0]?.NbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.rowToAppEvent(l_oRow));

      // 🗲 [RETOUR ANCIEN RÉGIME SANCTUARISÉ] Parfaitement conforme à IAppEventListResult !
      return {
        AppEvents:   l_aoLignes,
        TotalEvents: l_nTotal
      };
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('listByOptions', l_sMsg);
    }
  }


   /**
   * 📊 Calcule la volumétrie totale absolue de tous les journaux stockés sur le disque.
   * [RÉPARÉ TS2339] Ciblage chirurgical de la première ligne brute du tas !
   *
   * @public
   * @async
   * @returns {Promise<number>} Le nombre total d'enregistrements dans la table Events
   */
  public async count(): Promise<number> {
    try {
      const l_oResult = await this.db.query<{ count: string } & QueryResultRow>(
        'Select Count(*)::Text as count From public."Events";'
      );
      return Number(l_oResult.rows[0]?.count ?? 0);
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('count', l_sMsg);
    }
  }

  /**
   * 🗲 [RÉPARÉ TS2345] Extraction par utilisateur.
   * Construit un objet d'options complet honorant IListOptions et les clés 3NF !
   */
  public async findByUserId(p_axUserId: UserId, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_oResult = await this.listByOptions({
      userId:      p_axUserId,
      NbLignes:    p_iNbLignesMax ?? 50,
      LigneDebut:  0,
      ColonneTri:  'aeCreatedAt',
      OrdreAff:    OrdreTriEnum.DeCode<OrdreTriEnum>('DESC')
    });
    return l_oResult.AppEvents;
  }

  /**
   * 🗲 [RÉPARÉ TS2345] Extraction par sévérité.
   * Raccordé nominalement sur la clé d'acier aeSeverityId !
   */
  public async findBySeverity(p_eSeverity: AppEventSeverity, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_oResult = await this.listByOptions({
      severityId: p_eSeverity,
      NbLignes:    p_iNbLignesMax ?? 50,
      LigneDebut:  0,
      ColonneTri:  'aeCreatedAt',
      OrdreAff:    OrdreTriEnum.DeCode<OrdreTriEnum>('DESC')
    });
    return l_oResult.AppEvents;
  }

  /**
   * 🗲 [RÉPARÉ TS2345] Extraction par catégorie.
   * Raccordé nominalement sur la clé d'acier aeCategoryId !
   */
  public async findByCategory(p_eCategory: AppEventCategory, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_oResult = await this.listByOptions({
      categoryId: p_eCategory,
      NbLignes:    p_iNbLignesMax ?? 50,
      LigneDebut:  0,
      ColonneTri:  'aeCreatedAt',
      OrdreAff:    OrdreTriEnum.DeCode<OrdreTriEnum>('DESC')
    });
    return l_oResult.AppEvents;
  }

  /** 🗲 [RÉPARÉ TS2345] Extraction des alertes critiques système. */
  public async findCritical(p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_oResult = await this.listByOptions({
      severityId: AppEventSeverity.DeCode<AppEventSeverity>('CRIT'),
      NbLignes:    p_iNbLignesMax ?? 50,
      LigneDebut:  0,
      ColonneTri:  'aeCreatedAt',
      OrdreAff:    OrdreTriEnum.DeCode<OrdreTriEnum>('DESC')
    });
    return l_oResult.AppEvents;
  }

  /**
   * 👥 Rompt le lien ombilical avec l'acteur pour les logs de plus de 6 mois (Anonymisation RGPD).
   */
  public async anonymiserLogsActeurs(p_dDateCutoff: Date): Promise<number> {
    try {
      const l_oResult = await this.db.query(
        'Update "Events" Set "aeUserId" = Null Where "aeCreatedAt" < $1 and "aeUserId" is Not Null;',
        [p_dDateCutoff]
      );
      return l_oResult.rowCount ?? 0;
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('anonymiserLogsActeurs', l_sMsg);
    }
  }

  /**
   * 📜 ANCÊTRE OBLIGATOIRE : Raccordé sur le standard générique français d'élite.
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<AppEvent>> {
    try {
      const l_nLimit    = p_oOptions.NbLignes ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';

      const l_oResult = await this.db.query<IAppEventRow>(
        'Select * From public."ToutesLesTracesDuChateau"($1, $2, $3, $4);',
        [l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'aeCreatedAt', l_sOrdreTri]
      );

      // 🪓 [RÉPARÉ TS2339] Extraction de la volumétrie depuis la première ligne !
      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.rowToAppEvent(l_oRow));

      return {
        LigneDebut:    l_nOffset,
        NbLignesDem:   l_nLimit,
        NbLignesRenv:  l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes:        l_aoLignes
      };
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findAll', l_sMsg);
    }
  }

  /**
   * 🪓 Destruction physique définitive de toutes les traces de plus d'un an du disque.
   */
  public async deleteOlderThan(p_dCutoffDate: Date): Promise<number> {
    try {
      const l_oResult = await this.db.query(
        'Delete From "Events" Where "aeCreatedAt" < $1;',
        [p_dCutoffDate]
      );
      return l_oResult.rowCount ?? 0;
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('deleteOlderThan', l_sMsg);
    }
  }
}
