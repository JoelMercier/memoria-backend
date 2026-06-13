// ——— fichier : src/services/AuthService.ts

import { IdForge } from '@/domain/utils/IdForge';
import type { User } from '@/entities/User';
import { ConflictErrorFactory } from '@/exceptions/ConflictErrorFactory';
import { TokenError } from '@/exceptions/TokenError';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import { ProviderId, RoleId, UserId } from '@/domain/value-objects/ids';
import type { CreateUserDto } from '@/dto/user/CreateUserDto';
import type { LoginDto } from '@/dto/user/auth/LoginDto';
import type { RefreshTokenDto } from '@/dto/user/auth/RefreshTokenDto';
import type { IUser } from '@/interfaces/entities/user/IUser';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import type { IUserRepository } from '@/interfaces/repositories/PostGres/IUserRepository';
import type { IBlacklistService } from '@/interfaces/security/IBlacklistService';
import type { IPasswordHasher } from '@/interfaces/security/IPasswordHasher';
import type { ITokenManager } from '@/interfaces/security/ITokenManager';
import type { IAuthResult, IAuthService, IRefreshResult } from '@/interfaces/services/IAuthService';

/**
 * 🏛️ Classe AuthService
 * ----------------------------------------------------------------------------
 * Service de domaine gérant la cinématique de l'authentification et de la sécurité des comptes.
 *
 * @class AuthService
 * @implements {IAuthService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Garde d'élite en surchauffe)
 */
export class AuthService implements IAuthService {
  /** 🗄️ Entrepôt de persistance abstrait des utilisateurs (IUserRepository) */
  private readonly m_oUserRepository: IUserRepository;

  /** 🛡️ Service d'encodage cryptographique des mots de passe */
  private readonly m_oPasswordHasher: IPasswordHasher;

  /** 🔑 Gestionnaire de cycle de vie et de signature des jetons de sécurité */
  private readonly m_oTokenManager: ITokenManager;

  /** 🗄️ Registre de quarantaine en mémoire pour les jetons révoqués */
  private readonly m_oBlacklistService: IBlacklistService;

  /**
   * Initialise les fondations de sécurité par injection d'abstractions.
   */
  public constructor(
    p_oUserRepository: IUserRepository,
    p_oPasswordHasher: IPasswordHasher,
    p_oTokenManager: ITokenManager,
    p_oBlacklistService: IBlacklistService
  ) {
    this.m_oUserRepository = p_oUserRepository;
    this.m_oPasswordHasher = p_oPasswordHasher;
    this.m_oTokenManager = p_oTokenManager;
    this.m_oBlacklistService = p_oBlacklistService;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   */
  public get repository(): IUserRepository {
    return this.m_oUserRepository;
  }

  /** 🛡️ Accesseur public pour le hacheur cryptographique des secrets */
  public get hasher(): IPasswordHasher {
    return this.m_oPasswordHasher;
  }

  /** 🔑 Accesseur public pour le gestionnaire d'infrastructure JWT */
  public get tokens(): ITokenManager {
    return this.m_oTokenManager;
  }

  /** 🗄️ Accesseur public pour le registre de quarantaine Redis/Mémoire */
  public get blacklist(): IBlacklistService {
    return this.m_oBlacklistService;
  }

  /**
   * 📝 Inscription d'un nouvel utilisateur (Fail-fast unitaire inclus).
   */
  public async register(p_oDto: CreateUserDto): Promise<IUser> {
    // 🪓 ALIGNEMENT SOUVERAIN V4 : Interrogation obligatoire via l'accesseur this.repository
    const l_oExistingEmail: User | null = await this.repository.findByEmail(p_oDto.email);
    if (l_oExistingEmail) throw UserErrorFactory.emailExists(p_oDto.email);

    const l_oExistingPseudo: User | null = await this.repository.findByPseudo(p_oDto.pseudo);
    if (l_oExistingPseudo) throw ConflictErrorFactory.usernameExists(p_oDto.pseudo);

    const l_sPasswordHash: string = await this.hasher.hash(p_oDto.password);

    const l_oUserData: IUserData = {
      idUser: new UserId(IdForge.genererUuidV7()),
      courriel: p_oDto.email,
      passwordHash: l_sPasswordHash,
      pseudo: p_oDto.pseudo,
      roleId: new RoleId('CUST'),
      authProviderId: new ProviderId('LOCA'),
      settingsUser: {},
      rgpdConsent: p_oDto.rgpdConsent,
      rgpdConsentDate: new Date(),
      createdAt: new Date()
    };

    return await this.repository.create(l_oUserData);
  }

  /**
   * 🔐 Authentification initiale (Vérification des secrets et émission des jetons).
   */
  public async login(p_oDto: LoginDto): Promise<IAuthResult> {
    const l_oUser: User | null = await this.repository.findByEmail(p_oDto.email);
    if (!l_oUser) throw UserErrorFactory.invalidCredentials();

    const l_bIsValid: boolean = await this.hasher.verify(p_oDto.password, l_oUser.passwordHash);
    if (!l_bIsValid) throw UserErrorFactory.invalidCredentials();

    const { accessToken, refreshToken } = await this.tokens.generateTokens({
      sub: l_oUser.idUser,
      email: l_oUser.courriel,
      pseudo: l_oUser.pseudo,
      role: l_oUser.role
    });

    return { user: l_oUser, accessToken, refreshToken };
  }

  /**
   * 🔄 Renouvelle la validité des sessions via le jeton de rafraîchissement (Rotation incluse).
   */
  public async refresh(p_oDto: RefreshTokenDto): Promise<IRefreshResult> {
    const l_oPayload = await this.tokens.verifyRefreshToken(p_oDto.refreshToken);

    if (l_oPayload.jti && (await this.blacklist.isBlacklisted(l_oPayload.jti))) {
      throw TokenError.revoked();
    }

    const l_axIdActeur =
      typeof l_oPayload.sub === 'string' ? new UserId(l_oPayload.sub) : l_oPayload.sub;
    const l_oUser: User | null = await this.repository.findById(l_axIdActeur);
    if (!l_oUser) throw UserErrorFactory.notFound(l_axIdActeur);

    if (l_oPayload.jti && l_oPayload.exp) {
      await this.blacklist.add(l_oPayload.jti, l_oPayload.exp);
    }

    const { accessToken, refreshToken } = await this.tokens.generateTokens({
      sub: l_oUser.idUser,
      email: l_oUser.courriel,
      pseudo: l_oUser.pseudo,
      role: l_oUser.role
    });

    return { accessToken, refreshToken };
  }
  /**
   * 🗑️ Révoque définitivement un jeton de rafraîchissement pour clore la session (Déconnexion).
   *
   * @public
   * @async
   * @param {string} p_sRefreshToken - La chaîne du jeton de rafraîchissement à inscrire en liste noire
   * @returns {Promise<void>}
   */
  public async logout(p_sRefreshToken: string): Promise<void> {
    try {
      // 🪓 ALIGNEMENT SOUVERAIN V4 : Passage obligatoire par les accesseurs de surface
      const l_oPayload = await this.tokens.verifyRefreshToken(p_sRefreshToken);
      if (l_oPayload.jti && l_oPayload.exp) {
        await this.blacklist.add(l_oPayload.jti, l_oPayload.exp);
      }
    } catch {
      // Éradication silencieuse : si le jeton est déjà corrompu structurellement, la session est close.
    }
  }
}
