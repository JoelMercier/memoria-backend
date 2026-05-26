// ——— fichier : src/interfaces/database/IDatabaseConnection.ts

import type { Pool,
              QueryResult,
              QueryResultRow } from 'pg';

/**
 * 🗄️ Interface IDatabaseConnection
 * ---------------------------------
 * Contrat de bas niveau régissant la couche de connexion et de dialogue PostgreSQL.
 * Les repositories et les services d'infrastructure ne dépendent QUE de cette interface.
 *
 * SOLID :
 *  - DIP (Dependency Inversion Principle) : Isole le code métier des pilotes physiques bas niveau.
 *
 * @interface IDatabaseConnection
 * @author Joël, Gaïa & Co
 */
export interface IDatabaseConnection {

  /** ⚙️ Récupère l'instance brute du pool de connexions géré par le pilote pg. */
  getPool(): Pool;

  /** ⚡ Exécute une requête SQL paramétrée de manière totalement asynchrone et sécurisée. */
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: ReadonlyArray<unknown>
  ): Promise<QueryResult<T>>;

  /** ⏱️ Vérifie la vitalité de l'ancrage et la disponibilité de la liaison avec le serveur SQL. */
  ping(): Promise<boolean>;

  /** 🔌 Clôture proprement le pool et libère l'intégralité des ressources d'infrastructure. */
  close(): Promise<void>;
}
