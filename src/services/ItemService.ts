// ——— fichier : src/services/ItemService.ts

import type { CreateItemDto } from '@/dto/item/CreateItemDto';
import type { UpdateItemDto } from '@/dto/item/UpdateItemDto';

import type { ITagRepository }           from '@/interfaces/repositories/PostGres/ITagRepository';
import type { IItemData }                from '@/interfaces/entities/item/IItemData';
import type { IItemTagRepository }       from '@/interfaces/repositories/PostGres/IItemTagRepository';
import type { IItemService }             from '@/interfaces/services/IItemService';
import type {
  IItemRepository,
  IItemRepositoryListOptions
} from '@/interfaces/repositories/PostGres/IItemRepository';
import type { IListResult }              from '@/interfaces/shared/IListResult';
import type { Item }                     from '@/entities/Item';
import { IdForge }                       from '@/domain/utils/IdForge';
import { UserId, ItemId, TagId, ContentTypeId } from '@/domain/value-objects/ids';
import { TagErrorFactory }               from '@/exceptions/TagErrorFactory';
import { ItemErrorFactory }              from '@/exceptions/ItemErrorFactory';
import { SlugGenerator }                 from '@/utils/SlugGenerator';
import { OrdreTriEnum }                  from '@/constants/OrdreTriEnum';

/**
 * 🧱 Classe ItemService 📦
 * ----------------------------------------------------------------------------
 * Implémentation concrète de la logique métier gouvernant l'exploitation des Pépites.
 * Poste-frontière absorbant les primitives pour instancier les types forts du Domaine.
 *
 * @class ItemService
 * @implements {IItemService}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Stateful Tracking Master)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur le français d'élite V4)
 * @author Garde d'Élite des Types : La Vague Initial (Ouvriers de la V4 en surchauffe)
 */
export class ItemService implements IItemService {
  /** 🗄️ Le dépôt d'infrastructure principal des Pépites */
  private readonly m_rItemRepository: IItemRepository;

  /** 🗄️ Le dépôt d'infrastructure pivot des liaisons d'Étiquettes */
  private readonly m_rItemTagRepository: IItemTagRepository;

  /** 🗄️ Le dépôt d'infrastructure souverain des Étiquettes */
  private readonly m_rTagRepository: ITagRepository;

  /**
   * @constructor
   */
  public constructor(
    p_oItemRepository: IItemRepository,
    p_oItemTagRepository: IItemTagRepository,
    p_oTagRepository: ITagRepository
  ) {
    this.m_rItemRepository    = p_oItemRepository;
    this.m_rItemTagRepository = p_oItemTagRepository;
    this.m_rTagRepository     = p_oTagRepository;
  }

  /**
   * Accesseur unique exigé par le contrat ancêtre IBaseService.
   */
  public get repository(): IItemRepository {
    return this.m_rItemRepository;
  }

  /**
   * Accesseur interne privé protégé pour les besoins algorithmiques du service.
   */
  private get itemTagRepository(): IItemTagRepository {
    return this.m_rItemTagRepository;
  }

  /** 🪓 Accesseur public souverain vers le dépôt des étiquettes */
  public get tagRepository(): ITagRepository {
    return this.m_rTagRepository;
  }

  /**
   * 📜 Extrait la collection filtrée et paginée des pépites d'un acteur.
   */
  public async listByUser(
    p_sUserId: string,
    p_oOptions: IItemRepositoryListOptions
  ): Promise<IListResult<Item>> {
    const l_axUserId = new UserId(p_sUserId);

    // 🪓 ALIGNEMENT SOUVERAIN V4 : Passage obligatoire par l'accesseur public this.repository
    const l_oResultatSoute = await this.repository.listByUser(l_axUserId, p_oOptions);

    const l_oPackagePagine: IListResult<Item> = {
      LigneDebut    : p_oOptions.LigneDebut,
      NbLignesDem   : p_oOptions.NbLignes,
      NbLignesRenv  : l_oResultatSoute.NbLignesRenv,
      NbLignesTotal : l_oResultatSoute.NbLignesTotal,
      Lignes        : l_oResultatSoute.Lignes
    };

    return Object.freeze(l_oPackagePagine);
  }

  /**
   * 🛡️ Sécurité Nominale : Valide l'existence et l'ownership légitime d'une collection d'étiquettes.
   */
  private async validateTagOwnership(
    p_axUserId: UserId,
    p_aTagIds: ReadonlyArray<TagId>
  ): Promise<void> {
    const l_oGabaritLot = {
      NbLignes   : p_aTagIds.length,
      LigneDebut : 0,
      ColonneTri : 'tgName',
      OrdreAff   : OrdreTriEnum.DeCode<OrdreTriEnum>('ASC')
    };

    const l_oResultatLot = await this.tagRepository.findByIds(p_aTagIds, l_oGabaritLot);
    const l_aTags        = l_oResultatLot.Lignes;

    if (l_aTags.length !== p_aTagIds.length) {
      throw TagErrorFactory.notFound(new TagId('un ou plusieurs tags'));
    }

    for (const l_oTag of l_aTags) {
      if (!l_oTag.userId.estEgalA(p_axUserId)) {
        throw TagErrorFactory.accessDenied(l_oTag.idTag, p_axUserId);
      }
    }
  }

