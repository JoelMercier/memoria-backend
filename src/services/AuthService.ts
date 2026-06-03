// ——— fichier : src/services/AuthService.ts

import { randomUUID } from 'node:crypto';
import { AuthProvider } from '@/constants/AuthProvider';
import { Role } from '@/constants/Role';
import { User } from '@/entities/User';
import { ConflictErrorFactory } from '@/exceptions/ConflictErrorFactory';
import { TokenError } from '@/exceptions/TokenError';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import { UserId } from '@/domain/value-objects/IdMetier';
import type { CreateUserDto } from '@/dto/user/CreateUserDto';
import type { LoginDto } from '@/dto/user/auth/LoginDto';
import type { RefreshTokenDto } from '@/dto/user/auth/RefreshTokenDto';
import type { IUser } from '@/interfaces/entities/user/IUser';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import type { IUserRepository } from '@/interfaces/repositories/IUserRepository';
import type { IBlacklistService } from '@/interfaces/security/IBlacklistService';
import type { IPasswordHasher } from '@/interfaces/security/IPasswordHasher';
import type { ITokenManager } from '@/interfaces/security/ITokenManager';
import type { IAuthResult, IAuthService, IRefreshResult } from '@/interfaces/services/IAuthService';

/**
 * 🏛️ Classe AuthService
 * ---------------------
 * Service de domaine gérant la cinématique de l'authentification et de la sécurité des comptes.
 * Version armée contre les inversions d'identifiants et épurée des reliques d'infrastructure.
 *
 * @class AuthService
 * @implements {IAuthService}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class AuthService implements IAuthService {

  /** 🎛️ Dépendances de sécurité et de persistance injectées */
  private readonly userRepository : IUserRepository;
  private readonly passwordHasher : IPasswordHasher;
  private readonly tokenManager   : ITokenManager;
  private readonly blacklistService : IBlacklistService;

  /**
   * Initialise les fondations de sécurité par injection d'abstractions.
   *
   * @constructor
   */
  public constructor(
    userRepository : IUserRepository,
    passwordHasher : IPasswordHasher,
    tokenManager   : ITokenManager,
    blacklistService : IBlacklistService
  ) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenManager = tokenManager;
    this.blacklistService = blacklistService;
  }

  /**
   * 📝 Inscription d'un nouvel utilisateur (Fail-fast unitaire inclus).
   *
   * @public
   * @async
   */
  public async register(dto: CreateUserDto): Promise<IUser> {
    const existingEmail: User | null = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) throw UserErrorFactory.emailExists(dto.email);

    const existingPseudo: User | null = await this.userRepository.findByPseudo(dto.pseudo);
    if (existingPseudo) throw ConflictErrorFactory.usernameExists(dto.pseudo);

    const passwordHash : string = await this.passwordHasher.hash(dto.password);

    // 🪓 ALIGNEMENT 128-BIT : Allocation d'un véritable UserId d'acier pur généré à la volée !
    const userData : IUserData = {
      idUser          : new UserId(randomUUID()),
      email           : dto.email,
      passwordHash    : passwordHash,
      pseudo          : dto.pseudo,
      role            : Role.fromSql('customer')!,
      authProvider    : AuthProvider.LOCAL!,
      settingsUser    : {},
      gdprConsent     : dto.gdprConsent,
      gdprConsentDate : new Date()
    };

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
    if (!user) throw UserErrorFactory.invalidCredentials();

    // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation de getPasswordHash()
    const isValid : boolean = await this.passwordHasher.verify(dto.password, user.getPasswordHash());
    if (!isValid) throw UserErrorFactory.invalidCredentials();

    // 🪓 ALIGNEMENT INDUSTRIEL : Extraction propre via les nouvelles signatures de fonctions métiers de IUser
    const { accessToken, refreshToken } = await this.tokenManager.generateTokens({
      sub    : user.getUserId(),
      email  : user.getEmail(),
      pseudo : user.getPseudo(),
      role   : user.getRole()
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
    const payload = await this.tokenManager.verifyRefreshToken(dto.refreshToken);

    if (payload.jti && this.blacklistService.isBlacklisted(payload.jti)) {
      throw TokenError.revoked();
    }

    const idActeur = typeof payload.sub === 'string' ? new UserId(payload.sub) : (payload.sub as UserId);
    const user : User | null = await this.userRepository.findById(idActeur);
    if (!user) throw UserErrorFactory.notFound(idActeur);

    if (payload.jti && payload.exp) {
      this.blacklistService.add(payload.jti, payload.exp);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL : Extraction propre via les nouvelles signatures de fonctions métiers de IUser
    const tokens = await this.tokenManager.generateTokens({
      sub    : user.getUserId(),
      email  : user.getEmail(),
      pseudo : user.getPseudo(),
      role   : user.getRole()
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
