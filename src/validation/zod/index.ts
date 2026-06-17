// ——— fichier : src/validation/zod/index.ts

/**
 * 🏛️ Point d'entrée unique (Barrel File) de la couche de validation Zod
 * ---------------------------------------------------------------------
 * Regroupe et expose de manière centralisée tous les portiers de sécurité (classes)
 * et leurs contrats de structure inférés (types) pour l'application Memoria.
 *
 * SOLID :
 *  - Interface Segregation / Facade Pattern : Offre un point d'accès unifié aux douanes.
 *
 * @file index.ts
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */

/** 🏛️ Exportation des classes actives de validation (Portiers de sécurité) */
export { AppEventValidation } from '@/validation/zod/AppEventValidation';
export { AuthValidation } from '@/validation/zod/AuthValidation';
export { ItemValidation } from '@/validation/zod/ItemValidation';
export { ShareValidation } from '@/validation/zod/ShareValidation';
export { TagValidation } from '@/validation/zod/TagValidation';
export { UserValidation } from '@/validation/zod/UserValidation';

/** 🚨 Contrats de structure pour le module d'Audit Système (Logs) */
export type {
  CreateAppEventSchemaType,
  UpdateAppEventSchemaType
} from '@/validation/zod/AppEventValidation';

/** 🔑 Contrats de structure pour le module d'Authentification */
export type { LoginSchemaType, RefreshTokenSchemaType } from '@/validation/zod/AuthValidation';

/** 📦 Contrats de structure pour le domaine des Pépites (Items) */
export type { CreateItemSchemaType, UpdateItemSchemaType } from '@/validation/zod/ItemValidation';

/** 🔗 Contrats de structure pour le domaine des Partages (Shares) */
export type {
  CreateShareSchemaType,
  UpdateShareSchemaType
} from '@/validation/zod/ShareValidation';

/** 🏷️ Contrats de structure pour le domaine des Mots-clés (Tags) */
export type { CreateTagSchemaType, UpdateTagSchemaType } from '@/validation/zod/TagValidation';

/** 👥 Contrats de structure pour le domaine des Utilisateurs (Users) */
export type {
  CreateUserSchemaType,
  UpdateUserSchemaType,
  DeleteUserSchemaType,
  UpdateProfileSchemaType,
  ChangePasswordSchemaType,
  DeleteAccountSchemaType
} from '@/validation/zod/UserValidation';
