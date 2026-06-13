import { SmartEnum } from '@/constants/Choupy/SmartEnum';

/**
 * 🏛️ Classe EventSecteur 🗄️ (Le Sécuriseur de Secteurs d'Audit 🤖)
 * ----------------------------------------------------------------------------
 * Centralise et sécurise les périmètres fonctionnels de journalisation (logs).
 * Alignée au bit près sur nos quadrigrammes de 4 lettres de la table "EventSecteurs" [Mémoria].
 *
 * @class EventSecteur
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (Virtual worker)
 * @author Frapperie du code : Gaïa (Graveuse de pépites d'or)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export class AppEventSecteur extends SmartEnum<string> {

  /**
   * Constructeur privé pour verrouiller l'armure nominale en RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - L'affichage descriptif complet destiné à l'interface
   * @param {string} p_sCode - Le quadrigramme d'infrastructure immuable (4 majuscules) [Mémoria]
   * @param {number} p_nOrdreAff - La position numérique unique pour le tri visuel [Mémoria]
   */
  private constructor(p_sLibelle: string, p_sCode: string, p_nOrdreAff: number) {
    super(p_sLibelle, p_sCode, p_nOrdreAff);
  }

  /** 🗄️ Convertisseur d'infrastructure historique branché sur le décodeur central [Mémoria] */
  public static fromSql(p_sCodeSql: string): AppEventSecteur {
    return this.DeCode<AppEventSecteur>(p_sCodeSql);
  }

  // ----------------------------------------------------------------------------
  // 🏺 Ensemencement de la RAM (Les piliers initiaux issus de la migration V x.4)
  // ----------------------------------------------------------------------------

  /** 💻 SYST - Secteur Système : Événements liés à la vie de l'application */
  public static readonly SYST = new AppEventSecteur('Système', 'SYST', 10);

  /** 👥 UTIL - Secteur Utilisateur : Actions d'inscription et profil */
  public static readonly UTIL = new AppEventSecteur('Utilisateur', 'UTIL', 20);

  /** 🔑 AUTH - Secteur Authentification : Sessions et tentatives de connexion */
  public static readonly AUTH = new AppEventSecteur('Authentification', 'AUTH', 30);

  /** 📦 PEPI - Secteur Pépite : Gestion et manipulation des ressources */
  public static readonly PEPI = new AppEventSecteur('Pépite', 'PEPI', 40);

  /** ⛓️ RGPD - Secteur RGPD : Demandes réglementaires d'accès et d'oubli */
  public static readonly RGPD = new AppEventSecteur('RGPD', 'RGPD', 50);

  /** 💽 BASE - Secteur Base de données : Métriques et alertes de performance stockage */
  public static readonly BASE = new AppEventSecteur('Base de données', 'BASE', 60);
}
