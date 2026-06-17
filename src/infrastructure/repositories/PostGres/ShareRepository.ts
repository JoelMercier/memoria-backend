// ——— fichier : src/infrastructure/repositories/PostGres/ShareRepository.ts

import type { QueryResultRow }      from 'pg';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IAccessConfig }       from '@/interfaces/entities/share/IAccessConfig';
import type { IShareData }          from '@/interfaces/entities/share/IShareData';
import type { IListOptions }        from '@/interfaces/shared/IListOptions';
import type { IListResult }         from '@/interfaces/shared/IListResult';
import type { IShareRepository }    from '@/interfaces/repositories/PostGres/IShareRepository';

import { BaseRepository }       from '@/infrastructure/repositories/BaseRepositories';
import { UserId, ItemId, ShareId } from '@/domain/value-objects/ids';
import { Share }                from '@/entities/Share';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { ShareErrorFactory }    from '@/exceptions/ShareErrorFactory';
import { OrdreTriEnum }         from '@/constants/OrdreTriEnum';

/**
 * 🗄️ Interface interne calée au bit près sur le stockage physique décroissant de la table "Shares"
 */
interface IShareRow extends QueryResultRow {
  shIdShare      : string;        //-- UUID natif PostgreSQL reçu en string.
  shItemId       : string;        //-- UUID natif PostgreSQL reçu en string.
  shItemOwnerId  : string;        //-- UUID natif PostgreSQL reçu en string.
  shCreatedAt    : Date;          //-- 8 octets fixes (Timestamp).
  shUpdatedAt    : Date | null;   //-- 8 octets fixes (Timestamp).
  shCourrielDest : string | null; //-- Taille variable.
  shAccesJeton   : string;        //-- Alignement nominal sur le dictionnaire.
  shAccesConfig  : IAccessConfig; //-- Alignement nominal sur le dictionnaire.
  rNbLignesTotal?: string;        //-- Volumétrie calculée par le château.
}


/**
 * 🗄️ Classe ShareRepository 💎
 * ----------------------------------------------------------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Partages.
 */
