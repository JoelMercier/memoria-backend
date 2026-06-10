// ——— fichier : src/interfaces/services/ITagService.ts

import { IBaseService }     from '@/interfaces/services/IBaseService';
import { UserId, TagId }    from '@/domain/value-objects/ids';
import { ITagRepository }   from '@/interfaces/repositories/PostGres/ITagRepository'; // 🗲 [RÉPARÉ CASSE]
import { Tag }              from '@/entities/Tag'; // 🗲 [INJECTÉ V4]
import type { ITagData }    from '@/interfaces/entities/tag/ITagData'; // 🗲 [INJECTÉ V4]
import type { CreateTagDto } from '@/dto/tag/CreateTagDto';
import type { UpdateTagDto } from '@/dto/tag/UpdateTagDto';
import type { IListOptions } from '@/interfaces/shared/IListOptions'; // 🗲 [INJECTÉ V4]
import type { IListResult }  from '@/interfaces/shared/IListResult';  // 🗲 [FRANÇAIS D'ÉLITE]

/**
 * 📜 Interface ITagService
 * ----------------------------------------------------------------------------
 * Contrat du service applicatif gérant les étiquettes (Tags).
 * Purifiée de ses primitives de transport pour arborer l'armure nominale.
 * [ALIGNÉ CONSTITUTIONNEL V4] Raccordement étanche à 4 arguments génériques sur l'ancêtre !
 *
 * @interface ITagService
 * @extends {IBaseService<Tag, ITagData, TagId, ITagRepository>}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface ITagService extends IBaseService<Tag, ITagData, TagId, ITagRepository> {

  /**
   * 🎯 Crée et persiste une nouvelle étiquette métier pour l'utilisateur.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'action
   * @param {CreateTagDto} p_oDto - Les données d'intention pour l'étiquette fraîche
   * @returns {Promise<Tag>} L'entité du tag créé et indexé
   */
  create(p_axUserId: UserId, p_oDto: CreateTagDto): Promise<Tag>;

  /**
   * 🔎 Récupère les détails d'un tag après double vérification de propriété.
   *
   * @param {UserId} p_axUserId - L'identifiant fort de l'acteur qui formule la requête
   * @param {TagId} p_axTagId - L'identifiant binaire unique du tag recherché
   * @returns {Promise<Tag>} L'entité riche du tag réhydraté
   */
  findById(p_axUserId: UserId, p_axTagId: TagId): Promise<Tag>;

  /**
   * 📜 Liste la collection filtrée, ordonnée et obligatoirement paginée des étiquettes détenues par un acteur.
   * [SCELLÉ RECOUVREMENT V4] Protecteur officiel de la RAM contre les fuites de soute.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur cible
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoire [Mémoria]
   * @returns {Promise<IListResult<Tag>>} Le lot de résultats paginé au standard français d'élite [Mémoria]
   */
  listByUser(p_axUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Tag>>;

  /**
   * 🗛 Met à jour les propriétés configurables d'un tag existant.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur (Contrôle de propriété)
   * @param {TagId} p_axTagId - L'identifiant binaire unique du tag à réviser
   * @param {UpdateTagDto} p_oDto - Le libellé ou l'attribut modifié à appliquer
   * @returns {Promise<Tag>} L'entité du tag modifiée et sauvegardée
   */
  update(p_axUserId: UserId, p_axTagId: TagId, p_oDto: UpdateTagDto): Promise<Tag>;

  /**
   * 🗑️ Révoque et supprime définitivement une étiquette du système.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'ordre d'éradication
   * @param {TagId} p_axTagId - L'identifiant binaire unique du tag à détruire du disque
   * @returns {Promise<void>}
   */
  delete(p_axUserId: UserId, p_axTagId: TagId): Promise<void>;
}
