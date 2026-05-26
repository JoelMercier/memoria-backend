// ——— fichier : database/scripts/nuke.ts

import { readdir, readFile } from 'node:fs/promises';
import   path                from 'node:path';
import { Pool              } from 'pg';
import { LoggerSingleton   } from '@/config/LoggerSingleton';

/** 🪵 Instance partagée du journal applicatif */
const m_rLogger = LoggerSingleton.getInstance();

/** 🗄️ Emplacement des scripts de purge DDL (Drop de l'infrastructure) */
const DROP_DIR : string = 'database/migrations/drop';

/**
 * 🏭 Initialise un pool de connexions d'infrastructure à destination de PostgreSQL.
 * Valide la présence obligatoire des variables d'environnement d'administration.
 *
 * @function createAdminPool
 * @throws {Error} Si la configuration d'environnement est tronquée ou absente
 * @returns {Pool} Le pool de connexion pg initialisé
 * @author Joël, Gaïa & Co
 */
function createAdminPool(): Pool {
  const host     : string | undefined = process.env.DB_HOST;
  const port     : number             = Number(process.env.DB_PORT ?? 5432);
  const database : string | undefined = process.env.DB_NAME;
  const user     : string | undefined = process.env.DB_USER;
  const password : string | undefined = process.env.DB_PASSWORD;

  if (!host || !database || !user || !password) {
    throw new Error('Variables de configuration manquantes : DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD sont requis.');
  }

  return new Pool({ host, port, database, user, password });
}

/**
 * 🚀 Point d'entrée principal (Main) du script de nuke de l'infrastructure BDD.
 * Localise, ordonne lexicographiquement et applique les requêtes de destruction SQL.
 *
 * @async
 * @function main
 * @returns {Promise<void>}
 * @author Joël, Gaïa & Co
 */
async function main(): Promise<void> {
  m_rLogger.warn('⚠️  Suppression de tous les objets de la base en cours...');

  const pool : Pool = createAdminPool();
  try {
    let files : string[];
    try {
      const all : string[] = await readdir(DROP_DIR);
      files = all.filter((f): boolean => f.endsWith('.sql')).sort();
    } catch (err) {
      const code : string | undefined = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        m_rLogger.error({ dir: DROP_DIR }, "Le dossier de drop n'existe pas");
        process.exitCode = 1;
        return;
      }
      throw err;
    }

    if (files.length === 0) {
      m_rLogger.warn({ dir: DROP_DIR }, 'Aucun script de drop trouvé');
      return;
    }

    for (const file of files) {
      const filepath : string = path.join(DROP_DIR, file);
      const sql      : string = await readFile(filepath, 'utf-8');
      try {
        await pool.query(sql);
        m_rLogger.info({ file: filepath }, '🗑️  Drop appliqué');
      } catch (err) {
        m_rLogger.error({ file: filepath, err }, "❌ Échec d'un drop");
        throw err;
      }
    }
    m_rLogger.info('🧹 Base nettoyée');
  } catch (err) {
    m_rLogger.error({ err }, '💥 Le processus de nuke a échoué');
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
