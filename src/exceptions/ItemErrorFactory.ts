// ——— fichier : src/exceptions/ItemErrorFactory.ts

import type { UserId, ItemId } from '@/domain/value-objects/ids';
import      { ApiError       } from '@/exceptions/ApiError';

/**
 * 🏛️ Classe ItemErrorFactory
 * ---------------------------
 * Fabrique spécialisée pour la levée d'anomalies liées à la gestion des pépites (Items).
 * Centralise et standardise les anomalies HTTP 403, 404, 409 et 500 associées.
 *
 * Version: 4.2.1 (Déracinement Hexagonal - Alignement Franconien Pur V4) [1.1]
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
   * @param {ItemId} itemId - L'identifiant fort de la pépite recherchée (Buffer 16 octets) [1.1].
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée.
   */
  public static notFound(itemId: ItemId): ItemErrorFactory {
    return new ItemErrorFactory(`Pépite introuvable : ${itemId.valeur}`, 404, {
      code       : 'ITEM_NOT_FOUND',
      identifier : itemId.valeur
    });
  }

  /**
   * 🏭 Fabrique statique : Signale une collision de libellé sur l'espace d'un utilisateur.
   * [RÉPARÉ V4] Éradication définitive de l'ancien concept 'titleExists' au profit du franconien [1.1].
   *
   * @static
   * @function libelleExists
   * @param {UserId} userId - L'identifiant de l'utilisateur propriétaire
   * @param {string} p_sLibelle - Le libellé nominal en doublon [1.1].
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée.
   */
  public static libelleExists(userId: UserId, p_sLibelle: string): ItemErrorFactory {
    return new ItemErrorFactory(`Une pépite avec le libellé « ${p_sLibelle} » existe déjà.`, 409, {
      code   : 'ITEM_LIBELLE_EXISTS', // 💎 Réaligné sur le franconien de soute.
      field  : 'libelle',             // 💎 Réaligné sur le franconien de soute.
      userId : userId.valeur,
      value  : p_sLibelle
    });
  }

  /**
   * 🏭 Fabrique statique : Signale une collision de permalien (Slug) sur l'espace de l'acteur.
   *
   * @static
   * @function slugExists
   * @param {UserId} userId - L'identifiant de l'utilisateur propriétaire
   * @param {string} slug - Le slug en doublon
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée.
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
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée.
   */
  public static creation(originalError: string): ItemErrorFactory {
    return new ItemErrorFactory('Erreur lors de la création de la pépite', 500, {
      code          : 'ITEM_CREATION_FAILED',
      originalError : originalError
    });
  }

  /**
   * 🏭 Fabrique statique : Trame l'échec critique lors de la modification partielle en base [1.1].
   * [AJOUTÉ V4] Pièce manquante pour le déroutement de la méthode update [1.1].
   *
   * @static
   * @function modification
   * @param {string} originalError - Le message brut de l'avarie d'infrastructure
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée [1.1].
   */
  public static modification(originalError: string): ItemErrorFactory {
    return new ItemErrorFactory('Erreur lors de la modification de la pépite.', 500, {
      code          : 'ITEM_MODIFICATION_FAILED',
      originalError : originalError
    });
  }

  /**
   * 🏭 Fabrique statique : Trame l'échec critique lors de l'ablation physique en base [1.1].
   * [AJOUTÉ V4] Pièce manquante pour le déroutement de la méthode delete [1.1].
   *
   * @static
   * @function suppression
   * @param {string} originalError - Le message brut de l'avarie d'infrastructure
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée [1.1].
   */
  public static suppression(originalError: string): ItemErrorFactory {
    return new ItemErrorFactory('Erreur lors de la suppression de la pépite.', 500, {
      code          : 'ITEM_SUPPRESSION_FAILED',
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
   * @returns {ItemErrorFactory} L'instance vivante de l'exception configurée.
   */
  public static accessDenied(itemId: ItemId, userId: UserId): ItemErrorFactory {
    return new ItemErrorFactory("Vous n'avez pas accès à cette pépite.", 403, {
      code   : 'ITEM_ACCESS_DENIED',
      itemId : itemId.valeur,
      userId : userId.valeur
    });
  }
}
