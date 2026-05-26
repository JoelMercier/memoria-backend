// ——— fichier : src/interfaces/services/IShareService.ts

import type { CreateShareDto  } from '@/dto/share/CreateShareDto';
import type { UpdateShareDto  } from '@/dto/share/UpdateShareDto';
import type { IItem           } from '@/interfaces/entities/item/IItem';
import type { IShare          } from '@/interfaces/entities/share/IShare';
import type { UserId, ShareId } from '@/domain/value-objects/IdMetier';

/**
 * 📜 Interface IShareService
 * --------------------------
 * Contrat de logique métier régissant le cycle de vie et la sécurité des Partages.
 * Protège les accès aux pépites en exigeant des Value Objects nominalement typés.
 *
 * @interface IShareService
 * @author Joël, Gaïa & Co
 */
export interface IShareService {

  /**
   * 🔗 Génère un nouveau lien de partage sécurisé et immuable pour une pépite.
   */
  create(userId: UserId, dto: CreateShareDto): Promise<IShare>;

  /**
   * 🔎 Récupère le détail d'un partage après double vérification de propriété.
   */
  findById(userId: UserId, shareId: ShareId): Promise<IShare>;

  /**
   * 📜 Liste l'intégralité des partages détenus par un utilisateur spécifique.
   */
  listByUser(userId: UserId): Promise<IShare[]>;

  /**
   * 🎛️ Modifie la configuration ou les restrictions d'accès d'un partage actif.
   */
  update(userId: UserId, shareId: ShareId, dto: UpdateShareDto): Promise<IShare>;

  /**
   * 🗑️ Révoque et supprime définitivement un lien de partage du système.
   */
  delete(userId: UserId, shareId: ShareId): Promise<void>;

  /**
   * 🌐 Passerelle publique : Localise une pépite via son jeton anonyme d'URL.
   */
  findItemByToken(token: string): Promise<IItem>;

}
