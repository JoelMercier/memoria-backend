// ——— fichier : src/interfaces/security/IBlacklistService.ts

/**
 * 🔒 Interface IBlacklistService
 * ------------------------------
 * Contrat d'infrastructure régissant la mise en quarantaine des jetons révoqués (Blacklist).
 * Permet de neutraliser immédiatement les sessions compromises avant leur expiration naturelle.
 *
 * @interface IBlacklistService
 * @author Joël, Gaïa & Co
 */
export interface IBlacklistService {

  /** 🔏 Ajoute l'identifiant unique d'un jeton (jti) dans le registre des sessions révoquées. */
  add(jti: string, expiresAtEpochSeconds: number): void;

  /** 🔍 Vérifie si l'identifiant du jeton (jti) est présent dans le registre de quarantaine. */
  isBlacklisted(jti: string): boolean;

  /** 📊 Extrait le nombre total cumulé de jetons actuellement maintenus en quarantaine. */
  size(): number;
}
