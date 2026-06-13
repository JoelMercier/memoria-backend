// ——— fichier : src/constants/OrdreTriEnum.ts

import { SmartEnum } from '@/constants/Choupy/SmartEnum';

/**
 * 🎛️ Classe OrdreTriEnum 🧮 (Le Régulateur de Directives SQL 🤖)
 * ----------------------------------------------------------------------------
 * Centralise, sécurise et verrouille les clauses textuelles de tri pour PostgreSQL.
 * [ALIGNÉ V4] Éradication définitive des caches-misère par décorrélative de la valeur SQL.
 *
 * @class OrdreTriEnum
 * @extends {SmartEnum<string>}
 * @author Réflexion : Joël (Virtual worker - Nominal Unification Master)
 * @author Ciselage des flux : Gaïa (Au burin, redressée sur la Choupy Doctrine V4)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export class OrdreTriEnum extends SmartEnum<string> {

  /** 🎛️ La directive textuelle brute injectée de manière sécurisée dans la requête PostgreSQL */
  private readonly m_sValueSql: string;

  /**
   * Constructeur d'élite scellant l'armure nominale à 4 paramètres.
   *
   * @public
   * @constructor
   * @param {string} p_sLibelle - Désignation intelligible pour le débogage (ex: 'Naturel')
   * @param {string} p_sCodeTechnique - L'identifiant immuable unique en RAM (ex: 'NATU')
   * @param {string} p_sValueSql - La chaîne physique s'engouffrant dans SQL (ex: '' ou 'ASC')
   * @param {number} p_nOrdreAff - Indice technique de tri pour l'affichage graphique
   */
  public constructor(p_sLibelle: string, p_sCodeTechnique: string, p_sValueSql: string, p_nOrdreAff: number) {
    super(p_sLibelle, p_sCodeTechnique, p_nOrdreAff);
    this.m_sValueSql = p_sValueSql;
  }

  /**
   * ⚖️ VRAI GETTER : Extrait l'opérateur SQL réel destiné à s'engouffrer dans PostgreSQL.
   * [SCELLÉ V4] Plus aucun if, lecture directe de la propriété de soute !
   */
  public get clauseSql(): string {
    return this.m_sValueSql;
  }

  // ----------------------------------------------------------------------------
  // 🏺 ENSEMENCEMENT DE LA RAM (Les opérateurs de tri légitimes - Alignement V4)
  // ----------------------------------------------------------------------------

  /** 🪙 ASC - Tri par ordre arithmétique ou alphabétique croissant */
  public static readonly oCroissant = new OrdreTriEnum('Croissant', 'CROI', 'ASC', 1);

  /** 💾 NATU - Absence de tri explicite (Ordre naturel de stockage physique Heap) */
  public static readonly oNonTrie = new OrdreTriEnum('Naturel', 'NATU', '', 2);

  /** 💽 DESC - Tri par ordre arithmétique ou alphabétique décroissant */
  public static readonly oDecroissant = new OrdreTriEnum('Décroissant', 'DECR', 'DESC', 3);

  /** 🚀 Passerelle rétrocompatible pour l'infrastructure */
  public static values(): OrdreTriEnum[] {
    return this.ObtenirToutes<OrdreTriEnum>();
  }

  /**
   * 🗄️ Convertisseur d'infrastructure universel et dynamique.
   * [SCELLÉ JOJO-STYLE V4] Plus aucun "if" en dur ! Recherche directe par valeur SQL.
   */
  public static fromSql(p_sCodeSql: string): OrdreTriEnum {
    const l_sCodeNettoye = p_sCodeSql ? p_sCodeSql.trim().toUpperCase() : '';

    // 🪓 ALIGNEMENT ÉLITE : On fouille le catalogue en RAM pour trouver l'instance correspondante
    const l_oInstanceTrouvee = this.values().find(
      (l_oEnum) => l_oEnum.clauseSql === l_sCodeNettoye
    );

    // Si on trouve la tôle exacte (ex: 'ASC' ou ''), on la renvoie, sinon repli vers le tri Naturel
    return l_oInstanceTrouvee ?? this.DeCode<OrdreTriEnum>('NATU');
  }

}

export default OrdreTriEnum;
