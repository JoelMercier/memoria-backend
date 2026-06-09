// ——— fichier : src/interfaces/services/ITagService.ts

import { IBaseService   } from '@/interfaces/services/IBaseService';
import { UserId, TagId  } from '@/domain/value-objects/ids';
import { ITagRepository } from '@/interfaces/repositories/ITagRepository';

import type { CreateTagDto  } from '@/dto/tag/CreateTagDto';
import type { UpdateTagDto  } from '@/dto/tag/UpdateTagDto';
import type { ITag          } from '@/interfaces/entities/tag/ITag';

/**
 * 📜 Interface ITagService
 * -------------------------
 * Contrat du service applicatif gérant les étiquettes (Tags).
 * Purifiée de ses primitives de transport pour arborer l'armure nominale.
 *
 * @interface ITagService
 * @extends {IBaseService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */

export interface ITagService extends IBaseService<ITagRepository> {
  // L'accesseur "get repository(): TagRepository" est hérité automatiquement !
  // Il ne reste plus qu'à écrire les méthodes spécifiques au Tag.
  /**
   * 🎯 Crée et persiste une nouvelle étiquette métier pour l'utilisateur.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'action
   * @param {CreateTagDto} p_oDto - Les données d'intention pour l'étiquette fraîche
   * @returns {Promise<ITag>} L'entité du tag créé et indexé
   */
  create(p_axUserId: UserId, p_oDto: CreateTagDto): Promise<ITag>;

  /**
   * 🔎 Récupère les détails d'un tag après double vérification de propriété.
   *
   * @param {UserId} p_axUserId - L'identifiant fort de l'acteur qui formule la requête
   * @param {TagId} p_axTagId - L'identifiant binaire unique du tag recherché
   * @returns {Promise<ITag>} L'entité riche du tag réhydraté
   */
  findById(p_axUserId: UserId, p_axTagId: TagId): Promise<ITag>;

  /**
   * 📜 Liste l'intégralité des étiquettes détenues par un utilisateur spécifique.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur cible
   * @returns {Promise<ITag[]>} La collection des tags détenus
   */
  listByUser(p_axUserId: UserId): Promise<ITag[]>;

  /**
   * 🎛️ Met à jour les propriétés configurables d'un tag existant.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur (Contrôle de propriété)
   * @param {TagId} p_axTagId - L'identifiant binaire unique du tag à réviser
   * @param {UpdateTagDto} p_oDto - Le libellé ou l'attribut modifié à appliquer
   * @returns {Promise<ITag>} L'entité du tag modifiée et sauvegardée
   */
  update(p_axUserId: UserId, p_axTagId: TagId, p_oDto: UpdateTagDto): Promise<ITag>;

  /**
   * 🗑️ Révoque et supprime définitivement une étiquette du système.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'ordre d'éradication
   * @param {TagId} p_axTagId - L'identifiant binaire unique du tag à détruire du disque
   * @returns {Promise<void>}
   */
  delete(p_axUserId: UserId, p_axTagId: TagId): Promise<void>;
}
