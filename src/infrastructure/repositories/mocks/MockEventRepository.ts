// ——— fichier : src/infrastructure/repositories/mocks/MockAppEventRepository.ts

import type { IAppEventRepository, IAppEventListOptions, IAppEventListResult } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IListOptions }                                                  from '@/interfaces/shared/IListOptions';
import type { IListResult }                                                   from '@/interfaces/shared/IListResult';
import type { CategorieId, EventId, UserId, SeveriteId }                      from '@/domain/value-objects/ids';
import type { IAppEventData }                                                 from '@/interfaces/entities/event/IAppEventData';

import { AppEvent } from '@/entities/AppEvent';

/**
 * 🗄️ Classe MockAppEventRepository 🧮 (Le Coffre-Fort de Simulation des Logs 🤖)
 * ----------------------------------------------------------------------------
 * Émule en mémoire active le journal d'audit immuable et persistant "Events".
 */
export class MockEventRepository implements IAppEventRepository {
  /** 🧠 Le registre virtuel immuable des événements d'audit stocké en RAM */
  private m_aoEvents : AppEvent[] = [];

  /**
   * 🎰 True Getter privé centralisé régissant l'accès à la soute de RAM.
   */
  private get events() : AppEvent[] {
    return this.m_aoEvents;
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un log via son identifiant unique binaire 🤖.
   */
  public async findById(p_axEventId: EventId) : Promise<AppEvent | null> {
    return this.events.find((l_oEvent: AppEvent): boolean => (l_oEvent as any).idEvent?.estEgalA(p_axEventId)) ?? null;
  }

  /**
   * 👥 Extraction historique ciblée par acteur, respectant la pagination universelle.
   */
  public async findByUserId(p_axUserId: UserId, p_oOptions: IListOptions) : Promise<IAppEventListResult> {
    return this.listByOptions({
      ...p_oOptions,
      userId : p_axUserId
    });
  }

  /**
   * ⚠️ Extraction historique filtrée par sévérité stricte, assortie de la pagination universelle.
   */
  public async findBySeverite(p_axSeveriteId: SeveriteId, p_oOptions: IListOptions) : Promise<IAppEventListResult> {
    return this.listByOptions({
      ...p_oOptions,
      severiteId : p_axSeveriteId
    });
  }

  /**
   * 🗂️ Extraction historique filtrée par catégorie fonctionnelle, assortie de la pagination universelle.
   */
  public async findByCategorie(p_axCategorieId: CategorieId, p_oOptions: IListOptions) : Promise<IAppEventListResult> {
    return this.listByOptions({
      ...p_oOptions,
      categorieId : p_axCategorieId
    });
  }

  /**
   * 🚨 Extrait les alertes d'incidents critiques du système dans la limite du gabarit.
   */
  public async findCritical(p_iNbLignesMax?: number) : Promise<AppEvent[] | null> {
    const l_nLimit    = p_iNbLignesMax ?? 50;
    const l_aoFiltres = this.events.filter((l_oEvent: AppEvent): boolean => l_oEvent.Severite.code === 'CRIT');

    if (l_aoFiltres.length === 0) return null;
    return l_aoFiltres.slice(0, l_nLimit);
  }

  /**
   * 📜 Extrait la liste paginée, filtrée et indexée des logs d'un utilisateur donné.
   */
  public async listByOptions(p_oOptions: IAppEventListOptions) : Promise<IAppEventListResult> {
    let l_aoFiltres = [...this.events];

    if (p_oOptions.userId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.UserId !== null && l_oEvent.UserId.estEgalA(p_oOptions.userId!));
    }
    if (p_oOptions.secteurId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.Secteur.code === p_oOptions.secteurId!.valeur);
    }
    if (p_oOptions.actionId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.Action.code === p_oOptions.actionId!.valeur);
    }
    if (p_oOptions.categorieId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.Categorie.code === p_oOptions.categorieId!.valeur);
    }
    if (p_oOptions.severiteId) {
      l_aoFiltres = l_aoFiltres.filter((l_oEvent) => l_oEvent.Severite.code === p_oOptions.severiteId!.valeur);
    }

    const l_nTotal  = l_aoFiltres.length;
    const l_nOffset = p_oOptions.LigneDebut ?? 0;
    const l_nLimit  = p_oOptions.NbLignes   ?? 50;

    l_aoFiltres.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const l_aoPage  = l_aoFiltres.slice(l_nOffset, l_nOffset + l_nLimit);

    return {
      AppEvents   : l_aoPage,
      TotalEvents : l_nTotal
    };
  }

  /**
   * 🪓 Enregistre une trace d'audit immuable en RAM.
   */
  public async create(p_oData: IAppEventData) : Promise<AppEvent> {
    const l_oEvent = new AppEvent({
      idEvent        : p_oData.idEvent,
      userId         : p_oData.userId,
      categorie      : p_oData.categorie,
      eventseverite  : p_oData.severite,
      eventSecteur   : p_oData.secteur,
      eventAction    : p_oData.action,
      message        : p_oData.message,
      metadata       : p_oData.metadata,
      createdAt      : p_oData.createdAt ?? new Date()
    } as any);

    this.events.push(l_oEvent);
    return l_oEvent;
  }

  /** 📊 Simulation du décompte absolu */
  public async count() : Promise<number> {
    return this.events.length;
  }

  /** 👥 Simulation de l'anonymisation RGPD en RAM */
  public async anonymiserLogsActeurs(p_dDateCutoff: Date) : Promise<number> {
    let l_nModifiees = 0;
    this.m_aoEvents  = this.events.map((l_oEvent: AppEvent) : AppEvent => {
      if (l_oEvent.createdAt < p_dDateCutoff && l_oEvent.UserId !== null) {
        l_nModifiees++;
        return new AppEvent({
          idEvent        : (l_oEvent as any).idEvent,
          userId         : null,
          categorie      : l_oEvent.Categorie,
          eventseverite  : l_oEvent.Severite,
          eventSecteur   : l_oEvent.Secteur,
          eventAction    : l_oEvent.Action,
          message        : l_oEvent.Message,
          metadata       : l_oEvent.Metadata,
          createdAt      : l_oEvent.createdAt
        } as any);
      }
      return l_oEvent;
    });
    return l_nModifiees;
  }

  /** 🪓 Simulation de la purge physique */
  public async deleteOlderThan(p_dDateCutoff: Date) : Promise<number> {
    const l_nInitial = this.events.length;
    this.m_aoEvents  = this.events.filter((l_oEvent) => l_oEvent.createdAt >= p_dDateCutoff);
    return l_nInitial - this.events.length;
  }

  /**
   * 📜 ANCÊTRE OBLIGATOIRE : Raccordé sur le standard générique français d'élite.
   */
  public async findAll(p_oOptions: IListOptions) : Promise<IListResult<AppEvent>> {
    const l_nTotal  = this.events.length;
    const l_nLimit  = p_oOptions.NbLignes   ?? 50;
    const l_nOffset = p_oOptions.LigneDebut ?? 0;

    this.events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const l_aoPage  = this.events.slice(l_nOffset, l_nOffset + l_nLimit);

    return {
      LigneDebut    : l_nOffset,
      NbLignesDem   : l_nLimit,
      NbLignesRenv  : l_aoPage.length,
      NbLignesTotal : l_nTotal,
      Lignes        : l_aoPage
    };
  }
}
