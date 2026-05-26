// ——— fichier : src/interfaces/repositories/IItemRepository.ts

import type { UserId,
              ItemId           } from '@/domain/value-objects/IdMetier';
import type { Item             } from '@/entities/Item';
import type { IItemData        } from '@/interfaces/entities/item/IItemData';
import type { IBaseRepository  } from '@/interfaces/repositories/IBaseRepository';

/**
 * 📋 Interface IItemListOptions
 * -----------------------------
 * Options de filtrage et de pagination spécifiques pour la consultation des pépites.
 *
 * @interface IItemListOptions
 * @author Joël, Gaïa & Co
 */
export interface IItemListOptions {
  /** 📏 Nombre maximal d'enregistrements à retourner par page */
  limit? : number;

  /** 🛤️ Index de décalage de départ pour la pagination */
  offset? : number;

  /** 🏷️ Filtre optionnel ciblant un type de contenu sémantique du Smart Enum */
  contentType? : string;

  /** 🔍 Chaîne textuelle pour la recherche floue sur les titres et contenus */
  search? : string;
}

/**
 * 📦 Interface IItemListResult
 * ----------------------------
 * Structure de restitution normalisée pour les collections paginées de pépites.
 *
 * @interface IItemListResult
 * @author Joël, Gaïa & Co
 */
export interface IItemListResult {
  /** 🧾 Collection d'instances vivantes de pépites extraites de la base de données */
  items : Item[];

  /** 📊 Nombre total de pépites correspondantes au filtre trouvées en persistance */
  total : number;
}

/**
 * 🗄️ Interface IItemRepository
 * ----------------------------
 * Contrat d'accès aux données gérant le cycle de vie de persistance des pépites (Items).
 *
 * @interface IItemRepository
 * @extends {IBaseRepository<Item, IItemData, ItemId>}
 * @author Joël, Gaïa & Co
 */
export interface IItemRepository extends IBaseRepository<Item, IItemData, ItemId> {

  /** 🔎 Récupère une pépite spécifique sur l'espace d'un utilisateur via son permalien (Slug). */
  findBySlug(userId: UserId, slug: string): Promise<Item | null>;

  /** 📝 Recherche une pépite unique par son titre exact sur l'espace de stockage de l'acteur. */
  findByTitle(userId: UserId, title: string): Promise<Item | null>;

  /** 📜 Extrait la collection paginée, triée et filtrée des pépites détenues par l'utilisateur. */
  listByUser(userId: UserId, options?: IItemListOptions): Promise<IItemListResult>;
}
