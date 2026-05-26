// ——— fichier : src/interfaces/security/ITokenManager.ts

import type { ITokenPayload } from '@/interfaces/security/ITokenPayload';

/**
 * 📊 Interface IGeneratedTokens
 * -----------------------------
 * Structure de transport regroupant le doublet de jetons d'infrastructure de session.
 *
 * @interface IGeneratedTokens
 * @author Joël, Gaïa & Co
 */
export interface IGeneratedTokens {
  /** 🔑 Jeton d'accès de courte durée destiné à l'autorisation des requêtes privées */
  accessToken : string;

  /** 🔄 Jeton de rafraîchissement de longue durée destiné au renouvellement des sessions */
  refreshToken : string;
}

/**
 * 🔒 Interface ITokenManager
 * --------------------------
 * Contrat d'infrastructure régissant la forge, la signature et l'analyse des jetons JWT.
 * Isole les services de sécurité des bibliothèques de chiffrement cryptographiques de bas niveau.
 *
 * @interface ITokenManager
 * @author Joël, Gaïa & Co
 */
export interface ITokenManager {

  /** 🏭 Forge et signe un couple de jetons applicatifs neufs à partir de l'identité épurée de l'acteur. */
  generateTokens(
    payload: Omit<ITokenPayload, 'type' | 'iat' | 'exp' | 'jti'>
  ): Promise<IGeneratedTokens>;

  /** 🔍 Analyse, valide la signature et extrait les métadonnées d'audit d'un jeton d'accès. */
  verifyAccessToken(token: string): Promise<ITokenPayload>;

  /** 🔄 Analyse, valide la signature et extrait les métadonnées d'un jeton de rafraîchissement. */
  verifyRefreshToken(token: string): Promise<ITokenPayload>;
}
