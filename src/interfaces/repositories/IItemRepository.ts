// ——— fichier : src/interfaces/repositories/IItemRepository.ts

import { UserId, ItemId } from '@/domain/value-objects/ids';
import type { Item }      from '@/entities/Item';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import { IPhysicalRW }    from '@/interfaces/repositories/IPhysicalRW';
import { IMemoryRW }      from '@/interfaces/repositories/IMemoryRW';
import { IListResult }    from '@/interfaces/shared/IListResult';
import { IItemRepositoryListOptions } from '@/interfaces/repositories/IItemRepositoryListOptions';

/**
 * 📋 Interface Cadre IItemRepositoryBase 🛡️
 * ----------------------------------------------------------------------------
 * Centralise les signatures métiers et les cas d'usage transverses des pépites.
 * Assure le polymorphisme unifié partagé entre la mémoire vive et le disque physique.
 *
 * @interface IItemRepositoryBase
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Liskov Substitution)
 * @author Métallurgie des Octets : Gaïa (Au burin, alignée sur l'éclatement des soutes)
 */
interface IItemRepositoryBase {

  /**
   * 🛤️ Localise et extrait une Pépite unique via son permalien textuel (Slug).
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @param {string} p_sSlug - Le permalien normalisé à rechercher sur le disque ou en RAM
   * @returns {Promise<Item | null>} L'entité de la pépite hydratée ou null s'il n'y a rien
   */
  findBySlug(p_axUserId: UserId, p_sSlug: string): Promise<Item | null>;

  /**
   * 📝 Recherche une Pépite unique par son titre exact sur l'espace d'un utilisateur.
   * Utilisé en amont lors des créations pour bloquer les collisions d'intitulés.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @param {string} p_sTitle - Le titre textuel brut à vérifier à la douane
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

/**
 * 🗄️ Interface IItemRepository 🏛️
 * ----------------------------------------------------------------------------
 * Contrat d'accès gérant la persistance et le cycle de vie exclusif sur disque (PostgreSQL).
 * S'adosse constitutionnellement à la branche lourde IPhysicalRW. Exige la propriété `.db`.
 *
 * @interface IItemRepository
 * @extends {IItemRepositoryBase}
 * @extends {IPhysicalRW<Item, IItemData, ItemId>}
 */
export interface IItemRepository extends IItemRepositoryBase, IPhysicalRW<Item, IItemData, ItemId> {}

/**
 * 🎰 Interface IMockItemRepository 🧮
 * ----------------------------------------------------------------------------
 * Contrat d'émulation volatile dédié aux tests unitaires et aux simulateurs isolés en RAM.
 * S'adosse constitutionnellement à la branche épurée IMemoryRW. Libéré de la plomberie physique.
 *
 * @interface IMockItemRepository
 * @extends {IItemRepositoryBase}
 * @extends {IMemoryRW<Item, IItemData, ItemId>}
 */
export interface IMockItemRepository extends IItemRepositoryBase, IMemoryRW<Item, IItemData, ItemId> {}
