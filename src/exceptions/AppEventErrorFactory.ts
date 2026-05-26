// ——— fichier : src/exceptions/AppEventErrorFactory.ts

import { ApiError } from '@/exceptions/ApiError';
import { UserId,
         EventId  } from '@/domain/value-objects/IdMetier';

/**
 * 🏛️ Classe AppEventErrorFactory
 * -------------------------------
 * Fabrique spécialisée pour la levée d'anomalies liées à l'audit et aux événements système.
 * Centralise et uniformise la gestion des erreurs 404, 409 et 500 associées.
 *
 * 💡 JUSTIFICATION DE L'EMPLACEMENT DIRECT DANS « src/exceptions/ » :
 * Ce fichier a été déraciné du sous-dossier éphémère /entities/ pour être aligné à plat.
 * Pourquoi ? En Architecture Hexagonale pure, toutes les anomalies rejetées aux frontières
 * ou au cœur du Domaine partagent la même criticité et doivent être centralisées de manière
 * homogène. Créer des silos par sous-thématiques d'infrastructure (comme /entities/) rompt
 * le principe de moindre surprise, complique inutilement la politique des alias d'imports,
 * et masque la visibilité globale des pannes applicatives sur une même couche technique.
 *
 * @class AppEventErrorFactory
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class AppEventErrorFactory extends ApiError {

  /**
   * 🏭 Fabrique statique : Signale un événement introuvable par son identifiant unique.
   *
   * @static
   * @function notFound
   * @param {EventId} eventId - L'identifiant fort de l'événement manquant
   * @returns {AppEventErrorFactory} L'instance vivante de l'exception configurée
   */
  public static notFound(eventId: EventId): AppEventErrorFactory {
    return new AppEventErrorFactory(`Événement introuvable : ${eventId.valeur}`, 404, {
      code       : 'APPEVENT_NOT_FOUND',
      identifier : eventId.valeur
    });
  }

  /**
   * 🏭 Fabrique statique : Signale une collision d'identifiant d'événement en persistance.
   *
   * @static
   * @function eventExists
   * @param {EventId} eventId - L'identifiant déjà présent en base
   * @returns {AppEventErrorFactory} L'instance vivante de l'exception configurée
   */
  public static eventExists(eventId: EventId): AppEventErrorFactory {
    return new AppEventErrorFactory(`L'identifiant « ${eventId.valeur} » existe déjà.`, 409, {
      code  : 'APPEVENT_EXISTS',
      field : 'eventId',
      value : eventId.valeur
    });
  }

  /**
   * 🏭 Fabrique statique : Trame l'échec critique de l'écriture d'un log d'infrastructure.
   *
   * @static
   * @function creation
   * @param {string} originalError - Le message ou stack de l'erreur d'infrastructure basse
   * @returns {AppEventErrorFactory} L'instance vivante de l'exception configurée
   */
  public static creation(originalError: string): AppEventErrorFactory {
    return new AppEventErrorFactory("Erreur lors de la création de l'événement", 500, {
      code          : 'APPEVENT_CREATION_FAILED',
      originalError : originalError
    });
  }

  /**
   * 🏭 Fabrique statique : Gère l'anomalie d'un raccordement utilisateur brisé lors de l'audit.
   *
   * @static
   * @function userIdUnknown
   * @param {UserId} userId - L'identifiant de l'utilisateur introuvable ou altéré
   * @returns {AppEventErrorFactory} L'instance vivante de l'exception configurée
   */
  public static userIdUnknown(userId: UserId): AppEventErrorFactory {
    return new AppEventErrorFactory("Erreur: Événement avec identifiant utilisateur incorrect", 500, {
      code          : 'APPEVENT_WRONG_USERID',
      originalError : userId.valeur
    });
  }

}
