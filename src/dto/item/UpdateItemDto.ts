// ——— fichier : src/dto/item/UpdateItemDto.ts

import type { ContentType } from '@/constants/ContentType';
import { TagId               } from '@/domain/value-objects/ids';
import { type UpdateItemSchemaType,
         ItemValidation       } from '@/validation/zod/ItemValidation';

/**
 * 📦 Classe UpdateItemDto
 * -------------------------
 * Objet de transfert de données pour la modification partielle d'une pépite (Item).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 * Armé avec les cailloux de couleur (Value Objects) et calé sur nos types stricts.
 *
 * @class UpdateItemDto
 * @author Joël, Gaïa & Co
 */
export class UpdateItemDto {

  /** 🏷️ Type de contenu optionnel issu de nos constantes sémantiques */
  public readonly contentType?: ContentType;

  /** 📝 Titre principal optionnel de la pépite */
  public readonly title?: string;

  /** 🛤️ Permalien normalisé (Slug) optionnel */
  public readonly slug?: string;

  /** 📄 Corps du texte ou payload brut optionnel */
  public readonly content?: string;

  /** ✍️ Auteur original ou source de provenance optionnelle */
  public readonly sourceAuthor?: string;

  /** 🖼️ URL optionnelle de la miniature d'illustration */
  public readonly thumbnailUrl?: string | null;

  /** 🎛️ Métadonnées d'infrastructure dynamiques optionnelles */
  public readonly metadata?: Record<string, unknown>;

  /** 🏷️ Collection optionnelle de cailloux de couleur (Tags rattachés) */
  public readonly tagIds?: TagId[];

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   * Effectue le scellage nominal immédiat vers nos Value Objects.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : UpdateItemSchemaType = ItemValidation.validateUpdate(data);

    // Cast chirurgical pour s'adapter à notre instance de SmartEnum (sans Enum de transport)
    this.contentType  = validated.contentType ? (validated.contentType as unknown as ContentType) : undefined;

    this.title        = validated.title;
    this.slug         = validated.slug;
    this.content      = validated.content;
    this.sourceAuthor = validated.sourceAuthor;
    this.thumbnailUrl = validated.thumbnailUrl;
    this.metadata     = validated.metadata;

    // Scellage nominal de la collection optionnelle d'identifiants de tags
    this.tagIds       = validated.tagIds
      ? validated.tagIds.map((id: string) => new TagId(id))
      : undefined;
  }

}
