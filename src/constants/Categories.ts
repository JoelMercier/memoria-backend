// ——— fichier : src/constants/Categories.ts

import { SmartEnum } from './Choupy/SmartEnum';

/**
 * 🏛️ Classe Categorie 🗄️ (Le Sécuriseur de Domaines d'Audit 🤖)
 * ----------------------------------------------------------------------------
 * Centralise et sécurise les domaines fonctionnels de journalisation (logs).
 * Alignée au bit près sur nos quadrigrammes de 4 lettres de la table "Categories" [Mémoria].
 *
 * @class Categorie
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (C++ Framework Architect - Metaprogramming Master)
 * @author Frapperie du code : Gaïa (Graveuse de pépites d'or V4 Pro)
 */
export class Categorie extends SmartEnum<string> {

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
  public static fromSql(p_sCodeSql: string): Categorie {
    return this.DeCode<Categorie>(p_sCodeSql);
  }

  // ----------------------------------------------------------------------------
  // 🏺 Ensemencement de la RAM (Les cinq piliers de la traçabilité - Format 4 lettres)
  // ----------------------------------------------------------------------------

  /** 🪙 GENE - Domaine Générique : Le pilier amortisseur par défaut (Le Choupy de repli !) */
  public static readonly GENE = new Categorie('Générique', 'GENE', 1, true); // 🔒 Bit True nominal de soute basse !

  /** 🪙 ANAL - Domaine Analytique : Statistiques et métriques d'exploitation */
  public static readonly ANAL = new Categorie('Analytique', 'ANAL', 10);

  /** 💾 SECU - Domaine Sécurité : Traces de sécurité et accès sensibles [Mémoria] */
  public static readonly SECU = new Categorie('Sécurité et accès', 'SECU', 20);

  /** 💽 MONI - Domaine Monitoring : Alertes système et santé de l'infrastructure [Mémoria] */
  public static readonly MONI = new Categorie('Supervision', 'MONI', 30);

  /** ⛓️ RGPD - Domaine RGPD : Suivi de la conformité et droits à l'oubli [Mémoria] */
  public static readonly RGPD = new Categorie('Protection des données', 'RGPD', 40);
}

export default Categorie;
