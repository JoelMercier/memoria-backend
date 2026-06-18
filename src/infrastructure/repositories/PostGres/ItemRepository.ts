// ——— fichier : src/infrastructure/repositories/PostGres/ItemRepository.ts

import type { QueryResultRow      } from 'pg';
import type { JsonLégitime        } from '@/types/shared/JsonLégitime';
import type { IListResult         } from '@/interfaces/shared/IListResult';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IItemData           } from '@/interfaces/entities/item/IItemData';
import type { IItemRepository,
              IItemRepositoryListOptions } from '@/interfaces/repositories/PostGres/IItemRepository';

import { OrdreTriEnum                  } from '@/constants/OrdreTriEnum';
import { UserId, ItemId, ContentTypeId } from '@/domain/value-objects/ids';
import { Item                          } from '@/entities/Item';
import { BaseRepository                } from '@/infrastructure/repositories/BaseRepositories';
import { DatabaseErrorFactory          } from '@/exceptions/DatabaseErrorFactory';
import { ItemErrorFactory              } from '@/exceptions/ItemErrorFactory';

/**
 * 🗄️ Interface IItemRow (Miroir Physique Jojo-Style des Pépites 🔌)
 * Alignée au caractère près sur l'ordre physique décroissant anti-padding de la table Items.
 */
interface IItemRow extends QueryResultRow {
  itIdItem        : Buffer;        //-- [SCELLÉ] 16 octets binaires ByteA compacts en RAM.
  itUserId        : Buffer;        //-- [SCELLÉ] 16 octets binaires ByteA compacts en RAM.
  itCreatedAt     : Date;          //-- 8 octets fixes (Timestamp).
  itUpdatedAt     : Date | null;   //-- 8 octets fixes (Timestamp).
  itContentTypeId : string;        //-- 4 octets fixes (Char(4)).
  itLibelle       : string;        //-- Taille variable.
  itSlug          : string;        //-- Taille variable.
  itAuteurSource  : string;        //-- Taille variable.
  itThumbnailUrl  : string | null; //-- Taille variable.
  itMetadata      : JsonLégitime;  //-- JSONB flexible.
  itContent       : string;        //-- Contenu textuel lourd en fin de tas.
  rNbLignesTotal? : string;        //-- Volumétrie calculée par le chateau.
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
   * Version: 4.2.1 (Alignement total sur le franconien de soute V4)
   */
  private rowToItem(p_oRow: IItemRow): Item {
    return new Item({
      idItem        : new ItemId(p_oRow.itIdItem),
      idUser        : new UserId(p_oRow.itUserId),
      contentTypeId : new ContentTypeId(p_oRow.itContentTypeId),
      libelle       : p_oRow.itLibelle,
      slug          : p_oRow.itSlug,
      content       : p_oRow.itContent,
      auteurSource  : p_oRow.itAuteurSource,
      thumbnailUrl  : p_oRow.itThumbnailUrl ?? undefined,
      metadata      : p_oRow.itMetadata,
      createdAt     : p_oRow.itCreatedAt,
      updatedAt     : p_oRow.itUpdatedAt ?? undefined
    });
  }


