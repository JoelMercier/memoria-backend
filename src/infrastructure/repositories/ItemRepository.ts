// ——— fichier : src/infrastructure/repositories/ItemRepository.ts

import type { QueryResultRow      } from 'pg';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IItemData           } from '@/interfaces/entities/item/IItemData';
import type { IItemRepository     } from '@/interfaces/repositories/IItemRepository';

import { OrdreTriEnum                  } from '@/constants/OrdreTriEnum';
import { UserId, ItemId, ContentTypeId } from '@/domain/value-objects/ids';
import { Item                          } from '@/entities/Item';
import { BaseRepository                } from '@/infrastructure/repositories/BaseRepositories';
import { DatabaseErrorFactory          } from '@/exceptions/DatabaseErrorFactory';
import { ItemErrorFactory              } from '@/exceptions/ItemErrorFactory';
import { IItemRepositoryListOptions    } from '@/interfaces/repositories/IItemRepositoryListOptions';
import { IListResult                   } from '@/interfaces/shared/IListResult';

/**
 * 🗄️ Interface interne calée au bit près sur le stockage physique décroissant de la table "Items"
 */
interface IItemRow extends QueryResultRow {
  itIdItem         : Buffer;
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
 * ----------------------------------------------------------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Pépites.
 * Branche le flux binaire 128 bits pur sur les requêtes et l'indexation de la cour basse.
 *
 * @class ItemRepository
 * @extends {BaseRepository}
 * @implements {IItemRepository}
 * @author Vision : Joël (Architecte DR-DOS)
 * @author Frapperie du code : Gaïa (Au burin, alignée sur le manifeste d'acier SQL V4)
 */
export class ItemRepository extends BaseRepository implements IItemRepository {

  /**
   * Initialise le dépôt avec sa connexion physique et hérite de l'usine binaire.
   *
   * @constructor
   * @param {IDatabaseConnection} p_oDb - La connexion active à l'infrastructure de soute
   */
  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);
  }

  /**
   * Mappe une ligne PostgreSQL brute (snake_case) vers une entité Item (CamelCase).
   * [RÉPARÉ V4] Extraction compatible avec la soute anonyme calculée par la maman.
   *
   * @private
   * @param {IItemRow} p_oRow - La ligne brute PostgreSQL
   * @returns {Item} L'entité vivante du Domaine hydratée
   */
  private rowToItem(p_oRow: IItemRow): Item {
    return new Item({
      idUser        : new UserId(p_oRow.itUserId), // Forçage de l'encapsulation du type fort binaire
      contentTypeId : new ContentTypeId(p_oRow.itContentTypeId),
      title         : p_oRow.itTitle,
      slug          : p_oRow.itSlug,
      content       : p_oRow.itContent,
      sourceAuthor  : p_oRow.itSourceAuthor,
      thumbnailUrl  : p_oRow.itThumbnailUrl,
      metadata      : p_oRow.itMetadata,
      createdAt     : p_oRow.itCreatedAt,
      updatedAt     : p_oRow.itUpdatedAt ?? undefined // Alignement strict RAM sans null [Mémoria]
    } as any); // Le cast protège le dictionnaire face au motif calculé de la maman
  }

