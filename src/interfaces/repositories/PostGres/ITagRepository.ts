// ——— fichier : src/interfaces/repositories/ITagRepository.ts

import { UserId, TagId } from '@/domain/value-objects/ids';
import type { Tag }      from '@/entities/Tag';
import type { ITagData } from '@/interfaces/entities/tag/ITagData';
import type { IPhysicalRW } from '@/interfaces/repositories/IPhysicalRW';
import type { IListOptions } from '@/interfaces/shared/IListOptions';
import type { IListResult }  from '@/interfaces/shared/IListResult';

/**
 * 📋 Interface Cadre de Lecture Spécifique des Étiquettes (Tags)
 * ----------------------------------------------------------------------------
 * Regroupe les signatures métiers d'extraction transversale applicables
 * autant sur les simulateurs volatiles en RAM que sur les dépôts PostgreSQL.
 */
interface ITagRepositoryBase {

  /**
   * 👥 Récupère l'intégralité des étiquettes (Tags) créées par un utilisateur donné.
   * [BRIDER MEMOIRE] Intègre constitutionnellement les options de limites et de tri.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur cible
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoire
   * @returns {Promise<IListResult<Tag>>} La collection paginée au standard français d'élite
   */
  findByUserId(p_axUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Tag>>;

  /**
   * 📝 Recherche une étiquette unique par son nom exact sur l'espace d'un utilisateur.
   * Utilisé en amont pour bloquer l'insertion de doublons homonymes (Tir laser indexé).
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
   * [BRIDER MEMOIRE] Protégé contre les volumétries anarchiques par le contrat de lot paginé.
   *
   * @async
   * @param {ReadonlyArray<TagId>} p_aIds - Le tableau immuable d'identifiants uniques forts de tags
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoire
   * @returns {Promise<IListResult<Tag>>} La collection paginée au standard français d'élite
   */
  findByIds(p_aIds: ReadonlyArray<TagId>, p_oOptions: IListOptions): Promise<IListResult<Tag>>;
}

/**
 * 🗄️ Interface ITagRepository 🛡️ (Le Grand Contrat de Production)
 * ----------------------------------------------------------------------------
 * Contrat d'accès aux données gérant le cycle de vie de persistance des étiquettes (Tags).
 * Hérite du droit de modification et de suppression via le contrat IPhysicalRW.
 *
 * @interface ITagRepository
 * @extends {ITagRepositoryBase}
 * @extends {IPhysicalRW<Tag, ITagData, TagId>}
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Ouvriers de la V4 en surchauffe)
 */
export interface ITagRepository extends ITagRepositoryBase, IPhysicalRW<Tag, ITagData, TagId> {}
