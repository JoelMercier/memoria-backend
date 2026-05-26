// ——— fichier : src/exceptions/ConflictErrorFactory.ts

import { ApiError } from '@/exceptions/ApiError';

/**
 * 🏛️ Classe ConflictErrorFactory
 * ------------------------------
 * Fabrique spécialisée pour la levée d'anomalies de type HTTP 409 Conflict.
 * Centralise et uniformise la gestion des violations d'unicité et des collisions métier.
 *
 * Le pattern factory permet de garder les messages cohérents, isolés et localisés.
 *
 * @class ConflictErrorFactory
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class ConflictErrorFactory extends ApiError {

  /**
   * 🏭 Fabrique statique : Signale une collision d'identifiant ou de pseudonyme utilisateur.
   *
   * @static
   * @function usernameExists
   * @param {string} username - Le pseudonyme ou nom d'utilisateur incriminé
   * @returns {ConflictErrorFactory} L'instance vivante de l'exception configurée
   */
  public static usernameExists(username: string): ConflictErrorFactory {
    return new ConflictErrorFactory(`Le nom d'utilisateur « ${username} » est déjà utilisé.`, 409, {
      code  : 'USERNAME_EXISTS',
      field : 'username',
      value : username
    });
  }

  /**
   * 🏭 Fabrique statique : Signale une collision de permalien (Slug) sur une ressource.
   *
   * @static
   * @function slugExists
   * @param {string} slug - Le slug en doublon
   * @returns {ConflictErrorFactory} L'instance vivante de l'exception configurée
   */
  public static slugExists(slug: string): ConflictErrorFactory {
    return new ConflictErrorFactory(`Le slug « ${slug} » est déjà utilisé.`, 409, {
      code  : 'SLUG_EXISTS',
      field : 'slug',
      value : slug
    });
  }
}
