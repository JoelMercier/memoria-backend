// ——— fichier : src/repositories/PgShareRepository.ts

import type { QueryResultRow } from 'pg';
import { BaseRepository } from '@/repositories/base/BaseRepository';
import { UserId, ItemId, ShareId } from '@/domain/value-objects/IdMetier';
import { Share } from '@/entities/Share';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { ShareErrorFactory } from '@/exceptions/ShareErrorFactory';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IAccessConfig } from '@/interfaces/entities/share/IAccessConfig';
import type { IShareData } from '@/interfaces/entities/share/IShareData';
import type { IShareRepository } from '@/interfaces/repositories/IShareRepository';

interface IShareRow extends QueryResultRow {
  id_share        : Buffer;
  item_id         : Buffer;
  recipient_email : string | null;
  share_token     : string;
  access_config   : IAccessConfig;
  created_at      : Date;
  updated_at      : Date | null;
}

/**
 * 🗄️ Classe PgShareRepository
 * ----------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Partages.
 * Branche le flux binaire 128 bits pur sur les jointures de la cour basse.
 *
 * @class PgShareRepository
 * @extends {BaseRepository}
 * @implements {IShareRepository}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class PgShareRepository extends BaseRepository implements IShareRepository {

  /** 🎛️ Connexion physique à l'infrastructure de données */
  private readonly db : IDatabaseConnection;

  /**
   * Initialise le dépôt de partage et hérite de la classe mère.
   *
   * @constructor
   */
  public constructor(db: IDatabaseConnection) {
    super();
    this.db = db;
  }

  /**
   * Mappe une ligne PostgreSQL brute vers une entité typée Share.
   *
   * @private
   */
  private rowToShare(row: IShareRow): Share {
    return new Share({
      idShare: this.toDomainId(row.id_share, ShareId),
      itemId: this.toDomainId(row.item_id, ItemId),
      recipientEmail: row.recipient_email,
      shareToken: row.share_token,
      accessConfig: row.access_config,
      createdAt: row.created_at,
      updatedAt: row.updated_at ?? undefined
    });
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un partage via son identifiant nominal fort.
   *
   * @public
   * @async
   */
  public async findById(idShare: ShareId): Promise<Share | null> {
    try {
      const result = await this.db.query<IShareRow>(
        'SELECT * FROM shares WHERE id_share = fn_bin_to_uuid($1)',
        [this.toBuffer(idShare)]
      );
      return result.rows[0] ? this.rowToShare(result.rows[0]) : null;
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findById', msg);
    }
  }

  /**
   * 🔍 Alignement nominal : Récupère un privilège d'accès via son jeton sécurisé.
   *
   * @public
   * @async
   */
  public async findByToken(token: string): Promise<Share | null> {
    try {
      const result = await this.db.query<IShareRow>('SELECT * FROM shares WHERE share_token = $1', [token]);
      return result.rows[0] ? this.rowToShare(result.rows[0]) : null;
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findByToken', msg);
    }
  }
  /**
   * 🔍 Extraction ciblée : Récupère les partages attachés à une pépite.
   *
   * @public
   * @async
   */
  public async findByItemId(itemId: ItemId): Promise<Share[]> {
    try {
      const result = await this.db.query<IShareRow>(
        'SELECT * FROM shares WHERE item_id = fn_bin_to_uuid($1) ORDER BY created_at DESC',
        [this.toBuffer(itemId)]
      );
      return result.rows.map((row): Share => this.rowToShare(row));
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findByItemId', msg);
    }
  }

  /**
   * 🔍 Jointure croisée : Énumère les partages d'un utilisateur.
   *
   * @public
   * @async
   */
  public async findByUserId(userId: UserId): Promise<Share[]> {
    try {
      const result = await this.db.query<IShareRow>(
        `SELECT s.* FROM shares s
         INNER JOIN items i ON i.id_item = s.item_id
         WHERE i.user_id = fn_bin_to_uuid($1)
         ORDER BY s.created_at DESC`,
        [this.toBuffer(userId)]
      );
      return result.rows.map((row): Share => this.rowToShare(row));
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findByUserId', msg);
    }
  }

  /**
   * 🪓 Écriture concrète : Insère un nouveau droit de partage.
   *
   * @public
   * @async
   */
  public async create(data: IShareData): Promise<Share> {
    try {
      const result = await this.db.query<IShareRow>(
        `INSERT INTO shares (id_share, item_id, recipient_email, share_token, access_config)
         VALUES (fn_bin_to_uuid($1), fn_bin_to_uuid($2), $3, $4, $5::jsonb)
         RETURNING *`,
        [
          this.toBuffer(data.idShare),
          this.toBuffer(data.itemId), // 📥 Alignement IShareData
          data.recipientEmail,
          data.shareToken,
          JSON.stringify(data.accessConfig)
        ]
      );

      const row = result.rows[0];
      // 🪓 Fail-Fast académique !
      if (!row) throw ShareErrorFactory.creation('No row returned from INSERT in shares');

      return this.rowToShare(row);

    } catch (err) {
      if (err instanceof ShareErrorFactory) throw err;
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw ShareErrorFactory.creation(msg);
    }
  }

  /**
   * 🪓 Mutation dynamique : Modifie les configurations d'accès.
   *
   * @public
   * @async
   */
  public async update(idShare: ShareId, data: Partial<IShareData>): Promise<Share> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx: number = 1;

    if (data.recipientEmail !== undefined) {
      fields.push(`recipient_email = $${idx++}`);
      values.push(data.recipientEmail);
    }
    if (data.accessConfig !== undefined) {
      fields.push(`access_config = $${idx++}::jsonb`);
      values.push(JSON.stringify(data.accessConfig));
    }

    if (fields.length === 0) {
      const existing = await this.findById(idShare);
      if (!existing) throw ShareErrorFactory.notFound(idShare.valeur);
      return existing;
    }

    values.push(this.toBuffer(idShare));

    try {
      const result = await this.db.query<IShareRow>(
        `UPDATE shares SET ${fields.join(', ')} WHERE id_share = fn_bin_to_uuid($${idx}) RETURNING *`,
        values
      );
      const row = result.rows;
      if (!row) throw ShareErrorFactory.notFound(idShare.valeur); // 🪓 Fail-Fast académique !
      return this.rowToShare(row[0]);


    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.update', msg);
    }
  }

  /**
   * 🪓 Destruction atomique : Révoque définitivement un droit de partage.
   *
   * @public
   * @async
   */
  public async delete(id: ShareId): Promise<boolean> {
    try {
      const result = await this.db.query('DELETE FROM shares WHERE id_share = fn_bin_to_uuid($1)', [this.toBuffer(id)]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.delete', msg);
    }
  }

  /**
   * 📜 Contrat d'infrastructure : Récupère l'intégralité absolue des droits de partages.
   *
   * @public
   * @async
   */
  public async findAll(): Promise<Share[]> {
    try {
      const result = await this.db.query<IShareRow>('SELECT * FROM shares ORDER BY created_at DESC');
      return result.rows.map((row) => this.rowToShare(row));
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findAll', msg);
    }
  }
}
