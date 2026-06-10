// ——— fichier : src/interfaces/services/IAuthService.ts

import { IBaseService }    from '@/interfaces/services/IBaseService';
import type { IUser }      from '@/interfaces/entities/user/IUser';
import { LoginDto }        from '@/dto/user/auth/LoginDto';
import { RefreshTokenDto } from '@/dto/user/auth/RefreshTokenDto';
import { CreateUserDto }   from '@/dto/user/CreateUserDto';
import { IUserRepository } from '@/interfaces/repositories/PostGres/IUserRepository'; // 🗲 [RÉPARÉ CASSE]
import type { User }       from '@/entities/User';
import type { UserId }     from '@/domain/value-objects/ids';
import type { IUserData }  from '@/interfaces/entities/user/IUserData';

/**
 * 📦 Interface IAuthResult
 * ----------------------------------------------------------------------------
 * Structure de restitution regroupant le profil enrichi de l'acteur et son doublet de jetons.
 *
 * @interface IAuthResult
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (À la chaleur de l'acier et des octets V4)
 */
export interface IAuthResult {
  /** 👥 Instance vivante de l'entité utilisateur authentifiée conforme V4 */
  user : IUser;

  /** 🔑 Jeton d'accès de courte durée destiné à l'autorisation des requêtes privées */
  accessToken : string;

  /** 🔄 Jeton de rafraîchissement destiné au renouvellement ou à la fermeture des sessions */
  refreshToken : string;
}

/**
 * 📦 Interface IRefreshResult
 * ----------------------------------------------------------------------------
 * Structure de restitution regroupant le nouveau doublet de jetons généré après renouvellement.
 *
 * @interface IRefreshResult
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (À la chaleur de l'acier et des octets V4)
 */
export interface IRefreshResult {
  /** 🔑 Nouveau jeton d'accès de courte durée signé par l'infrastructure */
  accessToken : string;

  /** 🔄 Nouveau jeton de rafraîchissement de longue durée */
  refreshToken : string;
}


/**
 * 🔒 Interface IAuthService
 * ----------------------------------------------------------------------------
 * Contrat métier régissant la logique de sécurité, d'enrôlement et de cycle de vie des sessions.
 * Pilote l'inscription des acteurs, la vérification des secrets et l'émission des privilèges.
 * [RÉPARÉ V4] Alignement strict à 4 arguments génériques sur la maman IBaseService !
 *
 * @interface IAuthService
 * @extends {IBaseService<User, IUserData, UserId, IUserRepository>} -- 🗲 [SCELLÉ RECOUVREMENT]
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Ouvriers du Code : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IAuthService extends IBaseService<User, IUserData, UserId, IUserRepository> {

  /**
   * 📝 Orchestre l'inscription d'un nouvel utilisateur après validation stricte de ses données.
   *
   * @param {CreateUserDto} p_oDto - L'objet de transfert de données pour l'enrôlement de l'acteur
   * @returns {Promise<IUser>} L'instance de l'utilisateur créé et persistant
   */
  register(p_oDto: CreateUserDto): Promise<IUser>;

  /**
   * 🔐 Valide les secrets d'un acteur et initie sa session applicative sécurisée.
   *
   * @param {LoginDto} p_oDto - Les données d'identification de l'acteur (Courriel, Mot de passe)
   * @returns {Promise<IAuthResult>} Le profil enrichi de ses jetons de session
   */
  login(p_oDto: LoginDto): Promise<IAuthResult>;

  /**
   * 🔄 Renouvelle la validité d'une session compromise ou expirée via son jeton de contrôle.
   *
   * @param {RefreshTokenDto} p_oDto - Le jeton de rafraîchissement à valider
   * @returns {Promise<IRefreshResult>} Le nouveau doublet de jetons d'accès et renouvellement
   */
  refresh(p_oDto: RefreshTokenDto): Promise<IRefreshResult>;

  /**
   * 🗑️ Révoque définitivement un jeton de rafraîchissement pour clore la session (Déconnexion).
   *
   * @param {string} p_sRefreshToken - La chaîne du jeton de rafraîchissement à inscrire en liste noire
   * @returns {Promise<void>}
   */
  logout(p_sRefreshToken: string): Promise<void>;
}
