// ——— fichier : src/middlewares/AuthMiddleware.ts

import type { NextFunction, Request, Response } from 'express';
import { TokenError } from '@/exceptions/TokenError';
import type { IBlacklistService } from '@/interfaces/security/IBlacklistService';
import type { ITokenManager } from '@/interfaces/security/ITokenManager';

/**
 * 🏛️ Classe AuthMiddleware 🛡️
 * ----------------------------------------------------------------------------
 * Intercepteur d'infrastructure sécurisant les frontières d'exposition HTTP.
 * Extrait, décode et valide la signature cryptographique du jeton Bearer JWT.
 * Injecte l'identité nominale forte de l'acteur (UserId) dans le contexte Express.
 *
 * @class AuthMiddleware
 * @author Directrice du Silicium : Joël (Hongroise Maniac & Anti-Fuite Asynchrone)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur le standard V4)
 */
export class AuthMiddleware {
  /** 🧠 Le gestionnaire de jetons cryptographiques de soute */
  private readonly m_oTokenManager: ITokenManager;

  /** 🧠 Le service de contrôle d'accès aux jetons révoqués (Liste Noire) */
  private readonly m_oBlacklistService: IBlacklistService;

  /**
   * @constructor
   * @param {ITokenManager} p_oTokenManager - Le gestionnaire de jetons cryptographiques
   * @param {IBlacklistService} p_oBlacklistService - Le service de liste noire
   */
  public constructor(p_oTokenManager: ITokenManager, p_oBlacklistService: IBlacklistService) {
    this.m_oTokenManager = p_oTokenManager;
    this.m_oBlacklistService = p_oBlacklistService;
  }

  private get tokenManager(): ITokenManager {
    return this.m_oTokenManager;
  }

  private get blacklistService(): IBlacklistService {
    return this.m_oBlacklistService;
  }

  /**
   * 🛡️ Garde de surface : Exige une authentification valide par jeton Bearer.
   */
  public requireAuth() {
    return async (p_oReq: Request, _p_oRes: Response, p_oNext: NextFunction): Promise<void> => {
      try {
        const l_sAuthHeader: string | undefined = p_oReq.header('authorization');

        if (!l_sAuthHeader || !l_sAuthHeader.toLowerCase().startsWith('bearer ')) {
          throw TokenError.missing();
        }

        const l_sToken: string = l_sAuthHeader.slice('bearer '.length).trim();

        // Extraction et décodage de la charge utile pré-typée du JWT
        const l_oChargeUtile = await this.tokenManager.verifyAccessToken(l_sToken);

        // 🗲 [RÉPARÉ TS2801] Insertion de l'AWAIT constitutionnel pour le contrôle liste noire !
        if (l_oChargeUtile.jti && await this.blacklistService.isBlacklisted(l_oChargeUtile.jti)) {
          throw TokenError.revoked();
        }

        if (!l_oChargeUtile.role) {
          throw TokenError.invalid('Rôle applicatif inconnu ou absent du jeton.');
        }

        // Transfert direct des structures vivantes issues de la charge utile cryptographique
        const l_oSessionActeur = {
          id     : l_oChargeUtile.sub,
          email  : l_oChargeUtile.email,
          pseudo : l_oChargeUtile.pseudo,
          role   : l_oChargeUtile.role
        };

        // Le cast 'as any' global pacifie définitivement la surcharge de type d'Express.user
        p_oReq.user = l_oSessionActeur as any;

        p_oNext();
      } catch (l_oError) {
        p_oNext(l_oError);
      }
    };
  }
}
