// ——— fichier : src/domain/value-objects/IdMetier.ts

import { IdBinaire } from '@/domain/base/IdBinaire';
import { Buffer } from 'node:buffer';

/**
 * 🏛️ Tiroir des Identifiants Nominaux Forts du Domaine
 * -----------------------------------------------------
 * Centralise les Value Objects d'identité héritant du moteur binaire 128-bit pur.
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */

/** 💎 Armure nominale forte de l'identité de l'Utilisateur */
export class UserId extends IdBinaire {
  public constructor(idBrut: string | Buffer) {
    super(idBrut);
  }
}

/** 💎 Armure nominale forte de l'identité de la Pépite */
export class ItemId extends IdBinaire {
  public constructor(idBrut: string | Buffer) {
    super(idBrut);
  }
}

/** 💎 Armure nominale forte de l'identité de l'Étiquette */
export class TagId extends IdBinaire {
  public constructor(idBrut: string | Buffer) {
    super(idBrut);
  }
}

/** 💎 Armure nominale de traçabilité réseau (Jeton de corrélation) */
export class RequestId extends IdBinaire {
  public constructor(idBrut: string | Buffer) {
    super(idBrut);
  }
}

/** 💎 Armure nominale de traçabilité des journaux (Identifiant d'événement) */
export class AppEventId extends IdBinaire {
  public constructor(idBrut: string | Buffer) {
    super(idBrut);
  }
}

/** 💎 Armure nominale forte régissant l'identité des Partages */
export class ShareId extends IdBinaire {
  public constructor(idBrut: string | Buffer) {
    super(idBrut);
  }
}
