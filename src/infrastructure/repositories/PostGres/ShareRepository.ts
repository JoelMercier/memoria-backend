// ——— fichier : src/infrastructure/repositories/ShareRepository.ts

import type { QueryResultRow } from 'pg';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IAccessConfig } from '@/interfaces/entities/share/IAccessConfig';
import type { IShareData } from '@/interfaces/entities/share/IShareData';
import type { IListOptions } from '@/interfaces/shared/IListOptions';
import type { IListResult } from '@/interfaces/shared/IListResult';
import type { IShareRepository } from '@/interfaces/repositories/PostGres/IShareRepository';

import { BaseRepository } from '@/infrastructure/repositories/BaseRepositories';
import { UserId, ItemId, ShareId } from '@/domain/value-objects/ids';
import { Share } from '@/entities/Share';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { ShareErrorFactory } from '@/exceptions/ShareErrorFactory';
import { OrdreTriEnum } from '@/constants/OrdreTriEnum';

/**
 * 🗄️ Interface interne calée au bit près sur le stockage physique décroissant de la table "Shares"
 * [RÉPARÉ V4] Aligné au caractère près sur les préfixes physiques unifiés "sh" de la base.
 */
interface IShareRow extends QueryResultRow {
  shIdShare: Buffer; // 16 octets fixes tassés en RAM
  shItemId: Buffer; // 16 octets fixes tassés en RAM
  shItemOwnerId: Buffer; // 16 octets fixes tassés en RAM (Dé-normalisé !)
  shCreatedAt: Date;
  shUpdatedAt: Date | null;
  shCourrielDest: string | null;
  shJeton: string;
  shConfiguration: IAccessConfig;
  rNbLignesTotal?: string; // Volumétrie calculée par le chateau
}

/**
 * 🗄️ Classe PgShareRepository 💎
 * ----------------------------------------------------------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Partages.
 * Centralise et sécurise les flux en soute via les fonctions stockées d'élite.
 *
 * @class ShareRepository
 * @extends {BaseRepository}
 * @implements {IShareRepository}
 * @author Vision : Joël (Architecte DR-DOS - True Getters Alignement)
 * @author Frapperie du code : Gaïa (Au burin, raccordée sur la Choupy Doctrine V4)
 */
