// ——— fichier : src/exceptions/ApiError.ts

import { LoggerSingleton } from '@/config/LoggerSingleton';
import type { IAdditionalInfo } from '@/interfaces/security/IAdditionalInfo';

/**
 * 🏛️ Classe ApiError (Fondation Générique des exceptions)
 * --------------------------------------------------------
 * Erreur API de base servant de fondation universelle aux anomalies du système.
 * Encapsule l'instance du journal applicatif et élimine les fuites d'injection en inline.
 *
 * SOLID :
 *  - SRP : Représentation, enrichissement et journalisation d'une erreur HTTP.
 *  - DIP : Dépend de l'abstraction LoggerSingleton, jamais d'une bibliothèque d'infrastructure tierce.
 *
 * @class ApiError
 * @extends {Error}
 * @author Joël, Gaïa & Co
 */
export class ApiError extends Error {

  /** 🪵 Instance partagée du journal applicatif */
  private readonly m_rLogger = LoggerSingleton.getInstance();

  /** 🚦 Code de statut HTTP associé à l'anomalie (ex: 404, 403, 500) */
  public readonly statusCode : number;

  /** 🎛️ Métadonnées contextuelles d'infrastructure ou d'audit complémentaires */
  public readonly additionalInfo : IAdditionalInfo;

  /** 📅 Horodatage précis de la levée de l'exception */
  public readonly timestamp : string;

  /**
   * Construit et configure la capture de la pile d'exécution de l'anomalie.
   *
   * @constructor
   * @param {string} message - Description textuelle sémantique de l'erreur
   * @param {number} statusCode - Le code de réponse HTTP associé
   * @param {IAdditionalInfo} [additionalInfo={}] - Dictionnaire de contexte technique
   */
  public constructor(message: string, statusCode: number, additionalInfo: IAdditionalInfo = {}) {
    super(message);
    this.name           = this.constructor.name;
    this.statusCode     = statusCode;
    this.additionalInfo = additionalInfo;
    this.timestamp      = new Date().toISOString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 🛡️ Accesseur privé vers l'instance du journal.
   *
   * @private
   * @returns {any} L'instance du logger configurée.
   */
  private get logger(): any {
    return this.m_rLogger;
  }

  /**
   * 🪵 Journalise précisément les tréfonds de l'anomalie dans les flux de logs d'infrastructure.
   * Permet le chaînage d'opérations fluide (Method Chaining) en retournant l'instance vivante.
   *
   * @public
   * @function log
   * @returns {this} L'instance courante de l'exception.
   */
  public log(): this {
    this.logger.error(
      {
        name           : this.name,
        statusCode     : this.statusCode,
        additionalInfo : this.additionalInfo,
        timestamp      : this.timestamp,
        stack          : this.stack
      },
      this.message
    );
    return this;
  }

  /**
   * 🧼 Représentation sécurisée destinée à l'exposition sur le réseau public (Zéro fuite).
   * Expurgé des métadonnées d'audit critiques `additionalInfo` et des stacks d'exécution.
   *
   * @public
   * @function toJSON
   * @returns {Record<string, unknown>} Le sac de données plat sérialisable.
   */
  public toJSON(): Record<string, unknown> {
    return {
      name       : this.name,
      message    : this.message,
      statusCode : this.statusCode,
      timestamp  : this.timestamp
    };
  }
}
