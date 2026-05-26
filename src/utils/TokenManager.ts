// ——— fichier : src/utils/TokenManager.ts

import { randomUUID } from 'node:crypto';
import { SignJWT, jwtVerify, errors as joseErrors } from 'jose';
import { TokenError } from '@/exceptions/TokenError';
import type { IGeneratedTokens, ITokenManager } from '@/interfaces/security/ITokenManager';
import type { ITokenPayload } from '@/interfaces/security/ITokenPayload';

/**
 * ⚙️ Interface ITokenManagerConfig
 * --------------------------------
 * Structure de configuration optionnelle injectée pour le chiffrement des jetons.
 */
interface ITokenManagerConfig {
  /** 🔑 Secret d'infrastructure asymétrique pour les jetons d'accès */
  accessSecret?: string;

  /** 🔄 Secret d'infrastructure asymétrique pour les jetons de rafraîchissement */
  refreshSecret?: string;

  /** ⏱️ Durée de rétention chronologique du jeton d'accès (ex: '15m') */
  accessTTL?: string;

  /** ⏱️ Durée de rétention chronologique du jeton de rafraîchissement (ex: '7d') */
  refreshTTL?: string;
}

/**
 * 🏛️ Classe TokenManager
 * ----------------------
 * Gestionnaire d'infrastructure régissant la forge, la signature et l'analyse des jetons JWT.
 * Exploite la bibliothèque performante `jose` conforme aux standards de sécurité OWASP.
 *
 *  - Access token  : Courte durée (15min par défaut), transmis via les en-têtes d'autorisation.
 *  - Refresh token : Longue durée (7j par défaut), orchestrant le renouvellement ou la rotation.
 *  - Clé d'audit   : Tous deux intègrent un `jti` (UUIDv4) pour le suivi en quarantaine (Blacklist).
 *
 * SOLID :
 *  - SRP : Unique responsabilité de forger cryptographiquement ou de décoder le payload des jetons.
 *
 * @class TokenManager
 * @implements {ITokenManager}
 * @author Joël, Gaïa & Co
 */
export class TokenManager implements ITokenManager {

  /** 🔏 Algorithme de signature cryptographique standard unifié */
  private static readonly ALG : string = 'HS256';

  /** 🔑 Clé d'accès binaire calculée pour les jetons d'accès */
  private readonly m_rAccessSecret : Uint8Array;

  /** 🔄 Clé d'accès binaire calculée pour les jetons de rafraîchissement */
  private readonly m_rRefreshSecret : Uint8Array;

  /** ⏱️ Durée de validité des jetons d'accès */
  private readonly m_sAccessTTL : string;

  /** ⏱️ Durée de validité des jetons de rafraîchissement */
  private readonly m_sRefreshTTL : string;

  /**
   * Construit et configure le trousseau de clés à partir des variables d'environnement.
   *
   * @constructor
   */
  public constructor(config?: ITokenManagerConfig) {
    const accessSecret : string | undefined = config?.accessSecret ?? process.env.JWT_ACCESS_SECRET;
    const refreshSecret : string | undefined = config?.refreshSecret ?? process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new Error("JWT_ACCESS_SECRET et JWT_REFRESH_SECRET sont requis dans l'environnement.");
    }

    this.m_rAccessSecret  = new TextEncoder().encode(accessSecret);
    this.m_rRefreshSecret = new TextEncoder().encode(refreshSecret);
    this.m_sAccessTTL     = config?.accessTTL ?? process.env.JWT_ACCESS_TTL ?? '15m';
    this.m_sRefreshTTL    = config?.refreshTTL ?? process.env.JWT_REFRESH_TTL ?? '7d';
  }

  /**
   * 🏭 Forge et signe un couple de jetons applicatifs neufs (Access + Refresh) en parallèle.
   *
   * @public
   * @async
   */
  public async generateTokens(
    payload: Omit<ITokenPayload, 'type' | 'iat' | 'exp' | 'jti'>
  ): Promise<IGeneratedTokens> {
    const accessToken : string  = await this.sign(payload, 'access');
    const refreshToken : string = await this.sign(payload, 'refresh');
    return { accessToken, refreshToken };
  }

  /**
   * 🔍 Analyse, valide la signature et extrait le payload d'un jeton d'accès courant.
   *
   * @public
   * @async
   */
  public async verifyAccessToken(token: string): Promise<ITokenPayload> {
    return await this.verify(token, this.m_rAccessSecret, 'access');
  }

  /**
   * 🔄 Analyse, valide la signature et extrait le payload d'un jeton de rafraîchissement.
   *
   * @public
   * @async
   */
  public async verifyRefreshToken(token: string): Promise<ITokenPayload> {
    return await this.verify(token, this.m_rRefreshSecret, 'refresh');
  }

  /**
   * 🛠️ Routine interne d'encapsulation et de signature cryptographique asynchrone.
   *
   * @private
   * @async
   */
  private async sign(
    payload: Omit<ITokenPayload, 'type' | 'iat' | 'exp' | 'jti'>,
    type: 'access' | 'refresh'
  ): Promise<string> {
    const secret : Uint8Array = type === 'access' ? this.m_rAccessSecret : this.m_rRefreshSecret;
    const ttl : string        = type === 'access' ? this.m_sAccessTTL : this.m_sRefreshTTL;

    return await new SignJWT({
      email  : payload.email,
      pseudo : payload.pseudo,
      role   : payload.role,
      type   : type
    })
      .setProtectedHeader({ alg: TokenManager.ALG })
      .setSubject(payload.sub as unknown as string) // Transtypage transitoire pour la sérialisation textuelle brute du JWT
      .setIssuedAt()
      .setExpirationTime(ttl)
      .setJti(randomUUID())
      .sign(secret);
  }

  /**
   * 🎛️ Routine interne de déballage et de capture défensive contre les altérations de jetons.
   *
   * @private
   * @async
   */
  private async verify(
    token: string,
    secret: Uint8Array,
    expectedType: 'access' | 'refresh'
  ): Promise<ITokenPayload> {
    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.type !== expectedType) {
        throw TokenError.wrongType();
      }
      return payload as unknown as ITokenPayload;
    } catch (err) {
      if (err instanceof TokenError) {
        throw err;
      }
      if (err instanceof joseErrors.JWTExpired) {
        throw TokenError.expired();
      }
      if (err instanceof joseErrors.JOSEError) {
        throw TokenError.invalid(err.message);
      }
      throw TokenError.invalid(err instanceof Error ? err.message : 'unknown');
    }
  }
}