  /**
   * @description 🔍 Localise une pépite via son identifiant de soute et son propriétaire.
   * Version: 4.2.2 (RAM Binaire Pure - Passage de barrière UUID vers PostgreSQL)
   *
   * @param   {ItemId} p_axIdItem - L'identifiant fort de la pépite (Objet de valeur encapsulant le Buffer de 16 octets).
   * @param   {UserId} p_axIdUser - L'identifiant de l'acteur propriétaire demandeur (Verrou d'isolation).
   * @returns {Promise<Item | null>} L'entité Item réhydratée si trouvée, ou null si le tas est vide ou usurpé.
   * @throws  {DatabaseError} Si la tuyauterie ou le tir laser SQL subit une avarie mécanique.
   */
  public async findById(p_axIdItem: ItemId, p_axIdUser: UserId): Promise<Item | null> {
    try {
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."TrouverPepiteParId"($1, $2);',
        [
          p_axIdItem.binaire,
          p_axIdUser.binaire
        ]
      );

      if (l_oResult.rows && l_oResult.rows.length > 0) {
        return this.rowToItem(l_oResult.rows[0]);
      }

      return null;
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.findById / TrouverPepiteParId', l_sMsg);
    }
  }


    /**
   * @description 🔍 ALIGNEMENT NOMINAL : Récupère une pépite par son permalien utilisateur unique.
   * [SCELLÉ JOCAS V4] Vrai tir laser sur index composite unique, sans aucune pagination !
   *
   * @async
   * @param   {UserId} p_axUserId - L'identifiant fort de l'acteur (Encapsulant le Buffer de 16 octets) [1.1].
   * @param   {string} p_sSlug - Le permalien textuel nettoyé recherché sur le disque [1.1].
   * @returns {Promise<Item | null>} L'entité Item réhydratée ou null si le permalien est inconnu.
   * @throws  {DatabaseError} Si la turbine SQL subit une avarie ou un timeout de soute.
   */
  public async findBySlug(p_axUserId: UserId, p_sSlug: string): Promise<Item | null> {
    try {
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."TrouverPepiteParSlug"($1, $2);',
        [
          p_axUserId.binaire,           // ⚡ Transmission du Buffer compact de 16 octets en RAM [1.1].
          p_sSlug.trim().toLowerCase()  // 🧼 Nettoyage nominal et passage en minuscules de sécurité [1.1].
        ]
      );

      if (l_oResult.rows && l_oResult.rows.length > 0) {
        return this.rowToItem(l_oResult.rows[0]);
      }

      return null;
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.findBySlug / TrouverPepiteParSlug', l_sMsg);
    }
  }


  /**
   * @description 🔍 VÉRIFICATION ANTI-DOUBLON : Localise un libellé existant dans l'espace d'un utilisateur.
   * [SCELLÉ JOCAS V4] Vrai tir laser sur index composite unique, sans aucune pagination !
   *
   * @async
   * @param   {UserId} p_axUserId - L'identifiant fort de l'acteur (Encapsulant le Buffer de 16 octets) [1.1].
   * @param   {string} p_sLibelle - Le libellé nominal brut recherché à la douane anti-collision [1.1].
   * @returns {Promise<Item | null>} L'entité Item réhydratée ou null si le libellé est libre.
   * @throws  {DatabaseError} Si la tuyauterie ou le tir laser SQL subit une avarie mécanique.
   */
  public async findByLibelle(p_axUserId: UserId, p_sLibelle: string): Promise<Item | null> {
    try {
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."TrouverPepiteParLibelle"($1, $2);',
        [
          p_axUserId.binaire,  // ⚡ Transmission du Buffer compact de 16 octets en RAM [1.1].
          p_sLibelle.trim()    // 🧼 Nettoyage nominal des espaces superflus avant le tir [1.1].
        ]
      );

      if (l_oResult.rows && l_oResult.rows.length > 0) {
        return this.rowToItem(l_oResult.rows[0]);
      }

      return null;
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.findByLibelle / TrouverPepiteParLibelle', l_sMsg); // 💎 [RÉPARÉ V4] Alignement de la trace nominale [1.1].
    }
  }


  /**
   * @description 📊 PAGINATION & FILTRE : Énumère le coffre-fort d'un acteur de manière segmentée et paginée.
   * [BRIDER MEMOIRE] Exploite l'enveloppe générique d'IHM et s'aligne sur les variables sacrées Jojo-Style.
   *
   * @async
   * @param   {UserId} p_axUserId - L'identifiant fort de l'acteur (Encapsulant le Buffer de 16 octets) [1.1].
   * @param   {IItemRepositoryListOptions} p_oOptions - Le dictionnaire de configuration de tri, filtres et limites [1.1].
   * @returns {Promise<IListResult<Item>>} Le lot de résultats paginé et structuré en français d'élite [1.1].
   * @throws  {DatabaseError} Si la tuyauterie ou la turbine dynamique SQL subit une avarie mécanique.
   */
  public async listByUser(p_axUserId: UserId, p_oOptions: IItemRepositoryListOptions): Promise<IListResult<Item>> {
    try {
      // Détermination sécurisée de l'ordre de tri à partir de l'énumération de soute
      const l_eOrdreTri =
        p_oOptions.OrdreAff instanceof OrdreTriEnum
          ? p_oOptions.OrdreAff
          : OrdreTriEnum.DeCode<OrdreTriEnum>('DESC');

      // Interrogation chirurgicale de la fonction d'extraction dynamique
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."ToutesLesPepites"($1, $2, $3, $4, $5, $6, $7);',
        [
          p_axUserId.binaire,                           // ⚡ Passage sous pavillon Buffer ByteA en RAM [1.1].
          p_oOptions.contentTypeId?.valeur ?? null,     // 🔌 [RÉPARÉ V4] Alignement sur .valeur au lieu de .value !!!.
          p_oOptions.MotsCles ? `%${p_oOptions.MotsCles}%` : null, // 🧼 Préparation du pattern ILIKE [1.1].
          p_oOptions.ColonneTri ?? 'itCreatedAt',       // Colonne cible validée en amont par quote_ident.
          l_eOrdreTri.code,                             // Direction validée par whitelisting dans la fonction SQL.
          p_oOptions.NbLignes ?? 50,                    // Limite de fenêtrage (Limit).
          p_oOptions.LigneDebut ?? 0                    // Décalage de soute (Offset).
        ]
      );

      // 🛡️ [BLINDAGE TAS VIDE] : Si la requête ne ramène rien, on évite d'inspecter l'index 0
      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        return {
          LigneDebut    : p_oOptions.LigneDebut ?? 0,
          NbLignesDem   : p_oOptions.NbLignes   ?? 50,
          NbLignesRenv  : 0,
          NbLignesTotal : 0,
          Lignes        : []
        };
      }

      // Extraction analytique du compteur Over() sur la première ligne
      const l_nTotal   = Number(l_oResult.rows[0].rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.rowToItem(l_oRow));

      return {
        LigneDebut    : p_oOptions.LigneDebut ??  0,
        NbLignesDem   : p_oOptions.NbLignes   ?? 50,
        NbLignesRenv  : l_aoLignes.length,
        NbLignesTotal : l_nTotal,
        Lignes        : l_aoLignes
      };
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.listByUser / ToutesLesPepites', l_sMsg);
    }
  }


  /**
   * @description 🪓 ÉCRITURE CONCRÈTE : Insère une nouvelle pépite d'or via la turbine d'élite SQL.
   * [BRIDER MEMOIRE] Valide l'absence de collision sur les indexes composites uniques avant persistance.
   *
   * @async
   * @param   {IItemData} p_oData - Le contrat de données passif d'infrastructure encapsulant l'état initial.
   * @returns {Promise<Item>} L'entité Item réhydratée après son passage en base.
   * @throws  {ItemError} Si le libellé existe, si le slug existe, ou si la turbine renvoie un tas vide.
   */
  public async create(p_oData: IItemData): Promise<Item> {
    try {
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."CreerPepite"($1, $2, $3, $4, $5, $6, $7, $8, $9);',
        [
          p_oData.idItem.binaire,                // ⚡ Identifiant 128 bits compact en RAM.
          p_oData.idUser.binaire,                // ⚡ Identifiant propriétaire compact en RAM.
          p_oData.contentTypeId.valeur,          // 🔌 Alignement sur .valeur
          p_oData.libelle.trim(),                // 🧼 Nettoyage nominal des espaces.
          p_oData.slug,                          // Permalien calculé en RAM.
          p_oData.content,                       // Corps textuel lourd.
          p_oData.auteurSource.trim(),           // 🧼 Origine nettoyée.
          p_oData.thumbnailUrl ?? null,          // Illustration optionnelle.
          p_oData.metadata ?? {}                 // 📦 [RÉPARÉ V4] Objet envoyé natif pour l'injecteur JsonB direct [1.1].
        ]
      );

      const l_oRow = l_oResult.rows[0];
      if (!l_oRow) {
        throw ItemErrorFactory.creation('La turbine "CreerPepite" n\'a retourné aucune ligne.');
      }

      return this.rowToItem(l_oRow);
    } catch (l_oError) {
      if (l_oError instanceof ItemErrorFactory) {
        throw l_oError;
      }

      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown / CreerPepite';

      // 🛡️ Interception et déroutement chirurgical des violations de contraintes uniques
      if (l_sMsg.includes('Items_itUserId_itLibelle_Udx')) {
        throw ItemErrorFactory.libelleExists(p_oData.idUser, p_oData.libelle); // 💎 [RÉPARÉ V4] Alignement nominal libelleExists [1.1].
      }

      if (l_sMsg.includes('Items_itUserId_itSlug_Udx')) {
        throw ItemErrorFactory.slugExists(p_oData.idUser, p_oData.slug);
      }

      throw ItemErrorFactory.creation(l_sMsg);
    }
  }

  /**
   * @description 🪓 MUTATION DYNAMIQUE : Applique des modifications partielles sur une pépite via sa turbine SQL dédiée.
   * [SCELLÉ JOCAS V4] Exploite les filtres Coalesce natifs de PostgreSQL pour économiser une lecture en RAM.
   *
   * @async
   * @param   {ItemId} p_axIdItem - L'identifiant fort de la pépite cible à réviser (Buffer 16 octets) [1.1].
   * @param   {Partial<IItemData>} p_oData - Le lot partiel d'attributs modifiés à appliquer sur le disque [1.1].
   * @returns {Promise<Item>} L'entité Item révisée et réhydratée après sa mutation.
   * @throws  {ItemError} Si la pépite est introuvable ou si la soute a subi une violation de contrainte.
   */
  public async update(p_axIdItem: ItemId, p_oData: Partial<IItemData>): Promise<Item> {
    try {
      // 🛡️ [DOUBLE VERROU] L'identifiant de l'acteur ordonnateur est requis pour sécuriser la mutation partielle
      if (!p_oData.idUser) {
        throw ItemErrorFactory.modification("Impossible d'altérer une soute sans l'identifiant de l'acteur propriétaire.");
      }

      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."ModifierPepite"($1, $2, $3, $4, $5, $6, $7, $8, $9);',
        [
          p_axIdItem.binaire,                           // ⚡ Identifiant de la pépite.
          p_oData.idUser.binaire,                       // ⚡ Identifiant binaire de l'acteur (Verrou de sécurité) [1.1].
          p_oData.contentTypeId?.valeur ?? null,        // 🔌 Alignement sur votre précieux .valeur V4 [1.1].
          p_oData.libelle?.trim()       ?? null,        // 🧼 Si indéterminé, Coalesce SQL conserve l'existant.
          p_oData.slug                  ?? null,
          p_oData.content               ?? null,
          p_oData.auteurSource?.trim()  ?? null,        // 💎 Alignement franconien pur.
          p_oData.thumbnailUrl          ?? null,        // Géré nativement par la coalescence PostgreSQL.
          p_oData.metadata              ?? null         // 📦 Objet direct pour la machinerie JsonB [1.1].
        ]
      );

      const l_oRow = l_oResult.rows[0];
      if (!l_oRow) {
        throw ItemErrorFactory.notFound(p_axIdItem);
      }

      return this.rowToItem(l_oRow);
    } catch (l_oError) {
      if (l_oError instanceof ItemErrorFactory) {
        throw l_oError;
      }
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.update / ModifierPepite', l_sMsg);
    }
  }


  /**
   * @description 🪓 DESTRUCTION PHYSIQUE : Supprime une pépite du disque dur via son identifiant unique fort.
   * [SCELLÉ JOJO-STYLE V4] Surcharge par arité optionnelle pour isolation de soute ou administration globale.
   *
   * @async
   * @param   {ItemId} p_axIdItem - L'identifiant unique fort de la pépite à éradiquer (Buffer 16 octets) [1.1].
   * @param   {UserId} [p_axUserId] - L'identifiant optionnel du propriétaire (Verrou de sécurité d'isolation) [1.1].
   * @returns {Promise<boolean>} Vrai si la suppression physique a bien été confirmée par le tas.
   * @throws  {ItemErrorFactory} Si la turbine de soute subit une avarie mécanique ou un rejet de droits.
   */
  public async delete(p_axIdItem: ItemId, p_axUserId?: UserId): Promise<boolean> {
    try {
      // 🛡️ Si l'acteur est spécifié, on utilise le double verrouillage de sécurité de soute
      if (p_axUserId) {
        const l_oResult = await this.db.query<IItemRow>(
          'Select * From public."SupprimerPepite"($1, $2);', // 🔋 [RÉPARÉ] Raccordement nominal parfait [1.1].
          [
            p_axIdItem.binaire, // ⚡ Buffer compact 16 octets.
            p_axUserId.binaire  // 🔒 Verrou d'isolation d'acteur.
          ]
        );
        return (l_oResult.rows && l_oResult.rows.length > 0);
      }

      // 🏰 Si aucun acteur n'est fourni, repli sur l'administration globale (Réservé au Château)
      const l_oResultAdmin = await this.db.query<IItemRow>(
        'Delete From public."Items" Where "itIdItem" = $1 Returning *;',
        [p_axIdItem.binaire]
      );
      return (l_oResultAdmin.rows && l_oResultAdmin.rows.length > 0);
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw ItemErrorFactory.suppression(l_sMsg); // 💎 [RÉPARÉ V4] Utilisation de la munition dédiée de la fabrique [1.1].
    }
  }


  /**
   * @description 📜 VRAI FINDALL CONSTITUTIONNEL V4 🏛️
   * [BRIDER MEMOIRE] Interdiction absolue d'extraire des lignes sans options de soute paginées.
   * Extraction universellement débridée pour le grand fichier des pépites gérées au Château.
   *
   * @async
   * @param   {IItemRepositoryListOptions} p_oOptions - Le dictionnaire de configuration de tri et limites [1.1].
   * @returns {Promise<IListResult<Item>>} Le grand livre d'administration paginé en français d'élite [1.1].
   * @throws  {DatabaseError} Si la tuyauterie ou la turbine dynamique globale subit une avarie.
   */
  public async findAll(p_oOptions: IItemRepositoryListOptions): Promise<IListResult<Item>> {
    try {
      const l_nLimit   = p_oOptions.NbLignes   ?? 50;
      const l_nOffset  = p_oOptions.LigneDebut ?? 0;
      const l_eOrdreTri =
        p_oOptions.OrdreAff instanceof OrdreTriEnum
          ? p_oOptions.OrdreAff
          : OrdreTriEnum.DeCode<OrdreTriEnum>('DESC');

      // Interrogation chirurgicale de la fonction d'extraction d'administration globale
      const l_oResult = await this.db.query<IItemRow>(
        'Select * From public."ToutesLesPepitesDuChateau"($1, $2, $3, $4);', // 🔋 [RÉPARÉ V4] Raccordement nominal parfait [1.1].
        [
          l_nLimit,                                   // Nombre de lignes maximal réclamé.
          l_nOffset,                                  // Index de décalage de soute.
          p_oOptions.ColonneTri ?? 'itCreatedAt',     // Identifiant de la colonne cible (nettoyé via quote_ident).
          l_eOrdreTri.code                            // Code technique de direction du tri.
        ]
      );

      // 🛡️ [BLINDAGE TAS VIDE] : Si le Château n'a aucune pépite en soute, on coupe court proprement
      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        return {
          LigneDebut    : l_nOffset,
          NbLignesDem   : l_nLimit,
          NbLignesRenv  : 0,
          NbLignesTotal : 0,
          Lignes        : []
        };
      }

      const l_nTotal   = Number(l_oResult.rows[0].rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.rowToItem(l_oRow));

      return {
        LigneDebut    : l_nOffset,
        NbLignesDem   : l_nLimit,
        NbLignesRenv  : l_aoLignes.length,
        NbLignesTotal : l_nTotal,
        Lignes        : l_aoLignes
      };
    } catch (l_oError) {
      const l_sMsg = l_oError instanceof Error ? l_oError.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('Item.findAll / ToutesLesPepitesDuChateau', l_sMsg);
    }
  }
}

export default ItemRepository;
