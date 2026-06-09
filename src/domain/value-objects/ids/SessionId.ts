// ——— fichier : src/domain/value-objects/ids/SessionId.ts

import { IdChoupy }   from '@/domain/base/idCore/IdChoupy';
import { ChoupyEnum } from '@/domain/base/idCore/ChoupyEnum';
import { IdForge }    from '@/domain/utils/IdForge';

/**
 * 💾 Classe SessionId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fort nominal représentant de manière unique une Session utilisateur.
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule un segment de mémoire de 16 octets au standard compact ByteA (UUID v7).
 *
 * @class SessionId
 * @extends {IdChoupy<'SESSION_ID', string | Buffer>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, redressée sur la Choupy Doctrine)
 */
export class SessionId extends IdChoupy<'SESSION_ID', string | Buffer> {

  /**
   * Encapsule l'UUID d'une session sous l'armure nominale du domaine.
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
   * 🏭 Usine Statique : Engendre un nouvel identifiant de session chronologique V7.
   * Point de passage obligatoire lors de la création d'une nouvelle session d'infrastructure.
   *
   * @static
   * @public
   * @returns {SessionId} Une instance fraîchement coulée de SessionId par IdForge
   */
  public static Nouveau(): SessionId {
    return new SessionId(IdForge.genererUuidV7());
  }
}