export class ShareRepository extends BaseRepository implements IShareRepository {
  /**
   * Initialise le dépôt de partage et hérite de la classe mère.
   */
  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);
  }

  /**
   * Mappe une ligne PostgreSQL brute (snake_case) vers une entité vivante Share (CamelCase).
   */
  private rowToShare(p_oRow: IShareRow): Share {
    return new Share({
      idShare       : new ShareId(p_oRow.shIdShare),
      itemId        : new ItemId(p_oRow.shItemId),
      itemOwnerId   : new UserId(p_oRow.shItemOwnerId),
      courrielDest  : p_oRow.shCourrielDest,
      jeton         : p_oRow.shAccesJeton,            //-- Lié sur shAccesJeton.
      configuration : p_oRow.shAccesConfig,           //-- Lié sur shAccesConfig.
      createdAt     : p_oRow.shCreatedAt,
      updatedAt     : p_oRow.shUpdatedAt ?? undefined
    });
  }


  /**
   * 🔍 Lecture chirurgicale : Localise un partage via son identifiant nominal fort.
   */
  public async findById(p_axIdShare: ShareId): Promise<Share | null> {
    try {
      const l_oResult = await this.db.query<IShareRow>(
        'Select * From public."TrouverPartageParId"($1);',
        [p_axIdShare.valeur]
      );

      return l_oResult.rows && l_oResult.rows.length > 0
        ? this.rowToShare(l_oResult.rows[0])
        : null;

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findById / TrouverPartageParId', l_sMsg);
    }
  }


  /**
   * 🔍 Alignement nominal : Récupère un privilège d'accès via son jeton sécurisé.
   */
  public async findByToken(p_sToken: string): Promise<Share | null> {
    try {
      const l_oResult = await this.db.query<IShareRow>(
        'Select * From public."TrouverPartageParJeton"($1);',
        [p_sToken.trim()]
      );

      return l_oResult.rows && l_oResult.rows.length > 0
        ? this.rowToShare(l_oResult.rows[0])
        : null;

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findByToken / TrouverPartageParJeton', l_sMsg);
    }
  }



  /**
   * 🔍 Extraction ciblée : Récupère les partages attachés à une pépite.
   */
  public async findByItemId(
    p_axItemId : ItemId,
    p_oOptions : IListOptions
  ): Promise<IListResult<Share>> {
    try {
      const l_nLimit    = p_oOptions.NbLignes   ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';

      const l_oResult = await this.db.query<IShareRow>(
        'Select * From public."TousLesPartagesDunePepite"($1, $2, $3, $4, $5);',
        [
          p_axItemId.binaire,                                   //-- Flux binaire brut ByteA préservé sans conversion.
          l_nLimit,
          l_nOffset,
          p_oOptions.ColonneTri ?? 'shCreatedAt',
          l_sOrdreTri
        ]
      );

      const l_nTotal   = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((row) => this.rowToShare(row));

      return {
        LigneDebut    : l_nOffset,
        NbLignesDem   : l_nLimit,
        NbLignesRenv  : l_aoLignes.length,
        NbLignesTotal : l_nTotal,
        Lignes        : l_aoLignes
      };

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findByItemId / TousLesPartagesDunePepite', l_sMsg);
    }
  }


  /**
   * 🔍 Jointure croisée ultra-rapide : Énumère les partages d'un utilisateur.
   */
  public async findByUserId(
    p_axUserId : UserId,
    p_oOptions : IListOptions
  ): Promise<IListResult<Share>> {
    try {
      const l_nLimit    = p_oOptions.NbLignes   ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';

      const l_oResult = await this.db.query<IShareRow>(
        'Select * From public."TousLesPartagesDunActeur"($1, $2, $3, $4, $5);',
        [
          p_axUserId.binaire,                                   //-- Flux binaire brut ByteA préservé sans conversion.
          l_nLimit,
          l_nOffset,
          p_oOptions.ColonneTri ?? 'shCreatedAt',
          l_sOrdreTri
        ]
      );

      const l_nTotal   = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((row) => this.rowToShare(row));

      return {
        LigneDebut    : l_nOffset,
        NbLignesDem   : l_nLimit,
        NbLignesRenv  : l_aoLignes.length,
        NbLignesTotal : l_nTotal,
        Lignes        : l_aoLignes
      };

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findByUserId / TousLesPartagesDunActeur', l_sMsg);
    }
  }


  /**
   * 📜 VRAI FINDALL CONSTITUTIONNEL V4 🏛️
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<Share>> {
    try {
      const l_nLimit    = p_oOptions.NbLignes   ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';

      const l_oResult = await this.db.query<IShareRow>(
        'Select * From public."TousLesPartagesDuChateau"($1, $2, $3, $4);',
        [l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'shCreatedAt', l_sOrdreTri]
      );

      const l_nTotal   = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((row) => this.rowToShare(row));

      return {
        LigneDebut    : l_nOffset,
        NbLignesDem   : l_nLimit,
        NbLignesRenv  : l_aoLignes.length,
        NbLignesTotal : l_nTotal,
        Lignes        : l_aoLignes
      };

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findAll / TousLesPartagesDuChateau', l_sMsg);
    }
  }

  /**
   * 🪓 Écriture concrète : Insère un nouveau droit de partage via la turbine de soute.
   */
  public async create(p_oData: IShareData): Promise<Share> {
    try {
      const l_oResult = await this.db.query<IShareRow>(
        'Select * From public."CreerPartage"($1, $2, $3, $4, $5, $6);',
        [
          p_oData.idShare.binaire,                              //-- Flux binaire brut ByteA préservé sans conversion [1.1].
          p_oData.itemId.binaire,                               //-- Flux binaire brut ByteA préservé sans conversion [1.1].
          p_oData.itemOwnerId.binaire,                          //-- Flux binaire brut ByteA préservé sans conversion [1.1].
          p_oData.courrielDest,
          p_oData.jeton,
          JSON.stringify(p_oData.configuration ?? {})
        ]
      );

      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        throw ShareErrorFactory.creation('La turbine "CreerPartage" n\'a retourné aucune ligne.');
      }

      return this.rowToShare(l_oResult.rows[0]);

    } catch (l_oErr) {
      if (l_oErr instanceof ShareErrorFactory) throw l_oErr;
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw ShareErrorFactory.creation(`Share.create / CreerPartage : ${l_sMsg}`);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles du Domaine.
   */
  public async update(p_axIdShare: ShareId, p_oData: Partial<IShareData>): Promise<Share> {
    try {
      const l_oResult = await this.db.query<IShareRow>(
        'Select * From public."ModifierPartage"($1, $2, $3);',
        [
          p_axIdShare.binaire,                                  //-- Flux binaire brut ByteA préservé sans conversion [1.1].
          p_oData.courrielDest   ?? null,
          p_oData.configuration  ? JSON.stringify(p_oData.configuration) : null
        ]
      );

      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        throw ShareErrorFactory.notFound(p_axIdShare.valeur);   //-- Conserve l'affichage textuel pour le message d'erreur.
      }

      return this.rowToShare(l_oResult.rows[0]);

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.update / ModifierPartage', l_sMsg);
    }
  }


  /**
   * 🪓 Destruction atomique : Révoque définitivement un droit de partage.
   */
  public async delete(p_axIdShare: ShareId): Promise<boolean> {
    try {
      const l_oResult = await this.db.query<{ l_bImpacted: boolean }>(
        'Select public."RevoquerPartage"($1) as "l_bImpacted";',
        [p_axIdShare.binaire]                                 //-- Flux binaire brut ByteA préservé sans conversion [1.1].
      );

      return l_oResult.rows && l_oResult.rows.length > 0
        ? l_oResult.rows[0].l_bImpacted
        : false;

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.delete / RevoquerPartage', l_sMsg);
    }
  }



  /**
   * 🏛️ Extracteur universel d'administration pour le grand fichier des partages du château.
   */
  public async findAllShares(p_oOptions: IListOptions): Promise<IListResult<Share>> {
    try {
      // 1. Extraction et valeurs de repli militaires pour la pagination et le tri [Mémoria]
      const l_nLimit    = p_oOptions.NbLignes   ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';

      // 2. Appel à l'injecteur réseau via le canal officiel et typé .query<IShareRow> [Mémoria]
      const l_oResult = await this.db.query<IShareRow>(
        'Select * From public."TousLesPartagesDuChateau"($1, $2, $3, $4);',
        [l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'shCreatedAt', l_sOrdreTri]
      );

      // 3. Extraction sécurisée du compteur de performance de soute depuis la première ligne [Mémoria]
      const l_nTotal = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);

      // 4. Métamorphose de la meute de lignes physiques via ton convertisseur rowToShare [Mémoria]
      const l_aoLignes = l_oResult.rows.map((row) => this.rowToShare(row));

      // 5. Restituteur Universel Paginé et Tracé nominal d'excellence [Mémoria]
      return {
        LigneDebut    : l_nOffset,
        NbLignesDem   : l_nLimit,
        NbLignesRenv  : l_aoLignes.length,
        NbLignesTotal : l_nTotal,
        Lignes        : l_aoLignes
      };


    } catch (l_oErr) {
      // 6. Emballage réglementaire par la manufacture d'exceptions [Mémoria]
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Share.findAllShares', l_sMsg);
    }
  }


}
export default ShareRepository;
