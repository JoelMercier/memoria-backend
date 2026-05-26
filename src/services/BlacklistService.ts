// ——— fichier : src/services/security/BlacklistService.ts

import type { IBlacklistService } from '@/interfaces/security/IBlacklistService';

/**
 * 🏛️ Classe BlacklistService
 * --------------------------
 * Gestionnaire d'infrastructure en mémoire pour la mise en quarantaine des jetons (Blacklist).
 * Neutralise instantanément les sessions révoquées (Logout, Rotation) avant leur date de péremption.
 *
 * ⚠️ LIMITATION TECHNIQUE : Le registre réside en RAM et s'efface lors du redémarrage du serveur.
 * Évolutions futures industrielles à envisager : Migration vers Redis ou une table PostgreSQL.
 *
 * @class BlacklistService
 * @implements {IBlacklistService}
 * @author Joël, Gaïa & Co
 */
export class BlacklistService implements IBlacklistService {

  /** 🗄️ Registre interne associant l'identifiant unique du jeton (jti) à son expiration (Unix seconds) */
  private readonly m_rEntries : Map<string, number> = new Map();

  /**
   * 🔏 Ajoute un identifiant de jeton (jti) au registre de quarantaine et déclenche une purge préventive.
   *
   * @public
   * @function add
   * @param {string} jti - L'identifiant universel unique du jeton à bannir
   * @param {number} expiresAtEpochSeconds - Horodatage Unix de fin de validité théorique
   */
  public add(jti: string, expiresAtEpochSeconds: number): void {
    this.m_rEntries.set(jti, expiresAtEpochSeconds);
    this.cleanup();
  }

  /**
   * 🔍 Vérifie en temps réel si un identifiant (jti) fait l'objet d'une révocation active.
   * Supprime l'entrée au passage si celle-ci a dépassé sa date limite (auto-nettoyage opportuniste).
   *
   * @public
   * @function isBlacklisted
   * @param {string} jti - L'identifiant à tester
   * @returns {boolean} True si le jeton est banni et toujours valide
   */
  public isBlacklisted(jti: string): boolean {
    const exp : number | undefined = this.m_rEntries.get(jti);

    if (exp === undefined) {
      return false;
    }

    if (this.nowSeconds() > exp) {
      this.m_rEntries.delete(jti);
      return false;
    }

    return true;
  }

  /**
   * 📊 Extrait la volumétrie physique actuelle de la table de quarantaine résidente.
   *
   * @public
   * @function size
   * @returns {number} Le nombre total d'entrées maintenues en RAM
   */
  public size(): number {
    return this.m_rEntries.size;
  }

  /**
   * 🧹 Routine interne de nettoyage des entrées obsolètes (Garbage collection applicatif).
   * Limite la croissance de l'empreinte mémoire à chaque écriture.
   *
   * @private
   * @function cleanup
   */
  private cleanup(): void {
    const now : number = this.nowSeconds();

    for (const [jti, exp] of this.m_rEntries) {
      if (now > exp) {
        this.m_rEntries.delete(jti);
      }
    }
  }

  /**
   * ⏱️ Calcule l'horodatage courant normalisé au standard d'infrastructure Unix Epoch (secondes).
   *
   * @private
   * @function nowSeconds
   * @returns {number} Timestamp en secondes
   */
  private nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }
}
