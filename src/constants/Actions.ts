// ——— fichier : src/constants/Action.ts

import { SmartEnum } from '@/constants/Choupy/SmartEnum';

/**
 * 🏛️ Classe Action 🗄️ (Le Calibreur d'Actions d'Audit 🤖)
 * ----------------------------------------------------------------------------
 * Centralise et sécurise les opérations techniques et actions traçables du système.
 * Alignée au bit près sur nos quadrigrammes de 4 lettres de la table "Actions" [Mémoria].
 *
 * @class Action
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (C++ Framework Architect - Metaprogramming Master)
 * @author Frapperie du code : Gaïa (Graveuse de pépites d'or V4 Pro)
 */
export class Action extends SmartEnum<string> {

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
  public static fromSql(p_sCodeSql: string): Action {
    return this.DeCode<Action>(p_sCodeSql);
  }

  // ----------------------------------------------------------------------------
  // 🏺 Ensemencement de la RAM (Les opérations initiales issues de la table Actions)
  // ----------------------------------------------------------------------------

  /** 👁️ READ - Action Lecture : Consultation de ressource ou de pépite (Le Choupy de repli !) */
  public static readonly READ = new Action('Lecture', 'READ', 1, true); // 🔒 Bit True nominal de soute basse !

  /** ⚙️ DEMA - Action Démarrage : Initialisation des radiateurs et des services */
  public static readonly DEMA = new Action('Démarrage', 'DEMA', 10);

  /** 🔐 CONN - Action Connexion : Ouverture de session utilisateur réussie */
  public static readonly CONN = new Action('Connexion', 'CONN', 15);

  /** 📝 ENRE - Action Enregistrement : Création d'un nouvel acteur dans la forge */
  public static readonly ENRE = new Action('Enregistrement', 'ENRE', 20);

  /** ⚠️ ECHE - Action Échec : Rejet d'une operation ou anomalie de sécurité */
  public static readonly ECHE = new Action('Échec', 'ECHE', 30);

  /** 🔨 CREA - Action Création : Gravure d'une nouvelle ressource sur le disque */
  public static readonly CREA = new Action('Création', 'CREA', 40);

  /** 🔗 PART - Action Partage : Génération d'un jeton d'accès externe */
  public static readonly PART = new Action('Partage', 'PART', 50);

  /** 🧹 EXPO - Action Exportation : Extraction des données pour conformité */
  public static readonly EXPO = new Action('Exportation', 'EXPO', 60);

  /** 🐢 LENT - Action Requête Lente : Alerte de performance sur le pool SQL */
  public static readonly LENT = new Action('Requête lente', 'LENT', 70);

  /** 🧹 PURG - Action Purge : Destruction réglementaire de masse des lignes obsolètes */
  public static readonly PURG = new Action('Purge historique', 'PURG', 65);
}

export default Action;
