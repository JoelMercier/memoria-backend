// ——— fichier : src/interfaces/repositories/Mocks/IMockItemRepository.ts

import type { Item }        from '@/entities/Item';
import type { ItemId, UserId } from '@/domain/value-objects/ids';
import type { IItemData }   from '@/interfaces/entities/item/IItemData';
import type { IMemoryRW }   from '@/interfaces/repositories/IMemoryRW';
import type { IListResult }  from '@/interfaces/shared/IListResult';
import type { IItemRepositoryListOptions } from '@/interfaces/repositories/PostGres/IItemRepository';

/**
 * 🎰 Interface IMockItemRepository 🧮 [DÉCOUPAGE PHYSIQUE SCELLÉ V4]
 * ----------------------------------------------------------------------------
 * Contrat d'infrastructure volatile évitant l'injection obligatoire du pool PostgreSQL.
 * Marie les verbes métiers de lecture de pépites à la persistance d'écriture en mémoire vive.
 *
 * @interface IMockItemRepository
 * @extends {IMemoryRW<Item, IItemData, ItemId>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Liskov Substitution)
 * @author Métallurgie des Octets : Gaïa (Au burin, alignée sur la symétrie miroir V4)
 */
export interface IMockItemRepository extends IMemoryRW<Item, IItemData, ItemId> {

  /** 🔎 Récupère une pépite par son permalien utilisateur (Tir laser virtuel). */
  findBySlug(p_axUserId: UserId, p_sSlug: string): Promise<Item | null>;

  /** 📝 Recherche une pépite unique par son titre exact sur l'espace d'un acteur. */
  findByLibelle(p_axUserId: UserId, p_sTitle: string): Promise<Item | null>;

  /** 📊 Énumère le coffre-fort d'un acteur de manière segmentée (Français d'élite). */
  listByUser(p_axUserId: UserId, p_oOptions: IItemRepositoryListOptions): Promise<IListResult<Item>>;
}
