// ——— fichier : src/services/AppEventAdminService.ts

import { IAppEventAdminService } from '@/interfaces/services/IAppEventAdminService';
import { IAppEventService      } from '@/interfaces/services/IAppEventService';
import { AppEventCategory      } from '@/constants/AppEventCategory';
import { AppEventSeverity      } from '@/constants/AppEventSeverity';
import { AppEventSecteur       } from '@/constants/AppEventSecteur';
import { AppEventAction        } from '@/constants/AppEventAction';
import { AppEventId            } from '@/domain/value-objects/ids';
import { IAppEventRepository   } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { AppEvent }         from '@/entities/AppEvent';
import OrdreTriEnum from '@/constants/OrdreTriEnum';

/**
 * 🏛️ Classe AppEventAdminService 🚨
 * ----------------------------------------------------------------------------
 * Service de haut niveau réservé à l'administration et au monitoring système.
 * Exploite les fonctions statistiques et de purge de l'infrastructure d'audit.
 *
 * @class AppEventAdminService
 * @implements {IAppEventAdminService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, alignement chirurgical des types)
 */
export class AppEventAdminService implements IAppEventAdminService {
  /** 🗄️ Dépôt d'infrastructure d'audit unique injecté sous forme d'interface contractuelle */
  private readonly m_oAppEventRepository: IAppEventRepository;

  /** 🔐 Le port frère d'émission injecté pour consigner les intentions de purge */
  private readonly m_oAppEventService: IAppEventService;

  /**
   * Initialise le service d'administration avec ses dépendances par inversion de contrôle.
   *
   * @constructor
   * @param {IAppEventRepository} p_oAppEventRepository - Le contrat d'interface du dépôt d'audit
   * @param {IAppEventService} p_oAppEventService - Le service frère d'émission des logs
   */
  public constructor(
    p_oAppEventRepository: IAppEventRepository,
    p_oAppEventService: IAppEventService
  ) {
    this.m_oAppEventRepository = p_oAppEventRepository;
    this.m_oAppEventService = p_oAppEventService;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseEventService.
   * [SOUDURE ÉLITE TS2416] Transtypage chirurgical pour satisfaire l'exigence de la classe concrète d'infrastructure.
   *
   * @public
   * @returns {any} L'instance du dépôt d'infrastructure convertie pour le type de base
   */
  public get repository(): any {
    return this.m_oAppEventRepository;
  }

  /**
   * Accesseur historique conservé pour compatibilité ou spécificité d'audit.
   * [SOUDURE ÉLITE TS2416] Transtypage chirurgical pour satisfaire l'exigence de la classe concrète d'infrastructure.
   *
   * @public
   * @returns {any} L'instance du dépôt d'infrastructure convertie pour le type de base
   */
  public get eventRepository(): any {
    return this.m_oAppEventRepository;
  }

  /**
   * 🔎 Récupère un log d'audit spécifique par son identifiant unique fort ("aeIdEvent").
   *
   * @public
   * @async
   * @param {AppEventId} p_axIdEvent - L'identifiant unique fort de l'événement recherché
   * @returns {Promise<AppEvent | null>} L'entité de l'événement trouvée ou null
   */
  public async getById(p_axIdEvent: AppEventId): Promise<AppEvent | null> {
    return this.m_oAppEventRepository.findById(p_axIdEvent);
  }

  /**
   * 🚨 Opération interdite : Les journaux d'audit ne peuvent pas être modifiés.
   *
   * @public
   * @async
   * @throws {Error} Systématiquement pour sceller l'intégrité de la Forge
   * @returns {Promise<never>}
   */
  public async updateLog(): Promise<never> {
    throw new Error('[Erreur Sécurité] Violation d\'intégrité : L\'administration n\'a pas le droit de modifier un log d\'audit.');
  }

  /**
   * 📊 Extrait la liste complète des journaux pour le tableau de bord d'administration.
   *
   * @public
   * @async
   * @returns {Promise<AppEvent[]>} La collection complète des entités d'événement d'audit
   */
  public async getAllLogs(): Promise<AppEvent[]> {
    const l_oPackageResult = await this.m_oAppEventRepository.listByOptions({ NbLignes: 100, LigneDebut: 0, ColonneTri: 'aeCreatedAt', OrdreAff: OrdreTriEnum.oDecroissant });
    return l_oPackageResult.AppEvents;
  }

  /**
   * 🚨 Opération interdite : Les suppressions unitaires de logs sont prohibées.
   *
   * @public
   * @async
   * @throws {Error} Systématiquement pour verrouiller la sécurité de production
   * @returns {Promise<never>}
   */
  public async deleteLog(): Promise<never> {
    throw new Error('[Erreur Sécurité] Violation d\'intégrité : L\'administration n\'a pas le droit de supprimer un log unitaire.');
  }

  /**
   * 🧹 Purge historique réglementaire automatique (Conformité RGPD).
   *
   * @public
   * @async
   * @param {Date} p_dCutoffDate - La date pivot d'ancienneté maximale autorisée pour les données nominatives
   * @returns {Promise<number>} Le nombre réel de lignes purgées sur le disque PostgreSQL
   * @throws {Error} Si la date pivot viole la durée minimale légale de rétention de 180 jours de la CNIL
   */
  public async purgeOlderThan(p_dCutoffDate: Date): Promise<number> {
    const l_nSixMoisEnMillisecondes = 180 * 24 * 60 * 60 * 1000;
    const l_dDateMinimumLegale = new Date(Date.now() - l_nSixMoisEnMillisecondes);

    if (p_dCutoffDate.getTime() > l_dDateMinimumLegale.getTime()) {
      throw new Error('[Erreur RGPD] Violation de conformité CNIL : Il est interdit de purger des journaux d\'audit de moins de 6 mois (180 jours).');
    }

    // 🔬 ÉTAPE 1 : Log d'intention applicative AVANTE la purge via le service frère d'exploitation
    await this.m_oAppEventService.log({
      userId: null,
      eventCategory: AppEventCategory.AUDI,
      eventSecteur: AppEventSecteur.SYST,
      eventAction: AppEventAction.PURG,
      severity: AppEventSeverity.WARN,
      message: `Ordre d'administration : Lancement de la purge réglementaire des logs antérieurs au ${p_dCutoffDate.toISOString()}.`
    });

    // ⚙️ ÉTAPE 2 : Déclenchement de la suppression physique par le bras armé du Repository
    return this.m_oAppEventRepository.deleteOlderThan(p_dCutoffDate);
  }
}
