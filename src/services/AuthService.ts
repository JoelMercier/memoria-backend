// ——— fichier : src/services/AuthService.ts

import { IdForge }            from '@/domain/utils/IdForge'; // 🗲 [NEW V4] Fondeur UUID v7 du Domaine
import { User }               from '@/entities/User';
import { ConflictErrorFactory } from '@/exceptions/ConflictErrorFactory';
import { TokenError }         from '@/exceptions/TokenError';
import { UserErrorFactory }   from '@/exceptions/UserErrorFactory';
import { ProviderId, RoleId, UserId } from '@/domain/value-objects/ids';
import type { CreateUserDto } from '@/dto/user/CreateUserDto';
import type { LoginDto }      from '@/dto/user/auth/LoginDto';
import type { RefreshTokenDto } from '@/dto/user/auth/RefreshTokenDto';
import type { IUser }         from '@/interfaces/entities/user/IUser';
import type { IUserData }     from '@/interfaces/entities/user/IUserData';
import type { IUserRepository } from '@/interfaces/repositories/IUserRepository';
import type { IBlacklistService } from '@/interfaces/security/IBlacklistService';
import type { IPasswordHasher }   from '@/interfaces/security/IPasswordHasher';
import type { ITokenManager }     from '@/interfaces/security/ITokenManager';
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
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Garde d'élite en surchauffe)
 */
export class AuthService implements IAuthService {

  /** 🗄️ Entrepôt de persistance abstrait des utilisateurs (IUserRepository) */
  private readonly m_oUserRepository   : IUserRepository;

  /** 🛡️ Service d'encodage cryptographique des mots de passe */
  private readonly m_oPasswordHasher   : IPasswordHasher;

  /** 🔑 Gestionnaire de cycle de vie et de signature des jetons de sécurité */
  private readonly m_oTokenManager     : ITokenManager;

  /** 🗄️ Registre de quarantaine en mémoire pour les jetons révoqués */
  private readonly m_oBlacklistService : IBlacklistService;