export class ShareRepository extends BaseRepository implements IShareRepository {
  /**
   * Initialise le dépôt de partage et hérite de la classe mère.
   *
   * @constructor
   * @param {IDatabaseConnection} p_oDb - L'instance de connexion active de Cour Basse
   */
  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);
  }

  /**
   * Mappe une ligne PostgreSQL brute (snake_case) vers une entité vivante Share (CamelCase).
   * [RÉPARÉ V4] Utilise exclusivement le nouveau contrat d'écurie IShareData épuré.
   *
   * @private
   * @param {IShareRow} p_oRow - La ligne brute PostgreSQL
   * @returns {Share} L'entité vivante du Domaine hydratée
   */
  private rowToShare(p_oRow: IShareRow): Share {
    return new Share({
      idShare: new ShareId(p_oRow.shIdShare),
      itemId: new ItemId(p_oRow.shItemId),
      itemOwnerId: new UserId(p_oRow.shItemOwnerId), // Alimentation de la colonne performante !
      courrielDest: p_oRow.shCourrielDest,
      jeton: p_oRow.shJeton,
      configuration: p_oRow.shConfiguration,
      createdAt: p_oRow.shCreatedAt,
      updatedAt: p_oRow.shUpdatedAt ?? undefined
    });
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un partage via son identifiant nominal fort.
   * [SCELLÉ V4] Interrogation exclusive de la fonction stockée TrouverPartageParId !
   *
   * @public
   * @async
   * @param {ShareId} p_axIdShare - L'identifiant fort de soute
   * @returns {Promise<Share | null>} L'instance du partage ou null
   */
  public async findById(p_axIdShare: ShareId): Promise<Share | null> {
    try {
      // 🗲 Raccordement direct sur le tir laser de la base
      const l_oResult = await this.db.query<IShareRow>('Select * From "TrouverPartageParId"($1);', [
        p_axIdShare
      ]);
      return l_oResult.rows[0] ? this.rowToShare(l_oResult.rows[0]) : null;
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findById', l_sMsg);
    }
  }

  /**
   * 🔍 Alignement nominal : Récupère un privilège d'accès via son jeton sécurisé.
   * [SCELLÉ V4] Interrogation exclusive de la fonction stockée TrouverPartageParJeton !
   *
   * @public
   * @async
   * @param {string} p_sToken - Le jeton d'URL cryptographique recherché (shJeton)
   * @returns {Promise<Share | null>} L'instance du partage ou null
   */
  public async findByToken(p_sToken: string): Promise<Share | null> {
    try {
      // 🗲 Raccordement direct sur le tir laser de la base
      const l_oResult = await this.db.query<IShareRow>(
        'Select * From "TrouverPartageParJeton"($1);',
        [p_sToken.trim()]
      );
      return l_oResult.rows[0] ? this.rowToShare(l_oResult.rows[0]) : null;
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findByToken', l_sMsg);
    }
  }

  /**
   * 🔍 Extraction ciblée : Récupère les partages attachés à une pépite.
   * [RÉPARÉ V4] Intègre la pagination obligatoire et utilise la fonction stockée dédiée !
   */
  public async findByItemId(
    p_axItemId: ItemId,
    p_oOptions: IListOptions
  ): Promise<IListResult<Share>> {
    try {
      const l_nLimit = p_oOptions.NbLignes ?? 50;
      const l_nOffset = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri =
        p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';

      const l_oResult = await this.db.query<IShareRow>(
        'Select * From "TousLesPartagesDunePepite"($1, $2, $3, $4, $5);',
        [p_axItemId, l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'shCreatedAt', l_sOrdreTri]
      );

      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((row) => this.rowToShare(row));

      return {
        LigneDebut: l_nOffset,
        NbLignesDem: l_nLimit,
        NbLignesRenv: l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes: l_aoLignes
      };
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findByItemId', l_sMsg);
    }
  }

  /**
   * 🔍 Jointure croisée ultra-rapide : Énumère les partages d'un utilisateur.
   * [PULVÉRISÉ] Plus aucun INNER JOIN Items ! Utilisation directe de la colonne dé-normalisée shItemOwnerId indexée.
   */
  public async findByUserId(
    p_axUserId: UserId,
    p_oOptions: IListOptions
  ): Promise<IListResult<Share>> {
    try {
      const l_nLimit = p_oOptions.NbLignes ?? 50;
      const l_nOffset = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri =
        p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';

      const l_oResult = await this.db.query<IShareRow>(
        'Select * From "TousLesPartagesDunActeur"($1, $2, $3, $4, $5);',
        [p_axUserId, l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'shCreatedAt', l_sOrdreTri]
      );

      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((row) => this.rowToShare(row));

      return {
        LigneDebut: l_nOffset,
        NbLignesDem: l_nLimit,
        NbLignesRenv: l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes: l_aoLignes
      };
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findByUserId', l_sMsg);
    }
  }

  /**
   * 📜 VRAI FINDALL CONSTITUTIONNEL V4 🏛️
   * ----------------------------------------------------------------------------
   * Extrait l'intégralité absolue de la table Shares de manière globale (Mode Système/Admin).
   * [BRIDER MEMOIRE] Exige obligatoirement ses options de pagination pour interdire les fuites.
   * [ZÉRO SQL VOLANT] Interroge exclusivement la fonction stockée TousLesPartagesDuChateau !
   *
   * @public
   * @async
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites universel obligatoires
   * @returns {Promise<IListResult<Share>>} Le lot de résultats global paginé au standard français d'élite
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<Share>> {
    try {
      const l_nLimit = p_oOptions.NbLignes ?? 50;
      const l_nOffset = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri =
        p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';

      // 🗲 Appel de l'extracteur global de soute sans SQL volant !
      const l_oResult = await this.db.query<IShareRow>(
        'Select * From "TousLesPartagesDuChateau"($1, $2, $3, $4);',
        [l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'shCreatedAt', l_sOrdreTri]
      );

      // Extraction de la volumétrie sur la première ligne retournée par la fonction stockée
      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((row) => this.rowToShare(row));

      return {
        LigneDebut: l_nOffset,
        NbLignesDem: l_nLimit,
        NbLignesRenv: l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes: l_aoLignes
      };
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findAll', l_sMsg);
    }
  }

  /**
   * 🪓 Écriture concrète : Insère un nouveau droit de partage.
   * [SCELLÉ V4] Interrogation exclusive de la fonction stockée CreerPartage !
   */
  public async create(p_oData: IShareData): Promise<Share> {
    try {
      const l_oResult = await this.db.query<IShareRow>(
        'Select * From "CreerPartage"($1, $2, $3, $4, $5, $6);',
        [
          p_oData.idShare,
          p_oData.itemId,
          p_oData.itemOwnerId,
          p_oData.courrielDest,
          p_oData.jeton,
          p_oData.configuration
        ]
      );

      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        throw ShareErrorFactory.creation('No row returned from INSERT in shares');
      }

      return this.rowToShare(l_oResult.rows[0]);
    } catch (l_oErr) {
      if (l_oErr instanceof ShareErrorFactory) throw l_oErr;
      const l_sMsg: string = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw ShareErrorFactory.creation(l_sMsg);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles du Domaine.
   * [RÉPARÉ V4] Utilise les propriétés CamelCase épurées 3NF de IShareData !
   *
   * @public
   * @async
   * @param {ShareId} p_axIdShare - L'identifiant fort de soute du partage à modifier
   * @param {Partial<IShareData>} p_oData - Les colonnes partielles soumises par le service
   * @returns {Promise<Share>} L'entité mise à jour
   */

  public async update(p_axIdShare: ShareId, p_oData: Partial<IShareData>): Promise<Share> {
    try {
      const l_oResult = await this.db.query<IShareRow>(
        'Select * From "ModifierPartage"($1, $2, $3);',
        [p_axIdShare, p_oData.courrielDest ?? null, p_oData.configuration ?? null]
      );

      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        throw ShareErrorFactory.notFound(p_axIdShare.toString());
      }

      return this.rowToShare(l_oResult.rows[0]);
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.update', l_sMsg);
    }
  }

  /**
   * 🪓 Destruction atomique : Révoque définitivement un droit de partage.
   *
   * @public
   * @async
   * @param {ShareId} p_axIdShare - L'identifiant unique fort de soute
   * @returns {Promise<boolean>} True si la suppression physique a eu lieu
   */

  public async delete(p_axIdShare: ShareId): Promise<boolean> {
    try {
      const l_oResult = await this.db.query<{ l_bImpacted: boolean } & QueryResultRow>(
        'Select "RevoquerPartage"($1) as "l_bImpacted";',
        [p_axIdShare]
      );
      return l_oResult.rows[0]?.l_bImpacted ?? false;
    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.delete', l_sMsg);
    }
  }
}
