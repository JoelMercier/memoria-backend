// ——— fichier : src/services/AppEventAdminService.ts

import type { AppEvent } from '@/entities/AppEvent';
import type { IAppEventAdminService } from '@/interfaces/services/IAppEventAdminService';
import type { IAppEventService } from '@/interfaces/services/IAppEventService';
import { AppEventCategory } from '@/constants/Categories';
import { AppEventSeverity } from '@/constants/Severity';
import { AppEventSecteur } from '@/constants/Secteur';
import { AppEventAction } from '@/constants/Actions';
import type { AppEventId } from '@/domain/value-objects/ids';
import type { IAppEventRepository } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import { OrdreTriEnum } from '@/constants/OrdreTriEnum';

/**
 * 🏛️ Classe AppEventAdminService 🚨
 * ----------------------------------------------------------------------------
 * Service de haut niveau réservé à l'administration et au monitoring système.
 *
 * @class AppEventAdminService
 * @implements {IAppEventAdminService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, alignement chirurgical des types)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class AppEventAdminService implements IAppEventAdminService {
  /** 🗄️ Dépôt d'infrastructure d'audit unique injecté sous forme d'interface contractuelle */
  private readonly m_oAppEventRepository: IAppEventRepository;

  /** 🔐 Le port frère d'émission injecté pour consigner les intentions de purge */
  private readonly m_oAppEventService: IAppEventService;

  /**
   * Initialise le service d'administration avec ses dépendances par inversion de contrôle.
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
   * [SCELLÉ RÉALINÉ V4] Retourne le vrai type dur de l'interface pour satisfaire ESLint !
   */
  public get repository(): IAppEventRepository {
    return this.m_oAppEventRepository;
  }

  /**
   * Accesseur historique conservé pour compatibilité ou spécificité d'audit.
   * [SCELLÉ RÉALINÉ V4] Retourne le vrai type dur de l'interface pour satisfaire ESLint !
   */
  public get eventRepository(): IAppEventRepository {
    return this.m_oAppEventRepository;
  }

  /**
   * Accesseur public immuable pour le service frère d'émission des logs.
   */
  public get eventService(): IAppEventService {
    return this.m_oAppEventService;
  }

  /**
   * 🔎 Récupère un log d'audit spécifique par son identifiant unique fort ("aeIdEvent").
   */
  public async getById(p_axIdEvent: AppEventId): Promise<AppEvent | null> {
    // 🪓 ALIGNEMENT SOUVERAIN V4 : Utilisation du await direct requis par la règle require-await
    return await this.repository.findById(p_axIdEvent);
  }

  /**
   * 🚨 Opération interdite : Les journaux d'audit ne peuvent pas être modifiés.
   */
  public async updateLog(): Promise<never> {
    // 🪓 ALIGNEMENT SOUVERAIN V4 : Utilisation de Promise.reject pour honorer la signature asynchrone sans await interne
    return Promise.reject(
      new Error(
        "[Erreur Sécurité] Violation d'intégrité : L'administration n'a pas le droit de modifier un log d'audit."
      )
    );
  }

  /**
   * 📊 Extrait la liste complète des journaux pour le tableau de bord d'administration.
   */
  public async getAllLogs(): Promise<AppEvent[]> {
    const l_oPackageResult = await this.repository.listByOptions({
      NbLignes: 100,
      LigneDebut: 0,
      ColonneTri: 'aeCreatedAt',
      OrdreAff: OrdreTriEnum.oDecroissant
    });
    return l_oPackageResult.AppEvents;
  }

  /**
   * 🚨 Opération interdite : Les suppressions unitaires de logs sont prohibées.
   */
  public async deleteLog(): Promise<never> {
    // 🪓 ALIGNEMENT SOUVERAIN V4 : Utilisation de Promise.reject pour honorer la signature asynchrone sans await interne
    return Promise.reject(
      new Error(
        "[Erreur Sécurité] Violation d'intégrité : L'administration n'a pas le droit de supprimer un log unitaire."
      )
    );
  }

  /**
   * 🧹 Purge historique réglementaire automatique (Conformité RGPD).
   */
  public async purgeOlderThan(p_dCutoffDate: Date): Promise<number> {
    const l_nSixMoisEnMillisecondes = 180 * 24 * 60 * 60 * 1000;
    const l_dDateMinimumLegale = new Date(Date.now() - l_nSixMoisEnMillisecondes);

    if (p_dCutoffDate.getTime() > l_dDateMinimumLegale.getTime()) {
      throw new Error(
        "[Erreur RGPD] Violation de conformité CNIL : Il est interdit de purger des journaux d'audit de moins de 6 mois (180 jours)."
      );
    }

    await this.eventService.log({
      userId: null,
      eventCategory: AppEventCategory.AUDI,
      eventSecteur: AppEventSecteur.SYST,
      eventAction: AppEventAction.PURG,
      severity: AppEventSeverity.WARN,
      message: `Ordre d'administration : Lancement de la purge réglementaire des logs antérieurs au ${p_dCutoffDate.toISOString()}.`
    });

    return await this.repository.deleteOlderThan(p_dCutoffDate);
  }
}
