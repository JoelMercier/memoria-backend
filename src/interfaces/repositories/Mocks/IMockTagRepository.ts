// ——— fichier : src/interfaces/repositories/Mocks/IMockTagRepository.ts

import { Tag }               from '@/entities/Tag';
import { TagId, UserId }     from '@/domain/value-objects/ids';
import type { ITagData }     from '@/interfaces/entities/tag/ITagData';
import type { IMemoryRW }    from '@/interfaces/repositories/IMemoryRW';
import type { IListOptions } from '@/interfaces/shared/IListOptions';
import type { IListResult }  from '@/interfaces/shared/IListResult';

/**
 * 🎰 Interface IMockTagRepository 🧮 [DÉCOUPAGE PHYSIQUE V4]
 * ----------------------------------------------------------------------------
 * Contrat d'infrastructure volatile évitant l'injection obligatoire du pool PostgreSQL.
 * Marie les verbes métiers de lecture de tags à la persistance d'écriture en mémoire vive.
 *
 * @interface IMockTagRepository
 * @extends {IMemoryRW<Tag, ITagData, TagId>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Symmetry Obsession)
 * @author Métallurgie des Octets : Gaïa (Au burin, documentée au standard de surface V4)
 */
export interface IMockTagRepository extends IMemoryRW<Tag, ITagData, TagId> {

  /**
   * 👥 Récupère l'intégralité des étiquettes (Tags) simulées créées par un utilisateur donné.
   * [BRIDER MEMOIRE] Intègre les options de limites et de tri en mémoire vive active.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur cible
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoire
   * @returns {Promise<IListResult<Tag>>} La collection paginée simulée en français d'élite
   */
  findByUserId(p_axUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Tag>>;

  /**
   * 📝 Recherche une étiquette unique par son nom exact sur l'espace virtuel d'un utilisateur.
   * Utilisé pour valider l'absence de doublons homonymes au sein de la RAM de simulation.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @param {string} p_sTagName - Le libellé textuel de l'étiquette recherchée
   * @returns {Promise<Tag | null>} L'entité Tag correspondante ou null si absente
   */
  findByName(p_axUserId: UserId, p_sTagName: string): Promise<Tag | null>;

  /**
   * 🏷️ Extrait en masse une collection d'étiquettes simulées à partir d'une liste d'identifiants.
   * Point de passage obligatoire lors des tests unitaires de Pépites pour valider l'ownership en RAM.
   *
   * @async
   * @param {ReadonlyArray<TagId>} p_aIds - Le tableau immuable d'identifiants uniques forts de tags
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoire
   * @returns {Promise<IListResult<Tag>>} La collection paginée émulée en français d'élite
   */
  findByIds(p_aIds: ReadonlyArray<TagId>, p_oOptions: IListOptions): Promise<IListResult<Tag>>;
}
