// ——— fichier : src/infrastructure/repositories/ItemTagRepository.ts

import      { BaseRepository          } from '@/infrastructure/repositories/BaseRepositories';
import      { UserId, ItemId, TagId   } from '@/domain/value-objects/ids';
import      { Tag                     } from '@/entities/Tag';
import      { DatabaseErrorFactory    } from '@/exceptions/DatabaseErrorFactory';
import type { IItemTagRepository      } from '@/interfaces/repositories/IItemTagRepository';
import      { IDatabaseConnection     } from '@/interfaces/database/IDatabaseConnection';

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
 * 🧱 Classe ItemTagRepository 🏷️ (Le Maître de Liaison des Étiquettes 🔌)
 * ----------------------------------------------------------------------------
 * Centralise les opérations physiques d affectation de mots-clés sur les pépites.
 * Ré-architecturée en mode différentiel chirurgical pour préserver la traçabilité.
 *
 * SOLID :
 *  - SRP 📐 : Unique responsabilité de piloter la table pivot Many-to-Many "ItemTags".
 *
 * @class ItemTagRepository
 * @extends {BaseRepository}
 * @implements {IItemTagRepository}
 * @author Conception & Vision : Joël (MANIAC du PascalCase et DR-DOS Addict')
 * @author Frapperie du Code : Gaïa (Graveuse de pépites et du silicium)
 * @author Garde d Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class ItemTagRepository extends BaseRepository implements IItemTagRepository {

  /**
   * Initialise le dépôt de liaison via le pool global d infrastructure 🔌.
   *
   * @constructor
   * @param {Pool} p_oPool - L instance de connexion partagée du serveur Express
   */
  public constructor(p_oDb: IDatabaseConnection) {
    // Raccordement direct à la maman, alignement impérial !
    super(p_oDb);
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
   * Algorithme du "Tri sélectif des valises" : Préserve le createdAt des tags existants.
   *
   * @public
   * @async
   * @param {ItemId} p_oItemId - L identifiant fort de la pépite
   * @param {ReadonlyArray<TagId>} p_aoTagIdsCibles - Le tableau des nouvelles étiquettes cibles
   * @returns {Promise<void>}
   */
  public async sync(p_oItemId: ItemId, p_aoTagIdsCibles: ReadonlyArray<TagId>): Promise<void> {
    const l_oPoolClient = await this.db.getPool().connect(); // Extraction via l'accesseur public

    try {
      await l_oPoolClient.query('Begin;');

      // ----------------------------------------------------------------------------
      // ÉTAPE 1 : Lecture des liaisons actuellement stockées sur le disque (ByteA)
      // ----------------------------------------------------------------------------
      const l_sRequeteSelect = `Select "tiTagId" From "ItemTags" Where "tiItemId" = $1;`;
      const l_rResultatLect = await l_oPoolClient.query(l_sRequeteSelect, [this.toBuffer(p_oItemId)]);

      // Extraction des buffers bruts de la base sous forme de chaînes Hexa pour faciliter la comparaison
      const l_asTagsEnBaseHex = l_rResultatLect.rows.map((row: any) => row.tiTagId.toString('hex'));
      const l_asTagsCiblesHex = p_aoTagIdsCibles.map((id: TagId) => this.toBuffer(id)!.toString('hex'));

      // ----------------------------------------------------------------------------
      // ÉTAPE 2 : Analyse différentielle géométrique (Calcul des Entrants / Sortants)
      // ----------------------------------------------------------------------------

      // Sortants : Présents en base, mais absents de la nouvelle liste ➔ À exterminer

      const l_aTagIdsSortantsCibles = l_rResultatLect.rows.filter((row: any) =>
        !l_asTagsCiblesHex.includes(row.tiTagId.toString('hex'))
      ).map((row: any) => row.tiTagId as Buffer);

      // Entrants : Absents de la base, mais présents sur la nouvelle liste ➔ À insérer fraîchement
      const l_aoTagIdsEntrants = p_aoTagIdsCibles.filter((id: TagId) =>
        !l_asTagsEnBaseHex.includes(this.toBuffer(id)!.toString('hex'))
      );

      // ----------------------------------------------------------------------------
      // ÉTAPE 3 : Exécution des purges chirurgicales (Sortants)
      // ----------------------------------------------------------------------------
      if (l_aTagIdsSortantsCibles.length > 0) {
        const l_sMarqueursDel = l_aTagIdsSortantsCibles.map((_, idx) => `$${idx + 2}`).join(', ');
        const l_sRequeteDelete = `Delete From "ItemTags" Where "tiItemId" = $1 And "tiTagId" In (${l_sMarqueursDel});`;
        await l_oPoolClient.query(l_sRequeteDelete, [this.toBuffer(p_oItemId), ...l_aTagIdsSortantsCibles]);
      }

      // ----------------------------------------------------------------------------
      // ÉTAPE 4 : Exécution des insertions fraîches (Entrants)
      // ----------------------------------------------------------------------------
      if (l_aoTagIdsEntrants.length > 0) {
        // Ciselage matriciel des marqueurs de position ordonnés en arrière-plan ⚙️
        const l_sMarqueursIns = l_aoTagIdsEntrants.map((_, l_iIndex) => `($1, $${l_iIndex + 2})`).join(', ');
        const l_sRequeteInsert = `Insert Into "ItemTags" ("tiItemId", "tiTagId") Values ${l_sMarqueursIns};`;

        await l_oPoolClient.query(
          l_sRequeteInsert,
          [
            this.toBuffer(p_oItemId),
            ...l_aoTagIdsEntrants.map((id: TagId) => this.toBuffer(id))
          ]
        );
      }

      // Si la liste différentielle n a touché ni aux entrants ni aux sortants,
      // les liaisons rescapées conservent leur createdAt intact d il y a 3 ans !
      await l_oPoolClient.query('Commit;');

    } catch (l_oErreur) {

      await l_oPoolClient.query('Rollback;'); // Libération défensive immédiate des Shared Buffers
      throw DatabaseErrorFactory.queryFailed('ItemTag.sync', (l_oErreur as Error).message);

    } finally {

      l_oPoolClient.release();

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
