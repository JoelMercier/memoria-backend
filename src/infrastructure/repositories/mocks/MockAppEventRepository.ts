// ——— fichier : src/infrastructure/repositories/mocks/MockAppEventRepository.ts

import { AppEvent             } from '@/entities/AppEvent';
import { AppEventId, UserId   } from '@/domain/value-objects/ids';
import { AppEventCategory     } from '@/constants/AppEventCategory';
import { AppEventSeverity     } from '@/constants/AppEventSeverity';
import type {
  IAppEventData,
  IAppEventListOptions,
  IAppEventListResult,
  IAppEventRepository
}                               from '@/interfaces/repositories/IAppEventRepository';

/**
 * 🗄️ Classe MockAppEventRepository 🧮 (Le Coffre-Fort de Simulation des Logs 🤖)
 * ----------------------------------------------------------------------------
 * Émule en mémoire active le journal d'audit immuable et persistant "Events".
 * Valide les flux de traçabilité et de supervision système de Mémoria [Mémoria].
 *
 * @class MockAppEventRepository
 * @implements {IAppEventRepository}
 * @author Déconstruction : Joël (Nostalgique de l'AS/400 et d'ADA)
 * @author Ciselage du code : Gaïa (Génie autoproclamée du burin)
 */
export class MockAppEventRepository implements IAppEventRepository {
  /** 🧠 Le registre virtuel immuable des événements d'audit stocké en RAM */
  private m_aoEvents: AppEvent[] = [];

  /**
   * 🔍 Lecture chirurgicale : Localise un log via son identifiant unique binaire 🤖.
   *
   * @public
   * @async
   * @param {AppEventId} p_oIdEvent - L'identifiant binaire fort du log à localiser
   * @returns {Promise<AppEvent | null>} L'instance du log réarmée ou null si absent
   */
  public async findById(p_oIdEvent: AppEventId): Promise<AppEvent | null> {
    return this.m_aoEvents.find((l_oEvent: AppEvent): boolean => l_oEvent.getAppEventId().estEgalA(p_oIdEvent)) ?? null;
  }

  /**
   * 👥 Extrait la liste brute des derniers logs rattachés à un utilisateur spécifique.
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L'identifiant de l'acteur cible à auditer
   * @param {number} [p_iNbLignesMax] - Limite physique optionnelle de lignes
   * @returns {Promise<AppEvent[] | null>} Le catalogue des traces ou null si vide
   */
  public async findByUserId(p_oUserId: UserId, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_iLimit = p_iNbLignesMax ?? 20;

    // Sécurisation RGPD : Vérification obligatoire de la nullité de la clé usUserId avant comparaison
    const la_oFiltres = this.m_aoEvents.filter((l_oEvent: AppEvent): boolean => {
      const l_oUserId = l_oEvent.getUserId();
      return l_oUserId !== null && l_oUserId !== undefined && l_oUserId.estEgalA(p_oUserId);
    });

    if (la_oFiltres.length === 0) return null;
    return la_oFiltres.slice(0, l_iLimit);
  }

  /**
   * ⚠️ Extrait les derniers logs correspondant à un niveau de sévérité précis.
   *
   * @public
   * @async
   * @param {AppEventSeverity} p_eSeverity - L'énumérateur riche de criticité à filtrer
   * @param {number} [p_iNbLignesMax] - Limite physique de sécurité opérationnelle
   * @returns {Promise<AppEvent[] | null>} Les traces correspondantes ou null si vide
   */
  public async findBySeverity(p_eSeverity: AppEventSeverity, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_iLimit = p_iNbLignesMax ?? 20;

    const la_oFiltres = this.m_aoEvents.filter((l_oEvent: AppEvent): boolean => {
      const l_oData = l_oEvent.toData();
      return l_oData !== null && l_oData.severity === p_eSeverity;
    });

    if (la_oFiltres.length === 0) return null;
    return la_oFiltres.slice(0, l_iLimit);
  }

  /**
   * 🗂️ Extrait les derniers logs correspondant à une catégorie fonctionnelle spécifique.
   *
   * @public
   * @async
   * @param {AppEventCategory} p_eCategory - L'énumérateur riche du domaine cible
   * @param {number} [p_iNbLignesMax] - Limite physique de sécurité opérationnelle
   * @returns {Promise<AppEvent[] | null>} Les traces correspondantes ou null si vide
   */
  public async findByCategory(p_eCategory: AppEventCategory, p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_iLimit = p_iNbLignesMax ?? 20;

    const la_oFiltres = this.m_aoEvents.filter((l_oEvent: AppEvent): boolean => {
      const l_oData = l_oEvent.toData();
      return l_oData !== null && l_oData.eventCategory === p_eCategory;
    });

    if (la_oFiltres.length === 0) return null;
    return la_oFiltres.slice(0, l_iLimit);
  }

