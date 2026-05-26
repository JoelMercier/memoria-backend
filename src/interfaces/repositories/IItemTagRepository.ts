// ——— fichier : src/interfaces/repositories/IItemTagRepository.ts

import type { ItemId, TagId } from '@/domain/value-objects/IdMetier';
import type { Tag           } from '@/entities/Tag';

/**
 * 🗄️ Interface IItemTagRepository
 * --------------------------------
 * Contrat d'accès à la table de jointure relationnelle entre les Pépites (Items) et les Étiquettes (Tags).
 * Orchestre les liaisons sémantiques, les synchronisations de masse et les purges transactionnelles.
 *
 * @interface IItemTagRepository
 * @author Joël, Gaïa & Co
 */
export interface IItemTagRepository {

  /** 🔗 Ajoute une liaison entre une pépite et une étiquette (Idempotent : ON CONFLICT DO NOTHING). */
  add(itemId: ItemId, tagId: TagId): Promise<void>;

  /** 🪓 Retire l'association entre une pépite et une étiquette. Renvoie true si effectif. */
  remove(itemId: ItemId, tagId: TagId): Promise<boolean>;

  /** 🔄 Remplace tous les tags rattachés à une pépite par la collection fournie (Transactionnel). */
  sync(itemId: ItemId, tagIds: ReadonlyArray<TagId>): Promise<void>;

  /** 🔎 Récupère la collection exhaustive de toutes les instances de tags associées à une pépite. */
  findTagsForItem(itemId: ItemId): Promise<Tag[]>;

  /** 🧹 Supprime l'intégralité des liaisons d'une pépite (Requis avant la destruction de l'élément). */
  clearForItem(itemId: ItemId): Promise<void>;
}
