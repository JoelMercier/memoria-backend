// ——— fichier : src/infrastructure/repositories/ShareRepository.ts

import type { QueryResult, QueryResultRow } from 'pg';
import { BaseRepository } from '@/infrastructure/repositories/BaseRepositories';
import { UserId, ItemId, ShareId } from '@/domain/value-objects/IdMetier';
import { Share } from '@/entities/Share';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { ShareErrorFactory } from '@/exceptions/ShareErrorFactory';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IAccessConfig } from '@/interfaces/entities/share/IAccessConfig';
import type { IShareData } from '@/interfaces/entities/share/IShareData';
import type { IShareRepository } from '@/interfaces/repositories/IShareRepository';

/**
 * 🗄️ Interface interne calée au bit près sur le stockage physique décroissant de la table "Shares"
 */
interface IShareRow extends QueryResultRow {
  shIdShare       : Buffer;
  shItemId        : Buffer;
  shCreatedAt      : Date;
  shUpdatedAt      : Date | null;
  shCourrielDest   : string | null;
  shJeton          : string;
  shConfiguration  : IAccessConfig;
}

/**
 * 🗄️ Classe PgShareRepository
 * ----------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Partages.
 * Branche le flux binaire 128 bits pur sur les jointures de la cour basse.
 *
 * @class ShareRepository
 * @extends {BaseRepository}
 * @implements {IShareRepository}
 *
 * @author Vision : Joël (Architecte DR-DOS)
 * @author Frapperie du code : Gaïa (Alchimiste des structures)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export class ShareRepository extends BaseRepository implements IShareRepository {
  /** 🎛️ Connexion physique à l'infrastructure de données */
  private readonly db : IDatabaseConnection;

  /**
   * Initialise le dépôt de partage et hérite de la classe mère.
   *
   * @constructor
   */
  public constructor(db: IDatabaseConnection) {
    super(db.getPool());
    this.db = db;
  }

  /**
   * Mappe une ligne PostgreSQL brute vers une entité typée Share.
   *
   * @private
   */
  private rowToShare(row: IShareRow): Share {
    return new Share({
      idShare         : this.toDomainId(row.shIdShare, ShareId),
      shIdShare       : this.toDomainId(row.shIdShare, ShareId),
      shItemId        : this.toDomainId(row.shItemId, ItemId),
      itemId          : this.toDomainId(row.shItemId, ItemId),
      itemOwnerId     : new UserId(Buffer.from('00000000000000000000000000000000', 'hex')),
      shCourrielDest  : row.shCourrielDest,
      recipientEmail  : row.shCourrielDest,
      shJeton         : row.shJeton,
      shareToken      : row.shJeton,
      shConfiguration : row.shConfiguration,
      accessConfig    : row.shConfiguration,
      createdAt       : row.shCreatedAt,
      updatedAt       : row.shUpdatedAt
    } as any);
  }

  /**
   * Transforme un jeu de résultats SQL complet en tableau d'entités métiers.
   *
   * @private
   */
  private rowsToShares(result: QueryResult<IShareRow>): Share[] {
    return result.rows.map((row: IShareRow) => this.rowToShare(row));
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
        'Select * From "Shares" Where "shIdShare" = $1',
        [this.toBuffer(idShare)]
      );
      const l_aoShares = this.rowsToShares(result);
      return l_aoShares[0] ?? null;
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
      const result = await this.db.query<IShareRow>(
        'Select * From "Shares" Where "shJeton" = $1',
        [token.trim()]
      );
      const l_aoShares = this.rowsToShares(result);
      return l_aoShares[0] ?? null;
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
        'Select * From "Shares" Where "shItemId" = $1 Order By "shCreatedAt" Desc',
        [this.toBuffer(itemId)]
      );
      return this.rowsToShares(result);
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
        'Select "Shares".* From "Shares" Inner Join "Items" on "itIdItem" = "shItemId" Where "itUserId" = $1 Order By "shCreatedAt" Desc',
        [this.toBuffer(userId)]
      );
      return this.rowsToShares(result);
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
      const l_binIdShare = this.toBuffer(data.shIdShare);

      const result = await this.db.query<IShareRow>(
        `Insert Into "Shares" ("shIdShare", "shItemId", "shCourrielDest", "shJeton", "shConfiguration")
         Values ($1, $2, $3, $4, $5::jsonb)
         returning *`,
        [
          l_binIdShare,
          this.toBuffer(data.shItemId),
          data.shCourrielDest,
          data.shJeton,
          JSON.stringify(data.shConfiguration)
        ]
      );

      const l_aoShares = this.rowsToShares(result);
      if (l_aoShares.length === 0) throw ShareErrorFactory.creation('No row returned from INSERT in shares');

      return l_aoShares[0];

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

    if (data.shCourrielDest !== undefined) {
      fields.push(`"shCourrielDest" = $${idx++}`);
      values.push(data.shCourrielDest);
    }
    if (data.shConfiguration !== undefined) {
      fields.push(`"shConfiguration" = $${idx++}::jsonb`);
      values.push(JSON.stringify(data.shConfiguration));
    }

    if (fields.length === 0) {
      const existing = await this.findById(idShare);
      if (!existing) throw ShareErrorFactory.notFound(idShare.toString());
      return existing;
    }

    values.push(this.toBuffer(idShare));

    try {
      const result = await this.db.query<IShareRow>(
        `Update "Shares" Set ${fields.join(', ')} Where "shIdShare" = $${idx} returning *`,
        values
      );

      const l_aoShares = this.rowsToShares(result);
      if (l_aoShares.length === 0) throw ShareErrorFactory.notFound(idShare.toString());

      return l_aoShares[0];

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
      const result = await this.db.query('Delete From "Shares" Where "shIdShare" = $1', [this.toBuffer(id)]);
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
      const result = await this.db.query<IShareRow>('Select * From "Shares" Order By "shCreatedAt" Desc');
      return this.rowsToShares(result);
    } catch (err) {
      const msg: string = err instanceof Error ? err.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findAll', msg);
    }
  }
}
