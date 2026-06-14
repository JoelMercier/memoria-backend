// ——— fichier : src/constants/Secteur.ts

import { SmartEnum } from '@/constants/Choupy/SmartEnum';

/**
 * 🏛️ Classe Secteur 🗄️ (Le Sécuriseur de Secteurs d'Audit 🤖)
 * ----------------------------------------------------------------------------
 * Centralise et sécurise les périmètres fonctionnels de journalisation (logs).
 * Alignée au bit près sur nos quadrigrammes de 4 lettres de la table "Secteurs" [Mémoria].
 *
 * @class Secteur
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (C++ Framework Architect - Metaprogramming Master)
 * @author Frapperie du code : Gaïa (Graveuse de pépites d'or V4 Pro)
 */
export class Secteur extends SmartEnum<string> {

  /**
   * Constructeur privé pour verrouiller l'armure nominale en RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - L'affichage descriptif complet destiné à l'interface
   * @param {string} p_sCode - Le quadrigramme d'infrastructure immuable (4 majuscules) [Mémoria]
   * @param {number} p_nOrdreAff - La position numérique unique pour le tri visuel [Mémoria]
   * @param {boolean} p_bDefaut - Drapeau de repli nominal V4 Pro pour la base locale
   */
  private constructor(p_sLibelle: string, p_sCode: string, p_nOrdreAff: number, p_bDefaut: boolean = false) {
    super(p_sLibelle, p_sCode, p_nOrdreAff, p_bDefaut);
  }

  /** 🗄️ Convertisseur d'infrastructure historique branché sur le décodeur central [Mémoria] */
  public static fromSql(p_sCodeSql: string): Secteur {
    return this.DeCode<Secteur>(p_sCodeSql);
  }

  // ----------------------------------------------------------------------------
  // 🏺 Ensemencement de la RAM (Les piliers initiaux issus de la table Secteurs)
  // ----------------------------------------------------------------------------

  /** 💻 SYST - Secteur Système : Événements liés à la vie de l'application (Le Choupy de repli !) */
  public static readonly SYST = new Secteur('Système', 'SYST', 10, true); // 🔒 Bit True nominal de soute basse !

  /** 👥 UTIL - Secteur Utilisateur : Actions d'inscription et profil */
  public static readonly UTIL = new Secteur('Utilisateur', 'UTIL', 20);

  /** 🔑 AUTH - Secteur Authentification : Sessions et tentatives de connexion */
  public static readonly AUTH = new Secteur('Authentification', 'AUTH', 30);

  /** 📦 PEPI - Secteur Pépite : Gestion et manipulation des ressources */
  public static readonly PEPI = new Secteur('Pépite', 'PEPI', 40);

  /** ⛓️ RGPD - Secteur RGPD : Demandes réglementaires d'accès et d'oubli */
  public static readonly RGPD = new Secteur('Protection des données', 'RGPD', 50);

  /** 💽 BASE - Secteur Base de données : Métriques et alertes de performance stockage */
  public static readonly BASE = new Secteur('Base de données', 'BASE', 60);
}

export default Secteur;
