// ——— fichier : src/infrastructure/repositories/mocks/MockAppEventRepository.ts

import { AppEvent }             from '@/entities/AppEvent';
import { AppEventId, UserId }   from '@/domain/value-objects/ids';
import { AppEventSeverity }     from '@/constants/AppEventSeverity';
import { AppEventCategory }     from '@/constants/AppEventCategory';
import type { IAppEventData, IAppEventRepository, IAppEventListOptions, IAppEventListResult } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IListOptions }         from '@/interfaces/shared/IListOptions';
import type { IListResult }          from '@/interfaces/shared/IListResult';

/**
 * 🗄️ Classe MockAppEventRepository 🧮 (Le Coffre-Fort de Simulation des Logs 🤖)
 * ----------------------------------------------------------------------------
 * Émule en mémoire active le journal d'audit immuable et persistant "Events".
 * Aligné au caractère près sur votre interface réelle.
 *
 * @class MockAppEventRepository
 * @implements {IAppEventRepository}
 * @author Vision : Joël (C++ Framework Architect - Adaptive Soute Engine)
 * @author Métallurgie des Octets : Gaïa (Au burin, calée sur les clés physiques réelles)
 */
export class MockAppEventRepository implements IAppEventRepository {
  /** 🧠 Le registre virtuel immuable des événements d'audit stocké en RAM */
  private m_aoEvents: AppEvent[] = [];

  /**
   * 🔍 Lecture chirurgicale : Localise un log via son identifiant unique binaire 🤖.
   */
  public async findById(p_axEventId: AppEventId): Promise<AppEvent | null> {
    return this.m_aoEvents.find((l_oEvent: AppEvent): boolean => l_oEvent.AppEventId.estEgalA(p_axEventId)) ?? null;
  }

  /**
   * 👥 Extraction historique ciblée par acteur restreinte par un gabarit maximal de sécurité.
   */
  public async findByUserId(p_axUserId: UserId, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_nLimit = p_iNbLignesMax ?? 50;
    const l_aoFiltres = this.m_aoEvents.filter((l_oEvent: AppEvent): boolean => {
      const l_axUserId = l_oEvent.UserId;
      return l_axUserId !== null && l_axUserId !== undefined && l_axUserId.estEgalA(p_axUserId);
    });

    if (l_aoFiltres.length === 0) return null;
    return l_aoFiltres.slice(0, l_nLimit);
  }

  /**
   * ⚠️ Extraction historique filtrée par sévérité stricte assortie d'une limite physique.
   */
  public async findBySeverity(p_eSeverity: AppEventSeverity, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_nLimit = p_iNbLignesMax ?? 50;
    const l_aoFiltres = this.m_aoEvents.filter((l_oEvent: AppEvent): boolean => l_oEvent.Severity === p_eSeverity);

    if (l_aoFiltres.length === 0) return null;
    return l_aoFiltres.slice(0, l_nLimit);
  }

  /**
   * 🗂️ Extraction historique filtrée par catégorie fonctionnelle avec limite physique.
   */
  public async findByCategory(p_eCategory: AppEventCategory, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_nLimit = p_iNbLignesMax ?? 50;
    const l_aoFiltres = this.m_aoEvents.filter((l_oEvent: AppEvent): boolean => l_oEvent.EventCategory === p_eCategory);

    if (l_aoFiltres.length === 0) return null;
    return l_aoFiltres.slice(0, l_nLimit);
  }

  /**
   * 🚨 Extrait les alertes d'incidents critiques du système dans la limite du gabarit.
   */
  public async findCritical(p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_nLimit = p_iNbLignesMax ?? 50;
    const l_aoFiltres = this.m_aoEvents.filter((l_oEvent: AppEvent): boolean => l_oEvent.Severity.code === 'CRIT');

    if (l_aoFiltres.length === 0) return null;
    return l_aoFiltres.slice(0, l_nLimit);
  }

