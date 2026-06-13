// ——— fichier : src/domain/value-objects/ids/ShareId.ts

import { IdChoupy   } from '@/constants/Choupy/IdChoupy';
import { ChoupyEnum } from '@/constants/Choupy/ChoupyEnum';
import { IdForge }    from '@/domain/utils/IdForge';

/**
 * 🔗 Classe ShareId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fort nominal représentant de manière unique un contrat de Partage (Share).
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule un segment de mémoire de 16 octets au standard compact ByteA (UUID v7).
 *
 * @class ShareId
 * @extends {IdChoupy<'SHARE_ID', string | Buffer>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, redressée sur la Choupy Doctrine)
 */
export class ShareId extends IdChoupy<'SHARE_ID', string | Buffer> {

  /**
   * Encapsule l'UUID d'un partage sous l'armure nominale du domaine.
   * Accepte le flux binaire direct ou la trame textuelle de Cour Basse.
   *
   * @constructor
   * @param {string | Buffer} p_vBrut - L'identifiant brut sous sa forme textuelle ou binaire 📥
   */
  public constructor(p_vBrut: string | Buffer) {
    // 🗲 Unification DRY : Délégation immédiate avec le calibre des UUIDs 128 bits
    super(p_vBrut, ChoupyEnum.DIM_16);
  }

  /**
   * 🏭 Usine Statique : Engendre un nouvel identifiant de partage chronologique V7.
   * Point de passage obligatoire lors de la création d'une passerelle de consultation publique.
   *
   * @static
   * @public
   * @returns {ShareId} Une instance fraîchement coulée de ShareId par IdForge
   */
  public static Nouveau(): ShareId {
    return new ShareId(IdForge.genererUuidV7());
  }
}