  /**
   * Initialise les fondations de sécurité par injection d'abstractions.
   *
   * @constructor
   * @param {IUserRepository} p_oUserRepository - Le dépôt d'infrastructure des utilisateurs
   * @param {IPasswordHasher} p_oPasswordHasher - Le hacheur de mots de passe
   * @param {ITokenManager} p_oTokenManager - Le gestionnaire de jetons JWT
   * @param {IBlacklistService} p_oBlacklistService - Le service de liste noire des sessions
   */
  public constructor(
    p_oUserRepository : IUserRepository,
    p_oPasswordHasher : IPasswordHasher,
    p_oTokenManager   : ITokenManager,
    p_oBlacklistService : IBlacklistService
  ) {
    this.m_oUserRepository   = p_oUserRepository;
    this.m_oPasswordHasher   = p_oPasswordHasher;
    this.m_oTokenManager     = p_oTokenManager;
    this.m_oBlacklistService = p_oBlacklistService;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   * Centralise la souveraineté d'accès au dépôt d'infrastructure des utilisateurs.
   *
   * @public
   * @returns {IUserRepository} L'instance du dépôt d'infrastructure abstrait
   */
  public get repository(): IUserRepository {
    return this.m_oUserRepository;
  }

  /**
   * 📝 Inscription d'un nouvel utilisateur (Fail-fast unitaire inclus).
   *
   * @public
   * @async
   * @param {CreateUserDto} p_oDto - L'objet de transfert de données pour l'enrôlement de l'acteur
   * @throws {UserErrorFactory} Si l'adresse de courriel existe déjà sur le disque
   * @throws {ConflictErrorFactory} Si le pseudo d'affichage est déjà réservé
   * @returns {Promise<IUser>} L'instance de l'utilisateur créé et persistant
   */
  public async register(p_oDto: CreateUserDto): Promise<IUser> {
    const l_oExistingEmail: User | null = await this.m_oUserRepository.findByEmail(p_oDto.email);
    if (l_oExistingEmail) throw UserErrorFactory.emailExists(p_oDto.email);

    const l_oExistingPseudo: User | null = await this.m_oUserRepository.findByPseudo(p_oDto.pseudo);
    if (l_oExistingPseudo) throw ConflictErrorFactory.usernameExists(p_oDto.pseudo);

    const l_sPasswordHash : string = await this.m_oPasswordHasher.hash(p_oDto.password);

    // 🪓 [REARMÉ V4] Injection de IdForge pour couler un vrai UUID v7 chronologique
    const l_oUserData : IUserData = {
      idUser          : new UserId(IdForge.genererUuidV7()), // Exit la loterie v4 bête 🐦 💨
      email           : p_oDto.email,
      passwordHash    : l_sPasswordHash,
      pseudo          : p_oDto.pseudo,
      roleId          : new RoleId('CUST'),
      authProviderId  : new ProviderId('LOCA'),
      settingsUser    : {},
      rgpdConsent     : p_oDto.rgpdConsent,
      rgpdConsentDate : new Date(),
      createdAt       : new Date()
    };

    return await this.m_oUserRepository.create(l_oUserData);
  }

  /**
   * 🔐 Authentification initiale (Vérification des secrets et émission des jetons).
   *
   * @public
   * @async
   * @param {LoginDto} p_oDto - Les données d'identification de l'acteur (Courriel, Mot de passe)
   * @throws {UserErrorFactory} Si les identifiants de connexion ou le secret sont invalides
   * @returns {Promise<IAuthResult>} Le profil enrichi de ses jetons de session
   */
  public async login(p_oDto: LoginDto): Promise<IAuthResult> {
    const l_oUser : User | null = await this.m_oUserRepository.findByEmail(p_oDto.email);
    if (!l_oUser) throw UserErrorFactory.invalidCredentials();

    // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation de getPasswordHash()
    const l_bIsValid : boolean = await this.m_oPasswordHasher.verify(p_oDto.password, l_oUser.getPasswordHash());
    if (!l_bIsValid) throw UserErrorFactory.invalidCredentials();

    // 🪓 ALIGNEMENT INDUSTRIEL : Extraction propre via les nouvelles signatures de fonctions métiers de IUser
    const { accessToken, refreshToken } = await this.m_oTokenManager.generateTokens({
      sub    : l_oUser.getUserId(),
      email  : l_oUser.getEmail(),
      pseudo : l_oUser.getPseudo(),
      role   : l_oUser.getRole()
    });

    return { user: l_oUser, accessToken, refreshToken };
  }

  /**
   * 🔄 Renouvelle la validité des sessions via le jeton de rafraîchissement (Rotation incluse).
   *
   * @public
   * @async
   * @param {RefreshTokenDto} p_oDto - L'objet de transfert contenant le jeton de rafraîchissement
   * @throws {TokenError} Si le jeton fourni a fait l'objet d'une révocation active (liste noire)
   * @throws {UserErrorFactory} Si l'acteur rattaché au jeton est introuvable sur le disque
   * @returns {Promise<IRefreshResult>} Le nouveau doublet de jetons d'accès et renouvellement
   */
  public async refresh(p_oDto: RefreshTokenDto): Promise<IRefreshResult> {
    const l_oPayload = await this.m_oTokenManager.verifyRefreshToken(p_oDto.refreshToken);

    // 🗲 [RÉPARÉ V4] Ajout obligatoire du await car l'infrastructure de la liste noire est désormais asynchrone !
    if (l_oPayload.jti && await this.m_oBlacklistService.isBlacklisted(l_oPayload.jti)) {
      throw TokenError.revoked();
    }

    const l_axIdActeur = typeof l_oPayload.sub === 'string' ? new UserId(l_oPayload.sub) : (l_oPayload.sub as UserId);
    const l_oUser : User | null = await this.m_oUserRepository.findById(l_axIdActeur);
    if (!l_oUser) throw UserErrorFactory.notFound(l_axIdActeur);

    if (l_oPayload.jti && l_oPayload.exp) {
      // Ajout asynchrone également pris en compte
      await this.m_oBlacklistService.add(l_oPayload.jti, l_oPayload.exp);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL : Extraction propre via les nouvelles signatures de fonctions métiers de IUser
    const l_oTokens = await this.m_oTokenManager.generateTokens({
      sub    : l_oUser.getUserId(),
      email  : l_oUser.getEmail(),
      pseudo : l_oUser.getPseudo(),
      role   : l_oUser.getRole()
    });

    return l_oTokens;
  }

  /**
   * 🗑️ Révocation asynchrone de la session en cours de validité (Déconnexion).
   *
   * @public
   * @async
   * @param {string} p_sRefreshToken - La chaîne du jeton de rafraîchissement à inscrire en liste noire
   * @returns {Promise<void>}
   */
  public async logout(p_sRefreshToken: string): Promise<void> {
    try {
      const l_oPayload = await this.m_oTokenManager.verifyRefreshToken(p_sRefreshToken);
      if (l_oPayload.jti && l_oPayload.exp) {
        // Enclenchement asynchrone sécurisé
        await this.m_oBlacklistService.add(l_oPayload.jti, l_oPayload.exp);
      }
    } catch {
      // Clôture silencieuse : un token expiré ou corrompu est déjà caduc
    }
  }
}
