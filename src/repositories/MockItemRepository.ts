// ——— fichier : src\repositories\MockItemRepository.ts

import { Item } from '@/entities/Item';
import { ItemId, UserId } from '@/domain/value-objects/IdMetier';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import type {
  IItemListOptions,
  IItemListResult,
  IItemRepository
} from '@/interfaces/repositories/IItemRepository';

export class MockItemRepository implements IItemRepository {
  private items: Item[] = [];

  // 🪓 ALIGNEMENT INDUSTRIEL : Les identifiants sont désormais des Value Objects nominalisés
  public async findById(id: ItemId): Promise<Item | null> {
    return this.items.find((i): boolean => i.getItemId().valeur === id.valeur) ?? null;
  }

  public async findBySlug(userId: UserId, slug: string): Promise<Item | null> {
    return (
      this.items.find((i): boolean => i.getUserId().valeur === userId.valeur && i.getSlug() === slug) ?? null
    );
  }

  public async findByTitle(userId: UserId, title: string): Promise<Item | null> {
    return (
      this.items.find(
        (i): boolean =>
          i.getUserId().valeur === userId.valeur && i.getTitle().toLowerCase() === title.toLowerCase()
      ) ?? null
    );
  }

  public async listByUser(userId: UserId, options?: IItemListOptions): Promise<IItemListResult> {
    let filtered: Item[] = this.items.filter((i): boolean => i.getUserId().valeur === userId.valeur);
    if (options?.contentType) {
      filtered = filtered.filter((i): boolean => String(i.getContentType()) === options.contentType);
    }
    if (options?.search) {
      const q: string = options.search.toLowerCase();
      filtered = filtered.filter((i): boolean => i.getTitle().toLowerCase().includes(q));
    }
    const total: number = filtered.length;
    const offset: number = options?.offset ?? 0;
    const limit: number = options?.limit ?? 20;
    return { items: filtered.slice(offset, offset + limit), total };
  }

  public async create(data: IItemData): Promise<Item> {
    // L'ID est déjà forgé par le service sous forme d'ItemId dans l'objet data
    const item = new Item({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.items.push(item);
    return item;
  }
  public async update(id: ItemId, data: Partial<IItemData>): Promise<Item> {
    const idx: number = this.items.findIndex((i): boolean => i.getItemId().valeur === id.valeur);
    if (idx === -1) {
      // Respect strict de la signature IItemRepository qui interdit le retour "null"
      throw new Error(`Item with ID ${id.valeur} not found for update`);
    }
    const current: IItemData = this.items[idx].toData();
    const updated = new Item({
      ...current,
      ...data,
      idItem: id,
      updatedAt: new Date()
    });
    this.items[idx] = updated;
    return updated;
  }

  public async delete(id: ItemId): Promise<boolean> {
    const before: number = this.items.length;
    this.items = this.items.filter((i): boolean => i.getItemId().valeur !== id.valeur);
    return this.items.length < before;
  }

  /**
   * 🪓 ALIGNEMENT CONTRAT BASE : Extrait l'intégralité absolue de la table de simulation.
   * Requis par l'héritage strict de IBaseRepository.
   *
   * @public
   * @async
   * @returns {Promise<Item[]>} Le catalogue complet des pépites sans aucun filtrage.
   */
  public async findAll(): Promise<Item[]> {
    return [...this.items];
  }

}
