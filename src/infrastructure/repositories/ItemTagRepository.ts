// ——— fichier : src/infrastructure/repositories/ItemTagRepository.ts

import { Pool                 } from 'pg';
import { BaseRepository       } from '@/infrastructure/repositories/BaseRepositories';
import { UserId, ItemId, TagId } from '@/domain/value-objects/IdMetier';
import { Tag                  } from '@/entities/Tag';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import type { IItemTagRepository } from '@/interfaces/repositories/IItemTagRepository';

/**
 * 🗄️ Interface ITagRow (Miroir Physique Jojo-Style de la table "Tags" 🔌)
 */
interface ITagRow {
  tgIdTag         : Buffer;    // 16 octets fixes tassés en RAM
  tgUserId        : Buffer;    // 16 octets fixes tassés en RAM
  tgName          : string;    // Désignation textuelle de l étiquette
  tgCreatedAt     : Date;
  tgUpdatedAt     : Date | null;
}

/**
 * 🔗 Classe ItemTagRepository 🗄️ (Le Câbleur de Liaisons Associatives 🤖)
 * ----------------------------------------------------------------------------
 * Dépôt d infrastructure gérant les pivots Many-to-Many de la table "ItemTags".
 * Pureté nominale absolue : zéro alias, les préfixes exclusifs règnent [Mémoria].
 *
 * @class ItemTagRepository
 * @extends {BaseRepository}
 * @implements {IItemTagRepository}
 * @author Déconstruction : Joël (Nostalgique de l'ADA)
 * @author Ciselage du code : Gaïa (Meilleure ouvrière du Donjon)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class ItemTagRepository extends BaseRepository implements IItemTagRepository {

  /**
   * Initialise le dépôt de liaison via le pool global d infrastructure 🔌.
   *
   * @constructor
   * @param {Pool} p_oPool - L instance de connexion partagée du serveur Express
   */
  public constructor(p_oPool: Pool) {
    super(p_oPool);
  }

  /**
   * Mappe une ligne PostgreSQL brute vers une entité Tag propre 🔄.
   *
   * @private
   * @param {ITagRow} p_oLigne - La ligne de l étiquette extraite en jointure
   * @returns {Tag} L instance nominale réarmée et étanche
   */
  private LigneVersTag(p_oLigne: ITagRow): Tag {
    return new Tag({
      idTag     : this.toDomainId(p_oLigne.tgIdTag, TagId),
      userId    : this.toDomainId(p_oLigne.tgUserId, UserId),
      tagName   : p_oLigne.tgName,
      createdAt : p_oLigne.tgCreatedAt,
      updatedAt : p_oLigne.tgUpdatedAt ?? undefined
    });
  }

  /**
   * 🔍 Jointure chirurgicale : Extrait toutes les étiquettes rattachées à une pépite 📥.
   *
   * @public
   * @async
   * @param {ItemId} p_oItemId - L identifiant fort de la pépite cible
   * @returns {Promise<Tag[]>} Le tableau d étiquettes réarmé ordonné par nom
   */
  public async findTagsForItem(p_oItemId: ItemId): Promise<Tag[]> {
    try {
      // Nettoyage au Kärcher : Plus aucune trace de t. ou ti. parasite ! [Mémoria]
      const la_oLignes = await this.executer<ITagRow>(
        `Select "tgIdTag", "tgUserId", "tgName", "tgCreatedAt", "tgUpdatedAt"
         From "Tags"
         Inner Join "ItemTags" On "tiTagId" = "tgIdTag"
         Where "tiItemId" = $1
         Order By "tgName" Asc;`,
        [p_oItemId]
      );
      return la_oLignes.map((l_oLigne: ITagRow) => this.LigneVersTag(l_oLigne));
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('ItemTag.findTagsForItem', (l_oErreur as Error).message);
    }
  }

  /**
   * 🪓 Écriture concrète : Assigne une étiquette à une pépite via le soupirail binaire 🪙.
   *
   * @public
   * @async
   * @param {ItemId} p_oItemId - L identifiant fort de la pépite cible
   * @param {TagId} p_oTagId - L identifiant fort de l étiquette à lier
   * @returns {Promise<void>}
   */
  public async add(p_oItemId: ItemId, p_oTagId: TagId): Promise<void> {
    try {
      // Zéro alias, les préfixes "ti" uniques de Cour Basse font foi ! [Mémoria]
      await this.executer<any>(
        `Insert Into "ItemTags" ("tiItemId", "tiTagId") Values ($1, $2)
         On Conflict ("tiTagId", "tiItemId") Do Nothing;`,
        [p_oItemId, p_oTagId]
      );
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('ItemTag.add', (l_oErreur as Error).message);
    }
  }

  /**
   * 🪓 Écriture concrète : Supprime l association Many-to-Many entre une pépite et une étiquette.
   *
   * @public
   * @async
   * @param {ItemId} p_oItemId - L identifiant fort de la pépite
   * @param {TagId} p_oTagId - L identifiant fort de l étiquette à rompre
   * @returns {Promise<boolean>} True si l impact physique est validé
   */
  public async remove(p_oItemId: ItemId, p_oTagId: TagId): Promise<boolean> {
    try {
      await this.executer<any>(
        'Delete From "ItemTags" Where "tiItemId" = $1 And "tiTagId" = $2;',
        [p_oItemId, p_oTagId]
      );
      return true;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('ItemTag.remove', (l_oErreur as Error).message);
    }
  }

  /**
   * 🪓 Transaction Commando : Synchronise la collection d étiquettes d une pépite en RAM 🧠.
   * Ré-alignée géométriquement en colonnes étanches pour tes neurones carbones.
   *
   * @public
   * @async
   * @param {ItemId} p_oItemId - L identifiant fort de la pépite
   * @param {ReadonlyArray<TagId>} p_aoTagIds - Le tableau des nouvelles étiquettes cibles
   * @returns {Promise<void>}
   */
  public async sync(p_oItemId: ItemId, p_aoTagIds: ReadonlyArray<TagId>): Promise<void> {
    const r_Client = await this.m_rPool.connect(); // Utilisation légitime du pool hérité pour la transaction brute
    try {
      await r_Client.query('Begin;');
      await r_Client.query('Delete From "ItemTags" Where "tiItemId" = $1;', [this.toBuffer(p_oItemId)]);

      if (p_aoTagIds.length > 0) {
        // Ciselage matriciel des marqueurs de position ordonnés en arrière-plan ⚙️
        const l_sMarqueurs = p_aoTagIds.map((_, l_iIndex) => `($1, $${l_iIndex + 2})`).join(', ');

        await r_Client.query(
          `Insert Into "ItemTags" ("tiItemId", "tiTagId") Values ${l_sMarqueurs};`,
          [
            this.toBuffer(p_oItemId),
            ...p_aoTagIds.map(t => this.toBuffer(t))
          ]
        );
      }
      await r_Client.query('Commit;');
    } catch (l_oErreur) {
      await r_Client.query('Rollback;'); // Libération défensive immédiate des Shared Buffers
      throw DatabaseErrorFactory.queryFailed('ItemTag.sync', (l_oErreur as Error).message);
    } finally {
      r_Client.release();
    }
  }

  /**
   * 🪓 Écriture concrète : Nettoie l intégralité des étiquettes liées à une pépite.
   *
   * @public
   * @async
   * @param {ItemId} p_oItemId - L identifiant fort de la pépite à vider
   * @returns {Promise<void>}
   */
  public async clearForItem(p_oItemId: ItemId): Promise<void> {
    try {
      await this.executer<any>('Delete From "ItemTags" Where "tiItemId" = $1;', [p_oItemId]);
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('ItemTag.clearForItem', (l_oErreur as Error).message);
    }
  }
}
