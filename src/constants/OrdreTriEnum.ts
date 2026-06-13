// ——— fichier : src/constants/OrdreTriEnum.ts

import { SmartEnum } from '@/constants/Choupy/SmartEnum';

/**
 * 🎛️ Classe OrdreTriEnum 🧮 (Le Régulateur de Directives SQL 🤖)
 * ----------------------------------------------------------------------------
 * Centralise, sécurise et verrouille les clauses textuelles de tri pour PostgreSQL.
 * Évite les injections SQL sauvages au Pont-Levis dans les clauses ORDER BY.
 *
 * @class OrdreTriEnum
 * @extends {SmartEnum<string>}
 * @author Réflexion : Joël (Virtual worker)
 * @author Ciselage des flux : Gaïa (Gardienne du feu binaire)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export class OrdreTriEnum extends SmartEnum<string> {

  /**
   * Constructeur privé pour sceller l armure nominale des opérateurs en RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - Désignation intelligible pour le débogage
   * @param {string} p_sCodeSql - Le mot-clé SQL ou quadrigramme technique associé
   * @param {number} p_nOrdreAff - Indice technique d'alignement pour la classe mère
   */
  private constructor(p_sLibelle: string, p_sCodeSql: string, p_nOrdreAff: number) {
    super(p_sLibelle, p_sCodeSql, p_nOrdreAff);
  }

  /**
   * ⚖️ Extrait l opérateur SQL réel destiné à s'engouffrer dans la requête PostgreSQL.
   */
  public get clauseSql(): string {
    return this.code === 'NATU' ? '' : this.code;
  }

  // ----------------------------------------------------------------------------
  // 🏺 ENSEMENCEMENT DE LA RAM (Les opérateurs de tri légitimes - Alignement V4)
  // ----------------------------------------------------------------------------

  /** 🪙 ASC - Tri par ordre arithmétique ou alphabétique croissant */
  public static readonly oCroissant = new OrdreTriEnum('Croissant', 'ASC', 1);

  /** 💾 NATU - Absence de tri explicite (Ordre naturel de stockage physique de la table Heap) */
  public static readonly oNonTrie = new OrdreTriEnum('Naturel', 'NATU', 2);

  /** 💽 DESC - Tri par ordre arithmétique ou alphabétique décroissant */
  public static readonly oDecroissant = new OrdreTriEnum('Décroissant', 'DESC', 3);

  /** 🚀 Passerelle rétrocompatible pour tes DTOs et ton code existant */
  public static values(): OrdreTriEnum[] {
    return this.ObtenirToutes<OrdreTriEnum>();
  }

  /** 🗄️ Convertisseur d infrastructure sécurisé convertissant le texte en instance typée */
  public static fromSql(p_sCodeSql: string): OrdreTriEnum {
    const l_sCodeNettoye = p_sCodeSql ? p_sCodeSql.trim().toUpperCase() : '';

    if (l_sCodeNettoye === '') {
      return this.DeCode<OrdreTriEnum>('NATU');
    }

    return this.DeCode<OrdreTriEnum>(l_sCodeNettoye);
  }
}

export default OrdreTriEnum;
