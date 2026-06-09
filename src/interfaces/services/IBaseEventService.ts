// ——— fichier : src/interfaces/services/IBaseEventService.ts

import { IBaseService }       from '@/interfaces/services/IBaseService';
import { AppEventRepository } from '@/infrastructure/repositories/AppEventRepository';

/**
 * 🏛️ Interface IBaseEventService 🛡️
 * ----------------------------------------------------------------------------
 * Contrat racine centralisant l'accès à l'infrastructure d'audit de la Forge.
 * Éradique définitivement les instanciations sauvages en factorisant le dépôt d'accès.
 *
 * @interface IBaseEventService
 * @extends {IBaseService<AppEventRepository>}
 * @author Directrice du Silicium : Joël (Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets)
 * @author Ouvriers du Code : La Vague Initiale (Contrebande de logs et traçabilité)
 */
export interface IBaseEventService extends IBaseService<AppEventRepository> {
  /**
   * Accesseur unique et immuable vers le dépôt d'infrastructure d'audit.
   * Centralise la souveraineté de l'accès à la table physique "Events" via le contrat générique.
   *
   * @returns {AppEventRepository} Le dépôt d'infrastructure configuré
   */
  get repository(): AppEventRepository;
}
