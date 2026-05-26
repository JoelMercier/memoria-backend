// ——— fichier : src/utils/RequestIdGenerator.ts

import { randomUUID } from 'node:crypto';
import type { Request } from 'express';

/**
 * 🏛️ Classe RequestIdGenerator
 * ----------------------------
 * Générateur et extracteur d'identifiants uniques de requêtes (Request ID).
 * Assure la traçabilité et la corrélation des journaux applicatifs de bout en bout.
 *
 * SOLID :
 *  - SRP : Unique responsabilité de forger ou d'extraire la clé de corrélation réseau.
 *
 * @class RequestIdGenerator
 * @author Joël, Gaïa & Co
 */
export class RequestIdGenerator {

  /** 🎛️ Nom de l'en-tête HTTP standardisé de traçabilité réseau */
  private static readonly HEADER_NAME = 'x-request-id';

  /**
   * 🏭 Fabrique statique : Engendre un jeton d'audit universel unique (UUIDv4) de manière asynchrone.
   *
   * @public
   * @static
   * @function generate
   * @returns {string} Un identifiant unique brut.
   */
  public static generate(): string {
    return randomUUID();
  }

  /**
   * 🔍 Extrait la clé de corrélation depuis l'en-tête HTTP ou les propriétés étendues de la requête.
   * En cas d'absence pure et simple sur les frontières, engendre un jeton de secours à la volée.
   *
   * @public
   * @static
   * @function getFromRequest
   * @param {Request} req - L'instance de la requête HTTP Express active
   * @returns {string} Le jeton Request-ID validé.
   */
  public static getFromRequest(req: Request): string {
    const header : string | undefined = req.header(RequestIdGenerator.HEADER_NAME);

    if (typeof header === 'string' && header.length > 0) {
      return header;
    }

    // Extraction sécurisée sur l'extension d'interface req.id que nous avons blindée dans express.d.ts
    const local : string | undefined = (req as Request & { id?: string }).id;

    if (typeof local === 'string' && local.length > 0) {
      return local;
    }

    return RequestIdGenerator.generate();
  }
}
