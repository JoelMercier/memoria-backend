// ——— fichier : src/repositories/PgTagRepository.ts

import type { QueryResultRow } from 'pg';
import { BaseRepository } from '@/repositories/base/BaseRepository';
import { UserId, TagId } from '@/domain/value-objects/IdMetier';
import { Tag } from '@/entities/Tag';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { TagErrorFactory } from '@/exceptions/TagErrorFactory';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { ITagData } from '@/interfaces/entities/tag/ITagData';
import type { ITagRepository } from '@/interfaces/repositories/ITagRepository';

interface ITagRow extends QueryResultRow {
  id_tag     : Buffer;
  user_id    : Buffer;
  tag_name   : string;
  created_at : Date;
  updated_at : Date | null;
}

/**
 * 🗄️ Classe PgTagRepository
 * --------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Étiquettes.
 *
 * @class PgTagRepository
 * @extends {BaseRepository}
 * @implements {ITagRepository}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class PgTagRepository extends BaseRepository implements ITagRepository {

  private readonly db: IDatabaseConnection;

  public constructor(db: IDatabaseConnection) {
    super();
    this.db = db;
  }

  private rowToTag(row: ITagRow): Tag {
    return new Tag({
      idTag        : this.toDomainId(row.id_tag, TagId),
      userId    : this.toDomainId(row.user_id, UserId),
      tagName   : row.tag_name,
      createdAt : row.created_at,
      updatedAt : row.updated_at ?? undefined
    });
  }

  public async findById(idTag: TagId): Promise<Tag | null> {
    try {
      const result = await this.db.query<ITagRow>('SELECT * FROM tags WHERE id_tag = fn_bin_to_uuid($1)', [this.toBuffer(idTag)]);
      return result.rows[0] ? this.rowToTag(result.rows[0]) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('Tag.findById', err instanceof Error ? err.message : 'unknown');
    }
  }

  public async findByUserId(userId: UserId): Promise<Tag[]> {
    try {
      const result = await this.db.query<ITagRow>('SELECT * FROM tags WHERE user_id = fn_bin_to_uuid($1) ORDER BY tag_name ASC', [this.toBuffer(userId)]);
      return result.rows.map((row): Tag => this.rowToTag(row));
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('Tag.findByUserId', err instanceof Error ? err.message : 'unknown');
    }
  }

  public async findByName(userId: UserId, tagName: string): Promise<Tag | null> {
    try {
      const result = await this.db.query<ITagRow>(
        'SELECT * FROM tags WHERE user_id = fn_bin_to_uuid($1) AND LOWER(tag_name) = LOWER($2)',
        [this.toBuffer(userId), tagName]
      );
      return result.rows[0] ? this.rowToTag(result.rows[0]) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('Tag.findByName', err instanceof Error ? err.message : 'unknown');
    }
  }

  public async findByIds(ids: ReadonlyArray<TagId>): Promise<Tag[]> {
    if (ids.length === 0) return [];
    try {
      const binaryIds = ids.map(id => this.toBuffer(id));
      const result = await this.db.query<ITagRow>('SELECT * FROM tags WHERE id_tag = ANY($1::uuid[])', [binaryIds]);
      return result.rows.map((row): Tag => this.rowToTag(row));
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('Tag.findByIds', err instanceof Error ? err.message : 'unknown');
    }
  }

  public async create(data: ITagData): Promise<Tag> {
    try {
      const result = await this.db.query<ITagRow>(
        `INSERT INTO tags (user_id, tag_name) VALUES (fn_bin_to_uuid($1), $2) RETURNING *`,
        [this.toBuffer(data.userId), data.tagName]
      );
      const row = result.rows[0];
      if (!row) throw TagErrorFactory.creation('No row returned from INSERT');
      return this.rowToTag(row);
    } catch (err) {
      if (err instanceof TagErrorFactory) throw err;
      const msg = err instanceof Error ? err.message : 'unknown';
      if (msg.includes('unique_user_tag')) {
        throw TagErrorFactory.nameExists(data.userId, data.tagName);
      }
      throw TagErrorFactory.creation(msg);
    }
  }

  public async update(idTag: TagId, data: Partial<ITagData>): Promise<Tag> {
    if (data.tagName === undefined) {
      const existing = await this.findById(idTag);
      if (!existing) throw TagErrorFactory.notFound(idTag);
      return existing;
    }
    try {
      const result = await this.db.query<ITagRow>(
        'UPDATE tags SET tag_name = $1 WHERE id_tag = fn_bin_to_uuid($2) RETURNING *',
        [data.tagName, this.toBuffer(idTag)]
      );
      const row = result.rows[0];
      if (!row) throw TagErrorFactory.notFound(idTag);
      return this.rowToTag(row);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Tag.update', msg);
    }
  }

  public async delete(idTag: TagId): Promise<boolean> {
    try {
      const result = await this.db.query('DELETE FROM tags WHERE id_tag = fn_bin_to_uuid($1)', [this.toBuffer(idTag)]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('Tag.delete', err instanceof Error ? err.message : 'unknown');
    }
  }

  public async findAll(): Promise<Tag[]> {
    try {
      const result = await this.db.query<ITagRow>('SELECT * FROM tags ORDER BY tag_name ASC');
      return result.rows.map((row) => this.rowToTag(row));
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('Tag.findAll', err instanceof Error ? err.message : 'unknown');
    }
  }
}
