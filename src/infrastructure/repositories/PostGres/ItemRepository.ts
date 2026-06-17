// ——— fichier : src/infrastructure/repositories/PostGres/ItemRepository.ts

import type { QueryResultRow } from 'pg';

import type { IListResult } from '@/interfaces/shared/IListResult';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import type {
  IItemRepository,
  IItemRepositoryListOptions
} from '@/interfaces/repositories/PostGres/IItemRepository';

import { OrdreTriEnum } from '@/constants/OrdreTriEnum';
import { UserId, ItemId, ContentTypeId } from '@/domain/value-objects/ids';
import { Item } from '@/entities/Item';
import { BaseRepository } from '@/infrastructure/repositories/BaseRepositories';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { ItemErrorFactory } from '@/exceptions/ItemErrorFactory';

/**
 * 🗄️ Interface IItemRow (Miroir Physique Jojo-Style des Pépites 🔌)
 * Alignée au caractère près sur l'ordre physique décroissant anti-padding de la table Items.
 */
interface IItemRow extends QueryResultRow {
  itIdItem: Buffer; //-- [SCELLÉ] 16 octets binaires ByteA compacts en RAM.
  itUserId: Buffer; //-- [SCELLÉ] 16 octets binaires ByteA compacts en RAM.
  itCreatedAt: Date; //-- 8 octets fixes (Timestamp).
  itUpdatedAt: Date | null; //-- 8 octets fixes (Timestamp).
  itContentTypeId: string; //-- 4 octets fixes (Char(4)).
  itLibelle: string; //-- Taille variable.
  itSlug: string; //-- Taille variable.
  itAuteurSource: string; //-- Taille variable.
  itThumbnailUrl: string | null; //-- Taille variable.
  itMetadata: Record<string, unknown>; //-- JSONB flexible.
  itContent: string; //-- Contenu textuel lourd en fin de tas.
  rNbLignesTotal?: string; //-- Volumétrie calculée par le chateau.
}

