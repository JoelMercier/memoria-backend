// ——— fichier : src/interfaces/repositories/IShareRepository.ts

import { UserId, ItemId, ShareId } from '@/domain/value-objects/IdMetier';
import type { Share } from '@/entities/Share';
import type { IShareData } from '@/interfaces/entities/share/IShareData';
import type { IWriteableRepository } from '@/interfaces/repositories/IWriteableRepository';

/**
 * 🗄️ Interface IShareRepository
 * ----------------------------
 * Contrat d'accès aux données gérant le cycle de vie de persistance des partages (Shares).
 * Orchestre la recherche, la traçabilité des liens d'accès et la sécurisation des tokens.
 * Hérite du droit de modification et de suppression via le contrat IWriteableRepository.
 *
 * @interface IShareRepository
 * @extends {IWriteableRepository<Share, IShareData, ShareId>}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export interface IShareRepository extends IWriteableRepository<Share, IShareData, ShareId> {

  /** 🔑 Récupère un partage par son jeton de sécurité (token) public d'URL. */
  findByToken(token: string): Promise<Share | null>;

  /** 📦 Récupère l'ensemble des liens de partages configurés pour une pépite spécifique. */
  findByItemId(itemId: ItemId): Promise<Share[]>;

  /** 👥 Récupère l'intégralité des partages créés par un utilisateur (Jointure SQL via les pépites). */
  findByUserId(userId: UserId): Promise<Share[]>;
}
