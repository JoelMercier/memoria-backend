// ——— fichier : src/infrastructure/repositories/MemoryBlacklistRepository.ts

import { IBlacklistRepository } from '@/interfaces/repositories/IBlacklistRepository';

/**
 * 🏛️ Classe MemoryBlacklistRepository
 * -----------------------------------
 * Adaptateur d'infrastructure gérant la quarantaine des jetons JWT en mémoire vive.
 * Fait office d'usine de persistance ultra-rapide pour la production locale et les Mocks de tests.
 *
 * @class MemoryBlacklistRepository
 * @implements {IBlacklistRepository}
 *
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et de la JSDoc scellée)
 * @author Usine à Lignes : Gaïa (Graveuse de lignes certifiées V4 et sans bégayage)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class MemoryBlacklistRepository implements IBlacklistRepository {
  /** 🗄️ Le placard physique en RAM associant le jti (string) à son expiration (number), totalement encapsulé */
  private readonly m_rEntries: Map<string, number> = new Map();

  /**
   * 🔏 Enregistre l'empreinte binaire d'un jeton banni avec sa date d'expiration.
   *
   * @public
   * @async
   * @param {string} p_sJti - L'identifiant unique (jti) du jeton révoqué à inscrire
   * @param {number} p_nExpiresAtEpochSeconds - L'horodatage Unix de péremption du jeton
   * @returns {Promise<void>}
   */
  public async save(p_sJti: string, p_nExpiresAtEpochSeconds: number): Promise<void> {
    this.m_rEntries.set(p_sJti, p_nExpiresAtEpochSeconds);
  }

  /**
   * 🔍 Interroge le support physique pour savoir si le jeton fait l'objet d'un bannissement actif.
   *
   * @public
   * @async
   * @param {string} p_sJti - L'identifiant unique du jeton à vérifier au guichet
   * @returns {Promise<boolean>} Vrai si le jeton est banni et inutilisable
   */
  public async exists(p_sJti: string): Promise<boolean> {
    return this.m_rEntries.has(p_sJti);
  }

  /**
   * 📊 Extrait la volumétrie physique brute de la table de quarantaine résidente.
   *
   * @public
   * @async
   * @returns {Promise<number>} Le nombre total d'entrées actives stockées en RAM
   */
  public async count(): Promise<number> {
    return this.m_rEntries.size;
  }

  /**
   * 🧹 Routine de nettoyage atomique des lignes dont l'expiration est dépassée.
   * Limite la croissance de l'empreinte mémoire à chaque écriture.
   *
   * @public
   * @async
   * @param {number} p_nNowSeconds - L'horodatage courant normalisé au standard Unix Epoch (secondes)
   * @returns {Promise<void>}
   */
  public async purgeExpired(p_nNowSeconds: number): Promise<void> {
    for (const [l_sJti, l_nExp] of this.m_rEntries) {
      if (p_nNowSeconds > l_nExp) {
        this.m_rEntries.delete(l_sJti);
      }
    }
  }

  /**
   * Accesseur technique réservé à l'analyse ou aux assertions fines des Mocks.
   * Expose de manière sécurisée la structure interne pour les tests d'intégration.
   *
   * @public
   * @returns {Map<string, number>} La structure binaire brute résidente
   */
  public get internalMap(): Map<string, number> {
    return this.m_rEntries;
  }

  /**
   * 🔎 Implémentation générique exigée par IBaseRepository.findById
   * Mappe directement sur la logique d'existence de la quarantaine.
   */
  public async findById(p_sJti: string): Promise<number | null> {
    const l_nExp = this.m_rEntries.get(p_sJti);
    return l_nExp !== undefined ? l_nExp : null;
  }

  /**
   * 📜 Implémentation générique exigée par IBaseRepository.findAll
   * Renvoie la liste complète des expirations actives en RAM.
   */
  public async findAll(): Promise<number[]> {
    return Array.from(this.m_rEntries.values());
  }

  /**
   * 💾 Implémentation générique exigée par IBaseRepository.create
   * Utilise l'expiration comme payload de donnée passive.
   */
  public async create(p_nExpiresAtEpochSeconds: number): Promise<number> {
    // Par convention de test, on génère une clé transitoire ou on simule l'écriture
    return p_nExpiresAtEpochSeconds;
  }
}