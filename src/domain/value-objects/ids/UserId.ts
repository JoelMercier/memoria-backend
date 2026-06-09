// ——— fichier : src\domain\value-objects\ids\UserId.ts

import { IdChoupy }   from '@/domain/base/idCore/IdChoupy';
import { ChoupyEnum } from '@/domain/base/idCore/ChoupyEnum';
import { IdForge }    from '@/domain/utils/IdForge';

/**
 * 👥 Classe UserId 💎
 * ----------------------------------------------------------------------------
 * Identifiant fort nominal représentant de manière unique un Acteur de la Forge.
 * Verrouillé constitutionnellement contre le typage structurel par Branding générique.
 * Encapsule un segment de mémoire de 16 octets au standard compact ByteA (UUID v7).
 *
 * @class UserId
 * @extends {IdChoupy<'USER_ID', string | Buffer>}
 * @author Directeur du Silicium : Joël (Architect & Nominal Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, redressée sur la Choupy Doctrine)
 */
export class UserId extends IdChoupy<'USER_ID', string | Buffer> {

  /**
   * Encapsule l'UUID d'un acteur sous l'armure nominale du domaine.
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
   * 🏭 Usine Statique : Engendre un nouvel identifiant utilisateur chronologique V7.
   * Point de passage obligatoire lors de la création et de l'enrôlement d'un acteur.
   *
   * @static
   * @public
   * @returns {UserId} Une instance fraîchement coulée de UserId par IdForge
   */
  public static Nouveau(): UserId {
    return new UserId(IdForge.genererUuidV7());
  }
}
