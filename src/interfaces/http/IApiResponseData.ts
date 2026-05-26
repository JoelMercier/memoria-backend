// ——— fichier : src/interfaces/http/IApiResponseData.ts

/**
 * 📊 Interface IPaginationMeta
 * ----------------------------
 * Métadonnées d'infrastructure décrivant l'état de la pagination d'une collection.
 */
export interface IPaginationMeta {
  /** 📄 Numéro de l'index de la page courante */
  page : number;

  /** 📏 Nombre maximal d'enregistrements autorisés par page */
  limit : number;

  /** 📊 Nombre total cumulé de lignes physiques trouvées en base */
  total : number;

  /** 🗂️ Nombre total calculé de pages disponibles pour la consultation */
  totalPages : number;
}

/**
 * 🎛️ Interface IApiResponseMeta
 * -----------------------------
 * Métadonnées contextuelles globales greffées sur le transport de l'enveloppe HTTP.
 */
export interface IApiResponseMeta {
  /** 📅 Horodatage précis de l'émission de la réponse au format ISO 8601 */
  timestamp : string;

  /** 🆔 Identifiant unique de corrélation de la requête (Audit / Traçabilité) */
  requestId? : string;

  /** 📄 Métadonnées optionnelles de pagination (Uniquement pour les listes) */
  pagination? : IPaginationMeta;
}

/**
 * 🚨 Interface IApiResponseError
 * ------------------------------
 * Structure normalisée décrivant une anomalie ou une violation de frontière (Zéro fuite).
 */
export interface IApiResponseError {
  /** 🏷️ Libellé ou code sémantique de l'erreur (ex: 'USER_NOT_FOUND') */
  code : string;

  /** 💬 Message explicite décrivant la cause ou le motif technique */
  details? : string;

  /** ✏️ Nom du champ de formulaire incriminé en cas d'échec de validation Zod */
  field? : string;
}

/**
 * 📦 Interface IApiResponseData (Version Générique Universelle)
 * -------------------------------------------------------------
 * Contrat unique et standardisé de réponse JSON pour l'intégralité de l'API.
 * Offre au client Front-End un contrat d'analyse (parsing) unifié et totalement prévisible.
 *
 * @interface IApiResponseData
 * @template T - Le type ou le DTO du payload sérialisé encapsulé dans la réponse
 * @author Joël, Gaïa & Co
 */
export interface IApiResponseData<T> {
  /** 🛡️ Indicateur booléen de réussite ou d'échec de l'opération */
  success : boolean;

  /** 💬 Message de synthèse de l'action ou de l'état opérationnel */
  message : string;

  /** 🎁 Payload utile contenant les données métiers typées (DTOs) */
  data? : T;

  /** 🚨 Objet d'anomalie structuré (Uniquement présent en cas d'échec) */
  error? : IApiResponseError;

  /** 🎛️ Enveloppe technique de métadonnées et d'audit globale */
  meta : IApiResponseMeta;
}
