// ——— fichier : src/interfaces/services/IAuthService.ts

import      { LoginDto        } from '@/dto/user/auth/LoginDto';
import      { RefreshTokenDto } from '@/dto/user/auth/RefreshTokenDto';
import      { CreateUserDto   } from '@/dto/user/CreateUserDto';
import type { IUser           } from '@/interfaces/entities/user/IUser';

/**
 * 📦 Interface IAuthResult
 * ------------------------
 * Structure de restitution regroupant le profil de l'utilisateur et son doublet de jetons d'accès.
 *
 * @interface IAuthResult
 * @author Joël, Gaïa & Co
 */
export interface IAuthResult {
  /** 👥 Instance vivante de l'entité utilisateur authentifiée */
  user : IUser;

  /** 🔑 Jeton d'accès de courte durée destiné à l'autorisation des requêtes privées */
  accessToken : string;

  /** 🔄 Jeton de rafraîchissement destiné au renouvellement ou à la fermeture des sessions */
  refreshToken : string;
}

/**
 * 📦 Interface IRefreshResult
 * ---------------------------
 * Structure de restitution regroupant le nouveau doublet de jetons généré après renouvellement.
 *
 * @interface IRefreshResult
 * @author Joël, Gaïa & Co
 */
export interface IRefreshResult {
  /** 🔑 Nouveau jeton d'accès de courte durée signé par l'infrastructure */
  accessToken : string;

  /** 🔄 Nouveau jeton de rafraîchissement de longue durée */
  refreshToken : string;
}

/**
 * 🔒 Interface IAuthService
 * ----------------------------
 * Contrat métier régissant la logique de sécurité, d'enrôlement et de cycle de vie des sessions.
 * Pilote l'inscription des acteurs, la vérification des secrets et l'émission des privilèges.
 *
 * @interface IAuthService
 * @author Joël, Gaïa & Co
 */
export interface IAuthService {

  /** 📝 Orchestre l'inscription d'un nouvel utilisateur après validation stricte de ses données. */
  register(dto: CreateUserDto): Promise<IUser>;

  /** 🔐 Valide les secrets d'un acteur et initie sa session applicative sécurisée. */
  login(dto: LoginDto): Promise<IAuthResult>;

  /** 🔄 Renouvelle la validité d'une session compromise ou expirée via son jeton de contrôle. */
  refresh(dto: RefreshTokenDto): Promise<IRefreshResult>;

  /** 🗑️ Révoque définitivement un jeton de rafraîchissement pour clore la session (Déconnexion). */
  logout(refreshToken: string): Promise<void>;
}
