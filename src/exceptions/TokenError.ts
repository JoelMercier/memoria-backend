// ——— fichier : src/exceptions/TokenError.ts

import { ApiError } from '@/exceptions/ApiError';

/**
 * 🏛️ Classe TokenError
 * --------------------
 * Exception spécialisée pour les anomalies de la couche de transport et de sécurité des jetons.
 * Gère les échecs critiques d'infrastructure liés aux jetons d'authentification (HTTP 401).
 *
 * 💡 JUSTIFICATION DE L'EMPLACEMENT DIRECT DANS « src/exceptions/ » :
 * Tout comme PasswordError, ce fichier a été déraciné du sous-dossier éphémère /security/ pour être aligné à plat.
 * Pourquoi ? En Architecture Hexagonale pure, toutes les anomalies rejetées aux frontières
 * ou au cœur du Domaine partagent la même criticité et doivent être centralisées de manière
 * homogène. Créer des silos par sous-thématiques d'infrastructure (comme /security/) rompt
 * le principe de moindre surprise, complique inutilement la politique des alias d'imports,
 * et masque la visibilité globale des pannes applicatives sur une même couche technique.
 *
 * @class TokenError
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class TokenError extends ApiError {

  /**
   * 🏭 Fabrique statique : Signale un jeton altéré ou structurellement invalide.
   *
   * @static
   * @function invalid
   * @param {string} [reason] - Le motif technique de l'invalidité renvoyé par l'infrastructure
   * @returns {TokenError} L'instance vivante de l'exception configurée
   */
  public static invalid(reason?: string): TokenError {
    return new TokenError('Token invalide', 401, {
      code          : 'TOKEN_INVALID',
      ...(reason && { originalError: reason })
    });
  }

  /**
   * 🏭 Fabrique statique : Signale un jeton ayant dépassé sa limite de validité chronologique.
   *
   * @static
   * @function expired
   * @returns {TokenError} L'instance vivante de l'exception configurée
   */
  public static expired(): TokenError {
    return new TokenError('Token expiré', 401, {
      code : 'TOKEN_EXPIRED'
    });
  }

  /**
   * 🏭 Fabrique statique : Signale un jeton blacklisté ou révoqué manuellement en session.
   *
   * @static
   * @function revoked
   * @returns {TokenError} L'instance vivante de l'exception configurée
   */
  public static revoked(): TokenError {
    return new TokenError('Token révoqué', 401, {
      code : 'TOKEN_REVOKED'
    });
  }

  /**
   * 🏭 Fabrique statique : Rejette la requête si l'en-tête d'authentification est totalement absent.
   *
   * @static
   * @function missing
   * @returns {TokenError} L'instance vivante de l'exception configurée
   */
  public static missing(): TokenError {
    return new TokenError("Token d'authentification manquant", 401, {
      code : 'TOKEN_MISSING'
    });
  }

  /**
   * 🏭 Fabrique statique : Signale un jeton dont la typologie ou l'usage ne correspond pas au protocole attendu.
   *
   * @static
   * @function wrongType
   * @returns {TokenError} L'instance vivante de l'exception configurée
   */
  public static wrongType(): TokenError {
    return new TokenError('Type de token incorrect', 401, {
      code : 'TOKEN_WRONG_TYPE'
    });
  }
}
