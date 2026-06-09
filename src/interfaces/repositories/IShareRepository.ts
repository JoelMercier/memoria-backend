// ——— fichier : src/interfaces/repositories/IShareRepository.ts

import { UserId, ShareId } from '@/domain/value-objects/ids';
import type { Share }      from '@/entities/Share';
import type { IShareData }  from '@/interfaces/entities/share/IShareData';
import { IPhysicalRW }     from '@/interfaces/repositories/IPhysicalRW';

/**
 * 🗄️ Interface IShareRepository 🛡️
 * ----------------------------------------------------------------------------
 * Contrat d'accès gérant la persistance et la sécurité des jetons de Partage (Shares).
 * Hérite des droits de mutation complète (create, findById, update, delete)
 * via la branche d'infrastructure physique lourde IPhysicalRW.
 *
 * @interface IShareRepository
 * @extends {IPhysicalRW<Share, IShareData, ShareId>} -- 🗲 [RÉARMÉ V4] Restitution de l'héritage 3NF
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Garde d'élite en surchauffe)
 */
export interface IShareRepository extends IPhysicalRW<Share, IShareData, ShareId> {

  /**
   * 🌐 Localise un contrat de partage unique via sa chaîne cryptographique anonyme (Token).
   * Point de passage obligatoire pour la passerelle de consultation publique.
   *
   * @async
   * @param {string} p_sToken - Le jeton d'accès brut extrait des paramètres de l'URL publique
   * @returns {Promise<Share | null>} L'entité de partage hydratée ou null s'il n'y a aucune correspondance
   */
  findByToken(p_sToken: string): Promise<Share | null>;

  /**
   * 📜 Extrait l'intégralité des contrats de partage actifs créés par un utilisateur donné.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @returns {Promise<Share[]>} La collection des entités de partages trouvées sur le disque
   */
  findByUserId(p_axUserId: UserId): Promise<Share[]>;
}