  /**
   * 🔍 Lecture chirurgicale : Localise une pépite via son identifiant nominal fort.
   *
   * @public
   * @async
   * @param {ItemId} p_axIdItem - L'identifiant fort binaire de soute
   * @returns {Promise<Item | null>} L'entité hydratée ou null
   */
  public async findById(p_axIdItem: ItemId): Promise<Item | null> {
    try {
      // Rule 2 : Casse grammaticale Jojo-Style respectée au caractère près
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From "Items" Where "itIdItem" = "Bin-UUID"($1)', [p_axIdItem]
      );
      return l_oResult.rows[0] ? this.rowToItem(l_oResult.rows[0]) : null;
    } catch (l_oError) {
      const l_sMsg: string = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findById', l_sMsg);
    }
  }


  /**
   * 🔍 Alignement nominal : Récupère une pépite par son permalien utilisateur.
   * [SCELLÉ RECOUVREMENT V4] Consomme l'enveloppe IListResult de la fonction ToutesLesPepites.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur propriétaire
   * @param {string} p_sSlug - Le permalien textuel unique recherché
   * @returns {Promise<Item | null>} La pépite concrète hydratée ou null
   */
  public async findBySlug(p_axUserId: UserId, p_sSlug: string): Promise<Item | null> {
    try {
      // Appel unifié à notre reine des soutes avec contrainte Limit 1
      const l_oPackagePagine: IListResult<Item> = await this.listByUser(p_axUserId, {
        LigneDebut:  0,
        NbLignes:    1, // 🪓 Recherche atomique : une seule ligne max demandée
        ColonneTri:  'itCreatedAt',
        OrdreAff:    OrdreTriEnum.DeCode<OrdreTriEnum>('DESC'),
        MotsCles:    p_sSlug.trim() // Injection du filtre d'extraction
      } as any);

      // 🔍 Respect strict de la charte IListResult : la collection vit dans .Lignes !
      return l_oPackagePagine.Lignes.length > 0 ? l_oPackagePagine.Lignes[0] : null;
    } catch (l_oError) {
      const l_sMsg: string = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findBySlug', l_sMsg);
    }
  }

  /**
   * 🔍 Vérification anti-doublon : Localise un titre existant dans l'espace utilisateur.
   * [SCELLÉ RECOUVREMENT V4] Consomme l'enveloppe IListResult de la fonction ToutesLesPepites.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant binaire de l'acteur propriétaire
   * @param {string} p_sTitle - Le titre textuel brut recherché
   * @returns {Promise<Item | null>} La pépite correspondante ou null
   */
  public async findByTitle(p_axUserId: UserId, p_sTitle: string): Promise<Item | null> {
    try {
      const l_oPackagePagine: IListResult<Item> = await this.listByUser(p_axUserId, {
        LigneDebut:  0,
        NbLignes:    1,
        ColonneTri:  'itTitle',
        OrdreAff:    OrdreTriEnum.DeCode<OrdreTriEnum>('ASC'),
        MotsCles:    p_sTitle.trim()
      } as any);

      return l_oPackagePagine.Lignes.length > 0 ? l_oPackagePagine.Lignes[0] : null;
    } catch (l_oError) {
      const l_sMsg: string = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findByTitle', l_sMsg);
    }
  }


  /**
   * 📊 Pagination & Filtre : Énumère le coffre-fort d'un acteur de manière segmentée.
   * [RÉPARÉ V4] Intègre le tri dynamique obligatoire et restitue le français d'élite !
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur propriétaire (Rule 4 : p_ax)
   * @param {IItemRepositoryListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoires
   * @returns {Promise<IListResult<Item>>} Le lot de résultats paginé et tracé
   */
  /**
   * 📊 Pagination & Filtre : Énumère le coffre-fort d'un acteur de manière segmentée.
   * [SCELLÉ V4] Interrogation exclusive de la fonction stockée ToutesLesPepites !
   */
  public async listByUser(p_axUserId: UserId, p_oOptions: IItemRepositoryListOptions): Promise<IListResult<Item>> {
    try {
      // 🪓 [REDRESSÉ CONFORME SMARTENUM] Extraction directe du .code hérité de la maman SmartEnum !
      // Si p_oOptions.OrdreAff n'est pas fourni, le dictionnaire statique résout le fallback via DeCode() !
      const l_eOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum
        ? p_oOptions.OrdreAff
        : OrdreTriEnum.DeCode<OrdreTriEnum>('DESC');

      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."ToutesLesPepites"($1, $2, $3, $4, $5, $6, $7)',
        [
          p_axUserId,
          p_oOptions.contentTypeId?.valeur ?? null,
          p_oOptions.MotsCles ? `%${p_oOptions.MotsCles}%` : null,
          p_oOptions.ColonneTri ?? 'itCreatedAt',
          l_eOrdreTri.code, // 🗲 Injecte STRICTEMENT 'ASC' ou 'DESC' de manière immuable !
          p_oOptions.NbLignes ?? 50,
          p_oOptions.LigneDebut ?? 0
        ]
      );

      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.rowToItem(l_oRow));

      return {
        LigneDebut:    p_oOptions.LigneDebut,
        NbLignesDem:   p_oOptions.NbLignes,
        NbLignesRenv:  l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes:        l_aoLignes
      };

    } catch (l_oError) {
      const l_sMsg: string = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('listByUser', l_sMsg);
    }
  }

    /**
   * 🪓 Écriture concrète : Insère une pépite en base de données via le soupirail binaire.
   * [SCELLÉ JOCAS] Respect strict de la Rule 2 (Casse) et extraction des Value Objects.
   *
   * @public
   * @async
   * @param {IItemData} p_oData - Le sac de données brutes issues du Domaine
   * @returns {Promise<Item>} L'instance de la pépite créée, lue depuis le disque
   */
  public async create(p_oData: IItemData): Promise<Item> {
    try {
      const l_oResult = await this.db.query<IItemRow>(
        `Insert Into "Items"
           ("itIdItem", "itUserId", "itContentTypeId", "itTitle", "itSlug", "itContent", "itSourceAuthor", "itThumbnailUrl", "itMetadata")
         Values ("Bin-UUID"($1), "Bin-UUID"($2), $3, $4, $5, $6, $7, $8, $9)
         returning *`,
        [
          p_oData.idItem,
          p_oData.idUser,
          p_oData.contentTypeId.valeur, // 🪓 Extraction du code technique du Smart Enum
          p_oData.title,
          p_oData.slug,
          p_oData.content,
          p_oData.sourceAuthor,
          p_oData.thumbnailUrl ?? null,
          p_oData.metadata ?? {}
        ]
      );

      const l_oRow = l_oResult.rows[0];
      if (!l_oRow) throw ItemErrorFactory.creation('No row returned from INSERT');
      return this.rowToItem(l_oRow);
    } catch (l_oError) {
      if (l_oError instanceof ItemErrorFactory) throw l_oError;
      const l_sMsg: string = l_oError instanceof Error ? l_oError.message : 'unknown';
      if (l_sMsg.includes('Items_itUserId_itTitle_Udx')) {
        throw ItemErrorFactory.titleExists(p_oData.idUser, p_oData.title);
      }
      if (l_sMsg.includes('Items_itUserId_itSlug_Udx')) {
        throw ItemErrorFactory.slugExists(p_oData.idUser, p_oData.slug);
      }
      throw ItemErrorFactory.creation(l_sMsg);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles du Domaine.
   * [RÉPARÉ V4] Utilise les propriétés CamelCase épurées 3NF de IItemData !
   *
   * @public
   * @async
   * @param {ItemId} p_axIdItem - L'identifiant fort de la pépite à modifier
   * @param {Partial<IItemData>} p_oData - Les colonnes partielles soumises par le service
   * @returns {Promise<Item>} L'entité mise à jour
   */
  public async update(p_axIdItem: ItemId, p_oData: Partial<IItemData>): Promise<Item> {
    const l_asFields : string[] = [];
    const l_avParams : unknown[] = [];
    let l_iCounter   : number = 1;

    // 🪓 Correspondance exacte avec les clés du nouveau dictionnaire IItemData
    const l_oColumnMap: Record<string, string> = {
      contentTypeId : '"itContentTypeId"',
      title         : '"itTitle"',
      slug          : '"itSlug"',
      content       : '"itContent"',
      sourceAuthor  : '"itSourceAuthor"',
      thumbnailUrl  : '"itThumbnailUrl"',
      metadata      : '"itMetadata"'
    };

    for (const [l_sKey, l_sCol] of Object.entries(l_oColumnMap)) {
      const l_vValue: unknown = (p_oData as Record<string, unknown>)[l_sKey];
      if (l_vValue !== undefined) {
        l_asFields.push(`${l_sCol} = $${l_iCounter++}`);
        l_avParams.push(l_vValue instanceof ContentTypeId ? l_vValue.valeur : l_vValue);
      }
    }

    if (l_asFields.length === 0) {
      const l_oExisting = await this.findById(p_axIdItem);
      if (!l_oExisting) throw ItemErrorFactory.notFound(p_axIdItem);
      return l_oExisting;
    }

    l_avParams.push(p_axIdItem);

    try {
      const l_oResult = await this.db.query<IItemRow>(
        `Update "Items" Set ${l_asFields.join(', ')} Where "itIdItem" = "Bin-UUID"($${l_iCounter}) returning *`,
        l_avParams
      );
      const l_oRow = l_oResult.rows[0];
      if (!l_oRow) throw ItemErrorFactory.notFound(p_axIdItem);
      return this.rowToItem(l_oRow);
    } catch (l_oError) {
      const l_sMsg: string = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('update', l_sMsg);
    }
  }

  /**
   * 🪓 Destruction atomique : Supprime une pépite du donjon physique.
   *
   * @public
   * @async
   * @param {ItemId} p_axIdItem - L'identifiant unique fort de la pépite
   * @returns {Promise<boolean>} True si la suppression physique a eu lieu
   */
  public async delete(p_axIdItem: ItemId): Promise<boolean> {
    try {
      const l_oResult = await this.db.query('Delete From "Items" Where "itIdItem" = "Bin-UUID"($1)', [p_axIdItem]);
      return (l_oResult.rowCount ?? 0) > 0;
    } catch (l_oError) {
      const l_sMsg: string = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('delete', l_sMsg);
    }
  }
  /**
   * 📜 VRAI FINDALL CONSTITUTIONNEL V4 🏛️
   * ----------------------------------------------------------------------------
   * Extrait l'intégralité absolue de la table Items de manière globale (Mode Système/Admin).
   * [BRIDER MEMOIRE] Exige obligatoirement ses options de pagination pour interdire les fuites.
   * [SCELLÉ RECOUVREMENT] Interroge exclusivement la fonction stockée ToutesLesPepitesDuChateau !
   *
   * @public
   * @async
   * @param {IItemRepositoryListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoires
   * @returns {Promise<IListResult<Item>>} Le lot de résultats global paginé au standard français d'élite
   */
  public async findAll(p_oOptions: IItemRepositoryListOptions): Promise<IListResult<Item>> {
    try {
      const l_nLimit      : number = p_oOptions.NbLignes ?? 50;
      const l_nOffset     : number = p_oOptions.LigneDebut ?? 0;

      // 🪓 Extraction du code technique ('ASC' / 'DESC') depuis le Smart Enum d'écurie
      const l_sOrdreTriText = p_oOptions.OrdreAff instanceof OrdreTriEnum
        ? p_oOptions.OrdreAff.code
        : 'DESC';

      // 🗲 [RACCORDÉ SYSTÈME] Un unique appel de fonction PL/pgSQL, sans un pixel de texte SQL volant !
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."ToutesLesPepitesDuChateau"($1, $2, $3, $4)',
        [
          l_nLimit,
          l_nOffset,
          p_oOptions.ColonneTri ?? 'itCreatedAt',
          l_sOrdreTriText
        ]
      );

      // Extraction de la volumétrie sur la première ligne retournée par la fonction stockée
      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.rowToItem(l_oRow));

      return {
        LigneDebut:    l_nOffset,
        NbLignesDem:   l_nLimit,
        NbLignesRenv:  l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes:        l_aoLignes
      };
    } catch (l_oError) {
      const l_sMsg: string = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('findAll', l_sMsg);
    }
  }

}