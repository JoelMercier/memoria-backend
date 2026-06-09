// ——— fichier : src/infrastructure/repositories/ItemRepository.ts

import type { QueryResult,
              QueryResultRow       } from 'pg';
import      { BaseRepository       } from '@/infrastructure/repositories/BaseRepositories';
import      { UserId, ItemId, ContentTypeId       } from '@/domain/value-objects/ids';
import      { Item                 } from '@/entities/Item';
import      { ContentType          } from '@/constants/ContentType';
import      { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import      { ItemErrorFactory     } from '@/exceptions/ItemErrorFactory';
import type { IDatabaseConnection  } from '@/interfaces/database/IDatabaseConnection';
import type { IItemData            } from '@/interfaces/entities/item/IItemData';
import type { IItemListOptions,
              IItemListResult,
              IItemRepository      } from '@/interfaces/repositories/IItemRepository';

/**
 * 🗄️ Interface interne calée au bit près sur le stockage physique décroissant de la table "Items"
 */
interface IItemRow extends QueryResultRow {
  itIdItem        : Buffer;
  itUserId         : Buffer;
  itCreatedAt      : Date;
  itUpdatedAt      : Date | null;
  itContentTypeId  : string;
  itTitle          : string;
  itSlug           : string;
  itContent        : string;
  itSourceAuthor   : string;
  itThumbnailUrl   : string | null;
  itMetadata       : Record<string, unknown>;
}

/**
 * 🗄️ Classe ItemRepository
 * ---------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Pépites.
 * Branche le flux binaire 128 bits pur sur les requêtes et l'indexation de la cour basse.
 *
 * @class ItemRepository
 * @extends {BaseRepository}
 * @implements {IItemRepository}
 * @author Vision : Joël (Architecte DR-DOS)
 * @author Frapperie du code : Gaïa (Gardienne du feu binaire)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export class ItemRepository extends BaseRepository implements IItemRepository {
  /** 🎛️ Connexion physique à l'infrastructure de données de Cour Basse */

  /**
   * Initialise le dépôt avec sa connexion physique et hérite de l'usine binaire.
   *
   * @constructor
   */
  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);

  }

  /**
   * Mappe une ligne PostgreSQL brute (snake_case) vers une entité Item (camelCase).
   *
   * @private
   */
  private rowToItem(row: IItemRow): Item {
    return new Item({
      idItem        : this.toDomainId(row.itIdItem, ItemId),
      idUser        : this.toDomainId(row.itUserId, UserId),
      contentTypeId : new ContentTypeId(row.itContentTypeId),
      title         : row.itTitle,
      slug          : row.itSlug,
      content       : row.itContent,
      sourceAuthor  : row.itSourceAuthor,
      thumbnailUrl  : row.itThumbnailUrl,
      metadata      : row.itMetadata,
      createdAt     : row.itCreatedAt,
      updatedAt     : row.itUpdatedAt ?? new Date() // Cordon sanitaire temporel
    });
  }


  /**
   * Transforme un jeu de résultats SQL complet en tableau d'entités métiers.
   *
   * @private
   */
  private rowsToItems(result: QueryResult<IItemRow>): Item[] {
    return result.rows.map((row) => this.rowToItem(row));
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
        'Select * From "Items" Where "itIdItem" = $1',
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
        'Select * From "Items" Where "itUserId" = $1 and "itSlug" = $2',
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
        'Select * From "Items" Where "itUserId" = $1 and "itTitle" = $2',
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
    const conditions: string[] = ['"itUserId" = $1'];
    const params: unknown[] = [this.toBuffer(p_sUserId)];

    if (options?.contentType) {
      // Correction chirurgicale : injection directe de la chaîne primitive sans .code
      // Extraction d'acier du code technique ('ARTI', 'BOOK') depuis le Smart Enum typé
      params.push(options.contentType.code);
      conditions.push(`"itContentTypeId" = $${params.length}`);
    }
    if (options?.search) {
      params.push(`%${options.search}%`);
      conditions.push(`"itTitle" ilike $${params.length}`);
    }

    const l_iIdxLimit = params.length + 1;
    const l_iIdxOffset = params.length + 2;

    try {
      const itemsResult = await this.db.query<IItemRow>(
        `Select * From "Items" Where ${conditions.join(' and ')} Order By "itCreatedAt" Desc Limit $${l_iIdxLimit} Offset $${l_iIdxOffset}`,
        [...params, limit, offset]
      );
      const countResult = await this.db.query<{ count: string } & QueryResultRow>(
        `Select Count(*)::text as count From "Items" Where ${conditions.join(' and ')}`,
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
      const l_binIdItem = this.toBuffer(data.idItem);

      const result = await this.db.query<IItemRow>(
        `Insert Into "Items"
           ("itIdItem", "itUserId", "itContentTypeId", "itTitle", "itSlug", "itContent", "itSourceAuthor", "itThumbnailUrl", "itMetadata")
         Values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         returning *`,
        [
          l_binIdItem,
          this.toBuffer(data.idUser),
          data.contentTypeId.code,
          data.title,
          data.slug,
          data.content,
          data.sourceAuthor,
          data.thumbnailUrl ?? null,
          data.metadata ?? {}
        ]
      );
      const row = result.rows[0];
      if (!row) throw ItemErrorFactory.creation('No row returned from INSERT');
      return this.rowToItem(row);
    } catch (err) {
      if (err instanceof ItemErrorFactory) throw err;
      const msg: string = err instanceof Error ? err.message : 'unknown';
      if (msg.includes('Items_itUserId_itTitle_Udx')) {
        throw ItemErrorFactory.titleExists(data.idUser, data.title);
      }
      if (msg.includes('Items_itUserId_itSlug_Udx')) {
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
      contentType: '"itContentTypeId"',
      title: '"itTitle"',
      slug: '"itSlug"',
      content: '"itContent"',
      sourceAuthor: '"itSourceAuthor"',
      thumbnailUrl: '"itThumbnailUrl"',
      metadata: '"itMetadata"'
    };

    for (const [key, col] of Object.entries(columnMap)) {
      const value: unknown = (data as Record<string, unknown>)[key];
      if (value !== undefined) {
        fields.push(`${col} = $${i++}`);
        // Forçage de l extraction du code pour le SmartEnum ContentType
        params.push(value instanceof ContentType ? value.code : value);
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
        `Update "Items" Set ${fields.join(', ')} Where "itIdItem" = $${i} returning *`,
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
      const result = await this.db.query('Delete From "Items" Where "itIdItem" = $1', [this.toBuffer(id)]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('delete', msg);
    }
  }

  /**
   * 📜 Contrat d'infrastructure : Récupère l'intégralité absolue des lignes.
   *
   * @public
   * @async
   */
  public async findAll(): Promise<Item[]> {
    try {
      const result = await this.db.query<IItemRow>('Select * From "Items" Order By "itCreatedAt" Desc');
      return this.rowsToItems(result);
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findAll', msg);
    }
  }
}
