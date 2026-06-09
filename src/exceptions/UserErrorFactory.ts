// ——— fichier : src/exceptions/UserErrorFactory.ts

import { ApiError } from '@/exceptions/ApiError';
import { UserId   } from '@/domain/value-objects/ids';

/**
 * 🏛️ Classe UserErrorFactory
 * ---------------------------
 * Fabrique spécialisée pour la levée d'anomalies liées à la gestion des utilisateurs et profils.
 * Centralise et standardise les réponses HTTP 401, 404, 409 et 500 pour la couche Domaine.
 *
 * 💡 JUSTIFICATION DE L'EMPLACEMENT DIRECT DANS « src/exceptions/ » :
 * Ce fichier a été déraciné du sous-dossier éphémère /entities/ pour être aligné à plat.
 * Pourquoi ? En Architecture Hexagonale pure, toutes les anomalies rejetées aux frontières
 * ou au cœur du Domaine partagent la même criticité et doivent être centralisées de manière
 * homogène. Créer des silos par sous-thématiques d'infrastructure (comme /entities/) rompt
 * le principe de moindre surprise, complique inutilement la politique des alias d'imports,
 * et masque la visibilité globale des pannes applicatives sur une même couche technique.
 *
 * @class UserErrorFactory
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class UserErrorFactory extends ApiError {

  /**
   * 🏭 Fabrique statique : Signale un utilisateur introuvable par son identifiant unique fort.
   *
   * @static
   * @function notFound
   * @param {UserId} userId - L'identifiant fort de l'utilisateur recherché
   * @returns {UserErrorFactory} L'instance vivante de l'exception configurée
   */
  public static notFound(userId: UserId): UserErrorFactory {
    return new UserErrorFactory(`Utilisateur introuvable : ${userId.valeur}`, 404, {
      code       : 'USER_NOT_FOUND',
      identifier : userId.valeur
    });
  }

  /**
   * 🏭 Fabrique statique : Signale une collision d'adresse de correspondance sur le réseau.
   *
   * @static
   * @function emailExists
   * @param {string} email - L'adresse électronique en doublon
   * @returns {UserErrorFactory} L'instance vivante de l'exception configurée
   */
  public static emailExists(email: string): UserErrorFactory {
    return new UserErrorFactory(`L'email « ${email} » est déjà utilisé.`, 409, {
      code  : 'USER_EMAIL_EXISTS',
      field : 'email',
      value : email
    });
  }

  /**
   * 🏭 Fabrique statique : Interdit l'accès initial en cas d'échec de vérification des secrets (Connexion).
   *
   * @static
   * @function invalidCredentials
   * @returns {UserErrorFactory} L'instance vivante de l'exception configurée
   */
  public static invalidCredentials(): UserErrorFactory {
    return new UserErrorFactory('Email ou mot de passe incorrect.', 401, {
      code : 'INVALID_CREDENTIALS'
    });
  }

  /**
   * 🏭 Fabrique statique : Trame l'échec critique lors de l'instanciation d'un nouvel acteur en base.
   *
   * @static
   * @function creation
   * @param {string} originalError - Le message ou stack de l'erreur d'infrastructure basse
   * @returns {UserErrorFactory} L'instance vivante de l'exception configurée
   */
  public static creation(originalError: string): UserErrorFactory {
    return new UserErrorFactory("Erreur lors de la création de l'utilisateur", 500, {
      code          : 'USER_CREATION_FAILED',
      originalError : originalError
    });
  }

  /**
   * 🏭 Fabrique statique : Bloque l'action de mise à jour si le mot de passe de contrôle est invalide.
   *
   * @static
   * @function wrongPassword
   * @returns {UserErrorFactory} L'instance vivante de l'exception configurée
   */
  public static wrongPassword(): UserErrorFactory {
    return new UserErrorFactory('Mot de passe actuel incorrect.', 401, {
      code : 'WRONG_PASSWORD'
    });
  }

  /**
   * 🏭 Fabrique statique : Signale un conflit d'unicité lors d'une modification partielle de profil.
   *
   * @static
   * @function profileConflict
   * @param {string} field - Le nom du champ en conflit (ex: 'pseudo')
   * @param {string} value - La valeur provoquant la collision
   * @returns {UserErrorFactory} L'instance vivante de l'exception configurée
   */
  public static profileConflict(field: string, value: string): UserErrorFactory {
    return new UserErrorFactory(`Le champ « ${field} » est déjà utilisé.`, 409, {
      code  : 'PROFILE_CONFLICT',
      field : field,
      value : value
    });
  }
}
