// ——— fichier : src\infrastructure\repositories\PostGres\AppEventRepository.ts

import type { QueryResultRow       } from 'pg';
import type { JsonLégitime         } from '@/types/shared/JsonLégitime';
import type { IDatabaseConnection  } from '@/interfaces/database/IDatabaseConnection';
import type { IListOptions         } from '@/interfaces/shared/IListOptions';
import type { IListResult          } from '@/interfaces/shared/IListResult';
import type { IAppEventRepository,
              IAppEventListOptions,
              IAppEventListResult  } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IAppEventData        } from '@/interfaces/entities/event/IAppEventData';
import type { CategorieId, SeveriteId           } from '@/domain/value-objects/ids';

import { Action               } from '@/constants/Actions';
import { Categorie            } from '@/constants/Categories';
import { Secteur              } from '@/constants/Secteurs';
import { Severite             } from '@/constants/Severites';
import { BaseRepository       } from '@/infrastructure/repositories/BaseRepositories';
import { OrdreTriEnum         } from '@/constants/OrdreTriEnum';
import { EventId, UserId      } from '@/domain/value-objects/ids';
import { AppEvent             } from '@/entities/AppEvent';
import { AppEventErrorFactory } from '@/exceptions/AppEventErrorFactory';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';


interface IAppEventRow extends QueryResultRow {
  aeIdEvent       : string;                                     //-- Retour UUID PostgreSQL 17+ natif [1.1].
  aeUserId        : string | null;                              //-- Retour UUID PostgreSQL 17+ natif [1.1].
  aeCategorieId   : string;                                     //-- Code brut Char(4) (ex: 'SYST') [1.1].
  aeSeveriteId    : string;                                     //-- Code brut Char(4) (ex: 'INFO') [1.1].
  aeSecteurId     : string;                                     //-- Code brut Char(4) (ex: 'AUTH') [1.1].
  aeActionId      : string;                                     //-- Code brut Char(4) (ex: 'CONN') [1.1].
  aeMessage       : string;                                     //-- Contenu Text long d'audit [1.1].
  aeMetadata      : JsonLégitime;                               //-- Armure geek récursive universelle ! [1.1]
  aeCreatedAt     : Date;
  totalCount?     : string | number;                            //-- Compteur issu de "FiltrerJournaux" [1.1].
  rNbLignesTotal? : string | number;                            //-- [INSÉRÉ V4] Compteur d'élite issu de "ToutesLesTraces" [1.1] !
}


