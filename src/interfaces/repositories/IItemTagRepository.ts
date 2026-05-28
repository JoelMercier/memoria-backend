// ——— fichier : src/interfaces/repositories/IItemTagRepository.ts

import { ItemId, TagId } from '@/domain/value-objects/IdMetier';
import type { Tag } from '@/entities/Tag';

/**
 * 🗄️ Interface IItemTagRepository
 * --------------------------------
 * Contrat d'accès à la table de jointure relationnelle entre les Pépites (Items) et les Étiquettes (Tags).
 * Orchestre les liaisons sémantiques, les synchronisations de masse et les purges transactionnelles.
 *
 * @interface IItemTagRepository
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
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
