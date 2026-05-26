// ——— fichier : src/interfaces/security/IAdditionalInfo.ts

/**
 * 🔒 Interface IAdditionalInfo
 * ----------------------------
 * Contrat d'infrastructure régissant la structure des métadonnées d'anomalies.
 * Permet d'injecter des contextes d'audit et de traçabilité de façon normalisée.
 *
 * @interface IAdditionalInfo
 * @author Joël, Gaïa & Co
 */
export interface IAdditionalInfo {

  /** 🏷️ Code sémantique ou identifiant de l'erreur métier (ex: 'USER_NOT_FOUND') */
  code? : string;

  /** ✏️ Nom du champ de formulaire ou de propriété incriminé (ex: 'email') */
  field? : string;

  /** 🎛️ Valeur brute ayant provoqué le rejet ou la collision sémantique */
  value? : unknown;

  /** ⚡ Libellé ou trame de l'action d'infrastructure (ex: 'SELECT * FROM item') */
  operation? : string;

  /** 🏛️ Nom de la table PostgreSQL ou de l'entité concernée (ex: 'user') */
  entity? : string;

  /** 🆔 Chaîne physique brute de l'identifiant manquant ou rejeté */
  identifier? : string;

  /** 🔏 Nom de la contrainte relationnelle PostgreSQL violée en base */
  constraint? : string;

  /** 🪵 Message, stack ou pile d'exécution d'infrastructure d'origine */
  originalError? : string;

  /** 📦 Signature d'index libre autorisant l'extension dynamique de métadonnées */
  [key: string] : unknown;
}
