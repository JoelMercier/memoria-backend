// ——— fichier : src/interfaces/security/IBlacklistService.ts

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
   * @returns {IBlacklistRepository} Le dépôt de persistance abstrait
   */
  get repository(): IBlacklistRepository;

  /**
   * 🔏 Ajoute un identifiant de jeton (jti) au registre de quarantaine et déclenche une purge préventive.
   *
   * @async
   * @param {string} p_sJti - L'identifiant unique du jeton JWT à révoquer
   * @param {number} p_nExpiresAtEpochSeconds - Le timestamp absolu d'expiration du jeton
   * @returns {Promise<void>}
   */
  add(p_sJti: string, p_nExpiresAtEpochSeconds: number): Promise<void>;

  /**
   * 🔍 Vérifie en temps réel si un identifiant (jti) fait l'objet d'une révocation active.
   *
   * @async
   * @param {string} p_sJti - L'identifiant de jeton à auditer à la douane
   * @returns {Promise<boolean>} True si le jeton a été révoqué (Logout ou usurpation)
   */
  isBlacklisted(p_sJti: string): Promise<boolean>;

  /**
   * 📊 Extrait la volumétrie physique actuelle de la table de quarantaine résidente.
   *
   * @async
   * @returns {Promise<number>} Le nombre total de jetons actuellement sous séquestre
   */
  size(): Promise<number>;
}
