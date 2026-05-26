// ——— fichier : src/interfaces/repositories/IShareRepository.ts

import type { ItemId,
              ShareId,
              UserId          } from '@/domain/value-objects/IdMetier';
import type { Share           } from '@/entities/Share';
import type { IShareData      } from '@/interfaces/entities/share/IShareData';
import type { IBaseRepository } from '@/interfaces/repositories/IBaseRepository';

/**
 * 🗄️ Interface IShareRepository
 * ----------------------------
 * Contrat d'accès aux données gérant le cycle de vie de persistance des partages (Shares).
 * Orchestre la recherche, la traçabilité des liens d'accès et la sécurisation des tokens.
 *
 * @interface IShareRepository
 * @extends {IBaseRepository<Share, IShareData, ShareId>}
 * @author Joël, Gaïa & Co
 */
export interface IShareRepository extends IBaseRepository<Share, IShareData, ShareId> {

  /** 🔑 Récupère un partage par son jeton de sécurité (token) public d'URL. */
  findByToken(token: string): Promise<Share | null>;

  /** 📦 Récupère l'ensemble des liens de partages configurés pour une pépite spécifique. */
  findByItemId(itemId: ItemId): Promise<Share[]>;

  /** 👥 Récupère l'intégralité des partages créés par un utilisateur (Jointure SQL via les pépites). */
  findByUserId(userId: UserId): Promise<Share[]>;
}
