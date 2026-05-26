// ——— fichier : src/utils/ApiResponseFactory.ts

import type { IApiResponseData } from '@/interfaces/http/IApiResponseData';

/**
 * 🏛️ Classe ApiResponseFactory
 * ----------------------------
 * Fabrique spécialisée pour l'engendrement de réponses HTTP standardisées.
 * Toutes les routes applicatives `/v1/*` doivent transiter par ce pivot d'infrastructure.
 *
 * SOLID :
 *  - SRP : Unique responsabilité de mise en forme et d'encapsulation unifiée des paquets JSON.
 *
 * @class ApiResponseFactory
 * @author Joël, Gaïa & Co
 */
export class ApiResponseFactory {

  /**
   * 🎛️ Construit l'enveloppe universelle de métadonnées et d'audit temporels.
   *
   * @private
   * @static
   * @function generateMeta
   */
  private static generateMeta(requestId?: string): { timestamp: string; requestId?: string } {
    return {
      timestamp : new Date().toISOString(),
      ...(requestId && { requestId : requestId })
    };
  }

  /**
   * 🏭 Fabrique statique : Moule une enveloppe de succès standardisée pour un payload donné.
   *
   * @public
   * @static
   * @function success
   * @template T - Le type ou le DTO du payload sérialisé encapsulé
   */
  public static success<T>(message: string, data?: T, requestId?: string): IApiResponseData<T> {
    return {
      success : true,
      message : message,
      ...(data !== undefined && { data : data }),
      meta    : ApiResponseFactory.generateMeta(requestId)
    };
  }

  /**
   * 🏭 Fabrique statique : Moule une enveloppe d'anomalie normalisée (Zéro fuite d'audit).
   *
   * @public
   * @static
   * @function error
   */
  public static error(
    message: string,
    code: string,
    details?: string,
    field?: string,
    requestId?: string
  ): IApiResponseData<null> {
    return {
      success : false,
      message : message,
      error   : {
        code : code,
        ...(details && { details : details }),
        ...(field && { field : field })
      },
      meta    : ApiResponseFactory.generateMeta(requestId)
    };
  }

  /**
   * 🏭 Fabrique statique : Enveloppe une collection paginée munie de ses index de performance DB.
   *
   * @public
   * @static
   * @function paginated
   * @template T - Le type des éléments composant la collection
   */
  public static paginated<T>(
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number,
    requestId?: string
  ): IApiResponseData<T[]> {
    return {
      success : true,
      message : message,
      data    : data,
      meta    : {
        ...ApiResponseFactory.generateMeta(requestId),
        pagination : {
          page       : page,
          limit      : limit,
          total      : total,
          totalPages : Math.ceil(total / limit)
        }
      }
    };
  }
}
