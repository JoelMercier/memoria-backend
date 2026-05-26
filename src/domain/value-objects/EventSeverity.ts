// ——— fichier : src/domain/value-objects/EventSeverity.ts

/**
 * 🏛️ Classe EventSeverity (Value Object Pattern)
 * -----------------------------------------------
 * Encapsule et valide les niveaux de criticité opérationnelle des événements d'audit.
 * Alignée sur les types ENUM PostgreSQL de l'infrastructure de persistance.
 *
 * @class EventSeverity
 * @author Joël, Gaïa & Co
 */
export class EventSeverity {

  /** 🛡️ Liste immuable des sévérités acceptées par le système et la BDD */
  private static readonly VALEURS_VALIDES : ReadonlyArray<string> = ['INFO', 'WARN', 'ERROR', 'FATAL'];

  /** 🔏 Valeur physique de la sévérité (Immuabilité stricte) */
  public readonly valeur : string;

  /**
   * Le constructeur valide la légitimité du niveau avant de l'autoriser en mémoire.
   *
   * @private
   * @constructor
   * @param {string} p_valeurBrute - La chaîne de caractères à analyser
   */
  private constructor(p_valeurBrute: string) {
    const normalisee : string = p_valeurBrute.toUpperCase();
    if (!EventSeverity.VALEURS_VALIDES.includes(normalisee)) {
      throw new Error(`[Erreur Sécurité] Niveau de sévérité d'audit inconnu ou altéré : '${p_valeurBrute}'`);
    }
    this.valeur = normalisee;
  }

  /**
   * 🏭 Fabrique statique sécurisée (Point d'entrée unique depuis la douane ou l'infrastructure).
   * Gère intelligemment les valeurs absentes ou nulles en appliquant le repli de sécurité.
   *
   * @static
   * @function from
   * @param {string | null | undefined} p_valeur - La sévérité brute à évaluer
   * @returns {EventSeverity} L'instance vivante et certifiée conforme
   */
  public static from(p_valeur: string | null | undefined): EventSeverity {
    if (!p_valeur || p_valeur.trim().length === 0) {
      return new EventSeverity('INFO'); // Repli par défaut si l'infrastructure faillit
    }
    return new EventSeverity(p_valeur);
  }

  /**
   * 🔄 Vérifie l'égalité sémantique avec une autre instance de sévérité.
   */
  public estEgaleA(autreSeverity: EventSeverity): boolean {
    return this.valeur === autreSeverity.valeur;
  }

  /**
   * Permet l'affichage standardisé ou l'injection directe dans les requêtes SQL.
   */
  public toString(): string {
    return this.valeur;
  }
}