  /**
   * 🔔 Engendre et persiste une nouvelle Pépite après vérification rigoureuse des doublons.
   */
  public async create(p_sUserId: string, p_oDto: CreateItemDto): Promise<Item> {
    const l_axUserMetierId = new UserId(p_sUserId);
    const l_sSlug: string  = p_oDto.slug ?? SlugGenerator.generate(p_oDto.libelle); // 💎 [RÉPARÉ V4] Utilisation de libelle.

    // 🪓 ALIGNEMENT SOUVERAIN V4 : Passage obligatoire par l'accesseur public this.repository
    const l_oExistingSlug: Item | null = await this.repository.findBySlug(l_axUserMetierId, l_sSlug);
    if (l_oExistingSlug) {
      throw ItemErrorFactory.slugExists(l_axUserMetierId, l_sSlug);
    }

    // 💎 [RÉPARÉ V4] Raccordement sur findByLibelle au lieu de findByTitle banni [1.1]
    const l_oExistingLibelle: Item | null = await this.repository.findByLibelle(l_axUserMetierId, p_oDto.libelle);
    if (l_oExistingLibelle) {
      throw ItemErrorFactory.libelleExists(l_axUserMetierId, p_oDto.libelle); // 💎 Raccordement sur libelleExists [1.1].
    }

    const l_aRawTagIds             = p_oDto.tagIds || [];
    const l_aDomainTagIds: TagId[] = l_aRawTagIds.map((l_vId: unknown): TagId => new TagId(l_vId as string));

    if (l_aDomainTagIds.length > 0) {
      await this.validateTagOwnership(l_axUserMetierId, l_aDomainTagIds);
    }

    // 🛡️ [CONFORME] Le sac passif d'infrastructure épouse rigoureusement le franconien de IItemData
    const l_oData: IItemData = {
      idItem        : new ItemId(IdForge.genererUuidV7()),
      idUser        : l_axUserMetierId,
      contentTypeId : new ContentTypeId(p_oDto.contentTypeId), // 🔌 Alignement direct sur la clé fixe du DTO.
      libelle       : p_oDto.libelle,       // 💎 Propriété d'élite V4.
      slug          : l_sSlug,
      content       : p_oDto.content,
      auteurSource  : p_oDto.auteurSource,  // 💎 Propriété d'élite V4.
      thumbnailUrl  : p_oDto.thumbnailUrl,
      metadata      : p_oDto.metadata,
      createdAt     : new Date()
    };

    const l_oItem: Item = await this.repository.create(l_oData);

    if (l_aDomainTagIds.length > 0) {
      await this.itemTagRepository.sync(l_oItem.idItem, l_aDomainTagIds);
    }

    return l_oItem;
  }

  /**
   * 🔎 Récupère une pépite par sa clé primaire après validation de l'ownership.
   * Version: 4.2.2 (Exploitation de la Double Arité d'Infrastructure) [1.1]
   *
   * @public
   * @async
   * @param {string} p_sUserId - La primitive de l'identifiant de l'utilisateur requérant
   * @param {string} p_sItemId - La primitive de l'identifiant de la pépite ciblée
   * @throws {ItemErrorFactory} Si la ressource n'existe pas ou si l'ownership est violé
   * @returns {Promise<Item>} L'entité de la pépite validée
   */
  public async findById(p_sUserId: string, p_sItemId: string): Promise<Item> {
    const l_axUserMetierId = new UserId(p_sUserId);
    const l_axItemMetierId = new ItemId(p_sItemId);

    // 🪓 [CONFORME V4] Exploitation immédiate de la double arité optionnelle de soute
    const l_oItem: Item | null = await this.repository.findById(l_axItemMetierId, l_axUserMetierId);
    if (!l_oItem) {
      throw ItemErrorFactory.notFound(l_axItemMetierId);
    }

    // Double sécurité préservée au niveau du Domaine
    if (!l_oItem.idUser.estEgalA(l_axUserMetierId)) {
      throw ItemErrorFactory.accessDenied(l_axItemMetierId, l_axUserMetierId);
    }

    return l_oItem;
  }

  /**
   * 🛤️ Localise et extrait une pépite via son permalien (Slug).
   *
   * @public
   * @async
   * @param {string} p_sUserId - La primitive de l'identifiant de l'utilisateur requérant
   * @param {string} p_sSlug - Le permalien textuel de la ressource
   * @throws {ItemErrorFactory} Si la ressource est introuvable sur le disque
   * @returns {Promise<Item>} L'entité de la pépite localisée
   */
  public async findBySlug(p_sUserId: string, p_sSlug: string): Promise<Item> {
    const l_axUserMetierId = new UserId(p_sUserId);

    // 🪓 ALIGNEMENT SOUVERAIN V4 : Passage obligatoire par l'accesseur public this.repository
    const l_oItem: Item | null = await this.repository.findBySlug(l_axUserMetierId, p_sSlug);
    if (!l_oItem) {
      throw ItemErrorFactory.notFound(new ItemId(p_sSlug));
    }

    return l_oItem;
  }