export class ItemRepository extends BaseRepository implements IItemRepository {
  /**
   * Initialise le dépôt des pépites via la connexion active de Cour Basse.
   */
  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);
  }

  /**
   * Mappe une ligne PostgreSQL brute (snake_case) vers une entité Item (CamelCase).
   */
  private rowToItem(p_oRow: IItemRow): Item {
    return new Item({
      idItem: new ItemId(p_oRow.itIdItem),
      idUser: new UserId(p_oRow.itUserId),
      contentTypeId: new ContentTypeId(p_oRow.itContentTypeId),
      title: p_oRow.itLibelle, //-- Miroir physique de la table
      slug: p_oRow.itSlug,
      content: p_oRow.itContent,
      sourceAuthor: p_oRow.itAuteurSource, //-- Miroir physique de la table
      thumbnailUrl: p_oRow.itThumbnailUrl ?? undefined,
      metadata: p_oRow.itMetadata,
      createdAt: p_oRow.itCreatedAt,
      updatedAt: p_oRow.itUpdatedAt ?? undefined
    });
  }

  /**
   * 🔍 Lecture chirurgicale : Localise une pépite via son identifiant nominal fort.
   */
  public async findById(p_axIdItem: ItemId): Promise<Item | null> {
    try {
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."TrouverPepiteParId"($1);',
        [p_axIdItem.binaire] //-- Buffer compact ByteA 16 octets.
      );
      return l_oResult.rows && l_oResult.rows.length > 0 ? this.rowToItem(l_oResult.rows[0]) : null;
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.findById / TrouverPepiteParId', l_sMsg);
    }
  }

  /**
   * 🔍 Alignement nominal : Récupère une pépite par son permalien utilisateur unique.
   * [SCELLÉ JOCAS V4] Vrai tir laser sur index composite unique, sans aucune pagination !
   */
  public async findBySlug(p_axUserId: UserId, p_sSlug: string): Promise<Item | null> {
    try {
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."TrouverPepiteParSlug"($1, $2);', //-- [SCELLÉ] Turbine dédiée sur index unique
        [
          p_axUserId.binaire, //-- Clé du propriétaire (ByteA)
          p_sSlug.trim().toLowerCase() //-- Chaîne du permalien nettoyée
        ]
      );
      return l_oResult.rows && l_oResult.rows.length > 0 ? this.rowToItem(l_oResult.rows[0]) : null;
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.findBySlug / TrouverPepiteParSlug', l_sMsg);
    }
  }

  /**
   * 🔍 Vérification anti-doublon : Localise un libellé existant dans l'espace utilisateur.
   * [SCELLÉ JOCAS V4] Vrai tir laser sur index composite unique.
   */
  public async findByTitle(p_axUserId: UserId, p_sTitle: string): Promise<Item | null> {
    try {
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."TrouverPepiteParLibelle"($1, $2);', //-- [SCELLÉ] Turbine dédiée sur index unique
        [
          p_axUserId.binaire, //-- Clé du propriétaire (ByteA)
          p_sTitle.trim() //-- Titre nominal recherché
        ]
      );
      return l_oResult.rows && l_oResult.rows.length > 0 ? this.rowToItem(l_oResult.rows[0]) : null;
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.findByTitle / TrouverPepiteParLibelle', l_sMsg);
    }
  }

  /**
   * 📊 Pagination & Filtre : Énumère le coffre-fort d'un acteur de manière segmentée.
   */
  public async listByUser(
    p_axUserId: UserId,
    p_oOptions: IItemRepositoryListOptions
  ): Promise<IListResult<Item>> {
    try {
      const l_eOrdreTri =
        p_oOptions.OrdreAff instanceof OrdreTriEnum
          ? p_oOptions.OrdreAff
          : OrdreTriEnum.DeCode<OrdreTriEnum>('DESC');

      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."ToutesLesPepites"($1, $2, $3, $4, $5, $6, $7);',
        [
          p_axUserId.binaire, //-- Passage sous pavillon Buffer ByteA.
          p_oOptions.contentTypeId?.valeur ?? null,
          p_oOptions.MotsCles ? `%${p_oOptions.MotsCles}%` : null,
          p_oOptions.ColonneTri ?? 'itCreatedAt',
          l_eOrdreTri.code,
          p_oOptions.NbLignes ?? 50,
          p_oOptions.LigneDebut ?? 0
        ]
      );

      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.rowToItem(l_oRow));

      return {
        LigneDebut: p_oOptions.LigneDebut ?? 0,
        NbLignesDem: p_oOptions.NbLignes ?? 50,
        NbLignesRenv: l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes: l_aoLignes
      };
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.listByUser / ToutesLesPepites', l_sMsg);
    }
  }

  /**
   * 🪓 Écriture concrète : Insère une pépite via la turbine d'élite.
   */
  public async create(p_oData: IItemData): Promise<Item> {
    try {
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."CreerPepite"($1, $2, $3, $4, $5, $6, $7, $8, $9);',
        [
          p_oData.idItem.binaire,
          p_oData.idUser.binaire,
          p_oData.contentTypeId.valeur,
          p_oData.title.trim(),
          p_oData.slug,
          p_oData.content,
          p_oData.sourceAuthor.trim(),
          p_oData.thumbnailUrl ?? null,
          JSON.stringify(p_oData.metadata ?? {})
        ]
      );

      const l_oRow = l_oResult.rows[0];
      if (!l_oRow)
        throw ItemErrorFactory.creation('La turbine "CreerPepite" n\'a retourné aucune ligne.');
      return this.rowToItem(l_oRow);
    } catch (l_oError) {
      if (l_oError instanceof ItemErrorFactory) throw l_oError;
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown / CreerPepite';

      if (l_sMsg.includes('Items_itUserId_itLibelle_Udx')) {
        throw ItemErrorFactory.titleExists(p_oData.idUser, p_oData.title);
      }
      if (l_sMsg.includes('Items_itUserId_itSlug_Udx')) {
        throw ItemErrorFactory.slugExists(p_oData.idUser, p_oData.slug);
      }
      throw ItemErrorFactory.creation(l_sMsg);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles via la turbine dédiée.
   */
  public async update(p_axIdItem: ItemId, p_oData: Partial<IItemData>): Promise<Item> {
    try {
      const l_oExisting = await this.findById(p_axIdItem);
      if (!l_oExisting) throw ItemErrorFactory.notFound(p_axIdItem);

      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."ModifierPepite"($1, $2, $3, $4, $5, $6, $7, $8, $9);',
        [
          p_axIdItem.binaire,
          l_oExisting.idUser.binaire,
          p_oData.contentTypeId?.valeur ?? l_oExisting.contentType.code,
          p_oData.title?.trim() ?? l_oExisting.title,
          p_oData.slug ?? l_oExisting.slug,
          p_oData.content ?? l_oExisting.content,
          p_oData.sourceAuthor?.trim() ?? l_oExisting.sourceAuthor,
          p_oData.thumbnailUrl !== undefined
            ? p_oData.thumbnailUrl
            : (l_oExisting.thumbnailUrl ?? null),
          JSON.stringify(p_oData.metadata ?? l_oExisting.metadata)
        ]
      );

      const l_oRow = l_oResult.rows[0];
      if (!l_oRow) throw ItemErrorFactory.notFound(p_axIdItem);
      return this.rowToItem(l_oRow);
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.update / ModifierPepite', l_sMsg);
    }
  }

  /**
   * 🪓 Destruction physique d'infrastructure.
   */
  public async delete(p_axIdItem: ItemId, p_axUserId: UserId): Promise<boolean> {
    try {
      const l_oResult = await this.db.query(
        'Select * From public."SupprimerPepiteParIds"($1, $2);',
        [p_axIdItem.binaire, p_axUserId.binaire]
      );
      return (l_oResult.rowCount ?? 0) > 0;
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.delete / SupprimerPepiteParIds', l_sMsg);
    }
  }

  /**
   * 📜 VRAI FINDALL CONSTITUTIONNEL V4 🏛️
   */
  public async findAll(p_oOptions: IItemRepositoryListOptions): Promise<IListResult<Item>> {
    try {
      const l_nLimit = p_oOptions.NbLignes ?? 50;
      const l_nOffset = p_oOptions.LigneDebut ?? 0;
      const l_eOrdreTri =
        p_oOptions.OrdreAff instanceof OrdreTriEnum
          ? p_oOptions.OrdreAff
          : OrdreTriEnum.DeCode<OrdreTriEnum>('DESC');

      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."TousLesItems"($1, $2, $3, $4);',
        [l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'itCreatedAt', l_eOrdreTri.code]
      );

      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.rowToItem(l_oRow));

      return {
        LigneDebut: l_nOffset,
        NbLignesDem: l_nLimit,
        NbLignesRenv: l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes: l_aoLignes
      };
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.findAll / TousLesItems', l_sMsg);
    }
  }
}

export default ItemRepository;
