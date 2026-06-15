// ——— fichier : src/app.ts

import cookieParser from 'cookie-parser';
import cors         from 'cors';
import express, { type Express,
                  type NextFunction,
                  type Request,
                  type Response   } from 'express';
import rateLimit                    from 'express-rate-limit';
import helmet                       from 'helmet';
import swaggerUi                    from 'swagger-ui-express';
import { DatabaseConnection } from '@/config/DatabaseConnection';
import { LoggerSingleton }    from '@/config/LoggerSingleton';
import { SwaggerConfig }      from '@/config/SwaggerConfig';
import { SessionId }          from '@/domain/value-objects/ids';
import { createV1Router }     from '@/routes/v1';
import { HandlerService }     from '@/services/http/HandlerService';
import { ApiResponseFactory } from '@/utils/ApiResponseFactory';
import { RequestIdGenerator } from '@/utils/RequestIdGenerator';

/**
 * 🏛️ Fonction de Fabrique App (createApp)
 * ---------------------------------------
 * Construit, câble et configure l'intégralité du pipeline d'infrastructure Express.
 * Exportée sous forme de fonction pure pour isoler le cycle de vie applicatif lors des tests.
 *
 * @function createApp
 * @returns {Express} L'instance configurée de l'application Express
 * @author Génie Logiciel : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Forgerie logicielle : Gaïa (Graveuse de pépites d'or V4 Pro)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export function createApp(): Express {
  const app : Express  = express();
  const logger         = LoggerSingleton.getInstance();
  const handlerService = new HandlerService();

  // ----- 🛡️ Sécurité & Parsing d'infrastructure -----
  app.use(helmet());
  app.use(
    cors({
      origin      : process.env.CORS_ORIGIN?.split(',').map((s : string) : string => s.trim()) ?? '*',
      credentials : true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ----- ⏱️ Rate Limiting Global (Protection anti-bruteforce) -----
  app.use(
    rateLimit({
      windowMs        : 15 * 60 * 1000,
      max             : 300,
      standardHeaders : true,
      legacyHeaders   : false
    })
  );

  // ----- 🆔 Injection et Corrélation du Request-ID -----
  app.use((req: Request, res: Response, next: NextFunction): void => {
    const incoming : string | undefined = req.header('x-request-id');
    const sIdBrute : string = incoming && incoming.length > 0 ? incoming : RequestIdGenerator.generate();

    res.setHeader('x-request-id', sIdBrute);

    // 🪓 ALIGNEMENT SÉMANTIQUE : Plus de collision possible avec req.user.id !
    req.requestId = new SessionId(sIdBrute);

    next();
  });

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Vérifier l'état du service et de la base de données
   *     tags: [Health]
   *     security: []
   *     responses:
   *       200:
   *         description: Service opérationnel
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponseSuccess'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         status: { type: string, example: ok }
   *                         uptime: { type: number, example: 42.5 }
   *                         database: { type: string, example: up }
   *                         timestamp: { type: string, format: date-time }
   */

    // ----- 🩺 Routine de Health Check Système Résiliente -----
  app.get('/health', async (_req: Request, res: Response): Promise<void> => {
    const db : DatabaseConnection = DatabaseConnection.getInstance();
    const dbAlive : boolean       = await db.ping().catch((): boolean => false);

    // 🚨 ALLUMAGE DES SIRÈNES : Si la base est OOL, on bombarde le terminal !
    if (!dbAlive) {
      logger.error('🔥 [Mémoria - ALERTE MAJEURE] LE RÉACTEUR POSTGRESQL EST TOMBÉ HORS-LIGNE (OOL) !');
      logger.warn('🛡️ [Mémoria - SURVIE RESILIENTE] L\'API reste en ligne via le bouclier Fail-Safe de la RAM.');
    }

    // [FAIL-SAFE V4 PRO] L'application Express continue d'honorer la trame pour éviter le crash
    const chargeUtile = {
      status    : dbAlive ? 'ok' : 'fail-safe',
      uptime    : process.uptime(),
      database  : dbAlive ? 'up' : 'down',
      timestamp : new Date().toISOString()
    };

    res.status(200).json(ApiResponseFactory.success('Health check system', chargeUtile));
  });

  // ----- 🛣️ Enclenchement des Routes Versionnées -----
  app.use('/v1', createV1Router());

  // ----- 📜 Documentation d'exposition Swagger -----
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(SwaggerConfig.getSpec(), {
      customSiteTitle : 'Memoria API Docs',
      swaggerOptions  : { persistAuthorization: true }
    })
  );

  app.get('/docs.json', (_req: Request, res: Response): void => {
    res.json(SwaggerConfig.getSpec());
  });

  // ----- 🚨 Capture ultime et Handlers de fin (404 + Exceptions) -----
  app.use(handlerService.handleNotFound.bind(handlerService));
  app.use(handlerService.handleError.bind(handlerService));

  logger.info('Application Express initialisée');
  return app;
}
