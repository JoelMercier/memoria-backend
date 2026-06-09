import { SmartEnum } from '@/constants/base/SmartEnum';

/**
 * 🏛️ Classe EventAction 🗄️ (Le Calibreur d'Actions d'Audit 🤖)
 * ----------------------------------------------------------------------------
 * Centralise et sécurise les opérations techniques et actions traçables du système.
 * Alignée au bit près sur nos quadrigrammes de 4 lettres de la table "EventActions" [Mémoria].
 *
 * @class EventAction
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (Virtual worker)
 * @author Frapperie du code : Gaïa (Graveuse de pépites d'or)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export class AppEventAction extends SmartEnum<string> {

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
  public static fromSql(p_sCodeSql: string): AppEventAction {
    return this.DeCode<AppEventAction>(p_sCodeSql);
  }

  // ----------------------------------------------------------------------------
  // 🏺 Ensemencement de la RAM (Les opérations initiales issues de la migration V4)
  // ----------------------------------------------------------------------------

  /** ⚙️ DEMA - Action Démarrage : Initialisation des radiateurs et des services */
  public static readonly DEMA = new AppEventAction('Démarrage', 'DEMA', 10);

  /** 🔐 CONN - Action Connexion : Ouverture de session utilisateur réussie */
  public static readonly CONN = new AppEventAction('Connexion', 'CONN', 15);

  /** 📝 ENRE - Action Enregistrement : Création d'un nouvel acteur dans la forge */
  public static readonly ENRE = new AppEventAction('Enregistrement', 'ENRE', 20);

  /** ⚠️ ECHE - Action Échec : Rejet d'une opération ou anomalie de sécurité */
  public static readonly ECHE = new AppEventAction('Échec', 'ECHE', 30);

  /** 🔨 CREA - Action Création : Gravure d'une nouvelle ressource sur le disque */
  public static readonly CREA = new AppEventAction('Création', 'CREA', 40);

  /** 🔗 PART - Action Partage : Génération d'un jeton d'accès externe */
  public static readonly PART = new AppEventAction('Partage', 'PART', 50);

  /** 🧹 EXPO - Action Exportation : Extraction des données pour conformité */
  public static readonly EXPO = new AppEventAction('Exportation', 'EXPO', 60);

  /** 🐢 LENT - Action Requête Lente : Alerte de performance sur le pool SQL */
  public static readonly LENT = new AppEventAction('Requête lente', 'LENT', 70);

  /** 🧹 PURG - Action Purge : Destruction réglementaire de masse des lignes obsolètes */
  public static readonly PURG = new AppEventAction('Purge historique', 'PURG', 65);
}
