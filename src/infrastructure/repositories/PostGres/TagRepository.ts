// ——— fichier : src/infrastructure/repositories/postgres/TagRepository.ts

import type { QueryResultRow }        from 'pg';
import { BaseRepository }       from '@/infrastructure/repositories/BaseRepositories';
import { UserId, TagId }        from '@/domain/value-objects/ids';
import { Tag }                  from '@/entities/Tag';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { TagErrorFactory }      from '@/exceptions/TagErrorFactory';
import type { ITagData }        from '@/interfaces/entities/tag/ITagData';
import type { ITagRepository }  from '@/interfaces/repositories/PostGres/ITagRepository';
import { IDatabaseConnection }  from '@/interfaces/database/IDatabaseConnection';
import type { IListOptions }         from '@/interfaces/shared/IListOptions';
import type { IListResult }          from '@/interfaces/shared/IListResult';
import OrdreTriEnum                 from '@/constants/OrdreTriEnum';

/**
 * 🗄️ Interface ITagRow (Miroir Physique Jojo-Style des Souterrains 🔌)
 * Calée au caractère près sur l'ordre physique de soute décroissant.
 */
interface ITagRow extends QueryResultRow {
  tgIdTag         : Buffer;    // 16 octets fixes tassés en RAM
  tgUserId        : Buffer;    // 16 octets fixes tassés en RAM
  tgCreatedAt     : Date;
  tgUpdatedAt     : Date | null;
  tgName          : string;    // Désignation textuelle de l'étiquette
  rNbLignesTotal? : string;    // Volumétrie calculée par la fonction stockée
}

/**
 * 🏷️ Classe TagRepository 🗄️ (Le Classeur d'Étiquettes Système 🤖)
 * ----------------------------------------------------------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Mots-clés.
 * Connecté de manière étanche aux fonctions stockées exclusives de la Cour Basse.
 *
 * @class TagRepository
 * @extends {BaseRepository}
 * @implements {ITagRepository}
 * @author Déconstruction : Joël (Nostalgique de l'ADA - True Getters Conversion)
 * @author Sculptage de RAM : Gaïa (Au burin, raccordée sur la Choupy Doctrine V4)
 */
export class TagRepository extends BaseRepository implements ITagRepository {

