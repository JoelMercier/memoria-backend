// ——— fichier : src/exceptions/EventErrorFactory.ts

import { ApiError } from '@/exceptions/ApiError';
import { EventId  } from '@/domain/value-objects/IdMetier';

/**
 * 🏛️ Classe EventErrorFactory
 * ----------------------------
 * Fabrique spécialisée pour la gestion des anomalies génériques liées aux jetons d'événements.
 * Centralise et standardise les réponses HTTP 401, 404 et 500 pour la traçabilité.
 *
 * 💡 JUSTIFICATION DE L'EMPLACEMENT DIRECT DANS « src/exceptions/ » :
 * Ce fichier a été déraciné du sous-dossier éphémère /entities/ pour être aligné à plat.
 * Pourquoi ? En Architecture Hexagonale pure, toutes les anomalies rejetées aux frontières
 * ou au cœur du Domaine partagent la même criticité et doivent être centralisées de manière
 * homogène. Créer des silos par sous-thématiques d'infrastructure (comme /entities/) rompt
 * le principe de moindre surprise, complique inutilement la politique des alias d'imports,
 * et masque la visibilité globale des pannes applicatives sur une même couche technique.
 *
 * @class EventErrorFactory
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class EventErrorFactory extends ApiError {

  /**
   * 🏭 Fabrique statique : Signale l'absence pure et simple d'un identifiant d'événement obligatoire.
   *
   * @static
   * @function missing
   * @returns {EventErrorFactory} L'instance vivante de l'exception configurée
   */
  public static missing(): EventErrorFactory {
    const missing : string = 'Missing';
    return new EventErrorFactory(`Id Évent manquant`, 401, {
      code    : 'EVEN_NOT_FOUND',
      missing : missing
    });
  }

  /**
   * 🏭 Fabrique statique : Signale un événement introuvable par son identifiant unique fort.
   *
   * @static
   * @function notFound
   * @param {EventId} eventId - L'identifiant fort de l'événement recherché
   * @returns {EventErrorFactory} L'instance vivante de l'exception configurée
   */
  public static notFound(eventId: EventId): EventErrorFactory {
    return new EventErrorFactory(`Événement introuvable : ${eventId.valeur}`, 404, {
      code       : 'EVEN_NOT_FOUND',
      identifier : eventId.valeur
    });
  }

  /**
   * 🏭 Fabrique statique : Trame l'échec d'infrastructure lors de la persistance d'une trace.
   *
   * @static
   * @function creation
   * @param {string} originalError - Le message ou stack de l'erreur d'infrastructure basse
   * @returns {EventErrorFactory} L'instance vivante de l'exception configurée
   */
  public static creation(originalError: string): EventErrorFactory {
    return new EventErrorFactory("Erreur lors de la création de l'événement", 500, {
      code          : 'EVEN_CREATION_FAILED',
      originalError : originalError
    });
  }

}
