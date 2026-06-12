// ——— fichier : src/interfaces/services/IShareService.ts

import type { CreateShareDto   } from '@/dto/share/CreateShareDto';
import type { UpdateShareDto   } from '@/dto/share/UpdateShareDto';
import type { IItem            } from '@/interfaces/entities/item/IItem';
import type { IListOptions     } from '@/interfaces/shared/IListOptions';
import type { IListResult      } from '@/interfaces/shared/IListResult';
import type { IShareData       } from '@/interfaces/entities/share/IShareData';
import type { UserId, ShareId  } from '@/domain/value-objects/ids';
import { Share                 } from '@/entities/Share';
import { IBaseService          } from '@/interfaces/services/IBaseService';
import { IShareRepository      } from '@/interfaces/repositories/PostGres/IShareRepository';

/**
 * 📜 Interface IShareService
 * ----------------------------------------------------------------------------
 * Contrat de logique métier régissant le cycle de vie et la sécurité des Partages.
 * Protège les accès aux pépites en exigeant des Value Objects nominalement typés.
 * [ALIGNÉ CONSTITUTIONNEL V4] Raccordement étanche à 4 arguments génériques sur l'ancêtre !
 *
 * @interface IShareService
 * @extends {IBaseService<Share, IShareData, ShareId, IShareRepository>}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IShareService extends IBaseService<Share, IShareData, ShareId, IShareRepository> {

  /**
   * 🔗 Génère un nouveau lien de partage sécurisé et immuable pour une pépite.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'action
   * @param {CreateShareDto} p_oDto - Le dictionnaire de configuration du partage sortant
   * @returns {Promise<Share>} L'entité de partage configurée et de persistance
   */
  create(p_axUserId: UserId, p_oDto: CreateShareDto): Promise<Share>;

  /**
   * 🔎 Récupère le détail d'un partage après double vérification de propriété.
   *
   * @param {UserId} p_axUserId - L'identifiant fort de l'acteur qui formule la requête
   * @param {ShareId} p_axShareId - L'identifiant binaire unique du lien de partage
   * @returns {Promise<Share>} L'entité riche de partage hydratée
   */
  findById(p_axUserId: UserId, p_axShareId: ShareId): Promise<Share>;

  /**
   * 📜 Liste la collection filtrée, ordonnée et obligatoirement paginée des partages détenus par un acteur.
   * [SCELLÉ RECOUVREMENT V4] Intègre constitutionnellement le verrou universel de contrôle anti-fuite.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur cible
   * @param {IListOptions} p_oOptions - Le dictionnaire universel de limites et de tri obligatoire [Mémoria]
   * @returns {Promise<IListResult<Share>>} Le lot d'état structuré en français d'élite avec volumétrie absolue [Mémoria]
   */
  listByUser(p_axUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Share>>;

  /**
   * 🎛️ Modifie la configuration ou les restrictions d'accès d'un partage actif.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur (Contrôle de propriété)
   * @param {ShareId} p_axShareId - L'identifiant binaire unique du lien à réviser
   * @param {UpdateShareDto} p_oDto - Le lot de restrictions ou options modifiées à appliquer
   * @returns {Promise<Share>} L'entité de partage révisée et sauvegardée
   */
  update(p_axUserId: UserId, p_axShareId: ShareId, p_oDto: UpdateShareDto): Promise<Share>;

  /**
   * 🗑️ Révoque Clos et supprime définitivement un lien de partage du système.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'ordre d'éradication
   * @param {ShareId} p_axShareId - L'identifiant binaire unique du lien de partage à détruire
   * @returns {Promise<void>}
   */
  delete(p_axUserId: UserId, p_axShareId: ShareId): Promise<void>;

  /**
   * 🌐 Passerelle publique : Localise une pépite via son jeton anonyme d'URL.
   *
   * @param {string} p_sToken - La chaîne du jeton cryptographique compact d'accès public
   * @returns {Promise<IItem>} L'entité de la pépite rattachée pour affichage anonyme
   */
  findItemByToken(p_sToken: string): Promise<IItem>;
}
