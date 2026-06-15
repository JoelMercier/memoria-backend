// ——— fichier : src/domain/value-objects/ids/AppEventId.ts

import { IdChoupy   } from '@/constants/Choupy/IdChoupy';
import { ChoupyEnum } from '@/constants/Choupy/ChoupyEnum';
import { IdForge    } from '@/domain/utils/IdForge';

/**
 * 🚨 Classe AppEventId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fort nominal représentant de manière unique un Événement d'audit (AppEvent).
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule un segment de mémoire de 16 octets au standard compact ByteA (UUID v7).
 *
 * @class AppEventId
 * @extends {IdChoupy<'EVENT_ID', string | Buffer>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, redressée sur la Choupy Doctrine)
 */
export class EventId extends IdChoupy<'EVENT_ID', string | Buffer> {

  /**
   * Encapsule l'UUID d'un événement sous l'armure nominale du domaine.
   * Accepte le flux binaire direct ou la trame textuelle de Cour Basse.
   *
   * @constructor
   * @param {string | Buffer} p_vBrut - L'identifiant brut sous sa forme textuelle ou binaire 📥
   */
  public constructor(p_vBrut: string | Buffer) {
    //倾 Unification DRY : Délégation immédiate avec le calibre des UUIDs 128 bits
    super(p_vBrut, ChoupyEnum.DIM_16);
  }

  /**
   * 🏭 Usine Statique : Engendre un nouvel identifiant d'audit chronologique V7.
   * Point de passage obligatoire lors de la journalisation immuable d'un incident.
   *
   * @static
   * @public
   * @returns {EventId} Une instance fraîchement coulée de AppEventId par IdForge
   */
  public static Nouveau(): EventId {
    return new EventId(IdForge.genererUuidV7());
  }
}
