// ——— fichier : src/interfaces/repositories/ITagRepository.ts

import type { UserId,
              TagId            } from '@/domain/value-objects/IdMetier';
import type { Tag              } from '@/entities/Tag';
import type { ITagData         } from '@/interfaces/entities/tag/ITagData';
import type { IBaseRepository  } from '@/interfaces/repositories/IBaseRepository';

/**
 * 🗄️ Interface ITagRepository
 * ---------------------------
 * Contrat d'accès aux données gérant le cycle de vie de persistance des étiquettes (Tags).
 * Orchestre la recherche, les validations d'unicité de libellés et les extractions groupées.
 *
 * @interface ITagRepository
 * @extends {IBaseRepository<Tag, ITagData, TagId>}
 * @author Joël, Gaïa & Co
 */
export interface ITagRepository extends IBaseRepository<Tag, ITagData, TagId> {

  /** 👥 Récupère l'intégralité des étiquettes (Tags) créées par un utilisateur donné. */
  findByUserId(userId: UserId): Promise<Tag[]>;

  /** 📝 Recherche une étiquette unique par son nom exact sur l'espace d'un utilisateur. */
  findByName(userId: UserId, tagName: string): Promise<Tag | null>;

  /** 🏷️ Extrait en masse une collection d'étiquettes à partir d'une liste d'identifiants uniques forts. */
  findByIds(ids: ReadonlyArray<TagId>): Promise<Tag[]>;
}
