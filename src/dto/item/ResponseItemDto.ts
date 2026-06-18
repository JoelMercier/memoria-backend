// ——— fichier : src/dto/item/ResponseItemDto.ts

import type { ContentType    } from '@/constants/ContentTypes';
import type { UserId, ItemId } from '@/domain/value-objects/ids';
import type { Item           } from '@/entities/Item';
import type { ITag           } from '@/interfaces/entities/tag/ITag';
import type { JsonLégitime   } from '@/types/shared/JsonLégitime';

import { ResponseTagDto }   from '@/dto/tag/ResponseTagDto';

/**
 * 📦 Classe ResponseItemDto 💎
 * ----------------------------------------------------------------------------
 * Objet de transfert de données pour l'exposition sortante d'une pépite (Item).
 * Protège l'infrastructure en sérialisant proprement les entités du domaine.
 *
 * @class ResponseItemDto
 * @author Directrice du Silicium : Joël (C++ Pointer Maniac' et Chasseur de Parenthèses)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur les getters réarmés V4)
 */
export class ResponseItemDto {

  /** 🔔 Caillou de couleur : Identifiant unique immuable de la pépite */
  public readonly id : ItemId;

  /** 👥 Caillou de couleur : Identifiant unique du propriétaire de l'élément */
  public readonly userId : UserId;

  /** 🏷️ Type de contenu encapsulé issu de nos constantes sémantiques */
  public readonly contentType : ContentType;

  /** 📝 Titre principal de la pépite */
  public readonly libelle : string;

  /** 🛤️ Permalien normalisé (Slug) associé à la ressource */
  public readonly slug : string;

  /** 📄 Corps du texte ou payload brut textuel */
  public readonly content : string;

  /** ✍️ Auteur original ou source de l'information */
  public readonly sourceAuthor : string;

  /** 🖼️ URL optionnelle de la miniature d'illustration */
  public readonly thumbnailUrl? : string | null;

  /** 🎛️ Métadonnées d'infrastructure dynamiques et structurées */
  public readonly metadata : JsonLégitime;

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
   * @param {Item} p_oItem - L'entité pépite source concrète réarmée de ses getters [Mémoria]
   * @param {ITag[]} [p_aTags] - La collection optionnelle des entités étiquettes rattachées
   */
  private constructor(p_oItem: Item, p_aTags?: ITag[]) {
    // 🪓 [REDRESSÉ V4] Lecture directe via les getters souverains, sans parenthèses ! [Mémoria]
    this.id           = p_oItem.idItem;
    this.userId       = p_oItem.idUser;
    this.contentType  = p_oItem.contentType;

    // Propriétés nominales de l'entité vivante
    this.libelle      = p_oItem.libelle;
    this.slug         = p_oItem.slug;
    this.content      = p_oItem.content;
    this.sourceAuthor = p_oItem.sourceAuthor;
    this.thumbnailUrl = p_oItem.thumbnailUrl;
    this.metadata     = p_oItem.metadata;

    // Raccordement direct hérité de la BaseEntity d'origine [Mémoria]
    this.createdAt    = p_oItem.createdAt;
    this.updatedAt    = p_oItem.updatedAt;

    if (p_aTags) {
      this.tags = ResponseTagDto.fromTags(p_aTags);
    }
  }

  /**
   * 🏭 Fabrique statique : Transforme une entité unique en DTO de sortie.
   *
   * @static
   * @function fromItem
   * @param {Item} p_oItem - L'entité source concrète du Domaine [Mémoria]
   * @param {ITag[]} [p_aTags] - Les étiquettes rattachées
   * @returns {ResponseItemDto} Le DTO sérialisé conforme
   */
  public static fromItem(p_oItem: Item, p_aTags?: ITag[]): ResponseItemDto {
    return new ResponseItemDto(p_oItem, p_aTags);
  }

  /**
   * 🏭 Fabrique statique : Transforme une collection d'entités en liste de DTOs.
   *
   * @static
   * @function fromItems
   * @param {Item[]} p_aItems - La liste des entités sources concrètes [Mémoria]
   * @returns {ResponseItemDto[]} La collection de DTOs sérialisés
   */
  public static fromItems(p_aItems: Item[]): ResponseItemDto[] {
    return p_aItems.map((l_oItem): ResponseItemDto => ResponseItemDto.fromItem(l_oItem));
  }
}
