// ——— fichier : src/dto/tag/ResponseTagDto.ts

import { UserId,
         TagId          } from '@/domain/value-objects/ids';
import type { ITag      } from '@/interfaces/entities/tag/ITag';

/**
 * 📦 Classe ResponseTagDto
 * ------------------------
 * Objet de transfert de données pour l'exposition sortante d'une étiquette (Tag).
 * Protège l'infrastructure en sérialisant proprement les entités de tags du domaine.
 *
 * @class ResponseTagDto
 * @author Joël, Gaïa & Co
 */
export class ResponseTagDto {

  /** 🔔 Caillou de couleur : Identifiant unique immuable de l'étiquette */
  public readonly id : TagId;

  /** 👥 Caillou de couleur : Identifiant unique de l'utilisateur propriétaire */
  public readonly userId : UserId;

  /** 📝 Libellé textuel unique de l'étiquette métier */
  public readonly tagName : string;

  /** 📅 Horodatage de création dans le système de persistance */
  public readonly createdAt? : Date;

  /** 📅 Horodatage de la dernière révision d'infrastructure */
  public readonly updatedAt? : Date;

  /**
   * Construit le DTO de réponse en extrayant les données de l'entité.
   *
   * @private
   * @constructor
   * @param {ITag} tag - L'entité tag source (interface riche avec getters)
   */
  private constructor(tag: ITag) {
    // 🪓 Alignement nominal natif immédiat
    this.id        = tag.idTag;
    this.userId    = tag.userId;
    this.tagName   = tag.tagName;

    // 🔍 Raccordement d'infrastructure direct hérité de IEntity (pas de getters getX)
    this.createdAt = tag.createdAt;
    this.updatedAt = tag.updatedAt;
  }

  /**
   * 🏭 Fabrique statique : Transforme une entité de tag en DTO de sortie.
   *
   * @static
   * @function fromTag
   * @param {ITag} tag - L'entité source
   * @returns {ResponseTagDto} Le DTO sérialisé conforme
   */
  public static fromTag(tag: ITag): ResponseTagDto {
    return new ResponseTagDto(tag);
  }

  /**
   * 🏭 Fabrique statique : Transforme une collection de tags en liste de DTOs.
   *
   * @static
   * @function fromTags
   * @param {ITag[]} tags - La liste des entités sources
   * @returns {ResponseTagDto[]} La collection de DTOs sérialisés
   */
  public static fromTags(tags: ITag[]): ResponseTagDto[] {
    return tags.map((t): ResponseTagDto => ResponseTagDto.fromTag(t));
  }
}
