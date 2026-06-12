// ——— fichier : src/services/UserExportService.ts

import { UserId }               from '@/domain/value-objects/ids';
import { type IItemWithTags,
         UserExportDto }        from '@/dto/user/UserExportDto';
import { Item }                 from '@/entities/Item';
import { Share }                from '@/entities/Share';
import { Tag }                  from '@/entities/Tag';
import { User }                 from '@/entities/User';
import { UserErrorFactory }     from '@/exceptions/UserErrorFactory';
import type { IItemRepository } from '@/interfaces/repositories/PostGres/IItemRepository';
import type { IItemTagRepository } from '@/interfaces/repositories/PostGres/IItemTagRepository';
import type { IShareRepository } from '@/interfaces/repositories/PostGres/IShareRepository';
import type { ITagRepository }   from '@/interfaces/repositories/PostGres/ITagRepository';
import type { IUserRepository }  from '@/interfaces/repositories/PostGres/IUserRepository';
import type { IUserExportService } from '@/interfaces/services/IUserExportService';
import type { IListResult }      from '@/interfaces/shared/IListResult';
import OrdreTriEnum             from '@/constants/OrdreTriEnum';

/** ⚖️ Seuil défensif limitant la volumétrie maximale de pépites admises lors d'une extraction */
const EXPORT_ITEMS_LIMIT : number = 10000;

/**
 * 🏛️ Classe UserExportService
 * ----------------------------------------------------------------------------
 * Service d'application orchestrant la compilation transactionnelle et l'extraction RGPD (Art. 20).
 * Agrège l'ensemble des dépendances relationnelles d'un utilisateur vers un DTO d'exportation plat.
 * [ALIGNÉ V4] Intègre les options d'échantillonnage obligatoires sur l'intégralité des dépôts de lot.
 *
 * @class UserExportService
 * @implements {IUserExportService}
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, raccordée sur la Choupy Doctrine V4)
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
    p_oUserRepository    : IUserRepository,
    p_oItemRepository    : IItemRepository,
    p_oItemTagRepository : IItemTagRepository,
    p_oTagRepository     : ITagRepository,
    p_oShareRepository   : IShareRepository
  ) {
    this.m_oUserRepository   = p_oUserRepository;
    this.m_oItemRepository   = p_oItemRepository;
    this.m_oItemTagRepository = p_oItemTagRepository;
    this.m_oTagRepository     = p_oTagRepository;
    this.m_oShareRepository   = p_oShareRepository;
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

    // 🪓 [GABARIT DE SÉCURITÉ V4] Fabrication des options impératives pour calmer la Loi Somptuaire [Mémoria]
    const l_oGabaritMax: any = {
      NbLignes:   EXPORT_ITEMS_LIMIT,
      LigneDebut:  0,
      ColonneTri:  'createdAt',
      OrdreAff:    OrdreTriEnum.DeCode<OrdreTriEnum>('DESC')
    };

    // 🪓 [RÉPARÉ V4] Extraction simultanée : on consomme l'enveloppe et on capte du IListResult étanche [Mémoria]
    const [l_oItemPack, l_oTagPack, l_oSharePack] : [IListResult<Item>, IListResult<Tag>, IListResult<Share>] = await Promise.all([
      this.m_oItemRepository .listByUser(p_axUserId  , { ...l_oGabaritMax, ColonneTri: 'itCreatedAt' }),
      this.m_oTagRepository  .findByUserId(p_axUserId, { ...l_oGabaritMax, ColonneTri: 'tgName', OrdreAff: OrdreTriEnum.DeCode<OrdreTriEnum>('ASC') }),
      this.m_oShareRepository.findByUserId(p_axUserId, { ...l_oGabaritMax, ColonneTri: 'shCreatedAt' })
    ]);

    // Raccordement bilatéral des étiquettes associées à chaque pépite via la table de jointure Many-to-Many
    const l_aItemsWithTags : IItemWithTags[] = await Promise.all(
      l_oItemPack.Lignes.map(
        async (l_oItem: Item): Promise<IItemWithTags> => ({
          item: l_oItem,
          // 🪓 [RÉPARÉ V4] Interrogation via le vrai getter de surface .idItem sans parenthèses ! [Mémoria]
          tags: await this.m_oItemTagRepository.findTagsForItem(l_oItem.idItem)
        })
      )
    );

    // 🪓 [RÉPARÉ V4] Raccordement direct sans aucun cast menteur "as Tag[]", les types concordent au bit près !
    return UserExportDto.fromData(
      l_oUser,
      l_aItemsWithTags,
      l_oTagPack.Lignes,
      l_oSharePack.Lignes
    );
  }
}
