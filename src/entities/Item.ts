// ——— fichier : src/entities/Item.ts

import { BaseEntity }    from '@/entities/BaseEntity';
import { ItemId, UserId, ContentTypeId } from '@/domain/value-objects/ids';
import { ContentType }   from '@/constants/ContentTypes';
import type { IItemData } from '@/interfaces/entities/item/IItemData';

/**
 * 🏛️ Classe Item (Pépites) 📦
 * ----------------------------------------------------------------------------
 * Modèle métier immuable représentant une pépite de contenu.
 * Protégé par la notation hongroise, documenté et pourvu de vrais getters C++ Style.
 *
 * @class Item
 * @extends {BaseEntity<'item', IItemData, ItemId>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - True Getters Conversion)
 * @author Métallurgie des Octets : Gaïa (Au burin, éradication des parenthèses de contrebande)
 */
export class Item extends BaseEntity<'item', IItemData, ItemId> {

  /** 🔔 Identifiant unique immuable de la pépite (Clé Primaire) */
  private readonly m_idItem        : ItemId;

  /** 👥 Identifiant unique du propriétaire de l'élément */
  private readonly m_idUser        : UserId;

  /** 🏷️ Instance de Smart Enum gérant la typologie de contenu associé */
  private readonly m_eContentType  : ContentType;

  /** ✏️ Titre principal donné à la pépite */
  private readonly m_sTitle        : string;

  /** 🛤️ Permalien normalisé (Slug) unique */
  private readonly m_sSlug         : string;

  /** 📄 Corps textuel enrichi ou brut stockant la mémoire */
  private readonly m_sContent      : string;

  /** ✍️ Signature de l'auteur original ou provenance de la pépite */
  private readonly m_sSourceAuthor : string;

  /** 🖼️ URL ou chemin de la miniature de couverture (Optionnelle) */
  private readonly m_sThumbnailUrl : string | null | undefined;

  /** 🎛️ Métadonnées d'infrastructure dynamiques et structurées */
  private readonly m_rMetadata     : Record<string, unknown>;

  /**
   * Instancie une pépite immuable à partir de son contrat de données.
   *
   * @constructor
   * @param {IItemData} p_oData - Payload brut ou typé issu de l'infrastructure
   */
  public constructor(p_oData: IItemData) {
    super(p_oData);

    // 🪓 [RÉPARÉ V4] Extraction chirurgicale via la clé dynamique calculée par la maman !
    this.m_idItem        = (p_oData as any).idItem;
    this.m_idUser        = p_oData.idUser;
    this.m_eContentType  = ContentType.fromSql(p_oData.contentTypeId.valeur);
    this.m_sTitle        = p_oData.title;
    this.m_sSlug         = p_oData.slug;
    this.m_sContent      = p_oData.content;
    this.m_sSourceAuthor = p_oData.sourceAuthor;
    this.m_sThumbnailUrl = p_oData.thumbnailUrl;
    this.m_rMetadata     = p_oData.metadata || {};
  }

  /**
   * 📦 VRAI GETTER : Récupère l'identifiant unique fort de la pépite.
   *
   * @public
   * @returns {ItemId} Le caillou de couleur de la pépite
   */
  public get idItem(): ItemId {
    return this.m_idItem;
  }

  /**
   * 👥 VRAI GETTER : Récupère l'identifiant unique fort du propriétaire.
   *
   * @public
   * @returns {UserId} Le caillou de couleur de l'utilisateur
   */
  public get idUser(): UserId {
    return this.m_idUser;
  }

  /**
   * 🏷️ VRAI GETTER : Récupère le type sémantique du contenu (Smart Enum).
   *
   * @public
   * @returns {ContentType} L'instance vivante du type de contenu
   */
  public get contentType(): ContentType {
    return this.m_eContentType;
  }

  /**
   * ✏️ VRAI GETTER : Récupère le titre de la pépite.
   *
   * @public
   * @returns {string} Le texte du titre
   */
  public get title(): string {
    return this.m_sTitle;
  }

  /**
   * 🔗 VRAI GETTER : Récupère le slug normalisé pour les URL.
   *
   * @public
   * @returns {string} Le permalien de la pépite
   */
  public get slug(): string {
    return this.m_sSlug;
  }

  /**
   * 📝 VRAI GETTER : Récupère le contenu textuel brut ou enrichi de la pépite.
   *
   * @public
   * @returns {string} Le texte brut de mémoire
   */
  public get content(): string {
    return this.m_sContent;
  }

  /**
   * ✍️ VRAI GETTER : Récupère l'auteur d'origine de la source.
   *
   * @public
   * @returns {string} Le nom ou l'adresse d'origine
   */
  public get sourceAuthor(): string {
    return this.m_sSourceAuthor;
  }

  /**
   * 🖼️ VRAI GETTER : Récupère l'URL de la miniature de couverture.
   *
   * @public
   * @returns {string | null | undefined} L'URL ou une valeur absente
   */
  public get thumbnailUrl(): string | null | undefined {
    return this.m_sThumbnailUrl;
  }

  /**
   * 🗄️ VRAI GETTER : Récupère le dictionnaire des métadonnées complémentaires.
   *
   * @public
   * @returns {Record<string, unknown>} L'objet de métadonnées
   */
  public get metadata(): Record<string, unknown> {
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
      idUser        : this.idUser,
      contentTypeId : new ContentTypeId(this.m_eContentType.code.toString()),
      title         : this.title,
      slug          : this.slug,
      content       : this.content,
      sourceAuthor  : this.sourceAuthor,
      thumbnailUrl  : this.thumbnailUrl,
      metadata      : this.metadata,
      createdAt     : this.createdAt,
      updatedAt     : this.updatedAt
    } as IItemData;
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