export class AppEventRepository extends BaseRepository implements IAppEventRepository {

  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);
  }


  /**
   * Mappe une ligne PostgreSQL brute (snake_case préfixée ae) vers une entité vivante AppEvent (CamelCase).
   */
  private rowToAppEvent(p_oRow: IAppEventRow) : AppEvent {
    // 1. Extraction sécurisée du dictionnaire de métadonnées sans aucun "any"
    const l_oMetaNettoye = typeof p_oRow.aeMetadata === 'string'
      ? (JSON.parse(p_oRow.aeMetadata) as Record<string, JsonLégitime>)
      : (p_oRow.aeMetadata as Record<string, JsonLégitime> ?? {});

    // 2. Reconstruction nominale et rigoureuse du contrat IAppEventData de ton domaine
    return new AppEvent({
      idEvent   : new EventId(p_oRow.aeIdEvent),                  //-- Lecture directe de la colonne aeIdEvent [1.1].
      userId    : p_oRow.aeUserId ? new UserId(p_oRow.aeUserId) : null, //-- Lecture directe de la colonne aeUserId [1.1].
      categorie : Categorie.DeCode<Categorie>(p_oRow.aeCategorieId), //-- Résolution de l'instance unique en RAM [1.1].
      secteur   : Secteur.DeCode<Secteur>(p_oRow.aeSecteurId),       //-- Résolution de l'instance unique en RAM [1.1].
      action    : Action.DeCode<Action>(p_oRow.aeActionId),           //-- Résolution de l'instance unique en RAM [1.1].
      severite  : Severite.DeCode<Severite>(p_oRow.aeSeveriteId),     //-- Résolution de l'instance unique en RAM [1.1].
      message   : p_oRow.aeMessage,
      metadata  : l_oMetaNettoye,
      createdAt : p_oRow.aeCreatedAt
    });
  }


  /**
   * 🪓 Écriture Append-Only : Consigne un nouvel événement d'audit via la turbine de soute.
   */
  public async create(p_oData: IAppEventData): Promise<AppEvent> {
    try {
      //-- [RÉPARÉ V4] Extraction et conversion au format brut de soute PostgreSQL [1.1]
      const l_sMetadataJson = JSON.stringify(p_oData.metadata ?? {});

      const l_oResult = await this.db.query<IAppEventRow>(
        'Select * From public."ConsignerEvenement"($1, $2, $3, $4, $5, $6, $7, $8);',
        [
          p_oData.idEvent.binaire,                              //-- Flux binaire brut ByteA (UUID v7) sans conversion [1.1].
          p_oData.userId ? p_oData.userId.binaire : null,       //-- Flux binaire brut ByteA (UUID v4) ou null [1.1].
          p_oData.categorie.code,                               //-- Quadrigramme brut de l'Enum (ex: 'SYST') [1.1].
          p_oData.severite.code,                                //-- Quadrigramme brut de l'Enum (ex: 'CRIT') [1.1].
          p_oData.secteur.code,                                 //-- Quadrigramme brut de l'Enum (ex: 'AUTH') [1.1].
          p_oData.action.code,                                  //-- Quadrigramme brut de l'Enum (ex: 'CONN') [1.1].
          p_oData.message,
          l_sMetadataJson                                       //-- Chaîne JSON sérialisée proprement pour le jsonb [1.1].
        ]
      );

      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        throw AppEventErrorFactory.creation('Share.create / ConsignerEvenement : Aucun enregistrement renvoyé lors de la consignation.');
      }

      return this.rowToAppEvent(l_oResult.rows[0]);

    } catch (l_oErr) {
      if (l_oErr instanceof AppEventErrorFactory) throw l_oErr;
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';

      //-- Interception chirurgicale de la contrainte de clé étrangère PostgreSQL
      if (l_sMsg.includes('Events_aeUserId_Fkey')) {
        const l_oIdInconnu = p_oData.userId ?? new UserId(Buffer.from('00000000000000000000000000000000', 'hex'));
        throw AppEventErrorFactory.userIdUnknown(l_oIdInconnu);
      }

      throw AppEventErrorFactory.creation(`Share.create / ConsignerEvenement : ${l_sMsg}`);
    }
  }


  /**
   * 🔍 Lecture chirurgicale : Localise un événement d'audit unique via son identifiant de soute 🤖.
   *
   * @public
   * @async
   * @param {EventId} p_axEventId - L'identifiant fort de la trame de log (Segment binaire ByteA)
   * @returns {Promise<AppEvent | null>} L'instance de l'événement d'audit réarmée ou null
   */
  public async findById(p_axEventId: EventId) : Promise<AppEvent | null> {
    try {
      //-- [SCELLÉ V4] Appel de la turbine dédiée sur index unique (Préparable à 100% par PostgreSQL) [1.1]
      const l_oResult = await this.db.query<IAppEventRow>(
        'Select * From public."ObtenirEvenementParId"($1);',
        [p_axEventId.valeur]                                  //-- Pousse l'UUID sous forme de string normalisée [1.1].
      );

      //-- Restituteur nominal : extraction de la première ligne unique du tableau
      return l_oResult.rows && l_oResult.rows.length > 0
        ? this.rowToAppEvent(l_oResult.rows[0])
        : null;

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('AppEventRepository.findById / ObtenirEvenementParId', l_sMsg);
    }
  }


  /**
   * 📜 Extrait une population filtrée et obligatoirement paginée via la fonction stockée d'élite.
   */
  public async listByOptions(p_oOptions: IAppEventListOptions) : Promise<IAppEventListResult> {
    try {
      // 1. Déballage des limites réglementaires et des tris de surface V4.4
      const l_nLimit    = p_oOptions.NbLignes   ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sColonne  = p_oOptions.ColonneTri ?? 'aeCreatedAt';

      //-- Extraction sécurisée de la directive SQL ('ASC' / 'DESC' / '') depuis ton SmartEnum [1.1]
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum
        ? p_oOptions.OrdreAff.clauseSql
        : OrdreTriEnum.oDecroissant.clauseSql;

      // 2. Appel nominal à la fonction stockée dynamique "ToutesLesTraces" [1.1]
      const l_oResult = await this.db.query<IAppEventRow>(
        'Select * From public."ToutesLesTraces"($1, $2, $3, $4, $5, $6, $7, $8, $9);',
        [
          p_oOptions.userId      ? p_oOptions.userId     .valeur : null, //-- UUID string [1.1].
          p_oOptions.secteurId   ? p_oOptions.secteurId  .valeur : null, //-- Char(4) ou null [1.1].
          p_oOptions.actionId    ? p_oOptions.actionId   .valeur : null, //-- Char(4) ou null [1.1].
          p_oOptions.categorieId ? p_oOptions.categorieId.valeur : null, //-- Char(4) ou null [1.1].
          p_oOptions.severiteId  ? p_oOptions.severiteId .valeur : null, //-- Char(4) ou null [1.1].
          l_nLimit,
          l_nOffset,
          l_sColonne,
          l_sOrdreTri
        ]
      );

      // 3. Si la soute est vide, restitution nominale immédiate de la structure de contrôle
      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        return {
          AppEvents   : [],
          TotalEvents : 0
        };
      }

      // 4. Extraction sécurisée du compteur universel de soute rNbLignesTotal ou totalCount [1.1]
      const l_nFirstRow      = l_oResult.rows[0];
      const l_nTotalAbsolute = Number(l_nFirstRow.rNbLignesTotal ?? l_nFirstRow.totalCount ?? 0);
      const l_aoEvents       = l_oResult.rows.map((row) => this.rowToAppEvent(row));

      // 5. Restituteur Normalisé de Traces d'IHM d'excellence
      return {
        AppEvents   : l_aoEvents,
        TotalEvents : l_nTotalAbsolute
      };

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('AppEventRepository.listByOptions / ToutesLesTraces', l_sMsg);
    }
  }


  /**
   * 📊 Calcule la volumétrie totale absolue de tous les journaux stockés sur le disque.
   * [SCELLÉ PERF V4] Appel exclusif de la fonction stockée d'estimation instantanée (0% I/O) [1.1].
   *
   * @public
   * @async
   * @returns {Promise<number>} Le nombre total estimé d'enregistrements dans la table Events
   */
  public async count() : Promise<number> {
    try {
      //-- [SCELLÉ V4] Interdiction absolue des Select bruts. Passage par la turbine réglementaire [1.1].
      const l_oResult = await this.db.query<{ CompterEvenementsInstantane: string } & QueryResultRow>(
        'Select public."CompterEvenements"();'
      );

      return l_oResult.rows && l_oResult.rows.length > 0
        ? Math.max(0, Math.floor(Number(l_oResult.rows[0].CompterEvenementsInstantane)))
        : 0;

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('AppEventRepository.count / CompterEvenements', l_sMsg);
    }
  }


  /**
   * 🪙 Extraction historique ciblée par acteur, respectant la pagination universelle de soute.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant unique universel (UUID) de l'utilisateur cible
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri, limites et pages initié par l'IHM
   * @returns {Promise<IAppEventListResult>} L'enveloppe normalisée contenant le lot et le compte total
   */
  public async findByUserId(p_axUserId: UserId, p_oOptions: IListOptions) : Promise<IAppEventListResult> {
    try {
      //-- [RÉPARÉ V4] Déploiement du sac d'options universel fusionné avec l'identité de l'acteur [1.1]
      return await this.listByOptions({
        ...p_oOptions,
        userId     : p_axUserId,                                  //-- Injecte le filtre acteur obligatoire [1.1].
        ColonneTri : p_oOptions.ColonneTri ?? 'aeCreatedAt',      //-- Repli nominal sur la date d'enregistrement [1.1].
        OrdreAff   : p_oOptions.OrdreAff   ?? OrdreTriEnum.oDecroissant //-- Repli nominal sur le Choupy de secours V4 [1.1].
      });

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('AppEventRepository.findByUserId', l_sMsg);
    }
  }

  /**
   * 🪙 Extraction historique filtrée par sévérité stricte, assortie de la pagination universelle.
   *
   * @public
   * @async
   * @param {SeveriteId} p_axSeveriteId - L'identifiant fort de l'objet sévérité riche (ex: 'CRIT')
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri, limites et pages initié par l'IHM
   * @returns {Promise<IAppEventListResult>} L'enveloppe normalisée contenant le lot et le compte total
   */
  public async findBySeverite(p_axSeveriteId: SeveriteId, p_oOptions: IListOptions) : Promise<IAppEventListResult> {
    try {
      //-- [RÉPARÉ V4] Fusion nominale des options de l'IHM avec le filtre de criticité de soute [1.1]
      return await this.listByOptions({
        ...p_oOptions,
        severiteId : p_axSeveriteId,                             //-- Injecte le palier de sévérité requis [1.1].
        ColonneTri : p_oOptions.ColonneTri ?? 'aeCreatedAt',      //-- Repli nominal sur l'horloge système [1.1].
        OrdreAff   : p_oOptions.OrdreAff   ?? OrdreTriEnum.oDecroissant //-- Utilisation directe de l'instance statique de RAM [1.1].
      });

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('AppEventRepository.findBySeverite', l_sMsg);
    }
  }


  /**
   * 🪙 Extraction historique filtrée par catégorie fonctionnelle, assortie de la pagination universelle.
   *
   * @public
   * @async
   * @param {CategorieId} p_axCategorieId - L'identifiant fort de la catégorie applicative (ex: 'SYST')
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri, limites et pages initié par l'IHM
   * @returns {Promise<IAppEventListResult>} L'enveloppe normalisée contenant le lot et le compte total
   */
  public async findByCategorie(p_axCategorieId: CategorieId, p_oOptions: IListOptions) : Promise<IAppEventListResult> {
    try {
      //-- [RÉPARÉ V4] Fusion nominale des options de surface avec le filtre de domaine de catégorie [1.1]
      return await this.listByOptions({
        ...p_oOptions,
        categorieId : p_axCategorieId,                            //-- Injecte le filtre catégorie obligatoire [1.1].
        ColonneTri  : p_oOptions.ColonneTri ?? 'aeCreatedAt',      //-- Repli nominal sur la date d'enregistrement [1.1].
        OrdreAff    : p_oOptions.OrdreAff   ?? OrdreTriEnum.oDecroissant //-- Utilisation de l'instance statique de RAM [1.1].
      });

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('AppEventRepository.findByCategorie', l_sMsg);
    }
  }


  /**
   * 👥 Rompt le lien ombilical avec l'acteur pour les logs de plus de 6 mois (Anonymisation RGPD de masse).
   *
   * @public
   * @async
   * @param {Date} p_dDateCutoff - La date pivot au-delà de laquelle les IDs acteurs sont effacés
   * @returns {Promise<number>} Le nombre de lignes d'audit nettoyées en base de données
   */
  public async anonymiserLogsActeurs(p_dDateCutoff: Date) : Promise<number> {
    try {
      //-- [SCELLÉ V4] Interdiction du SQL en dur. Passage par la turbine d'entretien du château [1.1]
      const l_oResult = await this.db.query<{ AnonymiserAnciensLogs: number } & QueryResultRow>(
        'Select public."AnonymiserAnciensLogs"($1);',
        [p_dDateCutoff]
      );

      return l_oResult.rows && l_oResult.rows.length > 0
        ? Number(l_oResult.rows[0])
        : 0;

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('AppEventRepository.anonymiserLogsActeurs / AnonymiserAnciensLogs', l_sMsg);
    }
  }


  /**
   * 📜 ANCÊTRE OBLIGATOIRE : Raccordé sur le standard générique français d'élite.
   *
   * @public
   * @async
   * @param {IListOptions} p_oOptions - Le dictionnaire universel de pagination et de tri d'IHM
   * @returns {Promise<IListResult<AppEvent>>} Le conteneur normalisé paginé
   */
  public async findAll(p_oOptions: IListOptions) : Promise<IListResult<AppEvent>> {
    try {
      const l_nLimit    = p_oOptions.NbLignes   ?? 50;
      const l_nOffset   = p_oOptions.LigneDebut ?? 0;
      const l_sColonne  = p_oOptions.ColonneTri ?? 'aeCreatedAt';

      //-- Extraction de la directive PostgreSQL pure depuis ton SmartEnum d'élite [1.1]
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum
        ? p_oOptions.OrdreAff.clauseSql
        : OrdreTriEnum.oDecroissant.clauseSql;

      //-- [RÉPARÉ V4] Appel à la vraie fonction stockée ToutesLesTraces à 9 paramètres [1.1]
      const l_oResult = await this.db.query<IAppEventRow>(
        'Select * From public."ToutesLesTraces"($1, $2, $3, $4, $5, $6, $7, $8, $9);',
        [
          null,        //-- p_axUserId (Tout remonter) [1.1]
          null,        //-- p_cSecteurId (Tout remonter) [1.1]
          null,        //-- p_cActionId (Tout remonter) [1.1]
          null,        //-- p_cCategorieId (Tout remonter) [1.1]
          null,        //-- p_cSeveriteId (Tout remonter) [1.1]
          l_nLimit,
          l_nOffset,
          l_sColonne,
          l_sOrdreTri
        ]
      );

      //-- Si la soute est vide, restitution nominale immédiate
      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        return {
          LigneDebut    : l_nOffset,
          NbLignesDem   : l_nLimit,
          NbLignesRenv  : 0,
          NbLignesTotal : 0,
          Lignes        : []
        };
      }

      //-- Extraction sécurisée de la volumétrie absolue issue de rNbLignesTotal
      const l_nTotal   = Number(l_oResult.rows[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.rowToAppEvent(l_oRow));

      //-- Restituteur Universel Paginé et Tracé nominal d'excellence
      return {
        LigneDebut    : l_nOffset,
        NbLignesDem   : l_nLimit,
        NbLignesRenv  : l_aoLignes.length,
        NbLignesTotal : l_nTotal,
        Lignes        : l_aoLignes
      };

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('AppEventRepository.findAll / ToutesLesTraces', l_sMsg);
    }
  }


  /**
   * 🪓 Destruction physique définitive de toutes les traces de plus d'un an du disque.
   *
   * @public
   * @async
   * @param {Date} p_dDateCutoff - La date pivot au-delà de laquelle tout est carbonisé
   * @returns {Promise<number>} Le nombre de lignes d'audit supprimées sur PostgreSQL
   */
  public async deleteOlderThan(p_dDateCutoff: Date) : Promise<number> {
    try {
      //-- [SCELLÉ V4] Appel exclusif de la turbine stockée d'entretien de masse en Security Definer [1.1]
      const l_oResult = await this.db.query<{ PurgerAnciensLogs: number } & QueryResultRow>(
        'Select public."PurgerAnciensLogs"($1);',
        [p_dDateCutoff]
      );

      return l_oResult.rows && l_oResult.rows.length > 0
        ? Number(l_oResult.rows[0])
        : 0;

    } catch (l_oErr) {
      const l_sMsg = l_oErr instanceof Error ? l_oErr.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('AppEventRepository.deleteOlderThan / PurgerAnciensLogs', l_sMsg);
    }
  }

}