  /**
   * 📜 Extrait la liste paginée, filtrée et indexée des logs d'un utilisateur donné.
   * [RÉPARÉ TS2551] Alignement sur les clés exactes de l'en-tête (secteurId, actionId, categoryId, severityId).
   */
  public async listByOptions(p_oOptions: IAppEventListOptions): Promise<IAppEventListResult> {
    let l_aoFiltres = this.m_aoEvents;

    if (p_oOptions.userId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.UserId !== null && l_oEvent.UserId.estEgalA(p_oOptions.userId!));
    }
    if (p_oOptions.secteurId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.EventSecteur.code === p_oOptions.secteurId!.valeur);
    }
    if (p_oOptions.actionId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.EventAction.code === p_oOptions.actionId!.valeur);
    }
    if (p_oOptions.categoryId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.EventCategory === p_oOptions.categoryId);
    }
    if (p_oOptions.severityId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.Severity === p_oOptions.severityId);
    }

    const l_nTotal = l_aoFiltres.length;
    const l_nOffset = p_oOptions.LigneDebut ?? 0;
    const l_nLimit = p_oOptions.NbLignes ?? 50;

    l_aoFiltres.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const l_aoPage = l_aoFiltres.slice(l_nOffset, l_nOffset + l_nLimit);

    return {
      AppEvents:   l_aoPage,
      TotalEvents: l_nTotal
    };
  }

  /**
   * 🪓 Enregistre une trace d'audit immuable en RAM.
   */
  public async create(p_oData: IAppEventData): Promise<AppEvent> {
    const l_oEvent = new AppEvent({
      idAppEvent    : p_oData.aeIdAppEvent,
      userId        : p_oData.aeUserId,
      eventCategory : p_oData.aeCategoryId,
      severity      : p_oData.aeSeverityId,
      eventSecteur  : p_oData.aeSecteurId,
      eventAction   : p_oData.aeActionId,
      message       : p_oData.aeMessage,
      metadata      : p_oData.aeMetadata,
      createdAt     : p_oData.aeCreatedAt || new Date()
    } as any);
    this.m_aoEvents.push(l_oEvent);
    return l_oEvent;
  }

  /** 📊 Simulation du décompte absolu */
  public async count(): Promise<number> {
    return this.m_aoEvents.length;
  }

  /** 👥 Simulation de l'anonymisation RGPD en RAM */
  public async anonymiserLogsActeurs(p_dDateCutoff: Date): Promise<number> {
    let l_nModifiees = 0;
    this.m_aoEvents.forEach((l_oEvent: any) => {
      if (l_oEvent.createdAt < p_dDateCutoff && l_oEvent.UserId !== null) {
        (l_oEvent as any).m_idUser = null;
        l_nModifiees++;
      }
    });
    return l_nModifiees;
  }

  /** 🪓 Simulation de la purge physique */
  public async deleteOlderThan(p_dDateCutoff: Date): Promise<number> {
    const l_nInitial = this.m_aoEvents.length;
    this.m_aoEvents = this.m_aoEvents.filter((l_oEvent) => l_oEvent.createdAt >= p_dDateCutoff);
    return l_nInitial - this.m_aoEvents.length;
  }

  /**
   * 📜 ANCÊTRE OBLIGATOIRE : Raccordé sur le standard générique français d'élite.
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<AppEvent>> {
    const l_nTotal = this.m_aoEvents.length;
    const l_nLimit = p_oOptions.NbLignes ?? 50;
    const l_nOffset = p_oOptions.LigneDebut ?? 0;

    this.m_aoEvents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const l_aoPage = this.m_aoEvents.slice(l_nOffset, l_nOffset + l_nLimit);

    return {
      LigneDebut:    l_nOffset,
      NbLignesDem:   l_nLimit,
      NbLignesRenv:  l_aoPage.length,
      NbLignesTotal: l_nTotal,
      Lignes:        l_aoPage
    };
  }
}
