// ——— fichier : src/constants/AuthProviders.ts

import { SmartEnum } from './Choupy/SmartEnum';

/**
 * 🔐 Classe AuthProvider 🧮 (Le Verrouilleur de Protocoles SSO 🤖)
 * ----------------------------------------------------------------------------
 * Gère de manière nominale et sécurisée les fournisseurs d'authentification.
 * Encapsule les drapeaux de sécurité liés aux connexions déléguées.
 *
 * @class AuthProvider
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (Void capillaire)
 * @author Frapperie du code : Gaïa (Métallurgiste des octets)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export class AuthProvider extends SmartEnum<string> {
  /** 🛡️ Drapeau indiquant si le fournisseur contourne le mot de passe local (SSO) */
  private readonly m_bEstUnSso: boolean;

  /**
   * Moule une instance immuable de fournisseur dans la RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - Libellé d'affichage convivial destiné aux boutons du front-end
   * @param {string} p_sCode - Le quadrigramme d'infrastructure immuable (4 majuscules) [Mémoria]
   * @param {boolean} p_bEstUnSso - Indicateur de délégation d'authentification externe
   * @param {number} p_nOrdreAff - Position numérique unique pour le tri logique visuel [Mémoria]
   * @param {boolean} p_bDefaut - Drapeau de repli nominal V4 Pro pour la base locale
   */
  private constructor(p_sLibelle: string, p_sCode: string, p_bEstUnSso: boolean, p_nOrdreAff: number, p_bDefaut: boolean = false) {
    super(p_sLibelle, p_sCode, p_nOrdreAff, p_bDefaut);
    this.m_bEstUnSso = p_bEstUnSso;
  }

  /**
   * 🛡️ Détermine si le fournisseur est un protocole d'authentification externe SSO.
   */
  public get estUnSso(): boolean {
    return this.m_bEstUnSso;
  }

  /** 🗄️ Convertisseur d'infrastructure historique branché sur le décodeur central [Mémoria]. */
  public static fromSql(p_sCodeSql: string): AuthProvider {
    return this.DeCode<AuthProvider>(p_sCodeSql);
  }

  // ----------------------------------------------------------------------------
  // 🏺 ENSEMENCEMENT DE LA RAM (Les protocoles d'accès de Phase 1 - Format 4 lettres)
  // ----------------------------------------------------------------------------

  /** 🔑 LOCA - Connexion classique : Validation de l'empreinte Argon2id en Cour Basse (Le Choupy de repli !) */
  public static readonly LOCAL = new AuthProvider('Connexion Classique', 'LOCA', false, 10, true); // 🔒 Bit True nominal !

  /** 🌐 GOOG - Google SSO : Authentification déléguée OAuth2 [Mémoria] */
  public static readonly GOOGLE = new AuthProvider('Google SSO', 'GOOG', true, 20, false);

  /** 🏢 AZUR - Microsoft Azure : Infrastructure d'authentification AD [Mémoria] */
  public static readonly AZURE = new AuthProvider('Microsoft Azure', 'AZUR', true, 30, false);

  /** 🍏 APPL - Apple ID : Identification sécurisée de l'écosystème Apple [Mémoria] */
  public static readonly APPLE = new AuthProvider('Apple ID', 'APPL', true, 40, false);
}

export default AuthProvider;
