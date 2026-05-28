// ——— fichier : src/services/UserExportService.ts

import { UserId          } from '@/domain/value-objects/IdMetier';
import { type IItemWithTags,
         UserExportDto    } from '@/dto/user/UserExportDto';
import { Item             } from '@/entities/Item';
import { Share            } from '@/entities/Share';
import { Tag              } from '@/entities/Tag';
import { User             } from '@/entities/User';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import type { IItemListResult,
              IItemRepository  } from '@/interfaces/repositories/IItemRepository';
import type { IItemTagRepository } from '@/interfaces/repositories/IItemTagRepository';
import type { IShareRepository    } from '@/interfaces/repositories/IShareRepository';
import type { ITagRepository     } from '@/interfaces/repositories/ITagRepository';
import type { IUserRepository    } from '@/interfaces/repositories/IUserRepository';
import type { IUserExportService } from '@/interfaces/services/IUserExportService';
import type { ITag               } from '@/interfaces/entities/tag/ITag';
import type { IShare             } from '@/interfaces/entities/share/IShare';

/** ⚖️ Seuil défensif limitant la volumétrie maximale de pépites admises lors d'une extraction */
const EXPORT_ITEMS_LIMIT : number = 10000;

/**
 * 🏛️ Classe UserExportService
 * ----------------------------
 * Service d'application orchestrant la compilation transactionnelle et l'extraction RGPD (Art. 20).
 * Agrège l'ensemble des dépendances relationnelles d'un utilisateur vers un DTO d'exportation plat.
 *
 * @class UserExportService
 * @implements {IUserExportService}
 * @author Joël, Gaïa & Co
 */
export class UserExportService implements IUserExportService {

  /**
   * Initialise le cas d'usage par injection de l'intégralité des abstractions de dépôts.
   *
   * @constructor
   */
  public constructor(
    private readonly userRepository : IUserRepository,
    private readonly itemRepository : IItemRepository,
    private readonly itemTagRepository : IItemTagRepository,
    private readonly tagRepository : ITagRepository,
    private readonly shareRepository : IShareRepository
  ) {}

  /**
   * ⚖️ Compile et assemble l'intégralité de l'empreinte numérique d'un utilisateur (Pack de données).
   * Exploite une parallélisation agressive pour minimiser les allers-retours avec la base PostgreSQL.
   *
   * @public
   * @async
   */
  public async exportUserData(userId: UserId): Promise<UserExportDto> {
    const user : User | null = await this.userRepository.findById(userId);

    if (!user) {
      throw UserErrorFactory.notFound(userId);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation des types interfaces ITag[] et IShare[] conformes aux signatures des dépôts
    const [itemList, tags, shares] : [IItemListResult, ITag[], IShare[]] = await Promise.all([
      this.itemRepository.listByUser(userId, { limit: EXPORT_ITEMS_LIMIT, offset: 0 }),
      this.tagRepository.findByUserId(userId),
      this.shareRepository.findByUserId(userId)
    ]);

    // Raccordement bilatéral des étiquettes associées à chaque pépite via la table de jointure
    const itemsWithTags : IItemWithTags[] = await Promise.all(
      itemList.items.map(
        async (item: Item): Promise<IItemWithTags> => ({
          item,
          // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation stricte du getter immuable .getItemId() de l'entité Item
          tags: await this.itemTagRepository.findTagsForItem(item.getItemId())
        })
      )
    );

    // Cast défensif final vers les classes concrètes attendues par le DTO d'exportation si nécessaire
    return UserExportDto.fromData(user, itemsWithTags, tags as Tag[], shares as Share[]);
  }
}
