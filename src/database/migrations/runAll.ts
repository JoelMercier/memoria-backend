// ——— fichier : database/scripts/migrate.ts

import { readdir,
         readFile        } from 'node:fs/promises';
import path                from 'node:path';
import { Pool            } from 'pg';
import { LoggerSingleton } from '@/config/LoggerSingleton';

/** 🪵 Instance partagée du journal applicatif */
const m_rLogger = LoggerSingleton.getInstance();

/** 📜 Séquence ordonnée des répertoires de migration DDL et DML */
const MIGRATION_DIRS : ReadonlyArray<string> = [
  'database/migrations/config',
  'database/triggers',
  'database/migrations/tables',
  'database/views',
  'database/seeders'
];

/**
 * 🏭 Initialise un pool de connexions à destination de PostgreSQL.
 * Valide l'existence impérative des variables d'environnement requises.
 *
 * @function createAdminPool
 * @throws {Error} Si la configuration d'environnement est tronquée
 * @returns {Pool} Le pool de connexion pg configuré
 * @author Joël, Gaïa & Co
 */
function createAdminPool(): Pool {
  const host     : string | undefined = process.env.DB_HOST;
  const port     : number             = Number(process.env.DB_PORT ?? 5432);
  const database : string | undefined = process.env.DB_NAME;
  const user     : string | undefined = process.env.DB_USER;
  const password : string | undefined = process.env.DB_PASSWORD;

  if (!host || !database || !user || !password) {
    throw new Error('Variables de configuration manquantes : DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD sont requis pour les migrations.');
  }

  return new Pool({ host, port, database, user, password });
}

/**
 * 🛤️ Analyse et applique de manière séquentielle tous les fichiers SQL d'un répertoire ciblé.
 * Filtre les fichiers d'amorçage système (bootstrap) et trie par ordre lexicographique.
 *
 * @async
 * @function runDirectory
 * @param {Pool} pool - Le pool de connexions actif
 * @param {string} dir - Le chemin du dossier à traiter
 * @returns {Promise<void>}
 * @author Joël, Gaïa & Co
 */
async function runDirectory(pool: Pool, dir: string): Promise<void> {
  let files : string[];
  try {
    const all : string[] = await readdir(dir);
    files = all
      .filter((f): boolean => f.endsWith('.sql'))
      .filter((f): boolean => !f.startsWith('00_'))
      .sort();
  } catch (err) {
    const code : string | undefined = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      m_rLogger.warn({ dir }, 'Dossier de migration introuvable, ignoré');
      return;
    }
    throw err;
  }

  if (files.length === 0) {
    m_rLogger.info({ dir }, 'Aucun fichier SQL trouvé, dossier ignoré');
    return;
  }

  m_rLogger.info({ dir, count: files.length }, '▶️  Exécution du dossier');

  for (const file of files) {
    const filepath : string = path.join(dir, file);
    const sql      : string = await readFile(filepath, 'utf-8');
    try {
      await pool.query(sql);
      m_rLogger.info({ file: filepath }, '✅ Migration appliquée');
    } catch (err) {
      m_rLogger.error({ file: filepath, err }, '❌ Échec de la migration');
      throw err;
    }
  }
}

/**
 * 🚀 Orchestrateur principal du déploiement incrémental des schémas de la base de données.
 *
 * @async
 * @function main
 * @returns {Promise<void>}
 * @author Joël, Gaïa & Co
 */
async function main(): Promise<void> {
  const pool : Pool = createAdminPool();
  try {
    for (const dir of MIGRATION_DIRS) {
      await runDirectory(pool, dir);
    }
    m_rLogger.info('🎉 Toutes les migrations sont passées');
  } catch (err) {
    m_rLogger.error({ err }, '💥 Le processus de migration a échoué');
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
