// ——— fichier : src/interfaces/repositories/ITagRepository.ts

import { UserId, TagId } from '@/domain/value-objects/ids';
import type { Tag } from '@/entities/Tag';
import type { ITagData } from '@/interfaces/entities/tag/ITagData';
import type { IPhysicalRW } from '@/interfaces/repositories/IPhysicalRW';

/**
 * 🗄️ Interface ITagRepository 🛡️
 * ----------------------------------------------------------------------------
 * Contrat d'accès aux données gérant le cycle de vie de persistance des étiquettes (Tags).
 * Orchestre la recherche, les validations d'unicité de libellés et les extractions groupées.
 * Hérite du droit de modification et de suppression via le contrat IPhysicalRW.
 *
 * @interface ITagRepository
 * @extends {IPhysicalRW<Tag, ITagData, TagId>}
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Ouvriers de la V4 en surchauffe)
 */
export interface ITagRepository extends IPhysicalRW<Tag, ITagData, TagId> {

  /**
   * 👥 Récupère l'intégralité des étiquettes (Tags) créées par un utilisateur donné.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur cible
   * @returns {Promise<Tag[]>} La collection des étiquettes trouvées sur le disque
   */
  findByUserId(p_axUserId: UserId): Promise<Tag[]>;

  /**
   * 📝 Recherche une étiquette unique par son nom exact sur l'espace d'un utilisateur.
   * Utilisé en amont pour bloquer l'insertion de doublons homonymes.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @param {string} p_sTagName - Le libellé textuel de l'étiquette recherchée
   * @returns {Promise<Tag | null>} L'entité Tag correspondante ou null
   */
  findByName(p_axUserId: UserId, p_sTagName: string): Promise<Tag | null>;

  /**
   * 🏷️ Extrait en masse une collection d'étiquettes à partir d'une liste d'identifiants uniques forts.
   * Point de passage obligatoire lors de la création ou mise à jour d'une Pépite pour valider l'ownership.
   *
   * @async
   * @param {ReadonlyArray<TagId>} p_aIds - Le tableau immuable d'identifiants uniques forts de tags
   * @returns {Promise<Tag[]>} La collection des entités de tags réhydratées depuis PostgreSQL
   */
  findByIds(p_aIds: ReadonlyArray<TagId>): Promise<Tag[]>;
}
