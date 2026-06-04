// ——— fichier : src/server.ts

import { createApp }          from '@/app';
import { DatabaseConnection } from '@/config/DatabaseConnection';
import { LoggerSingleton }    from '@/config/LoggerSingleton';
import { WarmupCache }        from '@/infrastructure/cache/WarmupCache'; // Notre futur pré-chargeur !

/** 🪵 Instance partagée du journal applicatif global */
const logger = LoggerSingleton.getInstance();

/** 🔌 Port d'écoute réseau extrait de l'environnement d'infrastructure */
const PORT : number = Number(process.env.PORT ?? 3000);

/**
 * 🏛️ Routine de Démarrage Système (bootstrap)
 * -------------------------------------------
 * Point d'entrée unique et absolu de l'application Node.js (Runtime).
 * Orchestre l'amorçage défensif en Fail-Fast et câble la procédure d'arrêt chirurgical (Graceful Shutdown).
 *
 * SOLID :
 *  - SRP 📐 : Unique responsabilité de démarrer le moteur applicatif et d'écouter les signaux système.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>}
 * @author Conception & Vision : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Frapperie du Code : Gaïa (Graveuse de pépites et du silicium)
 * @author Garde d Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
async function bootstrap(): Promise<void> {
  try {
    // 🐘 Politique Fail-Fast : Validation impérative de l'ancrage SQL avant d'ouvrir le port réseau
    const db : DatabaseConnection = DatabaseConnection.getInstance();
    const dbAlive : boolean       = await db.ping();

    if (!dbAlive) {
      throw new Error('La base de données est injoignable au démarrage');
    }
    logger.info('🐘 Connexion PostgreSQL OK');

    // 🪓 CHANTIER N°2 : Chauffage des Placards de la RAM (Warmup Cache)
    // Braquage asynchrone des tables de dictionnaire avant d'ouvrir le réseau Express !
    await WarmupCache.allumez(db);
    logger.info('🗄️ Placards de RAM chauffés et SmartEnums ensemencés');

    const app = createApp();
    const server = app.listen(PORT, (): void => {
      logger.info(`🚀 Memoria API démarrée sur http://localhost:${PORT}`);
    });

    /**
     * 🔌 Procédure transactionnelle d'arrêt propre (Graceful Shutdown).
     */
    const shutdown = async (signal: string): Promise<void> => {
      logger.warn(`Signal reçu : ${signal}. Arrêt en cours…`);

      server.close((): void => {
        logger.info('Serveur HTTP fermé.');
      });

      await db.close();
      logger.info('Pool PostgreSQL fermé.');

      process.exit(0);
    };

    // Branchement des écouteurs de signaux système Unix standardisés
    process.on('SIGTERM', (): void => void shutdown('SIGTERM'));
    process.on('SIGINT', (): void => void shutdown('SIGINT'));

  } catch (error) {
    const msg : string = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Échec du démarrage : ${msg}`);
    process.exit(1);
  }
}

// Enclenchement asynchrone du réacteur applicatif principal
void bootstrap();
