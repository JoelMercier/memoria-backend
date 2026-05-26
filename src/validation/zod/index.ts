// ——— fichier : src/validation/zod/index.ts

/**
 * @file index.ts
 * @description Point d'entrée unique et baril d'exportation (Barrel File) pour la couche de validation Zod.
 * Regroupe tous les portiers de sécurité et leurs types inférés pour l'application Memoria.
 * @author Jojo & Co
 */

/** 🏛️ Exportation des classes actives de validation (Portiers de sécurité) */
export { AuthValidation           } from '@/validation/zod/AuthValidation';
export { ItemValidation           } from '@/validation/zod/ItemValidation';
export { ShareValidation          } from '@/validation/zod/ShareValidation';
export { TagValidation            } from '@/validation/zod/TagValidation';
export { UserValidation           } from '@/validation/zod/UserValidation';

/** 🔑 Contrats de structure pour le module d'Authentification */
export type { LoginSchemaType,
              RefreshTokenSchemaType } from '@/validation/zod/AuthValidation';

/** 📦 Contrats de structure pour le domaine des Pépites (Items) */
export type { CreateItemSchemaType,
              UpdateItemSchemaType   } from '@/validation/zod/ItemValidation';

/** 🔗 Contrats de structure pour le domaine des Partages (Shares) */
export type { CreateShareSchemaType,
              UpdateShareSchemaType  } from '@/validation/zod/ShareValidation';

/** 🏷️ Contrats de structure pour le domaine des Mots-clés (Tags) */
export type { CreateTagSchemaType,
              UpdateTagSchemaType    } from '@/validation/zod/TagValidation';

/** 👥 Contrats de structure pour le domaine des Utilisateurs (Users) */
export type { CreateUserSchemaType,
              UpdateUserSchemaType,
              DeleteUserSchemaType,
              UpdateProfileSchemaType,
              ChangePasswordSchemaType,
              DeleteAccountSchemaType } from '@/validation/zod/UserValidation';
