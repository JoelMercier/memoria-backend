// ——— fichier : src/domain/value-objects/IdMetier.ts

import { IdBinaire } from '@/domain/base/IdBinaire';

/**
 * 👥 Identifiant unique et fortement typé pour la table USERS.
 *
 * 💡 POURQUOI LE "BRANDING" (declare private readonly) ?
 * TypeScript utilise par défaut un système de typage "structurel" (si deux classes ont les
 * mêmes propriétés, elles sont interchangeables). Sans cette marque unique, TypeScript
 * autoriserait par erreur l'affectation d'un TagId dans un paramètre attendant un UserId.
 * Le mot-clé 'declare' indique au compilateur d'appliquer un contrôle nominal strict
 * sans générer la moindre ligne de code JavaScript inutile à l'exécution.
 *
 * @class UserId
 * @extends {IdBinaire}
 * @author Joël, Gaïa & Co
 */
export class UserId extends IdBinaire {
  /** 🛡️ Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandUserId: undefined;

  /**
   * Encapsule l'UUID d'un utilisateur sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string} p_chaineBrute - La chaîne UUIDv4 brute à valider et affecter
   */
  public constructor(p_chaineBrute: string) {
    super(p_chaineBrute);
  }
}

/**
 * 📦 Identifiant unique et fortement typé pour la table ITEMS (Pépites).
 *
 * @class ItemId
 * @extends {IdBinaire}
 * @author Joël, Gaïa & Co
 */
export class ItemId extends IdBinaire {
  /** 🛡️ Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandItemId: undefined;

  /**
   * Encapsule l'UUID d'une pépite sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string} p_chaineBrute - La chaîne UUIDv4 brute à valider et affecter
   */
  public constructor(p_chaineBrute: string) {
    super(p_chaineBrute);
  }
}

/**
 * 🔔 Identifiant unique et fortement typé pour la table APP_EVENTS (Logs d'audit).
 *
 * @class EventId
 * @extends {IdBinaire}
 * @author Joël, Gaïa & Co
 */
export class EventId extends IdBinaire {
  /** 🛡️ Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandEventId: undefined;

  /**
   * Encapsule l'UUID d'un événement sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string} p_chaineBrute - La chaîne UUIDv4 brute à valider et affecter
   */
  public constructor(p_chaineBrute: string) {
    super(p_chaineBrute);
  }
}

/**
 * 🔗 Identifiant unique et fortement typé pour la table SHARES (Partages de pépites).
 *
 * @class ShareId
 * @extends {IdBinaire}
 * @author Joël, Gaïa & Co
 */
export class ShareId extends IdBinaire {
  /** 🛡️ Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandShareId: undefined;

  /**
   * Encapsule l'UUID d'un partage sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string} p_chaineBrute - La chaîne UUIDv4 brute à valider et affecter
   */
  public constructor(p_chaineBrute: string) {
    super(p_chaineBrute);
  }
}

/**
 * 🔐 Identifiant unique et fortement typé pour la table SESSIONS (Jetons).
 *
 * @class SessionId
 * @extends {IdBinaire}
 * @author Joël, Gaïa & Co
 */
export class SessionId extends IdBinaire {
  /** 🛡️ Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandSessionId: undefined;

  /**
   * Encapsule l'UUID d'une session sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string} p_chaineBrute - La chaîne UUIDv4 brute à valider et affecter
   */
  public constructor(p_chaineBrute: string) {
    super(p_chaineBrute);
  }
}

/**
 * 🏷️ Identifiant unique et fortement typé pour la table TAGS (Mots-clés).
 *
 * @class TagId
 * @extends {IdBinaire}
 * @author Joël, Gaïa & Co
 */
export class TagId extends IdBinaire {
  /** 🛡️ Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandTagId: undefined;

  /**
   * Encapsule l'UUID d'une étiquette sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string} p_chaineBrute - La chaîne UUIDv4 brute à valider et affecter
   */
  public constructor(p_chaineBrute: string) {
    super(p_chaineBrute);
  }
}