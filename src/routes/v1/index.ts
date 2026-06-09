// ——— fichier : src/routes/v1/index.ts

// ——— fichier : src/routes/v1/index.ts

// ===== 🌐 1. MODULES EXTERNES & INFRASTRUCTURE CORE =====
import { Router }             from 'express';
import { DatabaseConnection } from '@/config/DatabaseConnection';

// ===== 🧪 2. COUCHE DOMAINE, CONSTANTS & UTILITAIRES =====
import { PasswordHasher }     from '@/utils/PasswordHasher';
import { TokenManager }       from '@/utils/TokenManager';

// ===== 🗄️ 3. COUCHE ADAPTATEURS : REPOSITORIES (INFRASTRUCTURE) =====
import { UserRepository            } from '@/infrastructure/repositories/UserRepository';
import { ItemRepository            } from '@/infrastructure/repositories/ItemRepository';
import { TagRepository             } from '@/infrastructure/repositories/TagRepository';
import { ItemTagRepository         } from '@/infrastructure/repositories/ItemTagRepository';
import { ShareRepository           } from '@/infrastructure/repositories/ShareRepository';
import { AppEventRepository        } from '@/infrastructure/repositories/AppEventRepository';
import { MemoryBlacklistRepository } from '@/infrastructure/repositories/MemoryBlacklistRepository';

// ===== 🧠 4. COUCHE NOYAU : SERVICES APPLICATIFS (DOMAINE) =====
import { AuthService          } from '@/services/AuthService';
import { UserService          } from '@/services/UserService';
import { ItemService          } from '@/services/ItemService';
import { TagService           } from '@/services/TagService';
import { ShareService         } from '@/services/ShareService';
import { BlacklistService     } from '@/services/BlacklistService';
import { UserExportService    } from '@/services/UserExportService';
import { AppEventService      } from '@/services/AppEventService';
import { AppEventAdminService } from '@/services/AppEventAdminService';

// ===== 🛡️ 5. COUCHE POSTES FRONTIÈRES : MIDDLEWARES & CONTROLLERS =====
import { AuthMiddleware          } from '@/middlewares/AuthMiddleware';
import { AuthController          } from '@/controllers/AuthController';
import { UserController          } from '@/controllers/UserController';
import { ItemController          } from '@/controllers/ItemController';
import { TagController           } from '@/controllers/TagController';
import { ShareController         } from '@/controllers/ShareController';
import { PublicShareController   } from '@/controllers/PublicShareController';
import { AppEventAdminController } from '@/controllers/event/AppEventAdminController';

// ===== 🛣️ 6. COUCHE EXPOSITION : SOUS-ROUTEURS COMPOSANTS =====
import { createAuthRouter   } from '@/routes/v1/auth.routes';
import { createUserRouter   } from '@/routes/v1/user.routes';
import { createItemRouter   } from '@/routes/v1/item.routes';
import { createTagRouter    } from '@/routes/v1/tag.routes';
import { createShareRouter  } from '@/routes/v1/share.routes';
import { createPublicRouter } from '@/routes/v1/public.routes';
import { createAuditRouter  } from '@/routes/v1/audit.routes';

/**
 * 🏛️ Fonction de Fabrique de Routeur V1 (createV1Router)
 * ----------------------------------------------------------------------------
 * Orchestre l'assemblage nominal et l'injection de dépendances pour l'API v1.
 * Éradication complète des méthodes statiques au profit du couplage par constructeur.
 *
 * @function createV1Router
 * @returns {Router} L'instance du routeur Express v1 configurée et étanche
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets)
 * @author Ouvriers du Code : La Vague Initiale (Rangement de printemps post-migration V4)
 */
export function createV1Router(): Router {


  // --- 🔌 B. Récupération de l'Ancrage Unique PostgreSQL V4 ---
  const db = DatabaseConnection.getInstance();

  // --- 🗄️ C. Instanciation des Dépôts d'Infrastructure (Repositories) ---
  const userRepository         = new UserRepository(db);
  const itemRepository         = new ItemRepository(db);
  const tagRepository          = new TagRepository(db);
  const itemTagRepository      = new ItemTagRepository(db);
  const shareRepository        = new ShareRepository(db);
  const l_oAppEventRepository  = new AppEventRepository(db);
  const l_oBlacklistRepository = new MemoryBlacklistRepository();

  // --- 🔧 A. Instanciation des Utilitaires de Sécurité ---
  const passwordHasher          = new PasswordHasher();
  const tokenManager            = new TokenManager();
  const blacklistService        = new BlacklistService(l_oBlacklistRepository);
  const l_oAppEventService      = new AppEventService(l_oAppEventRepository);
  const l_oAppEventAdminService = new AppEventAdminService(l_oAppEventRepository, l_oAppEventService);

  // --- 🧠 D. Instanciation Étanche des Services Métier ---
  const authService = new AuthService(
    userRepository,
    passwordHasher,
    tokenManager,
    blacklistService
  );
  const itemService       = new ItemService(itemRepository, itemTagRepository, tagRepository);
  const tagService        = new TagService(tagRepository);
  const shareService      = new ShareService(shareRepository, itemRepository);
  const userService       = new UserService(userRepository, passwordHasher);
  const userExportService = new UserExportService(
    userRepository,
    itemRepository,
    itemTagRepository,
    tagRepository,
    shareRepository
  );

  // --- 🛡️ E. Déploiement des Gardes-Barrières (Middlewares) ---
  const authMiddleware = new AuthMiddleware(tokenManager, blacklistService);

  // --- 🎛️ F. Instanciation des Contrôleurs d'Interface ---
  const authController          = new AuthController(authService, userRepository);
  const itemController          = new ItemController(itemService);
  const tagController           = new TagController(tagService);
  const shareController         = new ShareController(shareService);
  const publicShareController   = new PublicShareController(shareService);
  const userController          = new UserController(userService, userExportService);
  const appEventAdminController = new AppEventAdminController(l_oAppEventAdminService);

  // --- 🛣️ G. Assemblage Final du Pipeline de Distribution Étanche ---
  const v1: Router = Router();

  v1.use('/auth',   createAuthRouter(authController, authMiddleware));
  v1.use('/items',  authMiddleware.requireAuth(), createItemRouter(itemController));
  v1.use('/tags',   authMiddleware.requireAuth(), createTagRouter(tagController));
  v1.use('/shares', authMiddleware.requireAuth(), createShareRouter(shareController));
  v1.use('/users',  authMiddleware.requireAuth(), createUserRouter(userController));
  v1.use('/public', createPublicRouter(publicShareController));

  // Ancrage du nouveau territoire d'audit protégé par droit d'accès admin
  v1.use('/audit',  authMiddleware.requireAuth(), createAuditRouter(appEventAdminController));

  return v1;
}
