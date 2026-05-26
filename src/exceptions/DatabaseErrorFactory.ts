// ——— fichier : src/exceptions/DatabaseErrorFactory.ts

import { ApiError } from '@/exceptions/ApiError';

/**
 * 🏛️ Classe DatabaseErrorFactory
 * -------------------------------
 * Fabrique spécialisée pour la levée d'anomalies liées à la couche persistance PostgreSQL.
 * Centralise et standardise les anomalies HTTP 404, 409, 500 et 503 d'infrastructure basse.
 *
 * 💡 JUSTIFICATION DE L'EMPLACEMENT DIRECT DANS « src/exceptions/ » :
 * Tout comme ses consœurs de sécurité, cette fabrique a été extraite de son sous-dossier
 * éphémère /database/ pour être alignée à plat à la racine. En Architecture Hexagonale pure,
 * l'uniformité de la couche des exceptions prime : siloter les erreurs par origine
 * technique (base de données, sécurité, etc.) complexifie inutilement l'arbre des imports
 * et rompt le principe de moindre surprise pour le reste du Domaine. Tout à plat, et point barre !
 *
 * @class DatabaseErrorFactory
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class DatabaseErrorFactory extends ApiError {

  /**
   * 🏭 Fabrique statique : Trame l'échec critique lors de l'exécution d'une requête SQL.
   *
   * @static
   * @function queryFailed
   * @param {string} operation - Le libellé ou la trame de l'action SQL tentée
   * @param {string} originalError - Le message ou le stack renvoyé par le pilote pg
   * @returns {DatabaseErrorFactory} L'instance vivante de l'exception d'infrastructure
   */
  public static queryFailed(operation: string, originalError: string): DatabaseErrorFactory {
    return new DatabaseErrorFactory(`Échec de l'opération en base : ${operation}`, 500, {
      code          : 'DB_QUERY_FAILED',
      operation     : operation,
      originalError : originalError
    });
  }

  /**
   * 🏭 Fabrique statique : Signale une rupture ou indisponibilité du pool de connexions (HTTP 503).
   *
   * @static
   * @function connectionLost
   * @returns {DatabaseErrorFactory} L'instance vivante de l'exception d'infrastructure
   */
  public static connectionLost(): DatabaseErrorFactory {
    return new DatabaseErrorFactory('Connexion à la base de données perdue', 503, {
      code : 'DB_CONNECTION_LOST'
    });
  }

  /**
   * 🏭 Fabrique statique : Signale un enregistrement physique manquant au niveau des tables PostgreSQL.
   * Conserve la string brute d'identification exigée par le transport d'infrastructure d'accès.
   *
   * @static
   * @function notFound
   * @param {string} entity - Le nom de la table ou de l'entité concernée (ex: 'user')
   * @param {string} identifier - L'identifiant physique brut de la ligne manquante
   * @returns {DatabaseErrorFactory} L'instance vivante de l'exception d'infrastructure
   */
  public static notFound(entity: string, identifier: string): DatabaseErrorFactory {
    return new DatabaseErrorFactory(`${entity} introuvable : ${identifier}`, 404, {
      code       : 'NOT_FOUND',
      entity     : entity,
      identifier : identifier
    });
  }

  /**
   * 🏭 Fabrique statique : Traduit une violation de contrainte UNIQUE interceptée depuis le moteur SQL.
   *
   * @static
   * @function uniqueViolation
   * @param {string} constraint - Le nom de la contrainte PostgreSQL violée
   * @returns {DatabaseErrorFactory} L'instance vivante de l'exception d'infrastructure
   */
  public static uniqueViolation(constraint: string): DatabaseErrorFactory {
    return new DatabaseErrorFactory(`Violation d'unicité : ${constraint}`, 409, {
      code       : 'UNIQUE_VIOLATION',
      constraint : constraint
    });
  }
}
