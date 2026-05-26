// ——— fichier : src/dto/item/ResponseItemDto.ts

import type { ContentType } from '@/constants/ContentType';
import { UserId,
         ItemId              } from '@/domain/value-objects/IdMetier';
import { ResponseTagDto      } from '@/dto/tag/ResponseTagDto';
import type { IItem          } from '@/interfaces/entities/item/IItem';
import type { ITag           } from '@/interfaces/entities/tag/ITag';

/**
 * 📦 Classe ResponseItemDto
 * -------------------------
 * Objet de transfert de données pour l'exposition sortante d'une pépite (Item).
 * Protège l'infrastructure en sérialisant proprement les entités du domaine.
 *
 * @class ResponseItemDto
 * @author Joël, Gaïa & Co
 */
export class ResponseItemDto {

  /** 🔔 Caillou de couleur : Identifiant unique immuable de la pépite */
  public readonly id : ItemId;

  /** 👥 Caillou de couleur : Identifiant unique de l'utilisateur propriétaire */
  public readonly userId : UserId;

  /** 🏷️ Type de contenu encapsulé issu de nos constantes sémantiques */
  public readonly contentType : ContentType;

  /** 📝 Titre principal de la pépite */
  public readonly title : string;

  /** 🛤️ Permalien normalisé (Slug) associé à la ressource */
  public readonly slug : string;

  /** 📄 Corps du texte ou payload brut textuel */
  public readonly content : string;

  /** ✍️ Auteur original ou source de l'information */
  public readonly sourceAuthor : string;

  /** 🖼️ URL optionnelle de la miniature d'illustration */
  public readonly thumbnailUrl? : string | null;

  /** 🎛️ Métadonnées d'infrastructure dynamiques et structurées */
  public readonly metadata : Record<string, unknown>;

  /** 📅 Horodatage de création dans le système de persistance */
  public readonly createdAt? : Date;

  /** 📅 Horodatage de la dernière révision d'infrastructure */
  public readonly updatedAt? : Date;

  /** 🏷️ Collection optionnelle des étiquettes sérialisées rattachées */
  public readonly tags? : ResponseTagDto[];

  /**
   * Construit le DTO de réponse en extrayant les données de l'entité.
   *
   * @private
   * @constructor
   * @param {IItem} item - L'entité pépite source (interface riche avec getters)
   * @param {ITag[]} [tags] - La collection optionnelle des entités étiquettes rattachées
   */
  private constructor(item: IItem, tags?: ITag[]) {
    // 🪓 Alignement chirurgical natif (Fini les vieux double casts !)
    this.id           = item.getItemId();
    this.userId       = item.getUserId();
    this.contentType  = item.getContentType();

    // Propriétés de l'entité
    this.title        = item.getTitle();
    this.slug         = item.getSlug();
    this.content      = item.getContent();
    this.sourceAuthor = item.getSourceAuthor();
    this.thumbnailUrl = item.getThumbnailUrl();
    this.metadata     = item.getMetadata();

    // 🔍 Raccordement d'infrastructure direct hérité de IEntity (pas de getters getX)
    this.createdAt    = item.createdAt;
    this.updatedAt    = item.updatedAt;

    if (tags) {
      this.tags = ResponseTagDto.fromTags(tags);
    }
  }

  /**
   * 🏭 Fabrique statique : Transforme une entité unique en DTO de sortie.
   *
   * @static
   * @function fromItem
   * @param {IItem} item - L'entité source
   * @param {ITag[]} [tags] - Les étiquettes rattachées
   * @returns {ResponseItemDto} Le DTO sérialisé conforme
   */
  public static fromItem(item: IItem, tags?: ITag[]): ResponseItemDto {
    return new ResponseItemDto(item, tags);
  }

  /**
   * 🏭 Fabrique statique : Transforme une collection d'entités en liste de DTOs.
   *
   * @static
   * @function fromItems
   * @param {IItem[]} items - La liste des entités sources
   * @returns {ResponseItemDto[]} La collection de DTOs sérialisés
   */
  public static fromItems(items: IItem[]): ResponseItemDto[] {
    return items.map((i): ResponseItemDto => ResponseItemDto.fromItem(i));
  }
}
