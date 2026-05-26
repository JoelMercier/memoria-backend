// ——— fichier : src/services/AuthService.ts

import { AuthProvider }     from '@/constants/AuthProvider';
import { Role }             from '@/constants/Role';
import { User }             from '@/entities/User';
import { ConflictErrorFactory } from '@/exceptions/ConflictErrorFactory';
import { TokenError }       from '@/exceptions/TokenError';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import type { CreateUserDto }   from '@/dto/user/CreateUserDto';
import type { LoginDto }        from '@/dto/user/auth/LoginDto';
import type { RefreshTokenDto } from '@/dto/user/auth/RefreshTokenDto';
import type { IUser }           from '@/interfaces/entities/user/IUser';
import type { IUserData }       from '@/interfaces/entities/user/IUserData';
import type { IUserRepository } from '@/interfaces/repositories/IUserRepository';
import type { IBlacklistService } from '@/interfaces/security/IBlacklistService';
import type { IPasswordHasher }   from '@/interfaces/security/IPasswordHasher';
import type { ITokenManager }     from '@/interfaces/security/ITokenManager';
import type { IAuthResult,
              IAuthService,
              IRefreshResult }    from '@/interfaces/services/IAuthService';

/**
 * 🏛️ Classe AuthService
 * ---------------------
 * Service de domaine gérant la cinématique de l'authentification et de la sécurité des comptes.
 * Version armée contre les inversions d'identifiants et épurée des reliques d'infrastructure.
 *
 * @class AuthService
 * @implements {IAuthService}
 * @author Joël, Gaïa & Co
 */
export class AuthService implements IAuthService {

  /**
   * Initialise les fondations de sécurité par injection d'abstractions.
   *
   * @constructor
   */
  public constructor(
    private readonly userRepository : IUserRepository,
    private readonly passwordHasher : IPasswordHasher,
    private readonly tokenManager   : ITokenManager,
    private readonly blacklistService : IBlacklistService
  ) {}

  /**
   * 📝 Inscription d'un nouvel utilisateur (Fail-fast unitaire inclus).
   *
   * @public
   * @async
   */
  public async register(dto: CreateUserDto): Promise<IUser> {
    // 1. Vérifie l'unicité email et pseudo avant le hash cryptographique coûteux
    const existingEmail: User | null = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw UserErrorFactory.emailExists(dto.email);
    }
    const existingPseudo: User | null = await this.userRepository.findByPseudo(dto.pseudo);
    if (existingPseudo) {
      throw ConflictErrorFactory.usernameExists(dto.pseudo);
    }

    // 2. Hash cryptographique du mot de passe
    const passwordHash : string = await this.passwordHasher.hash(dto.password);

    // 3. Construit IUserData pour le stockage persistant
    const userData : IUserData = {
      idUser          : undefined as any, // Forgé dynamiquement à l'insertion par gen_random_uuid()
      email           : dto.email,
      passwordHash    : passwordHash,
      pseudo          : dto.pseudo,
      role            : Role.fromSql('customer'), // Alignement sur nos instances de Smart Enums
      authProvider    : AuthProvider.fromSql('local'),
      settingsUser    : {},
      gdprConsent     : dto.gdprConsent,
      gdprConsentDate : new Date()
    };

    // 4. Persistance finale via le dépôt PostgreSQL
    return await this.userRepository.create(userData);
  }

  /**
   * 🔐 Authentification initiale (Vérification des secrets et émission des jetons).
   *
   * @public
   * @async
   */
  public async login(dto: LoginDto): Promise<IAuthResult> {
    const user : User | null = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw UserErrorFactory.invalidCredentials();
    }

    const isValid : boolean = await this.passwordHasher.verify(dto.password, user.PasswordHash);
    if (!isValid) {
      throw UserErrorFactory.invalidCredentials();
    }

    const { accessToken, refreshToken } = await this.tokenManager.generateTokens({
      sub    : user.getUserId(), // Capture nominale stricte du caillou de couleur UserId
      email  : user.Email,
      pseudo : user.Pseudo,
      role   : user.Role
    });

    return { user, accessToken, refreshToken };
  }

  /**
   * 🔄 Renouvelle la validité des sessions via le jeton de rafraîchissement (Rotation incluse).
   *
   * @public
   * @async
   */
  public async refresh(dto: RefreshTokenDto): Promise<IRefreshResult> {
    // 1. Analyse la validité, la signature et l'expiration temporelle
    const payload = await this.tokenManager.verifyRefreshToken(dto.refreshToken);

    // 2. Bloque la transaction si l'identifiant unique du token (jti) est sur liste noire
    if (payload.jti && this.blacklistService.isBlacklisted(payload.jti)) {
      throw TokenError.revoked();
    }

    // 3. Vérifie l'existence saine du sujet (sub) au sein de la base de données
    const user : User | null = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw UserErrorFactory.notFound(payload.sub);
    }

    // 4. Règle de rotation : Ancien jeton mis en quarantaine immédiate
    if (payload.jti && payload.exp) {
      this.blacklistService.add(payload.jti, payload.exp);
    }

    // 5. Génère le nouveau doublet de jetons d'accès et de rafraîchissement
    const tokens = await this.tokenManager.generateTokens({
      sub    : user.getUserId(), // Alignement chirurgical nominal
      email  : user.Email,
      pseudo : user.Pseudo,
      role   : user.Role
    });

    return tokens;
  }

  /**
   * 🗑️ Révocation asynchrone de la session en cours de validité (Déconnexion).
   *
   * @public
   * @async
   */
  public async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await this.tokenManager.verifyRefreshToken(refreshToken);
      if (payload.jti && payload.exp) {
        this.blacklistService.add(payload.jti, payload.exp);
      }
    } catch {
      // Clôture silencieuse : un token expiré ou corrompu est déjà caduc
    }
  }
}
