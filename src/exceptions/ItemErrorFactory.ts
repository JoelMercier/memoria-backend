// ——— fichier : src/exceptions/ItemErrorFactory.ts

import { ApiError } from '@/exceptions/ApiError';
import { UserId,
         ItemId   } from '@/domain/value-objects/ids';

/**
 * 🏛️ Classe ItemErrorFactory
 * ---------------------------
 * Fabrique spécialisée pour la levée d'anomalies liées à la gestion des pépites (Items).
 * Centralise et standardise les anomalies HTTP 403, 404, 409 et 500 associées.
 *
 * 💡 JUSTIFICATION DE L'EMPLACEMENT DIRECT DANS « src/exceptions/ » :
 * Ce fichier a été déraciné du sous-dossier éphémère /entities/ pour être aligné à plat.
 * Pourquoi ? En Architecture Hexagonale pure, toutes les anomalies rejetées aux frontières
 * ou au cœur du Domaine partagent la même criticité et doivent être centralisées de manière
 * homogène. Créer des silos par sous-thématiques d'infrastructure (comme /entities/) rompt
 * le principe de moindre surprise, complique inutilement la politique des alias d'imports,
 * et masque la visibilité globale des pannes applicatives sur une même couche technique.
 *
 * @class ItemErrorFactory
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class ItemErrorFactory extends ApiError {

  /**
   * 🏭 Fabrique statique : Signale une pépite introuvable par son identifiant unique fort.
   *
   * @static
   * @function notFound
   * @param {ItemId} itemId - L'identifiant fort de la pépite recherchée
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée
   */
  public static notFound(itemId: ItemId): ItemErrorFactory {
    return new ItemErrorFactory(`Pépite introuvable : ${itemId.valeur}`, 404, {
      code       : 'ITEM_NOT_FOUND',
      identifier : itemId.valeur
    });
  }

  /**
   * 🏭 Fabrique statique : Signale une collision de titre sur l'espace d'un utilisateur.
   *
   * @static
   * @function titleExists
   * @param {UserId} userId - L'identifiant de l'utilisateur propriétaire
   * @param {string} title - Le titre en doublon
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée
   */
  public static titleExists(userId: UserId, title: string): ItemErrorFactory {
    return new ItemErrorFactory(`Une pépite avec le titre « ${title} » existe déjà.`, 409, {
      code   : 'ITEM_TITLE_EXISTS',
      field  : 'title',
      userId : userId.valeur,
      value  : title
    });
  }

  /**
   * 🏭 Fabrique statique : Signale une collision de permalien (Slug) sur l'espace de l'acteur.
   *
   * @static
   * @function slugExists
   * @param {UserId} userId - L'identifiant de l'utilisateur propriétaire
   * @param {string} slug - Le slug en doublon
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée
   */
  public static slugExists(userId: UserId, slug: string): ItemErrorFactory {
    return new ItemErrorFactory(`Une pépite avec le slug « ${slug} » existe déjà.`, 409, {
      code   : 'ITEM_SLUG_EXISTS',
      field  : 'slug',
      userId : userId.valeur,
      value  : slug
    });
  }

  /**
   * 🏭 Fabrique statique : Trame l'échec critique lors de l'instanciation ou l'écriture d'une pépite.
   *
   * @static
   * @function creation
   * @param {string} originalError - Le message ou stack de l'erreur d'infrastructure basse
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée
   */
  public static creation(originalError: string): ItemErrorFactory {
    return new ItemErrorFactory('Erreur lors de la création de la pépite', 500, {
      code          : 'ITEM_CREATION_FAILED',
      originalError : originalError
    });
  }

  /**
   * 🏭 Fabrique statique : Interdit l'accès bilatéral si l'acteur n'est pas le véritable propriétaire.
   *
   * @static
   * @function accessDenied
   * @param {ItemId} itemId - L'identifiant unique de la pépite visée
   * @param {UserId} userId - L'identifiant immuable de l'acteur connecté
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée
   */
  public static accessDenied(itemId: ItemId, userId: UserId): ItemErrorFactory {
    return new ItemErrorFactory("Vous n'avez pas accès à cette pépite.", 403, {
      code   : 'ITEM_ACCESS_DENIED',
      itemId : itemId.valeur,
      userId : userId.valeur
    });
  }
}
