// ——— fichier : src/interfaces/repositories/IItemRepository.ts

import { UserId, ItemId } from '@/domain/value-objects/IdMetier';
import type { Item } from '@/entities/Item';
import type { ContentType } from '@/constants/ContentType';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import type { IWriteableRepository } from '@/interfaces/repositories/IWriteableRepository';

/**
 * 📋 Interface IItemListOptions
 * -----------------------------
 * Options de filtrage et de pagination spécifiques pour la consultation des pépites.
 *
 * @interface IItemListOptions
 * @author Vision : Joël (Architecte DR-DOS)
 * @author Frapperie du code : Gaïa (Gardienne du feu binaire)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export interface IItemListOptions {
  /** 180352 Nombre maximal d'enregistrements à retourner par page */
  limit? : number;

  /** 🛤️ Index de décalage de départ pour la pagination */
  offset? : number;

  /** 🏷️ Filtre typé adossé à l'armure de notre Smart Enum à 4 lettres [Mémoria] */
  contentType? : ContentType;

  /** 🔍 Chaîne textuelle pour la recherche floue sur les titres et contenus */
  search? : string;
}

/**
 * 📦 Interface IItemListResult
 * ----------------------------
 * Structure de restitution normalisée pour les collections paginées de pépites.
 */
export interface IItemListResult {
  items : Item[];
  total : number;
}

/**
 * 🗄️ Interface IItemRepository
 * ----------------------------
 * Contrat d'accès aux données gérant le cycle de vie de persistance des pépites (Items).
 */
export interface IItemRepository extends IWriteableRepository<Item, IItemData, ItemId> {
  findBySlug(userId: UserId, slug: string): Promise<Item | null>;
  findByTitle(userId: UserId, title: string): Promise<Item | null>;
  listByUser(userId: UserId, options?: IItemListOptions): Promise<IItemListResult>;
}
