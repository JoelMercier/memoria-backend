// ——— fichier : src/infrastructure/repositories/TagRepository.ts

import { Pool                 } from 'pg';
import { BaseRepository       } from '@/infrastructure/repositories/BaseRepositories';
import { UserId, TagId        } from '@/domain/value-objects/IdMetier';
import { Tag                  } from '@/entities/Tag';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { TagErrorFactory      } from '@/exceptions/TagErrorFactory';
import type { ITagData        } from '@/interfaces/entities/tag/ITagData';
import type { ITagRepository  } from '@/interfaces/repositories/ITagRepository';

/**
 * 🗄️ Interface ITagRow (Miroir Physique Jojo-Style des Souterrains 🔌)
 */
interface ITagRow {
  tgIdTag         : Buffer;    // 16 octets fixes tassés en RAM
  tgUserId        : Buffer;    // 16 octets fixes tassés en RAM
  tgName          : string;    // Désignation textuelle de l étiquette
  tgCreatedAt     : Date;
  tgUpdatedAt     : Date | null;
}

/**
 * 🏷️ Classe TagRepository 🗄️ (Le Classeur d Étiquettes Système 🤖)
 * ----------------------------------------------------------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Mots-clés.
 * Connecté de manière étanche aux index propriétaires de la Cour Basse [Mémoria].
 *
 * @class TagRepository
 * @extends {BaseRepository}
 * @implements {ITagRepository}
 * @author Déconstruction : Joël (Nostalgique de l'ADA)
 * @author Sculptage de RAM : Gaïa (Génie autoproclamée du burin)
 * @author Ciment Git->Origin : Les Anciens du Donjon (Artisans du temps imparti)
 */
export class TagRepository extends BaseRepository implements ITagRepository {

  /**
   * Initialise le dépôt des étiquettes via le pool global d infrastructure 🔌.
   *
   * @constructor
   * @param {Pool} p_oPool - Le pool de connexions réseau partagé
   */
  public constructor(p_oPool: Pool) {
    super(p_oPool);
  }

  /**
   * Mappe une ligne PostgreSQL brute unifiée vers une entité typée Tag 🔄.
   *
   * @private
   * @param {ITagRow} p_oLigne - La ligne brute extraite de la Cour Basse
   * @returns {Tag} L instance de destination nominale réarmée
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
   * 🔍 Lecture chirurgicale : Localise une étiquette via son identifiant binaire fort 🤖.
   *
   * @public
   * @async
   * @param {TagId} p_oIdTag - L identifiant fort encapsulant le Buffer
   * @returns {Promise<Tag | null>} L entité Domaine réarmée ou null si absent
   */
  public async findById(p_oIdTag: TagId): Promise<Tag | null> {
    try {
      const la_oLignes = await this.executer<ITagRow>(
        'Select * From "Tags" Where "tgIdTag" = $1;',
        [p_oIdTag]
      );
      return la_oLignes && la_oLignes.length > 0 ? this.LigneVersTag(la_oLignes[0]) : null;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('Tag.findById', (l_oErreur as Error).message);
    }
  }

  /**
   * 🔍 Extraction chirurgicale : Récupère toutes les étiquettes rattachées à un acteur 👥.
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L identifiant de l acteur propriétaire
   * @returns {Promise<Tag[]>} Le tableau d étiquettes ordonné par nom
   */
  public async findByUserId(p_oUserId: UserId): Promise<Tag[]> {
    try {
      const la_oLignes = await this.executer<ITagRow>(
        'Select * From "Tags" Where "tgUserId" = $1 Order By "tgName" Asc;',
        [p_oUserId]
      );
      return la_oLignes.map((l_oLigne: ITagRow) => this.LigneVersTag(l_oLigne));
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('Tag.findByUserId', (l_oErreur as Error).message);
    }
  }

  /**
   * 🔍 Localise une étiquette spécifique via son nom normalisé pour un acteur 🔍.
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L identifiant de l acteur propriétaire
   * @param {string} p_sTagName - Le libellé textuel de l étiquette recherchée
   * @returns {Promise<Tag | null>} L instance correspondante ou null
   */
  public async findByName(p_oUserId: UserId, p_sTagName: string): Promise<Tag | null> {
    try {
      const la_oLignes = await this.executer<ITagRow>(
        'Select * From "Tags" Where "tgUserId" = $1 And Lower("tgName") = Lower($2);',
        [p_oUserId, p_sTagName.trim()]
      );
      return la_oLignes && la_oLignes.length > 0 ? this.LigneVersTag(la_oLignes[0]) : null;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('Tag.findByName', (l_oErreur as Error).message);
    }
  }

