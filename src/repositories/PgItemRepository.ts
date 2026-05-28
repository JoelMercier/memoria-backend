// ——— fichier : src/repositories/PgItemRepository.ts

import type { QueryResultRow } from 'pg';
import { BaseRepository } from '@/repositories/base/BaseRepository';
import { UserId, ItemId } from '@/domain/value-objects/IdMetier';
import { Item } from '@/entities/Item';
import { ContentType } from '@/constants/ContentType';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { ItemErrorFactory } from '@/exceptions/ItemErrorFactory';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import type { IItemListOptions, IItemListResult, IItemRepository } from '@/interfaces/repositories/IItemRepository';

interface IItemRow extends QueryResultRow {
  id_item: Buffer;
  user_id: Buffer;
  content_type: string;
  title: string;
  slug: string;
  content: string;
  source_author: string;
  thumbnail_url: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date | null;
}

/**
 * 🗄️ Classe PgItemRepository
 * ---------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Pépites.
 * Branche le flux binaire 128 bits pur sur les requêtes et l'indexation de la cour basse.
 *
 * @class PgItemRepository
 * @extends {BaseRepository}
 * @implements {IItemRepository}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class PgItemRepository extends BaseRepository implements IItemRepository {

  /** 🎛️ Connexion physique à l'infrastructure de données */
  private readonly db: IDatabaseConnection;

  /**
   * Initialise le dépôt avec sa connexion physique et hérite de l'usine binaire.
   *
   * @constructor
   */
  public constructor(db: IDatabaseConnection) {
    super();
    this.db = db;
  }

  /**
   * Mappe une ligne PostgreSQL brute (snake_case) vers une entité Item (camelCase).
   * Intègre le décabossage try/catch inconditionnel via la classe mère.
   *
   * @private
   */
  private rowToItem(row: IItemRow): Item {
    return new Item({
      idItem: this.toDomainId(row.id_item, ItemId),
      idUser: this.toDomainId(row.user_id, UserId),
      contentType: row.content_type as unknown as ContentType,
      title: row.title,
      slug: row.slug,
      content: row.content,
      sourceAuthor: row.source_author,
      thumbnailUrl: row.thumbnail_url,
      metadata: row.metadata,
      createdAt: row.created_at,
      updatedAt: row.updated_at ?? undefined
    });
  }

  /**
   * 🔍 Lecture chirurgicale : Localise une pépite via son identifiant nominal fort.
   *
   * @public
   * @async
   */
  public async findById(id: ItemId): Promise<Item | null> {
    try {
      const result = await this.db.query<IItemRow>(
        'SELECT * FROM items WHERE id_item = fn_bin_to_uuid($1)',
        [this.toBuffer(id)]
      );
      return result.rows[0] ? this.rowToItem(result.rows[0]) : null;
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findById', msg);
    }
  }

  /**
   * 🔍 Alignement nominal : Récupère une pépite par son permalien utilisateur.
   *
   * @public
   * @async
   */
  public async findBySlug(userId: UserId, slug: string): Promise<Item | null> {
    try {
      const result = await this.db.query<IItemRow>(
        'SELECT * FROM items WHERE user_id = fn_bin_to_uuid($1) AND slug = $2',
        [this.toBuffer(userId), slug]
      );
      return result.rows[0] ? this.rowToItem(result.rows[0]) : null;
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findBySlug', msg);
    }
  }

  /**
   * 🔍 Vérification anti-doublon : Localise un titre existant dans l'espace utilisateur.
   *
   * @public
   * @async
   */
  public async findByTitle(userId: UserId, title: string): Promise<Item | null> {
    try {
      const result = await this.db.query<IItemRow>(
        'SELECT * FROM items WHERE user_id = fn_bin_to_uuid($1) AND title = $2',
        [this.toBuffer(userId), title]
      );
      return result.rows[0] ? this.rowToItem(result.rows[0]) : null;
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findByTitle', msg);
    }
  }

  /**
   * 📊 Pagination & Filtre : Énumère le coffre-fort d'un acteur de manière segmentée.
   *
   * @public
   * @async
   */
  public async listByUser(p_sUserId: UserId, options?: IItemListOptions): Promise<IItemListResult> {
    const limit: number = options?.limit ?? 20;
    const offset: number = options?.offset ?? 0;
    const conditions: string[] = ['user_id = fn_bin_to_uuid($1)'];
    const params: unknown[] = [this.toBuffer(p_sUserId)];

    if (options?.contentType) {
      params.push(options.contentType);
      conditions.push(`content_type = $${params.length}`);
    }
    if (options?.search) {
      params.push(`%${options.search}%`);
      conditions.push(`title ILIKE $${params.length}`);
    }
    const whereClause: string = conditions.join(' AND ');

    try {
      const itemsResult = await this.db.query<IItemRow>(
        `SELECT * FROM items WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      );
      const countResult = await this.db.query<{ count: string } & QueryResultRow>(
        `SELECT COUNT(*)::text AS count FROM items WHERE ${whereClause}`,
        params
      );
      return {
        items: itemsResult.rows.map((row): Item => this.rowToItem(row)),
        total: Number(countResult.rows[0]?.count ?? 0)
      };
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('listByUser', msg);
    }
  }

  /**
   * 🪓 Écriture concrète : Insère une pépite en base de données via le soupirail binaire.
   *
   * @public
   * @async
   */
  public async create(data: IItemData): Promise<Item> {
    try {
      const result = await this.db.query<IItemRow>(
        `INSERT INTO items
           (user_id, content_type, title, slug, content, source_author, thumbnail_url, metadata)
         VALUES (fn_bin_to_uuid($1), $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          this.toBuffer(data.idUser), // Correction : Extraction de la bonne propriété métier d'IItemData
          data.contentType,
          data.title,
          data.slug,
          data.content,
          data.sourceAuthor,
          data.thumbnailUrl ?? null,
          data.metadata
        ]
      );
      const row = result.rows[0];
      if (!row) throw ItemErrorFactory.creation('No row returned from INSERT');
      return this.rowToItem(row);
    } catch (err) {
      if (err instanceof ItemErrorFactory) throw err;
      const msg: string = err instanceof Error ? err.message : 'unknown';
      if (msg.includes('unique_user_item_title')) {
        throw ItemErrorFactory.titleExists(data.idUser, data.title);
      }
      if (msg.includes('unique_user_item_slug')) {
        throw ItemErrorFactory.slugExists(data.idUser, data.slug);
      }
      throw ItemErrorFactory.creation(msg);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles du Domaine.
   *
   * @public
   * @async
   */
  public async update(id: ItemId, data: Partial<IItemData>): Promise<Item> {
    const fields: string[] = [];
    const params: unknown[] = [];
    let i: number = 1;

    const columnMap: Record<string, string> = {
      contentType: 'content_type',
      title: 'title',
      slug: 'slug',
      content: 'content',
      sourceAuthor: 'source_author',
      thumbnailUrl: 'thumbnail_url',
      metadata: 'metadata'
    };

    for (const [key, col] of Object.entries(columnMap)) {
      const value: unknown = (data as Record<string, unknown>)[key];
      if (value !== undefined) {
        fields.push(`${col} = $${i++}`);
        params.push(value);
      }
    }

    if (fields.length === 0) {
      const existing = await this.findById(id);
      if (!existing) throw ItemErrorFactory.notFound(id);
      return existing;
    }

    params.push(this.toBuffer(id));

    try {
      const result = await this.db.query<IItemRow>(
        `UPDATE items SET ${fields.join(', ')} WHERE id_item = fn_bin_to_uuid($${i}) RETURNING *`,
        params
      );
      const row = result.rows[0];
      if (!row) throw ItemErrorFactory.notFound(id);
      return this.rowToItem(row);
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('update', msg);
    }
  }

  /**
   * 🪓 Destruction atomique : Supprime une pépite du donjon physique.
   *
   * @public
   * @async
   */
  public async delete(id: ItemId): Promise<boolean> {
    try {
      const result = await this.db.query('DELETE FROM items WHERE id_item = fn_bin_to_uuid($1)', [this.toBuffer(id)]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('delete', msg);
    }
  }

    /**
   * 📜 Contrat d'infrastructure : Récupère l'intégralité absolue des lignes.
   * Requis par IBaseRepository dont hérite IItemRepository.
   *
   * @public
   * @async
   * @returns {Promise<Item[]>} Le catalogue complet des pépites du donjon
   */
  public async findAll(): Promise<Item[]> {
    try {
      const result = await this.db.query<IItemRow>('SELECT * FROM items ORDER BY created_at DESC');
      return result.rows.map((row) => this.rowToItem(row));
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findAll', msg);
    }
  }
}
