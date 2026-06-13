// ——— fichier : src/domain/value-objects/ids/TagId.ts

import { IdChoupy   } from '@/constants/Choupy/IdChoupy';
import { ChoupyEnum } from '@/constants/Choupy/ChoupyEnum';
import { IdForge }    from '@/domain/utils/IdForge';

/**
 * 🏷️ Classe TagId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fort nominal représentant de manière unique une Étiquette (Tag) du système.
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule un segment de mémoire de 16 octets au standard compact ByteA (UUID v7).
 *
 * @class TagId
 * @extends {IdChoupy<'TAG_ID', string | Buffer>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, redressée sur la Choupy Doctrine)
 */
export class TagId extends IdChoupy<'TAG_ID', string | Buffer> {

  /**
   * Encapsule l'UUID d'une étiquette sous l'armure nominale du domaine.
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
   * 🏭 Usine Statique : Engendre un nouvel identifiant d'étiquette chronologique V7.
   * Point de passage obligatoire lors de la création d'un mot-clé métier.
   *
   * @static
   * @public
   * @returns {TagId} Une instance fraîchement coulée de TagId par IdForge
   */
  public static Nouveau(): TagId {
    return new TagId(IdForge.genererUuidV7());
  }
}
