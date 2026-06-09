// ——— fichier : src/services/security/BlacklistService.ts

import { IBlacklistRepository } from '@/interfaces/repositories/IBlacklistRepository';
import type { IBlacklistService } from '@/interfaces/security/IBlacklistService';

/**
 * 🏛️ Classe BlacklistService
 * --------------------------
 * Gestionnaire d'infrastructure pour la mise en quarantaine des jetons (Blacklist).
 * Neutralise instantanément les sessions révoquées (Logout, Rotation) avant leur date de péremption.
 *
 * @class BlacklistService
 * @implements {IBlacklistService}
 *
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Graveuse de lignes certifiées et sans bégayage)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Garde d'élite en surchauffe)
 */
export class BlacklistService implements IBlacklistService {
  /** 🗄️ Dépôt d'infrastructure abstrait injecté par la Forge */
  private readonly m_oBlacklistRepository: IBlacklistRepository;

  /**
   * Initialise le service avec son support d'infrastructure requis.
   *
   * @constructor
   * @param {IBlacklistRepository} p_oBlacklistRepository - Le dépôt de persistance de la liste noire
   */
  public constructor(p_oBlacklistRepository: IBlacklistRepository) {
    this.m_oBlacklistRepository = p_oBlacklistRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   * Centralise la souveraineté d'accès au dépôt d'infrastructure de quarantaine.
   *
   * @public
   * @returns {IBlacklistRepository} L'instance du dépôt d'infrastructure abstrait
   */
  public get repository(): IBlacklistRepository {
    return this.m_oBlacklistRepository;
  }

  /**
   * 🔏 Ajoute un identifiant de jeton (jti) au registre de quarantaine et déclenche une purge préventive.
   *
   * @public
   * @async
   * @param {string} p_sJti - L'identifiant unique (jti) du jeton d'accès à révoquer
   * @param {number} p_nExpiresAtEpochSeconds - L'horodatage Unix de péremption naturelle du jeton
   * @returns {Promise<void>}
   */
  public async add(p_sJti: string, p_nExpiresAtEpochSeconds: number): Promise<void> {
    await this.m_oBlacklistRepository.save(p_sJti, p_nExpiresAtEpochSeconds);
    await this.m_oBlacklistRepository.purgeExpired(this.nowSeconds());
  }

  /**
   * 🔍 Vérifie en temps réel si un identifiant (jti) fait l'objet d'une révocation active.
   *
   * @public
   * @async
   * @param {string} p_sJti - L'identifiant unique du jeton à vérifier à la douane
   * @returns {Promise<boolean>} Vrai si le jeton est banni et éjecté
   */
  public async isBlacklisted(p_sJti: string): Promise<boolean> {
    return await this.m_oBlacklistRepository.exists(p_sJti);
  }

  /**
   * 📊 Extrait la volumétrie physique actuelle de la table de quarantaine résidente.
   *
   * @public
   * @async
   * @returns {Promise<number>} Le nombre total d'entrées actives stockées sur le support d'infrastructure
   */
  public async size(): Promise<number> {
    return await this.m_oBlacklistRepository.count();
  }

  /**
   * ⏱️ Calcule l'horodatage courant normalisé au standard d'infrastructure Unix Epoch (secondes).
   *
   * @private
   * @returns {number} Le nombre de secondes écoulées depuis l'Epoch
   */
  private nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }
}
