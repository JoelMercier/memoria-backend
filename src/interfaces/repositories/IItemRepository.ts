// ——— fichier : src/interfaces/repositories/IItemRepository.ts

import      { UserId, ItemId } from '@/domain/value-objects/IdMetier';
import type { Item } from '@/entities/Item';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import type { IWriteableRepository } from '@/interfaces/repositories/IWriteableRepository';

/**
 * 📋 Interface IItemListOptions
 * -----------------------------
 * Options de filtrage et de pagination spécifiques pour la consultation des pépites.
 *
 * @interface IItemListOptions
 * @author 🧠 Conception : Joël (Abstrait' Obsession)
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
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
 * @author 🧠 Conception : Joël (Abstrait' Obsession)
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
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
 * Hérite du droit de modification et de suppression via le contrat IWriteableRepository.
 *
 * @interface IItemRepository
 * @extends {IWriteableRepository<Item, IItemData, ItemId>}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export interface IItemRepository extends IWriteableRepository<Item, IItemData, ItemId> {

  /** 🔎 Récupère une pépite spécifique sur l'espace d'un utilisateur via son permalien (Slug). */
  findBySlug(userId: UserId, slug: string): Promise<Item | null>;

  /** 📝 Recherche une pépite unique par son titre exact sur l'espace de stockage de l'acteur. */
  findByTitle(userId: UserId, title: string): Promise<Item | null>;

  /** 📜 Extrait la collection paginée, triée et filtrée des pépites détenues par l'utilisateur. */
  listByUser(userId: UserId, options?: IItemListOptions): Promise<IItemListResult>;
}
