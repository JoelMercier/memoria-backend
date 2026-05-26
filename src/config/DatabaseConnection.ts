// ——— fichier : src/config/DatabaseConnection.ts

import { Pool,
         type QueryResult,
         type QueryResultRow } from 'pg';
import { LoggerSingleton     } from '@/config/LoggerSingleton';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';

/**
 * 🏛️ Classe DatabaseConnection
 * ----------------------------
 * Singleton encapsulant le pool de connexions PostgreSQL.
 * Garantit la souveraineté d'accès au coffre-fort de Gaïa.
 *
 * SOLID :
 *  - SRP : Gère de manière unique le cycle de vie du pool de connexions.
 *  - DIP : Implémente IDatabaseConnection pour lier l'infrastructure.
 *
 * @class DatabaseConnection
 * @implements {IDatabaseConnection}
 */
export class DatabaseConnection implements IDatabaseConnection {

  /** 👤 Instance unique globale du Singleton */
  static #instance : DatabaseConnection;

  /** 🗄️ Pool de connexions PostgreSQL natif */
  private readonly m_rPool : Pool;

  /** 🔔 Service de journalisation unifié */
  private readonly m_rLogger = LoggerSingleton.getInstance();

  /**
   * Initialise et configure le pool de connexions à partir de l'environnement.
   *
   * @private
   * @constructor
   */
  private constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("La variable DATABASE_URL est manquante dans l'environnement.");
    }

    const bUseSSL : boolean = process.env.DB_SSL === 'true';

    this.m_rPool = new Pool({
      connectionString  : process.env.DATABASE_URL,
      ssl               : bUseSSL ? { rejectUnauthorized: false } : false,
      max               : Number(process.env.DB_POOL_MAX ?? 10),
      idleTimeoutMillis : 30_000
    });

    this.m_rPool.on('connect', (): void => {
      this.m_rLogger.debug('🐘 PostgreSQL : nouvelle connexion établie');
    });

    this.m_rPool.on('error', (err: Error): void => {
      this.m_rLogger.error({ err }, 'Erreur PostgreSQL inattendue');
    });
  }

  /**
   * 🗺️ Récupère l'instance unique du gestionnaire de connexion.
   *
   * @returns {DatabaseConnection} L'instance du Singleton.
   */
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.#instance) {
      DatabaseConnection.#instance = new DatabaseConnection();
    }
    return DatabaseConnection.#instance;
  }

  /**
   * 🗄️ Accesseur direct vers le pool de connexions sous-jacent.
   *
   * @returns {Pool} Le pool de connexions pg.
   */
  public getPool(): Pool {
    return this.m_rPool;
  }

  /**
   * 🎯 Exécute une requête SQL de manière sécurisée et fortement typée.
   *
   * @template T - Structure attendue pour les lignes du résultat
   * @param {string} text - Requête SQL brute ou préparée
   * @param {ReadonlyArray<unknown>} [params] - Paramètres de requêtes SQL injectés
   * @returns {Promise<QueryResult<T>>} Le résultat brut de l'infrastructure pg
   */
  public async query<T extends QueryResultRow = QueryResultRow>(
    text    : string,
    params? : ReadonlyArray<unknown>
  ): Promise<QueryResult<T>> {
    return this.m_rPool.query<T>(text, params as unknown[] | undefined);
  }

  /**
   * ⏱️ Vérifie la viabilité de la liaison avec le serveur de base de données.
   *
   * @returns {Promise<boolean>} True si la base de données répond positivement
   */
  public async ping(): Promise<boolean> {
    try {
      await this.m_rPool.query('SELECT 1');
      return true;
    } catch (err) {
      this.m_rLogger.warn({ err }, 'Database ping failed');
      return false;
    }
  }

  /**
   * 🚪 Libère proprement l'intégralité des connexions actives du pool.
   *
   * @returns {Promise<void>}
   */
  public async close(): Promise<void> {
    await this.m_rPool.end();
  }
}
