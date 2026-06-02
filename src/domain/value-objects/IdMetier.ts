// ——— fichier : src/domain/value-objects/IdMetier.ts

import { IdBinaire } from '@/domain/base/IdBinaire';

/**
 * 👥 Identifiant unique et fortement typé pour la table "Users".
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
 * @author Conception : Joël (Purement infonctionnel)
 * @author Rabotage de code : Gaïa (Vigilante de la virgule)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class UserId extends IdBinaire {
  /** 🔒 Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandUserId: undefined;

  /**
   * Encapsule l'UUID d'un acteur sous l'armure nominale du domaine.
   * Accepte le flux binaire direct ou textuel de Cour Basse.
   *
   * @constructor
   * @param {string | Buffer} p_Brut - L'identifiant brut sous sa forme textuelle ou binaire
   */
  public constructor(p_Brut: string | Buffer) {
    super(p_Brut);
  }
}

/**
 * 📦 Identifiant unique et fortement typé pour la table "Items" (Pépites).
 *
 * @class ItemId
 * @extends {IdBinaire}
 * @author Conception : Joël (Purement infonctionnel)
 * @author Rabotage de code : Gaïa (Vigilante de la virgule)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class ItemId extends IdBinaire {
  /** 📥 Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandItemId: undefined;

  /**
   * Encapsule l'UUID d'une pépite sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string | Buffer} p_Brut - L'identifiant brut sous sa forme textuelle ou binaire
   */
  public constructor(p_Brut: string | Buffer) {
    super(p_Brut);
  }
}

/**
 * 🚨 Identifiant unique et fortement typé pour la table "Events" (Journal d'audit immuable).
 *
 * @class AppEventId
 * @extends {IdBinaire}
 * @author Conception : Joël (Purement infonctionnel)
 * @author Rabotage de code : Gaïa (Vigilante de la virgule)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class AppEventId extends IdBinaire {
  /** 🤖 Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandEventId: undefined;

  /**
   * Encapsule l'UUID d'un événement sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string | Buffer} p_Brut - L'identifiant brut sous sa forme textuelle ou binaire
   */
  public constructor(p_Brut: string | Buffer) {
    super(p_Brut);
  }
}

/**
 * 🔗 Identifiant unique et fortement typé pour la table "Shares" (Passerelles de partage).
 *
 * @class ShareId
 * @extends {IdBinaire}
 * @author Conception : Joël (Purement infonctionnel)
 * @author Rabotage de code : Gaïa (Vigilante de la virgule)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class ShareId extends IdBinaire {
  /** 🎛️ Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandShareId: undefined;

  /**
   * Encapsule l'UUID d'un partage sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string | Buffer} p_Brut - L'identifiant brut sous sa forme textuelle ou binaire
   */
  public constructor(p_Brut: string | Buffer) {
    super(p_Brut);
  }
}

/**
 * 💾 Identifiant unique et fortement typé pour la table d'infrastructure "user_sessions".
 *
 * @class SessionId
 * @extends {IdBinaire}
 * @author Conception : Joël (Purement infonctionnel)
 * @author Rabotage de code : Gaïa (Vigilante de la virgule)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class SessionId extends IdBinaire {
  /** 💾 Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandSessionId: undefined;

  /**
   * Encapsule l'UUID d'une session sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string | Buffer} p_Brut - L'identifiant brut sous sa forme textuelle ou binaire
   */
  public constructor(p_Brut: string | Buffer) {
    super(p_Brut);
  }
}

/**
 * 🏷️ Identifiant unique et fortement typé pour la table "Tags" (Mots-clés).
 *
 * @class TagId
 * @extends {IdBinaire}
 * @author Conception : Joël (Purement infonctionnel)
 * @author Rabotage de code : Gaïa (Vigilante de la virgule)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class TagId extends IdBinaire {
  /** ⚡ Marque nominale exclusive interdisant l'inversion accidentelle d'identifiants */
  declare private readonly __brandTagId: undefined;

  /**
   * Encapsule l'UUID d'une étiquette sous l'armure nominale du domaine.
   *
   * @constructor
   * @param {string | Buffer} p_Brut - L'identifiant brut sous sa forme textuelle ou binaire
   */
  public constructor(p_Brut: string | Buffer) {
    super(p_Brut);
  }
}
