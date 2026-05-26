// ——— fichier : src/domain/base/IdBinaire.ts

/**
 * 🏛️ Classe Abstraite IdBinaire (Value Object Pattern)
 * ----------------------------------------------------
 * Fondation universelle pour tous les identifiants UUID PostgreSQL du système.
 * Garantit la validité structurelle dès la construction.
 *
 * @abstract
 * @class IdBinaire
 * @author Joël, Gaïa & Co
 */
export abstract class IdBinaire {

  /** 🕵️‍♂️ Expression régulière de validation d'un UUIDv4 PostgreSQL conforme */
  private static readonly REGEX_UUID : RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /** 🔏 Valeur physique de l'identifiant (Immuabilité stricte) */
  public readonly valeur : string;

  /**
   * Valide la syntaxe de la chaîne brute avant d'autoriser la création de l'objet.
   *
   * @protected
   * @constructor
   * @param {string} p_chaineBrute - La chaîne de caractères à valider
   * @throws {Error} Si la syntaxe UUIDv4 PostgreSQL est invalide
   */
  protected constructor(p_chaineBrute: string) {
    if (!IdBinaire.REGEX_UUID.test(p_chaineBrute)) {
      throw new Error(`[Erreur Sécurité] Syntaxe UUID PostgreSQL invalide : '${p_chaineBrute}'`);
    }
    this.valeur = p_chaineBrute.toLowerCase();
  }

  /**
   * 🔄 Redéfinition sémantique de l'égalité (Faute d'opérateur '=' de surcharge).
   *
   * @param {IdBinaire} autreId - L'autre instance d'identifiant à comparer
   * @returns {boolean} Vrai si les deux valeurs physiques coïncident
   */
  public estEgalA(autreId: IdBinaire): boolean {
    return this.valeur === autreId.valeur;
  }

  /**
   * Permet l'affichage propre ou l'injection directe dans les requêtes de l'infrastructure.
   *
   * @returns {string} La chaîne de caractères de l'UUID normalisé en minuscules
   */
  public toString(): string {
    return this.valeur;
  }
}
