// ——— fichier : src/interfaces/services/IBaseEventService.ts

import type { AppEvent            } from '@/entities/AppEvent';
import type { EventId             } from '@/domain/value-objects/ids';
import type { IAppEventData       } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IAppEventRepository } from '@/interfaces/repositories/PostGres/IAppEventRepository';

import { IBaseService }         from '@/interfaces/services/IBaseService';
/**
 * 🏛️ Interface IBaseEventService 🛡️
 * ----------------------------------------------------------------------------
 * Contrat racine centralisant l'accès à l'infrastructure d'audit de la Forge.
 * Éradique définitivement les instanciations sauvages en factorisant le dépôt d'accès.
 * [RÉPARÉ V4] Raccordé de manière étanche à 4 arguments génériques sur l'ancêtre !
 *
 * @interface IBaseEventService
 * @extends {IBaseService<AppEvent, IAppEventData, AppEventId, IAppEventRepository>}
 * @author Directrice du Silicium : Joël (Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets)
 * @author Ouvriers du Code : La Vague Initiale (Contrebande de logs et traçabilité)
 */
export interface IBaseEventService extends IBaseService<AppEvent, IAppEventData, EventId, IAppEventRepository> {
  /**
   * Accesseur unique et immuable vers le dépôt d'infrastructure d'audit.
   * Centralise la souveraineté de l'accès à la table physique "Events" via le contrat générique.
   * [RÉPARÉ V4] Renvoie l'interface contractuelle abstraite et non la classe concrète !
   *
   * @returns {IAppEventRepository} Le dépôt d'infrastructure configuré
   */
  get repository(): IAppEventRepository;
}
