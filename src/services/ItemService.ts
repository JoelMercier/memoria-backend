// ——— fichier : src/services/ItemService.ts

import { randomUUID } from 'node:crypto';
import { UserId, ItemId, TagId } from '@/domain/value-objects/IdMetier';
import { Item } from '@/entities/Item';
import { Tag } from '@/entities/Tag';
import { ItemErrorFactory } from '@/exceptions/ItemErrorFactory';
import { TagErrorFactory } from '@/exceptions/TagErrorFactory';
import type { CreateItemDto } from '@/dto/item/CreateItemDto';
import type { UpdateItemDto } from '@/dto/item/UpdateItemDto';
import type { IItem } from '@/interfaces/entities/item/IItem';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import type { IItemRepository, IItemListOptions, IItemListResult } from '@/interfaces/repositories/IItemRepository';
import type { IItemTagRepository } from '@/interfaces/repositories/IItemTagRepository';
import type { ITagRepository } from '@/interfaces/repositories/ITagRepository';
import type { IItemService } from '@/interfaces/services/IItemService';
import { SlugGenerator } from '@/utils/SlugGenerator';

/**
 * 🏛️ Classe ItemService
 * ---------------------
 * Service de domaine orchestrant le cycle de vie métier complet des Pépites (Items).
 * Supervise les contrôles de propriété, l'unicité des ressources et la synchronisation des étiquettes.
 *
 * @class ItemService
 * @implements {IItemService}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class ItemService implements IItemService {

  private readonly itemRepository : IItemRepository;
  private readonly itemTagRepository : IItemTagRepository;
  private readonly tagRepository : ITagRepository;

  /**
   * Initialise le cas d'usage par injection d'abstractions de dépôts.
   *
   * @constructor
   */
  public constructor(
    itemRepository : IItemRepository,
    itemTagRepository : IItemTagRepository,
    tagRepository : ITagRepository
  ) {
    this.itemRepository = itemRepository;
    this.itemTagRepository = itemTagRepository;
    this.tagRepository = tagRepository;
  }

  /**
   * 🛡️ Sécurité Nominale : Valide l'existence et l'ownership légitime d'une collection d'étiquettes.
   *
   * @private
   * @async
   */
  private async validateTagOwnership(userId: UserId, tagIds: ReadonlyArray<TagId>): Promise<void> {
    const tags : Tag[] = await this.tagRepository.findByIds(tagIds);

    if (tags.length !== tagIds.length) {
      throw TagErrorFactory.notFound(new TagId('un ou plusieurs tags'));
    }

    for (const tag of tags) {
      if (tag.getUserId().valeur !== userId.valeur) {
        throw TagErrorFactory.accessDenied(tag.getTagId(), userId);
      }
    }

  }

  /**
   * 🔔 Engendre et persiste une nouvelle Pépite après vérification rigoureuse des doublons.
   *
   * @public
   * @async
   */
  public async create(userId: string, dto: CreateItemDto): Promise<IItem> {
    const userMetierId = new UserId(userId);
    const slug : string = dto.slug ?? SlugGenerator.generate(dto.title);

    const existingSlug : Item | null = await this.itemRepository.findBySlug(userMetierId, slug);
    if (existingSlug) throw ItemErrorFactory.slugExists(userMetierId, slug);

    const existingTitle : Item | null = await this.itemRepository.findByTitle(userMetierId, dto.title);
    if (existingTitle) throw ItemErrorFactory.titleExists(userMetierId, dto.title);

    const rawTagIds = dto.tagIds || [];
    const domainTagIds : TagId[] = rawTagIds.map((id: unknown): TagId => new TagId(id as string));

    if (domainTagIds.length > 0) {
      await this.validateTagOwnership(userMetierId, domainTagIds);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL : Création propre de la pépite via crypto native
    const data : IItemData = {
      idItem       : new ItemId(randomUUID()),
      idUser       : userMetierId,
      contentType  : dto.contentType,
      title        : dto.title,
      slug         : slug,
      content      : dto.content,
      sourceAuthor : dto.sourceAuthor,
      thumbnailUrl : dto.thumbnailUrl,
      metadata     : dto.metadata
    };

    const item : Item = await this.itemRepository.create(data);

    if (domainTagIds.length > 0) {
      await this.itemTagRepository.sync(item.getItemId(), domainTagIds);
    }

    return item;
  }

  /**
   * 🔎 Récupère une pépite par sa clé primaire après validation de l'ownership.
   *
   * @public
   * @async
   */
  public async findById(userId: string, itemId: string): Promise<IItem> {
    const userMetierId = new UserId(userId);
    const itemMetierId = new ItemId(itemId);

    const item : Item | null = await this.itemRepository.findById(itemMetierId);
    if (!item) throw ItemErrorFactory.notFound(itemMetierId);

    if (item.getUserId().valeur !== userMetierId.valeur) {
      throw ItemErrorFactory.accessDenied(itemMetierId, userMetierId);
    }

    return item;
  }

  /**
   * 🛤️ Localise et extrait une pépite via son permalien (Slug).
   *
   * @public
   * @async
   */
  public async findBySlug(userId: string, slug: string): Promise<IItem> {
    const userMetierId = new UserId(userId);
    const item : Item | null = await this.itemRepository.findBySlug(userMetierId, slug);
    if (!item) throw ItemErrorFactory.notFound(new ItemId(slug));

    return item;
  }

  /**
   * 📜 Extrait la liste complète ou paginée des ressources d'un utilisateur.
   *
   * @public
   * @async
   */
  public async listByUser(userId: string, options?: IItemListOptions): Promise<IItemListResult> {
    const userMetierId = new UserId(userId);
    return await this.itemRepository.listByUser(userMetierId, options);
  }

  /**
   * 🎛️ Applique des révisions partielles ou totales sur une pépite existante.
   *
   * @public
   * @async
   */
  public async update(userId: string, itemId: string, dto: UpdateItemDto): Promise<IItem> {
    const userMetierId = new UserId(userId);
    const itemMetierId = new ItemId(itemId);

    const existing : Item | null = await this.itemRepository.findById(itemMetierId);
    if (!existing) throw ItemErrorFactory.notFound(itemMetierId);

    if (existing.getUserId().valeur !== userMetierId.valeur) {
      throw ItemErrorFactory.accessDenied(itemMetierId, userMetierId);
    }

    const rawUpdateTagIds = dto.tagIds || [];
    const domainTagIds : TagId[] = rawUpdateTagIds.map((id: unknown): TagId => new TagId(id as string));

    if (dto.tagIds !== undefined && domainTagIds.length > 0) {
      await this.validateTagOwnership(userMetierId, domainTagIds);
    }

    const updates : Partial<IItemData> = { ...dto } as any;
    delete (updates as any).tagIds;

    if (dto.title && !dto.slug) {
      updates.slug = SlugGenerator.generate(dto.title);
    }

    const updated : Item | null = await this.itemRepository.update(itemMetierId, updates);
    if (!updated) throw ItemErrorFactory.notFound(itemMetierId);

    if (dto.tagIds !== undefined) {
      await this.itemTagRepository.sync(itemMetierId, domainTagIds);
    }

    return updated;
  }

  /**
   * 🗑️ Suppression destructive définitive d'une ressource.
   *
   * @public
   * @async
   */
  public async delete(userId: string, itemId: string): Promise<void> {
    const userMetierId = new UserId(userId);
    const itemMetierId = new ItemId(itemId);

    const existing : Item | null = await this.itemRepository.findById(itemMetierId);
    if (!existing) throw ItemErrorFactory.notFound(itemMetierId);

    if (existing.getUserId().valeur !== userMetierId.valeur) {
      throw ItemErrorFactory.accessDenied(itemMetierId, userMetierId);
    }

    const deleted : boolean = await this.itemRepository.delete(itemMetierId);
    if (!deleted) throw ItemErrorFactory.notFound(itemMetierId);
  }
}