  /**
   * 🚨 Récupère en priorité absolue les derniers logs critiques du système.
   *
   * @public
   * @async
   * @param {number} [p_iNbLignesMax] - Limite physique de sécurité opérationnelle
   * @returns {Promise<AppEvent[] | null>} Les alertes maximales système ou null si vide
   */
  public async findCritical(p_iNbLignesMax?: number): Promise<AppEvent[] | null> {
    const l_iLimit = p_iNbLignesMax ?? 20;

    const la_oFiltres = this.m_aoEvents.filter((l_oEvent: AppEvent): boolean => {
      const l_oData = l_oEvent.toData();
      // Alignement Quadrigramme V4 : Filtrage sur le code technique 'CRIT'
      return l_oData !== null && l_oData.severity === AppEventSeverity.CRIT;
    });

    if (la_oFiltres.length === 0) return null;
    return la_oFiltres.slice(0, l_iLimit);
  }

  /**
   * 📜 Extrait la liste paginée, filtrée et indexée des logs d'un utilisateur donné.
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L'identifiant de l'acteur cible à auditer
   * @param {IAppEventListOptions} [p_oOptions] - Le sac de filtres et tris d'écran
   * @returns {Promise<IAppEventListResult>} La structure de restitution paginée
   */
  public async listByUserId(p_oUserId: UserId, p_oOptions?: IAppEventListOptions): Promise<IAppEventListResult> {
    // Sécurisation contre le crash usUserId Null géré en amont
    let la_oFiltres = this.m_aoEvents.filter((l_oEvent: AppEvent): boolean => {
      const l_oUserId = l_oEvent.getUserId();
      return l_oUserId !== null && l_oUserId !== undefined && l_oUserId.estEgalA(p_oUserId);
    });

    la_oFiltres = la_oFiltres.filter((l_oEvent: AppEvent): boolean => {
      const l_oData = l_oEvent.toData();
      if (!l_oData) return false;

      if (p_oOptions?.eventType && l_oData.eventType !== p_oOptions.eventType) return false;
      if (p_oOptions?.eventCategory && l_oData.eventCategory !== p_oOptions.eventCategory) return false;
      if (p_oOptions?.severity && l_oData.severity !== p_oOptions.severity) return false;

      return true;
    });

    const l_iTotal  = la_oFiltres.length;
    const l_iOffset = p_oOptions?.IndexDepart ?? 0;
    const l_iLimit  = p_oOptions?.NbLignesMax ?? 20;

    const la_oTriees = la_oFiltres.sort((p_oEventA, p_oEventB) => {
      const l_oDataA = p_oEventA.toData();
      const l_oDataB = p_oEventB.toData();
      const l_iTimeA = l_oDataA?.createdAt?.getTime() ?? 0;
      const l_iTimeB = l_oDataB?.createdAt?.getTime() ?? 0;
      return l_iTimeB - l_iTimeA;
    });

    return {
      items : la_oTriees.slice(l_iOffset, l_iOffset + l_iLimit),
      total : l_iTotal
    };
  }

  /**
   * 🪓 Enregistre une trace d'audit immuable en RAM.
   *
   * @public
   * @async
   * @param {IAppEventData} p_oData - Le sac de données complet exigé par l'interface
   * @returns {Promise<AppEvent>} L'instance de l'entité d'audit forgée
   */
  public async create(p_oData: IAppEventData): Promise<AppEvent> {
    // Raccordement chirurgical des zones message et metadata exigées par l'interface
    const l_oEvent = new AppEvent({
      idAppEvent    : p_oData.idAppEvent,
      userId        : p_oData.userId,
      eventCategory : p_oData.eventCategory,
      eventType     : p_oData.eventType,
      severity      : p_oData.severity,
      message       : p_oData.message,
      metadata      : p_oData.metadata,
      createdAt     : p_oData.createdAt ?? new Date()
    });
    this.m_aoEvents.push(l_oEvent);
    return l_oEvent;
  }

  /**
   * 🏺 Extrait l'intégralité absolue des journaux de simulation.
   *
   * @public
   * @async
   * @returns {Promise<AppEvent[]>} La collection exhaustive du journal virtuel
   */
  public async findAll(): Promise<AppEvent[]> {
    return [...this.m_aoEvents];
  }
}
