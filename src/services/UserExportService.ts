// ——— fichier : src/services/UserExportService.ts

import { UserId          } from '@/domain/value-objects/ids';
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
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Garde d'élite en surchauffe)
 */
export class UserExportService implements IUserExportService {

  /** 🗄️ Entrepôt de persistance abstrait des utilisateurs (IUserRepository) */
  private readonly m_oUserRepository : IUserRepository;

  /** 🗄️ Entrepôt de persistance abstrait des pépites (IItemRepository) */
  private readonly m_oItemRepository : IItemRepository;

  /** 🔗 Dépôt d'infrastructure pour le raccordement sémantique des tables de jointure */
  private readonly m_oItemTagRepository : IItemTagRepository;

  /** 🏷️ Dépôt d'infrastructure pour la gestion et lecture des Étiquettes */
  private readonly m_oTagRepository : ITagRepository;

  /** 🗄️ Entrepôt de persistance abstrait des partages (IShareRepository) */
  private readonly m_oShareRepository : IShareRepository;

  /**
   * Initialise le cas d'usage par injection de l'intégralité des abstractions de dépôts.
   *
   * @constructor
   * @param {IUserRepository} p_oUserRepository - Le dépôt d'infrastructure des utilisateurs
   * @param {IItemRepository} p_oItemRepository - Le dépôt d'infrastructure des pépites
   * @param {IItemTagRepository} p_oItemTagRepository - Le dépôt d'infrastructure des jointures de tags
   * @param {ITagRepository} p_oTagRepository - Le dépôt d'infrastructure des étiquettes
   * @param {IShareRepository} p_oShareRepository - Le dépôt d'infrastructure des partages
   */
  public constructor(
    p_oUserRepository : IUserRepository,
    p_oItemRepository : IItemRepository,
    p_oItemTagRepository : IItemTagRepository,
    p_oTagRepository : ITagRepository,
    p_oShareRepository : IShareRepository
  ) {
    this.m_oUserRepository = p_oUserRepository;
    this.m_oItemRepository = p_oItemRepository;
    this.m_oItemTagRepository = p_oItemTagRepository;
    this.m_oTagRepository = p_oTagRepository;
    this.m_oShareRepository = p_oShareRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   * Centralise la souveraineté d'accès au dépôt d'infrastructure principal.
   *
   * @public
   * @returns {IUserRepository} L'instance du dépôt d'infrastructure des utilisateurs
   */
  public get repository(): IUserRepository {
    return this.m_oUserRepository;
  }

  /**
   * ⚖️ Compile et assemble l'intégralité de l'empreinte numérique d'un utilisateur (Pack de données).
   * Exploite une parallélisation agressive pour minimiser les allers-retours avec la base PostgreSQL.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant unique fort de l'acteur demandant l'extraction
   * @throws {UserErrorFactory} Si l'acteur cible est introuvable sur le disque
   * @returns {Promise<UserExportDto>} Le dictionnaire lourd de données purifiées pour la portabilité
   */
  public async exportUserData(p_axUserId: UserId): Promise<UserExportDto> {
    const l_oUser : User | null = await this.m_oUserRepository.findById(p_axUserId);

    if (!l_oUser) {
      throw UserErrorFactory.notFound(p_axUserId);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation des types interfaces ITag[] and IShare[] conformes aux signatures des dépôts
    const [l_oItemList, l_aTags, l_aShares] : [IItemListResult, ITag[], IShare[]] = await Promise.all([
      this.m_oItemRepository.listByUser(p_axUserId, { limit: EXPORT_ITEMS_LIMIT, offset: 0 }),
      this.m_oTagRepository.findByUserId(p_axUserId),
      this.m_oShareRepository.findByUserId(p_axUserId)
    ]);

    // Raccordement bilatéral des étiquettes associées à chaque pépite via la table de jointure
    const l_aItemsWithTags : IItemWithTags[] = await Promise.all(
      l_oItemList.items.map(
        async (l_oItem: Item): Promise<IItemWithTags> => ({
          item: l_oItem,
          // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation stricte du getter immuable .getItemId() de l'entité Item
          tags: await this.m_oItemTagRepository.findTagsForItem(l_oItem.getItemId())
        })
      )
    );

    // Cast défensif final vers les classes concrètes attendues par le DTO d'exportation si nécessaire
    return UserExportDto.fromData(l_oUser, l_aItemsWithTags, l_aTags as Tag[], l_aShares as Share[]);
  }
}
