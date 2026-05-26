// ——— fichier : src/exceptions/ShareErrorFactory.ts

import { ShareId, UserId } from '@/domain/value-objects/IdMetier';
import { ApiError }         from '@/exceptions/ApiError';

/**
 * 🏛️ Classe ShareErrorFactory
 * ----------------------------
 * Fabrique spécialisée pour la levée d'anomalies liées à la gestion des partages (Shares).
 * Centralise et standardise les anomalies HTTP 403, 404, 410 et 500 associées.
 *
 * 💡 JUSTIFICATION DE L'EMPLACEMENT DIRECT DANS « src/exceptions/ » :
 * Ce fichier a été déraciné du sous-dossier éphémère /entities/ pour être aligné à plat.
 * Pourquoi ? En Architecture Hexagonale pure, toutes les anomalies rejetées aux frontières
 * ou au cœur du Domaine partagent la même criticité et doivent être centralisées de manière
 * homogène. Créer des silos par sous-thématiques d'infrastructure (comme /entities/) rompt
 * le principe de moindre surprise, complique inutilement la politique des alias d'imports,
 * et masque la visibilité globale des pannes applicatives sur une même couche technique.
 *
 * @class ShareErrorFactory
 * @extends {ApiError}
 * @author Joël, Gaïa & Co
 */
export class ShareErrorFactory extends ApiError {

  /**
   * 🏭 Fabrique statique : Signale un lien de partage introuvable par son identifiant unique ou son token.
   *
   * @static
   * @function notFound
   * @param {string} identifier - L'identifiant textuel (ID ou token d'URL public) recherché
   * @returns {ShareErrorFactory} L'instance vivante de l'exception configurée
   */
  public static notFound(identifier: string): ShareErrorFactory {
    return new ShareErrorFactory(`Partage introuvable : ${identifier}`, 404, {
      code       : 'SHARE_NOT_FOUND',
      identifier : identifier
    });
  }

  /**
   * 🏭 Fabrique statique : Interdit l'accès si l'acteur n'est pas le véritable propriétaire du partage.
   *
   * @static
   * @function accessDenied
   * @param {ShareId} shareId - L'identifiant unique fort du partage visé
   * @param {UserId} userId - L'identifiant immuable fort de l'acteur connecté
   * @returns {ShareErrorFactory} L'instance vivante de l'exception configurée
   */
  public static accessDenied(shareId: ShareId, userId: UserId): ShareErrorFactory {
    return new ShareErrorFactory(`Vous n'avez pas accès à ce partage.`, 403, {
      code       : 'SHARE_ACCESS_DENIED',
      identifier : shareId.valeur,
      userId     : userId.valeur
    });
  }

  /**
   * 🏭 Fabrique statique : Signale un lien de partage ayant dépassé sa date limite de validité.
   *
   * @static
   * @function expired
   * @param {string} token - Le jeton public expiré
   * @returns {ShareErrorFactory} L'instance vivante de l'exception configurée
   */
  public static expired(token: string): ShareErrorFactory {
    return new ShareErrorFactory('Ce lien de partage a expiré.', 410, {
      code       : 'SHARE_EXPIRED',
      identifier : token
    });
  }

  /**
   * 🏭 Fabrique statique : Trame l'échec d'infrastructure lors de la génération d'un partage.
   *
   * @static
   * @function creation
   * @param {string} originalError - Le message ou stack de l'erreur d'infrastructure basse
   * @returns {ShareErrorFactory} L'instance vivante de l'exception configurée
   */
  public static creation(originalError: string): ShareErrorFactory {
    return new ShareErrorFactory('Erreur lors de la création du partage', 500, {
      code          : 'SHARE_CREATION_FAILED',
      originalError : originalError
    });
  }

  /**
   * 🏭 Fabrique statique : Signale un épuisement défensif des tentatives de génération de jeton.
   *
   * @static
   * @function tokenCollision
   * @returns {ShareErrorFactory} L'instance vivante de l'exception configurée
   */
  public static tokenCollision(): ShareErrorFactory {
    return new ShareErrorFactory(
      'Impossible de générer un token de partage unique après plusieurs tentatives',
      500,
      { code: 'SHARE_TOKEN_COLLISION' }
    );
  }
}
