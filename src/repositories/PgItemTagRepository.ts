// ——— fichier : src/repositories/PgItemTagRepository.ts

import type { QueryResultRow } from 'pg';
import { BaseRepository } from '@/repositories/base/BaseRepository';
import { UserId, ItemId, TagId } from '@/domain/value-objects/IdMetier';
import { Tag } from '@/entities/Tag';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IItemTagRepository } from '@/interfaces/repositories/IItemTagRepository';

interface ITagRow extends QueryResultRow {
  id_tag     : Buffer;
  user_id    : Buffer;
  tag_name   : string;
  created_at : Date;
  updated_at : Date | null;
}

/**
 * 🗄️ Classe PgItemTagRepository
 * ------------------------------
 * Dépôt physique PostgreSQL administrant la table de liaison des étiquettes (ItemTags).
 * Branche le flux binaire 128 bits pur sur les jointures et indexations de la cour basse.
 *
 * @class PgItemTagRepository
 * @extends {BaseRepository}
 * @implements {IItemTagRepository}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class PgItemTagRepository extends BaseRepository implements IItemTagRepository {

  /** 🎛️ Connexion physique à l'infrastructure de données */
  private readonly db: IDatabaseConnection;

  /**
   * Initialise le dépôt de liaison et hérite des outils de conversion de la classe mère.
   *
   * @constructor
   */
  public constructor(db: IDatabaseConnection) {
    super();
    this.db = db;
  }

  /**
   * Mappe une ligne PostgreSQL brute vers une entité Tag propre.
   * Exploitera l'instanciation inconditionnelle de notre forge.
   *
   * @private
   */
  /**
   * Mappe une ligne PostgreSQL brute vers une entité Tag propre.
   * Exploitera l'instanciation inconditionnelle de notre forge.
   *
   * @private
   */
  private rowToTag(row: ITagRow): Tag {
    return new Tag({
      idTag     : this.toDomainId(row.id_tag, TagId),
      userId    : this.toDomainId(row.user_id, UserId),
      tagName   : row.tag_name,
      createdAt : row.created_at,
      updatedAt : row.updated_at ?? undefined
    });
  }

  /**
   * 🪓 Écriture concrète : Assigne une étiquette à une pépite via le soupirail binaire.
   *
   * @public
   * @async
   */
  public async add(itemId: ItemId, tagId: TagId): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO item_tags (id_item, id_tag) VALUES (fn_bin_to_uuid($1), fn_bin_to_uuid($2))
         ON CONFLICT (id_tag, id_item) DO NOTHING`,
        [this.toBuffer(itemId), this.toBuffer(tagId)]
      );
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.add', msg);
    }
  }

  /**
   * 🪓 Écriture concrète : Supprime l'association entre une pépite et une étiquette.
   *
   * @public
   * @async
   */
  public async remove(itemId: ItemId, tagId: TagId): Promise<boolean> {
    try {
      const result = await this.db.query(
        'DELETE FROM item_tags WHERE id_item = fn_bin_to_uuid($1) AND id_tag = fn_bin_to_uuid($2)',
        [this.toBuffer(itemId), this.toBuffer(tagId)]
      );
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.remove', msg);
    }
  }

  /**
   * 🪓 Transaction Commando : Synchronise la collection d'étiquettes d'une pépite (Rethrow C++ style).
   *
   * @public
   * @async
   */
  public async sync(itemId: ItemId, tagIds: ReadonlyArray<TagId>): Promise<void> {
    const pool = this.db.getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM item_tags WHERE id_item = fn_bin_to_uuid($1)', [this.toBuffer(itemId)]);

      if (tagIds.length > 0) {
        const placeholders: string = tagIds.map((_, i): string => `(fn_bin_to_uuid($1), fn_bin_to_uuid($${i + 2}))`).join(', ');
        await client.query(`INSERT INTO item_tags (id_item, id_tag) VALUES ${placeholders}`, [
          this.toBuffer(itemId),
          ...tagIds.map(t => this.toBuffer(t))
        ]);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK'); // Libération défensive de la transaction
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.sync', msg); // Rethrow
    } finally {
      client.release();
    }
  }

  /**
   * 🔍 Jointure chirurgicale : Extrait toutes les étiquettes rattachées à une pépite.
   *
   * @public
   * @async
   */
  public async findTagsForItem(itemId: ItemId): Promise<Tag[]> {
    try {
      const result = await this.db.query<ITagRow>(
        `SELECT t.id_tag, t.user_id, t.tag_name, t.created_at, t.updated_at
         FROM tags t
         INNER JOIN item_tags it ON it.id_tag = t.id_tag
         WHERE it.id_item = fn_bin_to_uuid($1)
         ORDER BY t.tag_name ASC`,
        [this.toBuffer(itemId)]
      );
      return result.rows.map((row): Tag => this.rowToTag(row));

    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.findTagsForItem', msg);
    }
  }

  /**
   * 🪓 Écriture concrète : Nettoie l'intégralité des étiquettes liées à une pépite.
   *
   * @public
   * @async
   */
  public async clearForItem(itemId: ItemId): Promise<void> {
    try {
      await this.db.query('DELETE FROM item_tags WHERE id_item = fn_bin_to_uuid($1)', [this.toBuffer(itemId)]);
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.clearForItem', msg);
    }
  }
}
