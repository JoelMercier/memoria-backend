// ——— fichier : src/exceptions/PasswordError.ts

import { ApiError } from '@/exceptions/ApiError';

/**
 * 🏛️ Classe PasswordError
 * -----------------------
 * Exception spécialisée pour les anomalies de la couche de sécurité des secrets.
 * Gère les échecs critiques d'infrastructure liés au hachage (HTTP 500).
 *
 * 💡 JUSTIFICATION DE L'EMPLACEMENT DIRECT DANS « src/exceptions/ » :
 * Ce fichier a été déraciné du sous-dossier éphémère /security/ pour être aligné à plat.
 * Pourquoi ? En Architecture Hexagonale pure, toutes les anomalies rejetées aux frontières
 * ou au cœur du Domaine partagent la même criticité et doivent être centralisées de manière
 * homogène. Créer des silos par sous-thématiques d'infrastructure (comme /security/) rompt
 * le principe de moindre surprise, complique inutilement la politique des alias d'imports,
 * et masque la visibilité globale des pannes applicatives sur une même couche technique.
 *
 * @class PasswordError
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class PasswordError extends ApiError {

  /**
   * 🏭 Fabrique statique : Signale un échec critique lors du hachage asynchrone d'un secret brut.
   *
   * @static
   * @function hashFailed
   * @param {string} originalError - Le message ou le stack renvoyé par le module cryptographique
   * @returns {PasswordError} L'instance vivante de l'exception configurée
   */
  public static hashFailed(originalError: string): PasswordError {
    return new PasswordError('Échec du hashage du mot de passe', 500, {
      code          : 'PASSWORD_HASH_FAILED',
      originalError : originalError
    });
  }

  /**
   * 🏭 Fabrique statique : Signale un échec critique interne lors de la vérification d'un hash.
   *
   * @static
   * @function verifyFailed
   * @param {string} originalError - Le message ou le stack d'erreur de la bibliothèque de hachage
   * @returns {PasswordError} L'instance vivante de l'exception configurée
   */
  public static verifyFailed(originalError: string): PasswordError {
    return new PasswordError('Échec de la vérification du mot de passe', 500, {
      code          : 'PASSWORD_VERIFY_FAILED',
      originalError : originalError
    });
  }
}
