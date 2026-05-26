// ——— fichier : src/utils/SlugGenerator.ts

/**
 * 🏛️ Classe SlugGenerator
 * -----------------------
 * Générateur et convertisseur de chaînes de caractères pour la forge de permaliens sémantiques (Slugs).
 * Transforme les titres éditoriaux en chaînes nettoyées et saines pour les routes d'URL.
 *
 * SOLID :
 *  - SRP : Unique responsabilité d'appliquer les expressions régulières de normalisation sémantique textuelle.
 *
 * Exemples d'exécution d'infrastructure :
 *  "Apprendre Node.js" → "apprendre-nodejs"
 *  "Café & Croissants"  → "cafe-croissants"
 *
 * @class SlugGenerator
 * @author Joël, Gaïa & Co
 */
export class SlugGenerator {

  /**
   * 🏭 Fabrique statique : Engendre un slug URL-friendly épuré à partir d'un libellé textuel brut.
   * Gère la décomposition atomique des accents et purge l'intégralité des caractères spéciaux nuisibles.
   *
   * @public
   * @static
   * @function generate
   * @param {string} title - Le titre ou libellé textuel brut à convertir
   * @returns {string} La chaîne sémantique normalisée et nettoyée pour le routage.
   */
  public static generate(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
