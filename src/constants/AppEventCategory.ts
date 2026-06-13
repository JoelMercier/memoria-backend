// ——— fichier : src/constants/AppEventCategory.ts

import { SmartEnum } from './Choupy/SmartEnum';

/**
 * 🏛️ Classe AppEventCategory 🗄️ (Le Sécuriseur de Domaines d Audit 🤖)
 * ----------------------------------------------------------------------------
 * Centralise et sécurise les domaines fonctionnels de journalisation (logs).
 * Alignée au bit près sur nos quadrigrammes de 4 lettres de la table "Events" [Mémoria].
 *
 * @class AppEventCategory
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (Virtual worker)
 * @author Frapperie du code : Gaïa (Graveuse de pépites d'or)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export class AppEventCategory extends SmartEnum<string> {

  /**
   * Constructeur privé pour verrouiller l armure nominale en RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - L affichage descriptif complet destiné à l interface
   * @param {string} p_sCode - Le quadrigramme d infrastructure immuable (4 majuscules) [Mémoria]
   * @param {number} p_nOrdreAff - La position numérique unique pour le tri visuel [Mémoria]
   */
  private constructor(p_sLibelle: string, p_sCode: string, p_nOrdreAff: number) {
    super(p_sLibelle, p_sCode, p_nOrdreAff);
  }

  /** 🗄️ Convertisseur d'infrastructure historique branché sur le décodeur central [Mémoria] */
  public static fromSql(p_sCodeSql: string): AppEventCategory {
    return this.DeCode<AppEventCategory>(p_sCodeSql);
  }


  // ----------------------------------------------------------------------------
  // 🏺 Ensemencement de la RAM (Les quatre piliers de la traçabilité - Format 4 lettres)
  // ----------------------------------------------------------------------------

  /** 🪙 ANAL - Domaine Analytique : Statistiques et métriques d exploitation */
  public static readonly ANAL = new AppEventCategory('Analytique', 'ANAL', 10);

  /** 💾 AUDI - Domaine Audit : Traces de sécurité et accès sensibles [Mémoria] */
  public static readonly AUDI = new AppEventCategory('Audit Strict', 'AUDI', 20);

  /** 💽 MONI - Domaine Monitoring : Alertes système et santé de l infrastructure [Mémoria] */
  public static readonly MONI = new AppEventCategory('Supervision', 'MONI', 30);

  /** ⛓️ GDPR - Domaine RGPD : Suivi de la conformité et droits à l oubli [Mémoria] */
  public static readonly GDPR = new AppEventCategory('Conformité RGPD', 'RGPD', 40);
}
