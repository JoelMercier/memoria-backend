// ——— fichier : src/constants/OrdreAff.ts

import { SmartEnum } from '@/constants/base/SmartEnum';

/**
 * 🏛️ Classe OrdreAff (Smart Enum Réel)
 * -------------------------------------
 * Centralise et sécurise les directives de tri et d'ordonnancement SQL.
 * S'aligne sur la base générique en fixant le code technique en 'string'.
 *
 * @class OrdreAff
 * @extends SmartEnum<string>
 */
export class OrdreAff extends SmartEnum<string> {

  /** 🗂️ Tri par ordre arithmétique ou alphabétique croissant */
  public static readonly oaCroissant   = new OrdreAff('oaCroissant',   'asc');

  /** 🗂️ Absence de tri explicite (Ordre naturel de la base de données) */
  public static readonly oaNonTrie     = new OrdreAff('oaNonTrie',     '');

  /** 🗂️ Tri par ordre arithmétique ou alphabétique décroissant */
  public static readonly oaDecroissant = new OrdreAff('oaDecroissant', 'desc');

  /**
   * Constructeur privé pour verrouiller la création d'instances volantes.
   *
   * @private
   * @constructor
   * @param {string} libelle - Identifiant textuel de la constante
   * @param {string} codeSql - Chaîne de caractères exacte attendue par PostgreSQL (Minuscules)
   */
  private constructor(libelle: string, codeSql: string) {
    super(libelle, codeSql);
  }

  /**
   * 🗂️ Retourne la liste exhaustive des ordres de tri autorisés.
   *
   * @static
   * @returns {OrdreAff[]} Tableau des instances de constantes de tri
   */
  public static values(): OrdreAff[] {
    return [
      OrdreAff.oaCroissant,
      OrdreAff.oaNonTrie,
      OrdreAff.oaDecroissant
    ];
  }

  /**
   * 🗄️ Passerelle d'infrastructure : Convertit une chaîne brute PostgreSQL en instance typée.
   * Exploite l'indexation dynamique du registre de notre classe de base SmartEnum.
   *
   * @static
   * @param {string} codeSql - Le jeton textuel extrait de la ligne SQL
   * @throws {Error} Si la directive de tri lue en base est inconnue du dictionnaire
   * @returns {OrdreAff} L'instance de classe Smart Enum correspondante
   */
  public static fromSql(codeSql: string): OrdreAff {
    const sCodeMinuscule : string = codeSql.toLowerCase();
    const bEstValide     : boolean = this.isValidCode(sCodeMinuscule);

    if (!bEstValide) {
      throw new Error(`Directive de tri SQL invalide ou non synchronisée : ${codeSql}`);
    }

    return this.values().find(o => o.code === sCodeMinuscule)!;
  }
}
