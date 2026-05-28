// ——— fichier : src/interfaces/repositories/ITagRepository.ts

import { UserId, TagId } from '@/domain/value-objects/IdMetier';
import type { Tag } from '@/entities/Tag';
import type { ITagData } from '@/interfaces/entities/tag/ITagData';
import type { IWriteableRepository } from '@/interfaces/repositories/IWriteableRepository';

/**
 * 🗄️ Interface ITagRepository
 * ---------------------------
 * Contrat d'accès aux données gérant le cycle de vie de persistance des étiquettes (Tags).
 * Orchestre la recherche, les validations d'unicité de libellés et les extractions groupées.
 * Hérite du droit de modification et de suppression via le contrat IWriteableRepository.
 *
 * @interface ITagRepository
 * @extends {IWriteableRepository<Tag, ITagData, TagId>}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export interface ITagRepository extends IWriteableRepository<Tag, ITagData, TagId> {

  /** 👥 Récupère l'intégralité des étiquettes (Tags) créées par un utilisateur donné. */
  findByUserId(userId: UserId): Promise<Tag[]>;

  /** 📝 Recherche une étiquette unique par son nom exact sur l'espace d'un utilisateur. */
  findByName(userId: UserId, tagName: string): Promise<Tag | null>;

  /** 🏷️ Extrait en masse une collection d'étiquettes à partir d'une liste d'identifiants uniques forts. */
  findByIds(ids: ReadonlyArray<TagId>): Promise<Tag[]>;
}
