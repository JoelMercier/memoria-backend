// ——— fichier : src/interfaces/security/IBlacklistService.ts

import { IBaseService }         from '@/interfaces/services/IBaseService';
import { IBlacklistRepository } from '@/interfaces/repositories/IBlacklistRepository';

/**
 * 🔒 Interface IBlacklistService 🛡️
 * ----------------------------------------------------------------------------
 * Contrat d'infrastructure gérant la mise en quarantaine des jetons (Blacklist).
 * Neutralise instantanément les sessions révoquées (Logout, Rotation) avant leur date de péremption.
 * Hérite de la souveraineté d'accès au registre via le contrat générique de base.
 *
 * @interface IBlacklistService
 * @extends {IBaseService<IBlacklistRepository>}
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IBlacklistService extends IBaseService<IBlacklistRepository> {

  /**
   * Accesseur unique et immuable vers le dépôt d'infrastructure principal du service.
   * Expose de manière sécurisée la structure de persistance pour le Domaine.
   *
   * @returns {IBlacklistRepository} Le dépôt de persistance abstrait
   */
  get repository(): IBlacklistRepository;

  /**
   * 🔏 Ajoute un identifiant de jeton (jti) au registre de quarantaine et déclenche une purge préventive.
   *
   * @async
   */
  add(p_sJti: string, p_nExpiresAtEpochSeconds: number): Promise<void>;

  /**
   * 🔍 Vérifie en temps réel si un identifiant (jti) fait l'objet d'une révocation active.
   *
   * @async
   */
  isBlacklisted(p_sJti: string): Promise<boolean>;

  /**
   * 📊 Extrait la volumétrie physique actuelle de la table de quarantaine résidente.
   *
   * @async
   */
  size(): Promise<number>;
}
