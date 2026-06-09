// ——— fichier : src/interfaces/repositories/IItemRepository.ts

import { UserId, ItemId } from '@/domain/value-objects/ids';
import type { Item }      from '@/entities/Item';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import { IPhysicalRW }    from '@/interfaces/repositories/IPhysicalRW';
import { IListResult }    from '@/interfaces/shared/IListResult';
import { IItemRepositoryListOptions } from '@/interfaces/repositories/IItemRepositoryListOptions';

/**
 * 🗄️ Interface IItemRepository 🛡️
 * ----------------------------------------------------------------------------
 * Contrat d'accès gérant la persistance et le cycle de vie exclusif des Pépites (Items).
 * Hérite des droits de mutation complète (create, findById, update, delete)
 * via la branche d'infrastructure physique lourde IPhysicalRW.
 * Purifié constitutionnellement de la plomberie des étiquettes (Tags).
 *
 * SOLID :
 *  - SRP 🪓 : Responsabilité unique et étanche focalisée sur le stockage des ressources.
 *
 * @interface IItemRepository
 * @extends {IPhysicalRW<Item, IItemData, ItemId>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Separation of Concerns)
 * @author Métallurgie des Octets : Gaïa (Au burin, raccordée sur le découpage des tags)
 */
export interface IItemRepository extends IPhysicalRW<Item, IItemData, ItemId> {

  /**
   * 🛤️ Localise et extrait une Pépite unique via son permalien textuel (Slug).
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @param {string} p_sSlug - Le permalien normalisé à rechercher sur le disque
   * @returns {Promise<Item | null>} L'entité de la pépite hydratée ou null s'il n'y a rien
   */
  findBySlug(p_axUserId: UserId, p_sSlug: string): Promise<Item | null>;

  /**
   * 📝 Recherche une Pépite unique par son titre exact sur l'espace d'un utilisateur.
   * Utilisé en amont lors des créations pour bloquer les collisions d'intitulés.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @param {string} p_sTitle - Le titre textuel brut à vérifier à la douane du disque
   * @returns {Promise<Item | null>} L'entité de la pépite correspondante ou null
   */
  findByTitle(p_axUserId: UserId, p_sTitle: string): Promise<Item | null>;

  /**
   * 📜 Extrait la collection filtrée, ordonnée et paginée des ressources détenues par un acteur.
   * Exploite l'enveloppe générique d'IHM et s'aligne sur les variables sacrées Jojo-Style.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur cible
   * @param {IItemRepositoryListOptions} p_oOptions - Le dictionnaire de configuration de tri, filtres et limites
   * @returns {Promise<IListResult<Item>>} Le lot de résultats paginé et structuré en français d'élite
   */
  listByUser(p_axUserId: UserId, p_oOptions: IItemRepositoryListOptions): Promise<IListResult<Item>>;
}
