// ——— fichier : src/exceptions/TagErrorFactory.ts

import { ApiError } from '@/exceptions/ApiError';
import { UserId,
         TagId    } from '@/domain/value-objects/IdMetier';

/**
 * 🏛️ Classe TagErrorFactory
 * --------------------------
 * Fabrique spécialisée pour la levée d'anomalies liées aux étiquettes (Tags).
 * Centralise et standardise les réponses HTTP 403, 404, 409 et 500 pour le domaine.
 *
 * 💡 JUSTIFICATION DE L'EMPLACEMENT DIRECT DANS « src/exceptions/ » :
 * Ce fichier a été déraciné du sous-dossier éphémère /entities/ pour être aligné à plat.
 * Pourquoi ? En Architecture Hexagonale pure, toutes les anomalies rejetées aux frontières
 * ou au cœur du Domaine partagent la même criticité et doivent être centralisées de manière
 * homogène. Créer des silos par sous-thématiques d'infrastructure (comme /entities/) rompt
 * le principe de moindre surprise, complique inutilement la politique des alias d'imports,
 * et masque la visibilité globale des pannes applicatives sur une même couche technique.
 *
 * @class TagErrorFactory
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class TagErrorFactory extends ApiError {

  /**
   * 🏭 Fabrique statique : Signale un tag introuvable par son identifiant unique fort.
   *
   * @static
   * @function notFound
   * @param {TagId} tagId - L'identifiant fort du tag manquant
   * @returns {TagErrorFactory} L'instance vivante de l'exception configurée
   */
  public static notFound(tagId: TagId): TagErrorFactory {
    return new TagErrorFactory(`Tag introuvable : ${tagId.valeur}`, 404, {
      code       : 'TAG_NOT_FOUND',
      identifier : tagId.valeur
    });
  }

  /**
   * 🏭 Fabrique statique : Signale une collision de nom d'étiquette pour un utilisateur spécifique.
   *
   * @static
   * @function nameExists
   * @param {UserId} userId - L'identifiant immuable de l'acteur propriétaire
   * @param {string} tagName - Le libellé du tag provoquant le doublon
   * @returns {TagErrorFactory} L'instance vivante de l'exception configurée
   */
  public static nameExists(userId: UserId, tagName: string): TagErrorFactory {
    return new TagErrorFactory(`Le tag « ${tagName} » existe déjà.`, 409, {
      code   : 'TAG_NAME_EXISTS',
      field  : 'tagName',
      userId : userId.valeur,
      value  : tagName
    });
  }

  /**
   * 🏭 Fabrique statique : Interdit l'accès si l'acteur n'est pas le propriétaire du tag visé.
   *
   * @static
   * @function accessDenied
   * @param {TagId} tagId - L'identifiant unique fort de l'étiquette ciblée
   * @param {UserId} userId - L'identifiant immuable fort de l'acteur connecté
   * @returns {TagErrorFactory} L'instance vivante de l'exception configurée
   */
  public static accessDenied(tagId: TagId, userId: UserId): TagErrorFactory {
    return new TagErrorFactory(`Vous n'avez pas accès à ce tag.`, 403, {
      code       : 'TAG_ACCESS_DENIED',
      identifier : tagId.valeur,
      userId     : userId.valeur
    });
  }

  /**
   * 🏭 Fabrique statique : Trame l'échec d'infrastructure lors de l'écriture d'un tag.
   *
   * @static
   * @function creation
   * @param {string} originalError - Le message ou stack de l'erreur d'infrastructure basse
   * @returns {TagErrorFactory} L'instance vivante de l'exception configurée
   */
  public static creation(originalError: string): TagErrorFactory {
    return new TagErrorFactory('Erreur lors de la création du tag', 500, {
      code          : 'TAG_CREATION_FAILED',
      originalError : originalError
    });
  }
}
