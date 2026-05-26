// ——— fichier : src/interfaces/services/ITagService.ts

import      { UserId, TagId } from '@/domain/value-objects/IdMetier';
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
 * @author Joël, Gaïa & Co
 */
export interface ITagService {

  /** 🎯 Crée et persiste une nouvelle étiquette métier pour l'utilisateur. */
  create(userId: UserId, dto: CreateTagDto): Promise<ITag>;

  /** 🔎 Récupère les détails d'un tag après double vérification de propriété. */
  findById(userId: UserId, tagId: TagId): Promise<ITag>;

  /** 📜 Liste l'intégralité des étiquettes détenues par un utilisateur spécifique. */
  listByUser(userId: UserId): Promise<ITag[]>;

  /** 🎛️ Met à jour les propriétés configurables d'un tag existant. */
  update(userId: UserId, tagId: TagId, dto: UpdateTagDto): Promise<ITag>;

  /** 🗑️ Révoque et supprime définitivement une étiquette du système. */
  delete(userId: UserId, tagId: TagId): Promise<void>;
}
