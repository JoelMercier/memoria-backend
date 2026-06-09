// ——— fichier : src/dto/share/ResponseShareDto.ts

import { ItemId,
         ShareId             } from '@/domain/value-objects/ids';
import type { IAccessConfig  } from '@/interfaces/entities/share/IAccessConfig';
import type { IShare         } from '@/interfaces/entities/share/IShare';

/**
 * 📦 Classe ResponseShareDto
 * --------------------------
 * Objet de transfert de données pour l'exposition sortante d'un partage (Share).
 * Protège l'infrastructure en sérialisant proprement les entités de partage du domaine.
 *
 * @class ResponseShareDto
 * @author Joël, Gaïa & Co
 */
export class ResponseShareDto {

  /** 🔔 Caillou de couleur : Identifiant unique immuable du lien de partage */
  public readonly id : ShareId;

  /** 📦 Caillou de couleur : Identifiant de la pépite (Item) associée */
  public readonly itemId : ItemId;

  /** 📧 Adresse électronique du destinataire cible du partage */
  public readonly recipientEmail : string | null;

  /** 🔑 Jeton de sécurité aléatoire unique inclus dans la route publique */
  public readonly shareToken : string;

  /** 🌐 URL publique complète générée pour l'accès invité non authentifié */
  public readonly shareUrl : string;

  /** ⚙️ Configuration d'infrastructure des restrictions d'accès (Expiration, etc.) */
  public readonly accessConfig : IAccessConfig;

  /** ⏱️ Indicateur booléen de péremption chronologique du jeton */
  public readonly isExpired : boolean;

  /** 📅 Horodatage de création dans le système de persistance */
  public readonly createdAt? : Date;

  /** 📅 Horodatage de la dernière révision d'infrastructure */
  public readonly updatedAt? : Date;

  /**
   * Construit le DTO de réponse en extrayant les données de l'entité.
   *
   * @private
   * @constructor
   * @param {IShare} share - L'entité partage source (interface riche avec getters)
   * @param {string} baseUrl - L'URL racine du serveur pour forger le lien absolu
   */
  private constructor(share: IShare, baseUrl: string) {
    // 🪓 Alignement chirurgical natif (Fini les vieux double casts d'ID !)
    this.id             = share.getShareId();
    this.itemId         = share.getItemId();

    this.recipientEmail = share.getCourrielDest();
    this.shareToken     = share.getJeton();
    this.shareUrl       = `${baseUrl}/v1/public/shared/${share.getJeton()}`;
    this.accessConfig   = share.getAccessConfig();
    this.isExpired      = share.isExpired();

    // 🔍 Raccordement d'infrastructure direct hérité de IEntity (pas de getters getX)
    this.createdAt    = share.createdAt;
    this.updatedAt    = share.updatedAt;
  }

  /**
   * 🏭 Fabrique statique : Transforme une entité de partage en DTO de sortie.
   *
   * @static
   * @function fromShare
   * @param {IShare} share - L'entité source
   * @param {string} baseUrl - L'URL racine de l'application
   * @returns {ResponseShareDto} Le DTO sérialisé conforme
   */
  public static fromShare(share: IShare, baseUrl: string): ResponseShareDto {
    return new ResponseShareDto(share, baseUrl);
  }

  /**
   * 🏭 Fabrique statique : Transforme une collection de partages en liste de DTOs.
   *
   * @static
   * @function fromShares
   * @param {IShare[]} shares - La liste des entités sources
   * @param {string} baseUrl - L'URL racine de l'application
   * @returns {ResponseShareDto[]} La collection de DTOs sérialisés
   */
  public static fromShares(shares: IShare[], baseUrl: string): ResponseShareDto[] {
    return shares.map((s): ResponseShareDto => ResponseShareDto.fromShare(s, baseUrl));
  }
}
