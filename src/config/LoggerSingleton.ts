// ——— fichier : src/config/LoggerSingleton.ts

import pino, { type Logger } from 'pino';

/**
 * 🏛️ Classe LoggerSingleton
 * -------------------------
 * Centralisation et configuration unifiée du moteur de journalisation Pino.
 * Assure la traçabilité des accès et la conformité de l'audit système.
 *
 * Pattern Singleton :
 *  - DEV : Sortie fluide, colorée et human-readable via pino-pretty.
 *  - PROD : Stream JSON brut (stdout) pour l'observabilité conteneurisée.
 *  - AUDIT : Stratégie stricte de rétention et rotation (RGPD).
 *
 * @class LoggerSingleton
 */
export class LoggerSingleton {

  /** 👤 Instance unique globale du logger Pino */
  static #instance : Logger;

  /**
   * Empêche l'instanciation directe pour forcer le patron Singleton.
   *
   * @private
   * @constructor
   */
  private constructor() {
    // Verrouillage de l'accès constructeur
  }

  /**
   * 🗺️ Récupère l'instance unique configurée du système de log.
   *
   * @returns {Logger} L'instance partagée du logger Pino.
   */
  public static getInstance(): Logger {
    if (!LoggerSingleton.#instance) {
      const bIsDev : boolean = process.env.NODE_ENV !== 'production';

      const transport = bIsDev
        ? {
            target  : 'pino-pretty',
            options : {
              colorize      : true,
              translateTime : 'dd-mm-yyyy HH:MM:ss',
              ignore        : 'pid,hostname'
            }
          }
        : {
            targets : [
              // 1. stdout JSON (observabilité plateforme : Docker, k8s, etc.)
              {
                target  : 'pino/file',
                options : { destination: 1 },
                level   : 'info'
              },
              // 2. Logs d'erreurs (30 jours, ~10MB par fichier)
              {
                target  : 'pino-roll',
                options : {
                  file      : 'logs/error',
                  frequency : 'daily',
                  size      : '10m',
                  extension : '.log',
                  mkdir     : true,
                  limit     : { count: 30 }
                },
                level   : 'error'
              },
              // 3. Audit RGPD (1 an, ~20MB par fichier)
              {
                target  : 'pino-roll',
                options : {
                  file      : 'logs/audit',
                  frequency : 'daily',
                  size      : '20m',
                  extension : '.log',
                  mkdir     : true,
                  limit     : { count: 365 }
                },
                level   : 'info'
              }
            ]
          };

      LoggerSingleton.#instance = pino({
        level     : process.env.LOG_LEVEL ?? 'info',
        timestamp : pino.stdTimeFunctions.isoTime,
        transport
      });
    }
    return LoggerSingleton.#instance;
  }
}