    /**
   * 🔍 Lecture groupée : Localise un tableau d étiquettes via leurs identifiants binaires 🤖.
   *
   * @public
   * @async
   * @param {ReadonlyArray<TagId>} p_aoIds - Le tableau d identifiants forts du Domaine
   * @returns {Promise<Tag[]>} La liste des étiquettes correspondantes réarmées
   */
  public async findByIds(p_aoIds: ReadonlyArray<TagId>): Promise<Tag[]> {
    if (p_aoIds.length === 0) return [];
    try {
      const la_oBuffers = p_aoIds.map(id => this.toBuffer(id));
      const la_oLignes  = await this.executer<ITagRow>(
        'Select * From "Tags" Where "tgIdTag" = Any($1::bytea[]);',
        [la_oBuffers]
      );
      return la_oLignes.map((l_oLigne: ITagRow) => this.LigneVersTag(l_oLigne));
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('Tag.findByIds', (l_oErreur as Error).message);
    }
  }

  /**
   * 🪓 Écriture concrète : Insère une nouvelle étiquette via le soupirail binaire 🪙.
   *
   * @public
   * @async
   * @param {ITagData} p_oData - Le sac de données de création de l étiquette
   * @returns {Promise<Tag>} L entité Domaine réarmée et retournée
   * @throws {TagErrorFactory} En cas de collision d index unique détectée
   */
  public async create(p_oData: ITagData): Promise<Tag> {
    try {
      const la_oLignes = await this.executer<ITagRow>(
        `Insert Into "Tags" ("tgUserId", "tgName")
         Values ($1, $2) Returning *;`,
        [this.toBuffer(p_oData.userId), p_oData.tagName.trim()]
      );

      if (!la_oLignes || la_oLignes.length === 0) throw TagErrorFactory.creation('Aucun enregistrement renvoyé.');
      // CORRECTION PHYSIQUE : Extraction de l index 0 du tableau ! [Mémoria]
      return this.LigneVersTag(la_oLignes[0]);
    } catch (l_oErreur) {
      if (l_oErreur instanceof TagErrorFactory) throw l_oErreur;
      const l_sMessage = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';

      if (l_sMessage.includes('Tags_tgUserId_tgName_Udx')) {
        throw TagErrorFactory.nameExists(p_oData.userId, p_oData.tagName);
      }
      throw TagErrorFactory.creation(l_sMessage);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles d une étiquette.
   *
   * @public
   * @async
   * @param {TagId} p_oIdTag - L identifiant fort du mot-clé à muter
   * @param {Partial<ITagData>} p_oData - Les modifications partielles soumises
   * @returns {Promise<Tag>} L entité Domaine mise à jour
   */
  public async update(p_oIdTag: TagId, p_oData: Partial<ITagData>): Promise<Tag> {
    const la_sChamps     : string[] = [];
    const la_oParametres : any[]    = [];
    let   l_iCompteur               = 1;

    if (p_oData.tagName !== undefined) { la_sChamps.push(`"tgName" = $${l_iCompteur++}`); la_oParametres.push(p_oData.tagName.trim()); }

    if (la_sChamps.length === 0) {
      const l_oExistant = await this.findById(p_oIdTag);
      if (!l_oExistant) throw TagErrorFactory.notFound(p_oIdTag);
      return l_oExistant;
    }

    la_oParametres.push(this.toBuffer(p_oIdTag));

    try {
      const la_oLignes = await this.executer<ITagRow>(
        `Update "Tags" Set ${la_sChamps.join(', ')} Where "tgIdTag" = $${l_iCompteur} Returning *;`,
        la_oParametres
      );
      if (!la_oLignes || la_oLignes.length === 0) throw TagErrorFactory.notFound(p_oIdTag);
      // CORRECTION PHYSIQUE : Extraction de l index 0 du tableau ! [Mémoria]
      return this.LigneVersTag(la_oLignes[0]);
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('Tag.update', (l_oErreur as Error).message);
    }
  }

  /**
   * 🪓 Destruction physique : Supprime définitivement une étiquette sur le disque 🚨.
   *
   * @public
   * @async
   * @param {TagId} p_oIdTag - L identifiant fort du mot-clé à purger
   * @returns {Promise<boolean>} True si l impact physique est validé
   */
  public async delete(p_oIdTag: TagId): Promise<boolean> {
    try {
      await this.executer<any>(
        'Delete From "Tags" Where "tgIdTag" = $1;',
        [p_oIdTag]
      );
      return true;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('Tag.delete', (l_oErreur as Error).message);
    }
  }

  /**
   * 📜 Contrat d infrastructure : Récupère l intégralité absolue des étiquettes système.
   *
   * @public
   * @async
   * @returns {Promise<Tag[]>} La liste exhaustive ordonnée par ordre alphabétique
   */
  public async findAll(): Promise<Tag[]> {
    try {
      const la_oLignes = await this.executer<ITagRow>('Select * From "Tags" Order By "tgName" Asc;');
      return la_oLignes.map((l_oLigne: ITagRow) => this.LigneVersTag(l_oLigne));
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('Tag.findAll', (l_oErreur as Error).message);
    }
  }
}
