// ——— fichier : src/interfaces/security/IAdditionalInfo.ts

/**
 * 🔒 Interface IAdditionalInfo 🛡️
 * ----------------------------------------------------------------------------
 * Contrat d'infrastructure régissant la structure des métadonnées d'anomalies.
 * Permet d'injecter des contextes d'audit et de traçabilité de façon normalisée.
 * Alimente directement le champ "aeMetadata" JSONB de la table d'audit.
 *
 * @interface IAdditionalInfo
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IAdditionalInfo {

  /**
   * 🏷️ Code sémantique ou identifiant de l'erreur métier (ex: 'USER_NOT_FOUND').
   *
   * @type {string}
   */
  code? : string;

  /**
   * ✏️ Nom du champ de formulaire ou de propriété incriminé (ex: 'email').
   *
   * @type {string}
   */
  field? : string;

  /**
   * 🎛️ Valeur brute ayant provoqué le rejet ou la collision sémantique.
   *
   * @type {unknown}
   */
  value? : unknown;

  /**
   * ⚡ Libellé ou trame de l'action d'infrastructure d'audit (ex: 'SELECT * FROM item').
   *
   * @type {string}
   */
  operation? : string;

  /**
   * 🏛️ Nom de la table PostgreSQL ou de l'entité concernée (ex: 'user').
   *
   * @type {string}
   */
  entity? : string;

  /**
   * 🆔 Chaîne physique brute de l'identifiant manquant ou rejeté.
   *
   * @type {string}
   */
  identifier? : string;

  /**
   * 🔏 Nom de la contrainte relationnelle PostgreSQL violée en base.
   *
   * @type {string}
   */
  constraint? : string;

  /**
   * 🪵 Message, stack ou pile d'exécution d'infrastructure d'origine.
   *
   * @type {string}
   */
  originalError? : string;

  /**
   * 📦 Signature d'index libre autorisant l'extension dynamique de métadonnées de surface.
   *
   * @type {unknown}
   */
  [key: string] : unknown;
}
