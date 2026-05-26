// ——— fichier : src/constants/AuthProvider.ts

import { SmartEnum } from './base/SmartEnum';

/**
 * 🏛️ Classe AuthProvider (Smart Enum)
 * -----------------------------------
 * Gère de manière nominale les fournisseurs d'authentification du système.
 * Encapsule les règles de sécurité liées aux connexions centralisées (SSO).
 *
 * @class AuthProvider
 * @extends SmartEnum<string>
 */
export class AuthProvider extends SmartEnum<string> {

  /** 🔑 Connexion classique via la base de données locale (Email / Mot de passe) */
  public static readonly LOCAL  = new AuthProvider('LOCAL',  'local',  false, '🔑 Connexion Classique');

  /** 🌐 Authentification déléguée via le service Google OAuth2 */
  public static readonly GOOGLE = new AuthProvider('GOOGLE', 'google', true,  '🌐 Google SSO');

  /** 🏢 Authentification déléguée via l'infrastructure Microsoft Azure AD */
  public static readonly AZURE  = new AuthProvider('AZURE',  'azure',  true,  '🏢 Microsoft Azure');

  /** 🍏 Authentification déléguée via l'écosystème Apple ID */
  public static readonly APPLE  = new AuthProvider('APPLE',  'apple',  true,  '🍏 Apple ID');

  /** 🛡️ Drapeau indiquant si le fournisseur contourne le mot de passe local */
  private readonly m_bEstUnSso : boolean;

  /** 💬 Libellé destiné aux boutons de l'interface graphique */
  private readonly m_sLibelleAffichage : string;

  /**
   * Constructeur privé assurant l'immuabilité des fournisseurs.
   *
   * @private
   * @constructor
   * @param {string} libelle - Identifiant textuel interne de l'instance
   * @param {string} codeSql - Valeur brute stockée dans la colonne PostgreSQL (Minuscules)
   * @param {boolean} estUnSso - Drapeau indiquant si le fournisseur contourne le mot de passe local
   * @param {string} libelleAffichage - Libellé destiné aux boutons de l'interface graphique
   */
  private constructor(
    libelle          : string,
    codeSql          : string,
    estUnSso         : boolean,
    libelleAffichage : string
  ) {
    super(libelle, codeSql);
    this.m_bEstUnSso         = estUnSso;
    this.m_sLibelleAffichage = libelleAffichage;
  }

  /**
   * 🛡️ Détermine si le fournisseur est un protocole d'authentification externe SSO.
   *
   * @returns {boolean} True si c'est un SSO externe.
   */
  public get estUnSso(): boolean {
    return this.m_bEstUnSso;
  }

  /**
   * 💬 Obtient le libellé d'affichage convivial destiné à l'interface utilisateur.
   *
   * @returns {string} Le texte d'affichage graphique.
   */
  public get libelleAffichage(): string {
    return this.m_sLibelleAffichage;
  }

  /**
   * 🌐 Retourne la liste exhaustive de tous les fournisseurs configurés.
   *
   * @static
   * @returns {AuthProvider[]} Tableau des instances de sécurité
   */
  public static values(): AuthProvider[] {
    return [
      AuthProvider.LOCAL,
      AuthProvider.GOOGLE,
      AuthProvider.AZURE,
      AuthProvider.APPLE
    ];
  }

  /**
   * 🗄️ Convertit la chaîne brute de la base de données en fournisseur qualifié.
   * Exploite l'indexation dynamique du registre de notre classe de base SmartEnum.
   *
   * @static
   * @param {string} codeSql - Le code brut extrait de la session ou du token
   * @throws {Error} Si le code ne correspond à aucun protocole de sécurité valide
   * @returns {AuthProvider} L'instance validée du fournisseur
   */
  public static fromSql(codeSql: string): AuthProvider {
    const bEstValide : boolean = this.isValidCode(codeSql);

    if (!bEstValide) {
      throw new Error(`[Erreur Sécurité] Fournisseur d'authentification inconnu : '${codeSql}'`);
    }

    return this.values().find(p => p.code === codeSql)!;
  }
}

export default AuthProvider;
