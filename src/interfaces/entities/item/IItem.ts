// ——— fichier : src/interfaces/entities/item/IItem.ts

import type { ContentType    } from '@/constants/ContentTypes';
import type { UserId, ItemId } from '@/domain/value-objects/ids';
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
  get idItem(): ItemId;

  /** 👥 Accesseur vers l'identifiant unique fort du propriétaire */
  get idUser(): UserId;

  /** 🏷️ Accesseur vers le type de contenu sémantique du Smart Enum */
  get contentType(): ContentType;

  /** 📝 Accesseur vers le titre principal */
  get libelle(): string;

  /** 🛤️ Accesseur vers le permalien normalisé (Slug) */
  get slug(): string;

  /** 📄 Accesseur vers le corps ou payload textuel */
  get content(): string;

  /** ✍️ Accesseur vers l'auteur original ou la provenance */
  get sourceAuthor(): string;

  /** 🖼️ Accesseur vers l'URL optionnelle de la miniature d'illustration */
  get thumbnailUrl(): string | null | undefined;

  /** 🎛️ Accesseur vers les métadonnées d'infrastructure dynamiques */
  get metadata(): Record<string, unknown>;
}