  /**
   * 🎛️ Applique des corrections ou modifications sur une pépite existante.
   * [SCELLÉ PURIFICATION V4] Mutation atomique sans double lecture réseau préventive [1.1].
   *
   * @public
   * @async
   * @param {string} p_sUserId - La primitive de l'identifiant de l'auteur de la modification
   * @param {string} p_sItemId - La primitive de l'identifiant de la pépite à modifier
   * @param {UpdateItemDto} p_oDto - L'objet de transfert contenant les révisions à appliquer
   * @throws {ItemErrorFactory} Si l'entité est introuvable ou si le contrôle d'accès échoue
   * @returns {Promise<Item>} L'entité de la pépite mise à jour
   */
  /**
   * 🎛️ Applique des corrections ou modifications sur une pépite existante.
   * [SCELLÉ PURIFICATION V4] Mutation atomique sans double lecture réseau préventive, zéro as any [1.1].
   *
   * @public
   * @async
   * @param {string} p_sUserId - La primitive de l'identifiant de l'auteur de la modification
   * @param {string} p_sItemId - La primitive de l'identifiant de la pépite à modifier
   * @param {UpdateItemDto} p_oDto - L'objet de transfert contenant les révisions à appliquer
   * @throws {ItemErrorFactory} Si l'entité est introuvable ou si le contrôle d'accès échoue
   * @returns {Promise<Item>} L'entité de la pépite mise à jour
   */
  public async update(p_sUserId: string, p_sItemId: string, p_oDto: UpdateItemDto): Promise<Item> {
    const l_axUserMetierId = new UserId(p_sUserId);
    const l_axItemMetierId = new ItemId(p_sItemId);

    const l_aRawUpdateTagIds       = p_oDto.tagIds || [];
    const l_aDomainTagIds: TagId[] = l_aRawUpdateTagIds.map((l_vId: unknown): TagId => new TagId(l_vId as string));

    if (p_oDto.tagIds !== undefined && l_aDomainTagIds.length > 0) {
      await this.validateTagOwnership(l_axUserMetierId, l_aDomainTagIds);
    }


    // 🛡️ Extraction explicite et chirurgicale, sans aucun type fantôme
    const l_oUpdates: Partial<IItemData> = {
      libelle       : p_oDto.libelle,
      slug          : p_oDto.slug,
      content       : p_oDto.content,
      auteurSource  : p_oDto.auteurSource,
      thumbnailUrl  : p_oDto.thumbnailUrl,
      // 💎 Double cast universel et sécurisé vers le type exact attendu par l'interface
      metadata      : p_oDto.metadata as unknown as IItemData['metadata'],
      idUser        : l_axUserMetierId,
      contentTypeId : p_oDto.contentTypeId ? new ContentTypeId(p_oDto.contentTypeId) : undefined
    };


    // 💎 [RÉPARÉ V4] Alignement nominal sur .libelle au lieu de .title banni [1.1]
    if (p_oDto.libelle && !p_oDto.slug) {
      l_oUpdates.slug = SlugGenerator.generate(p_oDto.libelle);
    }

    // 🪓 [PERFORMANCE ÉLITE] : La fonction SQL valide l'existence et l'ownership en une seule transaction [1.1].
    const l_oUpdated: Item | null = await this.repository.update(l_axItemMetierId, l_oUpdates);
    if (!l_oUpdated) {
      throw ItemErrorFactory.notFound(l_axItemMetierId);
    }

    if (p_oDto.tagIds !== undefined) {
      // 🪓 ALIGNEMENT SOUVERAIN V4 : Passage obligatoire par l'accesseur privé this.itemTagRepository
      await this.itemTagRepository.sync(l_axItemMetierId, l_aDomainTagIds);
    }

    return l_oUpdated;
  }

  /**
   * 🗑️ Suppression destructive définitive d'une ressource.
   */
  public async delete(p_sUserId: string, p_sItemId: string): Promise<void> {
    const l_axUserMetierId = new UserId(p_sUserId);
    const l_axItemMetierId = new ItemId(p_sItemId);

    // 🪓 [RÉPARÉ] Plus besoin de faire un findById préventif encombrant [1.1].
    // Le double verrou de notre fonction SQL SupprimerPepite abat la ligne uniquement si l'ownership est légitime [1.1].
    const l_bDeleted: boolean = await this.repository.delete(l_axItemMetierId, l_axUserMetierId);
    if (!l_bDeleted) {
      throw ItemErrorFactory.notFound(l_axItemMetierId);
    }
  }
}
