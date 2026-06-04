// ——— fichier : src/entities/Item.ts

import      { BaseEntity     } from '@/entities/BaseEntity';
import type { ItemId, UserId } from '@/domain/value-objects/IdMetier'
import      { ContentType    } from '@/constants/ContentType';
import type { IItem          } from '@/interfaces/entities/item/IItem';
import type { IItemData      } from '@/interfaces/entities/item/IItemData';
import      { ContentTypeId  } from '@/domain/value-objects/IdMetier';
/**
 * 🏛️ Classe Item (Pépites)
 * ------------------------
 * Modèle métier immuable représentant une pépite de contenu.
 * Protégé par la notation hongroise, documenté et corrigé des inversions d'ID.
 *
 * @class Item
 * @extends {BaseEntity<'item', IItemData, ItemId>}
 * @implements {IItem}
 * @author Joël, Gaïa & Co
 */
export class Item extends BaseEntity<'item', IItemData, ItemId> implements IItem {

  /** 🔔 Caillou de couleur : Identifiant unique immuable de la pépite */
  private readonly m_idItem        : ItemId;

  /** 👥 Caillou de couleur : Identifiant unique du propriétaire de l'élément */
  private readonly m_idUser        : UserId;

  /** 🏷️ Instance de Smart Enum gérant la typologie de contenu associé */
  private readonly m_eContentType  : ContentType;

  /** 📝 Titre principal donné à la pépite */
  private readonly m_sTitle        : string;

  /** 🛤️ Permalien normalisé (Slug) unique */
  private readonly m_sSlug         : string;

  /** 📄 Corps textuel enrichi ou brut stockant la mémoire */
  private readonly m_sContent      : string;

  /** ✍️ Signature de l'auteur original ou provenance de la pépite */
  private readonly m_sSourceAuthor : string;

  /** 🖼️ URL ou chemin de la miniature de couverture */
  private readonly m_sThumbnailUrl : string | null | undefined;

  /** 🎛️ Métadonnées d'infrastructure dynamiques et structurées */
  private readonly m_rMetadata     : Record<string, unknown>;

  /**
   * Instancie une pépite immuable à partir de son contrat de données.
   *
   * @constructor
   * @param {IItemData} data - Payload brut ou typé issu de l'infrastructure
   */
  public constructor(data: IItemData) {
    super(data);
    this.m_idItem        = data.idItem;
    this.m_idUser        = data.idUser;
    this.m_eContentType  = ContentType.fromSql(data.contentTypeId.valeur);
    this.m_sTitle        = data.title;
    this.m_sSlug         = data.slug;
    this.m_sContent      = data.content;
    this.m_sSourceAuthor = data.sourceAuthor;
    this.m_sThumbnailUrl = data.thumbnailUrl;
    this.m_rMetadata     = data.metadata || {};
  }

  /**
   * 📦 Récupère l'identifiant unique et fortement typé de la pépite.
   *
   * @public
   * @function getItemId
   * @returns {ItemId} Le caillou de couleur de la pépite.
   */
  public getItemId(): ItemId {
    return this.m_idItem;
  }

  /**
   * 👥 Récupère l'identifiant unique et fortement typé du propriétaire.
   *
   * @public
   * @function getUserId
   * @returns {UserId} Le caillou de couleur de l'utilisateur.
   */
  public getUserId(): UserId {
    return this.m_idUser;
  }

  /**
   * 🏷️ Récupère le type sémantique du contenu (Smart Enum).
   *
   * @public
   * @function getContentType
   * @returns {ContentType} L'instance vivante du type de contenu.
   */
  public getContentType(): ContentType {
    return this.m_eContentType;
  }

  /**
   * ✏️ Récupère le titre de la pépite.
   *
   * @public
   * @function getTitle
   * @returns {string} Le texte du titre.
   */
  public getTitle(): string {
    return this.m_sTitle;
  }

  /**
   * 🔗 Récupère le slug normalisé pour les URL.
   *
   * @public
   * @function getSlug
   * @returns {string} Le permalien de la pépite.
   */
  public getSlug(): string {
    return this.m_sSlug;
  }

  /**
   * 📝 Récupère le contenu textuel brut ou enrichi de la pépite.
   *
   * @public
   * @function getContent
   * @returns {string} Le texte brut de mémoire.
   */
  public getContent(): string {
    return this.m_sContent;
  }

  /**
   * ✍️ Récupère l'auteur d'origine de la source.
   *
   * @public
   * @function getSourceAuthor
   * @returns {string} Le nom ou l'adresse d'origine.
   */
  public getSourceAuthor(): string {
    return this.m_sSourceAuthor;
  }

  /**
   * 🖼️ Récupère l'URL de la miniature de couverture.
   *
   * @public
   * @function getThumbnailUrl
   * @returns {string | null | undefined} L'URL ou une valeur absente.
   */
  public getThumbnailUrl(): string | null | undefined {
    return this.m_sThumbnailUrl;
  }

  /**
   * 🗄️ Récupère le dictionnaire des métadonnées complémentaires.
   *
   * @public
   * @function getMetadata
   * @returns {Record<string, unknown>} L'objet de métadonnées.
   */
  public getMetadata(): Record<string, unknown> {
    return this.m_rMetadata;
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   * Aligné sur le type mapping dynamique et les clés de persistance.
   *
   * @public
   * @function toData
   * @returns {IItemData} Structure de données brute d'infrastructure
   */
  public toData(): IItemData {
    return {
      idItem       : this.getItemId(),
      idUser       : this.getUserId(),
     contentTypeId : new ContentTypeId(this.m_eContentType.code.toString()),
      title        : this.getTitle(),
      slug         : this.getSlug(),
      content      : this.getContent(),
      sourceAuthor : this.getSourceAuthor(),
      thumbnailUrl : this.getThumbnailUrl(),
      metadata     : this.getMetadata(),
      createdAt    : this.createdAt,
      updatedAt    : this.updatedAt
    };
  }

  /**
   * 🖨️ Sérialise textuellement l'entité pépite au format de texte JSON.
   *
   * @public
   * @override
   * @function toString
   * @returns {string} Le sac de données aplati sous forme de chaîne de caractères
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
