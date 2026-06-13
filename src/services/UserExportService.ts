// ——— fichier : src/services/UserExportService.ts

import type { IItemWithTags      } from '@/dto/user/UserExportDto';
import type { IItemRepository    } from '@/interfaces/repositories/PostGres/IItemRepository';
import type { IItemTagRepository } from '@/interfaces/repositories/PostGres/IItemTagRepository';
import type { IShareRepository   } from '@/interfaces/repositories/PostGres/IShareRepository';
import type { IUserRepository    } from '@/interfaces/repositories/PostGres/IUserRepository';
import type { ITagRepository     } from '@/interfaces/repositories/PostGres/ITagRepository';
import type { IUserExportService } from '@/interfaces/services/IUserExportService';

import type { UserId } from '@/domain/value-objects/ids';
import type { User   } from '@/entities/User';
import type { Share  } from '@/entities/Share';
import type { Tag    } from '@/entities/Tag';
import type { Item   } from '@/entities/Item';

import type { IListResult } from '@/interfaces/shared/IListResult';
import type { IListOptions } from '@/interfaces/shared/IListOptions';

import { UserExportDto    } from '@/dto/user/UserExportDto';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import { OrdreTriEnum     } from '@/constants/OrdreTriEnum';

/** ⚖️ Seuil défensif limitant la volumétrie maximale de pépites admises lors d'une extraction */
const EXPORT_ITEMS_LIMIT: number = 10000;

/**
 * 🏛️ Classe UserExportService
 * ----------------------------------------------------------------------------
 * Service d'application orchestrant la compilation transactionnelle et l'extraction RGPD (Art. 20).
 * Agrège l'ensemble des dépendances relationnelles d'un utilisateur vers un DTO d'exportation plat.
 *
 * @class UserExportService
 * @implements {IUserExportService}
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Garde d'élite en surchauffe)
 */
export class UserExportService implements IUserExportService {
  /** 🗄️ Entrepôt de persistance abstrait des utilisateurs (IUserRepository) */
  private readonly m_oUserRepository: IUserRepository;

  /** 🗄️ Entrepôt de persistance abstrait des pépites (IItemRepository) */
  private readonly m_oItemRepository: IItemRepository;

  /** 🔗 Dépôt d'infrastructure pour le raccordement sémantique des tables de jointure */
  private readonly m_oItemTagRepository: IItemTagRepository;

  /** 🏷️ Dépôt d'infrastructure pour la gestion et lecture des Étiquettes */
  private readonly m_oTagRepository: ITagRepository;

  /** 🗄️ Entrepôt de persistance abstrait des partages (IShareRepository) */
  private readonly m_oShareRepository: IShareRepository;

  /**
   * Initialise le cas d'usage par injection de l'intégralité des abstractions de dépôts.
   */
  public constructor(
    p_oUserRepository: IUserRepository,
    p_oItemRepository: IItemRepository,
    p_oItemTagRepository: IItemTagRepository,
    p_oTagRepository: ITagRepository,
    p_oShareRepository: IShareRepository
  ) {
    this.m_oUserRepository = p_oUserRepository;
    this.m_oItemRepository = p_oItemRepository;
    this.m_oItemTagRepository = p_oItemTagRepository;
    this.m_oTagRepository = p_oTagRepository;
    this.m_oShareRepository = p_oShareRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   */
  public get repository(): IUserRepository {
    return this.m_oUserRepository;
  }

  /** 🗄️ Accesseur public vers le dépôt des pépites */
  public get itemRepository(): IItemRepository {
    return this.m_oItemRepository;
  }

  /** 🔗 Accesseur public vers le dépôt de jointure pépites-tags */
  public get itemTagRepository(): IItemTagRepository {
    return this.m_oItemTagRepository;
  }

  /** 🏷️ Accesseur public vers le dépôt des étiquettes */
  public get tagRepository(): ITagRepository {
    return this.m_oTagRepository;
  }

  /** 🗄️ Accesseur public vers le dépôt des partages */
  public get shareRepository(): IShareRepository {
    return this.m_oShareRepository;
  }

  /**
   * ⚖️ Compile et assemble l'intégralité de l'empreinte numérique d'un utilisateur (Pack de données).
   */
  public async exportUserData(p_axUserId: UserId): Promise<UserExportDto> {
    const l_oUser: User | null = await this.repository.findById(p_axUserId);

    if (!l_oUser) {
      throw UserErrorFactory.notFound(p_axUserId);
    }

    // 🪓 [RÉPARÉ V4] Utilisation des identifiants techniques nominaux réels de la RAM ('DECR' et 'CROI')
    const l_oGabaritMax: IListOptions = {
      NbLignes:   EXPORT_ITEMS_LIMIT,
      LigneDebut: 0,
      ColonneTri: 'createdAt',
      OrdreAff:   OrdreTriEnum.DeCode<OrdreTriEnum>('DECR') // 🪓 Remplacement de 'DESC' par 'DECR'
    };

    const [l_oItemPack, l_oTagPack, l_oSharePack]: [
      IListResult<Item>,
      IListResult<Tag>,
      IListResult<Share>
    ] = await Promise.all([
      this.itemRepository.listByUser(p_axUserId, { ...l_oGabaritMax, ColonneTri: 'itCreatedAt' }),
      this.tagRepository.findByUserId(p_axUserId, {
        ...l_oGabaritMax,
        ColonneTri: 'tgName',
        OrdreAff:   OrdreTriEnum.DeCode<OrdreTriEnum>('CROI') // 🪓 Remplacement de 'ASC' par 'CROI'
      }),
      this.shareRepository.findByUserId(p_axUserId, { ...l_oGabaritMax, ColonneTri: 'shCreatedAt' })
    ]);

    const l_aItemsWithTags: IItemWithTags[] = await Promise.all(
      l_oItemPack.Lignes.map(
        async (l_oItem: Item): Promise<IItemWithTags> => ({
          item: l_oItem,
          tags: await this.itemTagRepository.findTagsForItem(l_oItem.idItem)
        })
      )
    );

    return UserExportDto.fromData(
      l_oUser,
      l_aItemsWithTags,
      l_oTagPack.Lignes,
      l_oSharePack.Lignes
    );
  }
}