  /**
   * Initialise le dépôt des étiquettes via le gestionnaire de connexion universel 🔌.
   *
   * @constructor
   * @param {IDatabaseConnection} p_oDb - Le gestionnaire de connexion officiel de la Forge.
   */
  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);
  }

  /**
   * Mappe une ligne PostgreSQL brute unifiée vers une entité typée Tag 🔄.
   * [RÉPARÉ V4] Instanciation POO C++ Style directe sans intermédiaire paresseux !
   *
   * @private
   * @param {ITagRow} p_oLigne - La ligne brute extraite de la Cour Basse
   * @returns {Tag} L'instance de destination nominale réarmée
   */
  private LigneVersTag(p_oLigne: ITagRow): Tag {
    return new Tag({
      idTag     : new TagId(p_oLigne.tgIdTag),   // Passage direct de tampon [Mémoria]
      userId    : new UserId(p_oLigne.tgUserId), // Passage direct de tampon [Mémoria]
      tagName   : p_oLigne.tgName,
      createdAt : p_oLigne.tgCreatedAt,
      updatedAt : p_oLigne.tgUpdatedAt ?? undefined
    } as any);
  }

  /**
   * 🔍 Lecture chirurgicale : Localise une étiquette via son identifiant binaire fort 🤖.
   */
  public async findById(p_oIdTag: TagId): Promise<Tag | null> {
    try {
      const l_oResult = await this.db.query<ITagRow>(
        'Select * From public."TrouverTagParId"($1);',
        [p_oIdTag]
      );
      return l_oResult.rows[0] ? this.LigneVersTag(l_oResult.rows[0]) : null;
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Tag.findById', l_sMsg);
    }
  }

  /**
   * 🔍 Extraction chirurgicale : Récupère toutes les étiquettes rattachées à un acteur 👥.
   * [SCELLÉ V4] Intègre la pagination obligatoire et la lecture sur l'index [0] de volumétrie !
   */
  public async findByUserId(p_oUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Tag>> {
    try {
      const l_nLimit    = p_oOptions.NbLignes ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'ASC';

      const l_oResult = await this.db.query<ITagRow>(
        'Select * From public."ToutesLesEtiquettesDunActeur"($1, $2, $3, $4, $5);',
        [p_oUserId, l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'tgName', l_sOrdreTri]
      );

      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0); // 🪓 [RÉPARÉ TS2339] index [0] ! [Mémoria]
      const l_aoLignes = l_oResult.rows.map((l_oLigne: ITagRow) => this.LigneVersTag(l_oLigne));

      return {
        LigneDebut:    l_nOffset,
        NbLignesDem:   l_nLimit,
        NbLignesRenv:  l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes:        l_aoLignes
      };
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Tag.findByUserId', l_sMsg);
    }
  }

  /**
   * 🔍 Localise une étiquette spécifique via son nom normalisé pour un acteur 🔍.
   */
  public async findByName(p_oUserId: UserId, p_sTagName: string): Promise<Tag | null> {
    try {
      const l_oResult = await this.db.query<ITagRow>(
        'Select * From public."TrouverTagParNom"($1, $2);',
        [p_oUserId, p_sTagName.trim()]
      );
      return l_oResult.rows[0] ? this.LigneVersTag(l_oResult.rows[0]) : null;
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Tag.findByName', l_sMsg);
    }
  }

  /**
   * 🔍 Lecture groupée : Localise un tableau d'étiquettes via leurs identifiants binaires 🤖.
   * [SCELLÉ V4] Raccordé sur la fonction stockée de lot matricielle UUID[] !
   */
  public async findByIds(p_aoIds: ReadonlyArray<TagId>, p_oOptions: IListOptions): Promise<IListResult<Tag>> {
    if (p_aoIds.length === 0) {
      return { LigneDebut: 0, NbLignesDem: p_oOptions.NbLignes, NbLignesRenv: 0, NbLignesTotal: 0, Lignes: [] };
    }
    try {
      const l_nLimit    = p_oOptions.NbLignes ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'ASC';
      const l_asCiblesBinaire = p_aoIds.map((id) => id.valeur);

      const l_oResult = await this.db.query<ITagRow>(
        'Select * From public."ToutesLesEtiquettesParIds"($1::Uuid[], $2, $3, $4, $5);',
        [l_asCiblesBinaire, l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'tgName', l_sOrdreTri]
      );

      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oLigne: ITagRow) => this.LigneVersTag(l_oLigne));

      return {
        LigneDebut:    l_nOffset,
        NbLignesDem:   l_nLimit,
        NbLignesRenv:  l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes:        l_aoLignes
      };
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Tag.findByIds', l_sMsg);
    }
  }

  /**
   * 🪓 Écriture concrète : Insère une nouvelle étiquette via la fonction stockée royale.
   */
  public async create(p_oData: ITagData): Promise<Tag> {
    try {
      const l_oResult = await this.db.query<ITagRow>(
        'Select * From "CreerTag"($1, $2, $3);',
        [p_oData.idTag, p_oData.idUser, p_oData.tagName.trim()]
      );

      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        throw TagErrorFactory.creation('Aucun enregistrement renvoyé.');
      }
      return this.LigneVersTag(l_oResult.rows[0]);
    } catch (l_oErreur) {
      if (l_oErreur instanceof TagErrorFactory) throw l_oErreur;
      const l_sMessage = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';

      if (l_sMessage.includes('Tags_tgUserId_tgName_Udx')) {
        throw TagErrorFactory.nameExists(p_oData.idUser, p_oData.tagName);
      }
      throw TagErrorFactory.creation(l_sMessage);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles d'une étiquette.
   */
  public async update(p_oIdTag: TagId, p_oData: Partial<ITagData>): Promise<Tag> {
    try {
      const l_oResult = await this.db.query<ITagRow>(
        'Select * From "ModifierTag"($1, $2);',
        [p_oIdTag, p_oData.tagName ? p_oData.tagName.trim() : null]
      );

      if (!l_oResult.rows || l_oResult.rows.length === 0) throw TagErrorFactory.notFound(p_oIdTag);
      return this.LigneVersTag(l_oResult.rows[0]);
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Tag.update', l_sMsg);
    }
  }

  /**
   * 🪓 Destruction physique : Supprime définitivement une étiquette sur le disque 🚨.
   */
  public async delete(p_oIdTag: TagId): Promise<boolean> {
    try {
      const l_oResult = await this.db.query('Delete From public."Tags" Where "tgIdTag" = "Bin-UUID"($1);', [p_oIdTag]);
      return (l_oResult.rowCount ?? 0) > 0;
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Tag.delete', l_sMsg);
    }
  }

  /**
   * 📜 VRAI FINDALL CONSTITUTIONNEL V4 🏛️
   * ----------------------------------------------------------------------------
   * Extrait l'intégralité absolue de la table Tags de manière globale (Mode Système/Admin).
   * [BRIDER MEMOIRE] Exige obligatoirement ses options de pagination pour interdire les fuites.
   * [ZÉRO SQL VOLANT] Interroge exclusivement la fonction stockée ToutesLesEtiquettesDuChateau !
   *
   * @public
   * @async
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites universel obligatoires
   * @returns {Promise<IListResult<Tag>>} Le lot de résultats global paginé au standard français d'élite
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<Tag>> {
    try {
      const l_nLimit    = p_oOptions.NbLignes ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'ASC';

      // 🗲 Appel de l'extracteur global de soute sans SQL volant !
      const l_oResult = await this.db.query<ITagRow>(
        'Select * From "ToutesLesEtiquettesDuChateau"($1, $2, $3, $4);',
        [l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'tgName', l_sOrdreTri]
      );

      // 🪓 [RÉPARÉ TS2339] Extraction de la volumétrie absolue calculée sur la première ligne
      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oLigne: ITagRow) => this.LigneVersTag(l_oLigne));

      return {
        LigneDebut:    l_nOffset,
        NbLignesDem:   l_nLimit,
        NbLignesRenv:  l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes:        l_aoLignes
      };
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Tag.findAll', l_sMsg);
    }
  }
}
