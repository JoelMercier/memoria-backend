// ——— fichier : src/dto/item/CreateItemDto.ts

import type { ContentType } from '@/constants/ContentTypes';
import { TagId               } from '@/domain/value-objects/ids';
import { type CreateItemSchemaType,
         ItemValidation       } from '@/validation/zod/ItemValidation';

/**
 * 📦 Classe CreateItemDto (Version Pure Hexagonale)
 * ---------------------------------------------------
 * Objet de transfert de données pour la création d'une pépite (Item).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 * Armé avec les cailloux de couleur (Value Objects) pour la sécurité nominale.
 *
 * @class CreateItemDto
 * @author Joël, Gaïa & Co
 */
export class CreateItemDto {

  /** 🏷️ Type de contenu encapsulé issu de nos constantes sémantiques */
  public readonly contentType  : ContentType;

  /** 📝 Titre principal de la pépite */
  public readonly title        : string;

  /** 🛤️ Permalien normalisé (Slug) optionnel */
  public readonly slug?        : string;

  /** 📄 Corps du texte ou payload brut de la pépite */
  public readonly content      : string;

  /** ✍️ Auteur original ou source de l'information */
  public readonly sourceAuthor : string;

  /** 🖼️ URL optionnelle de la miniature d'illustration */
  public readonly thumbnailUrl?: string | null;

  /** 🎛️ Métadonnées d'infrastructure dynamiques */
  public readonly metadata     : Record<string, unknown>;

  /** 🏷️ Collection optionnelle de cailloux de couleur (Tags rattachés) */
  public readonly tagIds?      : TagId[];

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   * Effectue le scellage nominal immédiat vers nos Value Objects.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const l_oRawBody : Record<string, unknown> = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const validated  : CreateItemSchemaType = ItemValidation.validateCreate(l_oRawBody);

    // Cast chirurgical d'alignement avec notre instance de SmartEnum
    this.contentType  = validated.contentType as unknown as ContentType;
    this.title        = validated.title;
    this.slug         = validated.slug;
    this.content      = validated.content;
    this.sourceAuthor = validated.sourceAuthor;
    this.thumbnailUrl = validated.thumbnailUrl;
    this.metadata     = validated.metadata;

    // Scellage nominal de la collection d'identifiants de tags
    this.tagIds       = validated.tagIds
      ? validated.tagIds.map((id: string) => new TagId(id))
      : undefined;
  }

}
