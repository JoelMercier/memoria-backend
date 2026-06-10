// ——— fichier : src/interfaces/services/IBlacklistService.ts

import { IBlacklistRepository } from '@/interfaces/repositories/IBlacklistRepository';

/**
 * 🔒 Interface IBlacklistService 🛡️
 * ----------------------------------------------------------------------------
 * Contrat d'infrastructure gérant la mise en quarantaine des jetons (Blacklist).
 * Neutralise instantanément les sessions révoquées (Logout, Rotation) avant leur date de péremption.
 * [ALIGNÉ PUR V4] Émancipée d'IBaseService pour éliminer l'enflure de types génériques fictifs.
 *
 * @interface IBlacklistService
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IBlacklistService {

  /**
   * Accesseur unique et immuable vers le dépôt d'infrastructure principal du service.
   * Expose de manière sécurisée la structure de persistance pour le Domaine.
   *
   * @returns {IBlacklistRepository} Le dépôt de persistance abstrait de la liste noire
   */
  get repository(): IBlacklistRepository;

  /**
   * 🔏 Ajoute un identifiant de jeton (jti) au registre de quarantaine et déclenche une purge préventive.
   *
   * @async
   * @param {string} p_sJti - L'identifiant unique (jti) du jeton d'accès à révoquer
   * @param {number} p_nExpiresAtEpochSeconds - L'horodatage Unix de péremption naturelle du jeton
   * @returns {Promise<void>}
   */
  add(p_sJti: string, p_nExpiresAtEpochSeconds: number): Promise<void>;

  /**
   * 🔍 Vérifie en temps réel si un identifiant (jti) fait l'objet d'une révocation active.
   *
   * @async
   * @param {string} p_sJti - L'identifiant unique du jeton à vérifier à la douane de sécurité
   * @returns {Promise<boolean>} Vrai si le jeton est banni et éjecté du système
   */
  isBlacklisted(p_sJti: string): Promise<boolean>;

  /**
   * 📊 Extrait la volumétrie physique actuelle de la table de quarantaine résidente.
   *
   * @async
   * @returns {Promise<number>} Le nombre total d'entrées actives stockées en base d'infrastructure
   */
  size(): Promise<number>;
}
