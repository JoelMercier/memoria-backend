// ——— fichier : src\repositories\MockTagRepository.ts

import { Tag } from '@/entities/Tag';
import { TagId, UserId } from '@/domain/value-objects/IdMetier';
import type { ITagData } from '@/interfaces/entities/tag/ITagData';
import type { ITagRepository } from '@/interfaces/repositories/ITagRepository';

export class MockTagRepository implements ITagRepository {
  private tags: Tag[] = [];

  public async findById(id: TagId): Promise<Tag | null> {
    // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation de getTagId() conforme à l'entité Tag
    return this.tags.find((t): boolean => t.getTagId().valeur === id.valeur) ?? null;
  }

  public async findByUserId(userId: UserId): Promise<Tag[]> {
    return this.tags.filter((t): boolean => t.getUserId().valeur === userId.valeur);
  }

  public async findByName(userId: UserId, tagName: string): Promise<Tag | null> {
    return (
      this.tags.find(
        (t): boolean =>
          t.getUserId().valeur === userId.valeur && t.getTagName().toLowerCase() === tagName.toLowerCase()
      ) ?? null
    );
  }

  public async findByIds(ids: ReadonlyArray<TagId>): Promise<Tag[]> {
    const stringIds = ids.map(id => id.valeur);
    return this.tags.filter((t): boolean => stringIds.includes(t.getTagId().valeur));
  }

  public async create(data: ITagData): Promise<Tag> {
    // L'ID est déjà forgé par le service sous forme de TagId dans l'objet data
    const tag = new Tag({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.tags.push(tag);
    return tag;
  }

  public async update(id: TagId, data: Partial<ITagData>): Promise<Tag> {
    const idx: number = this.tags.findIndex((t): boolean => t.getTagId().valeur === id.valeur);
    if (idx === -1) {
      throw new Error(`Tag with ID ${id.valeur} not found for update`);
    }
    const current: ITagData = this.tags[idx].toData();
    const updated = new Tag({
      ...current,
      ...data,
      idTag: id, // Alignement nominal sur le champ idTag attendu par l'ITagData
      updatedAt: new Date()
    });
    this.tags[idx] = updated;
    return updated;
  }

  public async delete(id: TagId): Promise<boolean> {
    const before: number = this.tags.length;
    this.tags = this.tags.filter((t): boolean => t.getTagId().valeur !== id.valeur);
    return this.tags.length < before;
  }

  /**
   * 🪓 ALIGNEMENT CONTRAT BASE : Extrait l'intégralité absolue de la table de simulation.
   * Requis par l'héritage strict de IBaseRepository via ITagRepository.
   */
  public async findAll(): Promise<Tag[]> {
    return [...this.tags];
  }
}
