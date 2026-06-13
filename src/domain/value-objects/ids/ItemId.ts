// ——— fichier : src\domain\value-objects\ids\ItemId.ts

import { IdChoupy   } from '@/constants/Choupy/IdChoupy';
import { ChoupyEnum } from '@/constants/Choupy/ChoupyEnum';
import { IdForge }    from '@/domain/utils/IdForge';

/**
 * 📦 Classe ItemId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fort nominal représentant de manière unique une Pépite (Item) du système.
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule un segment de mémoire de 16 octets au standard compact ByteA (UUID v7).
 *
 * @class ItemId
 * @extends {IdChoupy<'ITEM_ID', string | Buffer>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, redressée sur la Choupy Doctrine)
 */
export class ItemId extends IdChoupy<'ITEM_ID', string | Buffer> {

  /**
   * Encapsule l'UUID d'une pépite sous l'armure nominale du domaine.
   * Accepte le flux binaire direct ou la trame textuelle de Cour Basse.
   *
   * @constructor
   * @param {string | Buffer} p_vBrut - L'identifiant brut sous sa forme textuelle ou binaire 📥
   */
  public constructor(p_vBrut: string | Buffer) {
    // Délégation immédiate à la maman avec injection du calibre strict des UUIDs 128 bits
    super(p_vBrut, ChoupyEnum.DIM_16);
  }

  /**
   * 🏭 Usine Statique : Engendre un nouvel identifiant de pépite chronologique V7.
   * Point de passage obligatoire lors de la création d'un nouvel enregistrement métier.
   *
   * @static
   * @public
   * @returns {ItemId} Une instance fraîchement coulée de ItemId par IdForge
   */
  public static Nouveau(): ItemId {
    return new ItemId(IdForge.genererUuidV7());
  }
}
