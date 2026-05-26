// ——— fichier : src/interfaces/services/IUserService.ts

import      { UserId            } from '@/domain/value-objects/IdMetier';
import type { ChangePasswordDto } from '@/dto/user/ChangePasswordDto';
import type { DeleteAccountDto  } from '@/dto/user/DeleteAccountDto';
import type { UpdateProfileDto  } from '@/dto/user/UpdateProfileDto';
import type { IUser             } from '@/interfaces/entities/user/IUser';

/**
 * 📜 Interface IUserService
 * -------------------------
 * Contrat du service applicatif orchestrant le cycle de vie et la sécurité des utilisateurs.
 * Transitionne vers le type nominal pour interdire les chaînes primitives brutes.
 *
 * @interface IUserService
 * @author Joël, Gaïa & Co
 */
export interface IUserService {

  /** 🎛️ Modifie les informations de contact ou publiques du profil. */
  updateProfile(userId: UserId, dto: UpdateProfileDto): Promise<IUser>;

  /** 🔏 Applique et valide le renouvellement du mot de passe de l'acteur. */
  changePassword(userId: UserId, dto: ChangePasswordDto): Promise<void>;

  /** 🗑️ Purge définitivement l'intégralité du compte de l'utilisateur. */
  deleteAccount(userId: UserId, dto: DeleteAccountDto): Promise<void>;
}
