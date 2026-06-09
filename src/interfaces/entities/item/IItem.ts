// ——— fichier : src/interfaces/entities/item/IItem.ts

import type { ContentType } from '@/constants/ContentType';
import { UserId,
         ItemId              } from '@/domain/value-objects/ids';
import type { IEntity        } from '@/interfaces/entities/IEntity';
import type { IItemData      } from '@/interfaces/entities/item/IItemData';

/**
 * 📜 Interface IItem
 * ------------------
 * Contrat d'accès en lecture de l'entité Pépite (Item).
 * Blindée aux Value Objects du Domaine pour interdire les fuites de primitives.
 *
 * @interface IItem
 * @extends {IEntity<IItemData>}
 * @author Joël, Gaïa & Co
 */
export interface IItem extends IEntity<IItemData> {

  /** 🔔 Accesseur vers l'identifiant unique fort de la pépite */
  getItemId(): ItemId;

  /** 👥 Accesseur vers l'identifiant unique fort du propriétaire */
  getUserId(): UserId;

  /** 🏷️ Accesseur vers le type de contenu sémantique du Smart Enum */
  getContentType(): ContentType;

  /** 📝 Accesseur vers le titre principal */
  getTitle(): string;

  /** 🛤️ Accesseur vers le permalien normalisé (Slug) */
  getSlug(): string;

  /** 📄 Accesseur vers le corps ou payload textuel */
  getContent(): string;

  /** ✍️ Accesseur vers l'auteur original ou la provenance */
  getSourceAuthor(): string;

  /** 🖼️ Accesseur vers l'URL optionnelle de la miniature d'illustration */
  getThumbnailUrl(): string | null | undefined;

  /** 🎛️ Accesseur vers les métadonnées d'infrastructure dynamiques */
  getMetadata(): Record<string, unknown>;
}
