// ——— fichier : src/interfaces/security/ITokenManager.ts

import type { ITokenPayload } from '@/interfaces/security/ITokenPayload';

/**
 * 📊 Interface IGeneratedTokens
 * -----------------------------
 * Structure de transport regroupant le doublet de jetons d'infrastructure de session.
 *
 * @interface IGeneratedTokens
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (À la chaleur de l'acier et des octets V4)
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
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface ITokenManager {

  /**
   * 🏭 Forge et signe un couple de jetons applicatifs neufs à partir de l'identité épurée de l'acteur.
   *
   * @async
   * @param {Omit<ITokenPayload, 'type' | 'iat' | 'exp' | 'jti'>} p_oPayload - L'identité métier brute nettoyée des scories temporelles
   * @returns {Promise<IGeneratedTokens>} Le doublet de jetons signés par l'infrastructure
   */
  generateTokens(
    p_oPayload: Omit<ITokenPayload, 'type' | 'iat' | 'exp' | 'jti'>
  ): Promise<IGeneratedTokens>;

  /**
   * 🔍 Analyse, valide la signature et extrait les métadonnées d'audit d'un jeton d'accès.
   *
   * @async
   * @param {string} p_sToken - La chaîne brute du jeton d'accès JWT à soumettre à la douane
   * @throws {TokenError} Si la signature est altérée ou si la date de validité est dépassée
   * @returns {Promise<ITokenPayload>} La charge utile décodée et certifiée conforme
   */
  verifyAccessToken(p_sToken: string): Promise<ITokenPayload>;

  /**
   * 🔄 Analyse, valide la signature et extrait les métadonnées d'un jeton de rafraîchissement.
   *
   * @async
   * @param {string} p_sToken - La chaîne brute du jeton de rafraîchissement à valider
   * @throws {TokenError} Si le jeton est caduc, falsifié ou expiré
   * @returns {Promise<ITokenPayload>} La charge utile décodée et vérifiée
   */
  verifyRefreshToken(p_sToken: string): Promise<ITokenPayload>;
}
