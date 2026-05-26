// ——— fichier : src/dto/share/PublicShareDto.ts

import type { ContentType } from '@/constants/ContentType';
import type { IItem       } from '@/interfaces/entities/item/IItem';

/**
 * 📦 Classe PublicShareDto
 * ------------------------
 * Objet de transfert de données pour l'exposition publique non authentifiée d'une pépite partagée.
 * Filtre les données sensibles (pas d'identifiants, pas de userId) pour un invité anonyme.
 *
 * @class PublicShareDto
 * @author Joël, Gaïa & Co
 */
export class PublicShareDto {

  /** 📝 Titre principal de la pépite partagée */
  public readonly title        : string;

  /** 🛤️ Permalien normalisé (Slug) associé à la ressource */
  public readonly slug         : string;

  /** 🏷️ Type de contenu sémantique issu de nos constantes */
  public readonly contentType  : ContentType;

  /** 📄 Corps du texte ou payload brut textuel accessible publiquement */
  public readonly content      : string;

  /** ✍️ Auteur original ou source de l'information */
  public readonly sourceAuthor : string;

  /** 🖼️ URL optionnelle de la miniature d'illustration */
  public readonly thumbnailUrl?: string | null;

  /** 🎛️ Métadonnées d'infrastructure dynamiques autorisées */
  public readonly metadata     : Record<string, unknown>;

  /** 📅 Horodatage de création originel dans le système */
  public readonly createdAt?   : Date;

  /**
   * Construit le DTO public en filtrant et extrayant les données de l'entité.
   * Totalement étanche : aucun identifiant technique (Id) ne fuite vers l'extérieur.
   *
   * @private
   * @constructor
   * @param {IItem} item - L'entité pépite source (interface riche)
   */
  private constructor(item: IItem) {
    this.title        = item.getTitle();
    this.slug         = item.getSlug();
    this.contentType  = item.getContentType();
    this.content      = item.getContent();
    this.sourceAuthor = item.getSourceAuthor();
    this.thumbnailUrl = item.getThumbnailUrl();
    this.metadata     = item.getMetadata();

    // Raccordement d'infrastructure direct hérité de IEntity (pas de getter getX)
    this.createdAt    = item.createdAt;
  }

  /**
   * 🏭 Fabrique statique : Transforme une entité de pépite en DTO de consultation public.
   *
   * @static
   * @function fromItem
   * @param {IItem} item - L'entité source
   * @returns {PublicShareDto} Le DTO d'exposition publique conforme
   */
  public static fromItem(item: IItem): PublicShareDto {
    return new PublicShareDto(item);
  }
}
