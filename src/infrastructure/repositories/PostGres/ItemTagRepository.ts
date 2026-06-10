// ——— fichier : src/infrastructure/repositories/ItemTagRepository.ts

import type { QueryResultRow     } from 'pg';
import type { IItemTagRepository } from '@/interfaces/repositories/PostGres/IItemTagRepository';

import { BaseRepository        } from '@/infrastructure/repositories/BaseRepositories';
import { UserId, ItemId, TagId } from '@/domain/value-objects/ids';
import { Tag                   } from '@/entities/Tag';
import { DatabaseErrorFactory  } from '@/exceptions/DatabaseErrorFactory';
import { IDatabaseConnection   } from '@/interfaces/database/IDatabaseConnection';

/**
 * 🗄️ Interface ITagRow (Miroir Physique Jojo-Style de la table "Tags" 🔌)
 * [RÉPARÉ V4] Aligné au caractère près sur les préfixes d'écurie réels de la base.
 */
interface ITagRow extends QueryResultRow {
  tgIdTag       : Buffer;    // 16 octets fixes tassés en RAM
  tgUserId      : Buffer;    // 16 octets fixes tassés en RAM
  tgName        : string;    // Désignation textuelle de l'étiquette
  tgCreatedAt   : Date;
  tgUpdatedAt   : Date | null;
}

/**
 * 🧱 Classe ItemTagRepository 🏷️ (Le Maître de Liaison des Étiquettes 🔌)
 * ----------------------------------------------------------------------------
 * Centralise les opérations physiques d'affectation de mots-clés sur les pépites.
 * Ré-architecturée en mode différentiel chirurgical PostgreSQL 17+ via PL/pgSQL.
 *
 * SOLID :
 *  - SRP 📐 : Unique responsabilité de piloter la table pivot Many-to-Many "ItemTags".
 *
 * @class ItemTagRepository
 * @extends {BaseRepository}
 * @implements {IItemTagRepository}
 * @author Conception & Vision : Joël (MANIAC du PascalCase et DR-DOS Addict')
 * @author Frapperie du Code : Gaïa (Graveuse de pépites et du silicium V4)
 */
export class ItemTagRepository extends BaseRepository implements IItemTagRepository {

  /**
   * Initialise le dépôt de liaison via le pool global d'infrastructure 🔌.
   *
   * @constructor
   * @param {IDatabaseConnection} p_oDb - L'instance de connexion partagée du serveur
   */
  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);
  }

  /**
   * Mappe une ligne PostgreSQL brute vers une entité Tag propre 🔄.
   * [RÉPARÉ V4] Utilise les Value Objects du Bloc 1 sans intermédiaire paresseux.
   *
   * @private
   * @param {ITagRow} p_oLigne - La ligne de l'étiquette extraite en jointure
   * @returns {Tag} L'instance nominale réarmée et étanche
   */
  private LigneVersTag(p_oLigne: ITagRow): Tag {
    return new Tag({
      idTag     : new TagId(p_oLigne.tgIdTag),   // Instanciation directe et étanche
      userId    : new UserId(p_oLigne.tgUserId), // Instanciation directe et étanche
      tagName   : p_oLigne.tgName,
      createdAt : p_oLigne.tgCreatedAt,
      updatedAt : p_oLigne.tgUpdatedAt ?? undefined
    } as any);
  }


    /**
   * 🪓 Transaction Commando : Synchronise la collection d'étiquettes d'une pépite.
   * [ZÉRO PLOMBERIE NODE.JS] Délégation de masse absolue à la fonction stockée royale !
   */
  public async sync(p_oItemId: ItemId, p_aoTagIdsCibles: ReadonlyArray<TagId>): Promise<void> {
    try {
      // Extraction native des chaînes ou buffers pour l'injecter sous forme de tableau PG Uuid[]
      const l_asCiblesBinaire = p_aoTagIdsCibles.map((id) => id.valeur);

      // Un unique appel de fonction souverain, atomique et ultrasécurisé !
      await this.db.query(
        'Select "SynchroniserLesEtiquettes"("Bin-UUID"($1), $2::Uuid[]);',
        [p_oItemId, l_asCiblesBinaire]
      );
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.sync', l_sMsg);
    }
  }

  /**
   * 🪓 Écriture concrète : Assigne une étiquette à une pépite via la fonction stockée royale.
   */
  public async add(p_oItemId: ItemId, p_oTagId: TagId): Promise<void> {
    try {
      await this.db.query('Select public."LierEtiquette"($1, $2);', [p_oItemId, p_oTagId] );
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.add', l_sMsg);
    }
  }

  /**
   * 🪓 Écriture concrète : Supprime l'association Many-to-Many via la fonction stockée royale.
   */
  public async remove(p_oItemId: ItemId, p_oTagId: TagId): Promise<boolean> {
    try {
      const l_oResult = await this.db.query<{ l_bImpacted: boolean } & QueryResultRow>(
        'Select "DelierEtiquette"($1, $2) as "l_bImpacted";', [p_oItemId, p_oTagId] );
      return l_oResult.rows[0]?.l_bImpacted ?? false;
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.remove', l_sMsg);
    }
  }

  /**
   * 🪓 Écriture concrète : Nettoie l'intégralité des étiquettes liées via la fonction stockée royale.
   */
  public async clearForItem(p_oItemId: ItemId): Promise<void> {
    try {
      await this.db.query('Select public."NettoyerEtiquettesPepite"($1);', [p_oItemId]);
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.clearForItem', l_sMsg);
    }
  }

    /**
   * 🔍 Jointure chirurgicale : Extrait toutes les étiquettes rattachées à une pépite 📥.
   * [SCELLÉ V4] Interrogation exclusive de la fonction stockée EtiquettesDunePepite !
   *
   * @public
   * @async
   * @param {ItemId} p_oItemId - L'identifiant fort de la pépite cible
   * @returns {Promise<Tag[]>} Le tableau d'étiquettes réarmé ordonné par nom
   */
  public async findTagsForItem(p_oItemId: ItemId): Promise<Tag[]> {
    try {
      // 🗲 [RACCORDÉ SUR FONCTION STOCKÉE] Plus aucune trace de texte SQL brut en RAM !
      const l_oResult = await this.db.query<ITagRow>(
        'Select * From "EtiquettesDunePepite"($1);', [p_oItemId] );
      return l_oResult.rows.map((l_oLigne: ITagRow) => this.LigneVersTag(l_oLigne));
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('ItemTag.findTagsForItem', l_sMsg);
    }
  }

}
