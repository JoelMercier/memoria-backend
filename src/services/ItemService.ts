// ——— fichier : src/services/ItemService.ts

import type { CreateItemDto } from '@/dto/item/CreateItemDto';
import type { UpdateItemDto } from '@/dto/item/UpdateItemDto';

import type { ITagRepository } from '@/interfaces/repositories/PostGres/ITagRepository';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import type { IItemTagRepository } from '@/interfaces/repositories/PostGres/IItemTagRepository';
import type { IItemService } from '@/interfaces/services/IItemService';
import type {
  IItemRepository,
  IItemRepositoryListOptions
} from '@/interfaces/repositories/PostGres/IItemRepository';
import type { IListResult } from '@/interfaces/shared/IListResult';
import type { Item } from '@/entities/Item';
import { IdForge } from '@/domain/utils/IdForge';
import { UserId, ItemId, TagId, ContentTypeId } from '@/domain/value-objects/ids';
import { TagErrorFactory } from '@/exceptions/TagErrorFactory';
import { ItemErrorFactory } from '@/exceptions/ItemErrorFactory';
import { SlugGenerator } from '@/utils/SlugGenerator';
import { OrdreTriEnum } from '@/constants/OrdreTriEnum';

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
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class ItemService implements IItemService {
  /** 🗄️ Le dépôt d'infrastructure principal des Pépites */
  private readonly m_rItemRepository: IItemRepository;

  /** 🗄️ Le dépôt d'infrastructure pivot des liaisons d'Étiquettes */
  private readonly m_rItemTagRepository: IItemTagRepository;

  /** 🗄️ Le dépôt d'infrastructure souverain des Étiquettes */
  private readonly m_rTagRepository: ITagRepository; // 🪓 [INJECTÉ V4]

  /**
   * @constructor
   */
  public constructor(
    p_oItemRepository: IItemRepository,
    p_oItemTagRepository: IItemTagRepository,
    p_oTagRepository: ITagRepository // 🪓 Triple alimentation par la Forge [Mémoria]
  ) {
    this.m_rItemRepository = p_oItemRepository;
    this.m_rItemTagRepository = p_oItemTagRepository;
    this.m_rTagRepository = p_oTagRepository;
  }

  /**
   * Accesseur unique exigé par le contrat ancêtre IBaseService.
   * Centralise la souveraineté d'accès au dépôt d'infrastructure associé.
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
  } /**
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
      LigneDebut: p_oOptions.LigneDebut,
      NbLignesDem: p_oOptions.NbLignes,
      NbLignesRenv: l_oResultatSoute.NbLignesRenv,
      NbLignesTotal: l_oResultatSoute.NbLignesTotal,
      Lignes: l_oResultatSoute.Lignes
    };

    return Object.freeze(l_oPackagePagine);
  }

  /**
   * 🛡️ Sécurité Nominale : Valide l'existence et l'ownership légitime d'une collection d'étiquettes.
   *
   * @private
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur formulant la demande
   * @param {ReadonlyArray<TagId>} p_aTagIds - Le tableau ordonné des identifiants uniques de tags à vérifier
   * @throws {TagErrorFactory} Si un tag est introuvable ou n'appartient pas à l'appelant
   * @returns {Promise<void>}
   */

  /**
   * 🛡️ Sécurité Nominale : Valide l'existence et l'ownership légitime d'une collection d'étiquettes.
   */
  private async validateTagOwnership(
    p_axUserId: UserId,
    p_aTagIds: ReadonlyArray<TagId>
  ): Promise<void> {
    const l_oGabaritLot = {
      NbLignes: p_aTagIds.length,
      LigneDebut: 0,
      ColonneTri: 'tgName',
      OrdreAff: OrdreTriEnum.DeCode<OrdreTriEnum>('ASC')
    };

    // 🪓 PURIFICATION TOTALE : Appel de la vraie méthode du dépôt des TAGS via son accesseur propre, sans aucun any !
    const l_oResultatLot = await this.tagRepository.findByIds(p_aTagIds, l_oGabaritLot);
    const l_aTags = l_oResultatLot.Lignes;

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
    const l_sSlug: string = p_oDto.slug ?? SlugGenerator.generate(p_oDto.title);

    // 🪓 ALIGNEMENT SOUVERAIN V4 : Passage obligatoire par l'accesseur public this.repository
    const l_oExistingSlug: Item | null = await this.repository.findBySlug(
      l_axUserMetierId,
      l_sSlug
    );
    if (l_oExistingSlug) throw ItemErrorFactory.slugExists(l_axUserMetierId, l_sSlug);

    const l_oExistingTitle: Item | null = await this.repository.findByTitle(
      l_axUserMetierId,
      p_oDto.title
    );
    if (l_oExistingTitle) throw ItemErrorFactory.titleExists(l_axUserMetierId, p_oDto.title);

    const l_aRawTagIds = p_oDto.tagIds || [];
    const l_aDomainTagIds: TagId[] = l_aRawTagIds.map(
      (l_vId: unknown): TagId => new TagId(l_vId as string)
    );

    if (l_aDomainTagIds.length > 0) {
      await this.validateTagOwnership(l_axUserMetierId, l_aDomainTagIds);
    }

    const l_oData: IItemData = {
      idItem: new ItemId(IdForge.genererUuidV7()),
      idUser: l_axUserMetierId,
      contentTypeId: new ContentTypeId(p_oDto.contentType.code.toString()),
      title: p_oDto.title,
      slug: l_sSlug,
      content: p_oDto.content,
      sourceAuthor: p_oDto.sourceAuthor,
      thumbnailUrl: p_oDto.thumbnailUrl,
      metadata: p_oDto.metadata,
      createdAt: new Date()
    };

    const l_oItem: Item = await this.repository.create(l_oData);

    if (l_aDomainTagIds.length > 0) {
      // 🪓 Passage obligatoire par l'accesseur privé this.itemTagRepository
      await this.itemTagRepository.sync(l_oItem.idItem, l_aDomainTagIds);
    }

    return l_oItem;
  }
  /**
   * 🔎 Récupère une pépite par sa clé primaire après validation de l'ownership.
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

    // 🪓 Passage obligatoire par l'accesseur public this.repository
    const l_oItem: Item | null = await this.repository.findById(l_axItemMetierId);
    if (!l_oItem) throw ItemErrorFactory.notFound(l_axItemMetierId);

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
    if (!l_oItem) throw ItemErrorFactory.notFound(new ItemId(p_sSlug));

    return l_oItem;
  }

  /**
   * 🎛️ Applique des corrections ou modifications sur une pépite existante.
   * [SCELLÉ PURIFICATION V4] Éradication complète des "any" et des "delete" sauvages.
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

    // 🪓 ALIGNEMENT SOUVERAIN V4 : Passage obligatoire par l'accesseur public this.repository
    const l_oExisting: Item | null = await this.repository.findById(l_axItemMetierId);
    if (!l_oExisting) throw ItemErrorFactory.notFound(l_axItemMetierId);

    if (!l_oExisting.idUser.estEgalA(l_axUserMetierId)) {
      throw ItemErrorFactory.accessDenied(l_axItemMetierId, l_axUserMetierId);
    }

    const l_aRawUpdateTagIds = p_oDto.tagIds || [];
    const l_aDomainTagIds: TagId[] = l_aRawUpdateTagIds.map(
      (l_vId: unknown): TagId => new TagId(l_vId as string)
    );

    if (p_oDto.tagIds !== undefined && l_aDomainTagIds.length > 0) {
      await this.validateTagOwnership(l_axUserMetierId, l_aDomainTagIds);
    }

    // 🪓 [RÉPARÉ V4] Déstructuration propre : On extrait proprement tagIds sous un alias neutre pour l'isoler
    const { tagIds: _purg, ...l_oUpdatesData } = p_oDto;

    // Raccordement direct sur le type d'infrastructure via Omit structurel strict pour satisfaire ESLint
    const l_oUpdates: Partial<IItemData> = l_oUpdatesData;

    if (p_oDto.title && !p_oDto.slug) {
      l_oUpdates.slug = SlugGenerator.generate(p_oDto.title);
    }

    // 🪓 ALIGNEMENT SOUVERAIN V4 : Passage obligatoire par l'accesseur public this.repository
    const l_oUpdated: Item | null = await this.repository.update(l_axItemMetierId, l_oUpdates);
    if (!l_oUpdated) throw ItemErrorFactory.notFound(l_axItemMetierId);

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

    // 🪓 ALIGNEMENT SOUVERAIN V4 : Passage obligatoire par l'accesseur public this.repository
    const l_oExisting: Item | null = await this.repository.findById(l_axItemMetierId);
    if (!l_oExisting) throw ItemErrorFactory.notFound(l_axItemMetierId);

    if (!l_oExisting.idUser.estEgalA(l_axUserMetierId)) {
      throw ItemErrorFactory.accessDenied(l_axItemMetierId, l_axUserMetierId);
    }

    const l_bDeleted: boolean = await this.repository.delete(l_axItemMetierId);
    if (!l_bDeleted) throw ItemErrorFactory.notFound(l_axItemMetierId);
  }
}
