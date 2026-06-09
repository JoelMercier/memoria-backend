// ——— fichier : src/entities/Tag.ts

import { BaseEntity } from '@/entities/BaseEntity';
import type { ITag  } from '@/interfaces/entities/tag/ITag';
import type { ITagData } from '@/interfaces/entities/tag/ITagData';
import type { UserId, TagId } from '@/domain/value-objects/ids';

/**
 * 🏛️ Classe Tag
 * -------------
 * Modèle métier immuable représentant un tag utilisateur.
 * Protégé par l'armure de la notation hongroise et aligné sur l'id dynamique.
 *
 * @class Tag
 * @extends {BaseEntity<'tag', ITagData, TagId>}
 * @implements {ITag}
 * @author Joël, Gaïa & Co
 */
export class Tag extends BaseEntity<'tag', ITagData, TagId> implements ITag {

  /** 🔔 Caillou de couleur : Identifiant technique unique de l'étiquette */
  private readonly m_idTag    : TagId;

  /** 👥 Caillou de couleur : Identifiant unique de l'utilisateur propriétaire */
  private readonly m_sUserId  : UserId;

  /** 📝 Libellé textuel unique de l'étiquette métier */
  private readonly m_sTagName : string;

  /**
   * Instancie un tag immuable à partir de son contrat de données.
   *
   * @constructor
   * @param {ITagData} data - Payload brut issu de l'infrastructure
   */
  public constructor(data: ITagData) {
    super(data);
    this.m_idTag    = data.idTag;
    this.m_sUserId  = data.userId;
    this.m_sTagName = data.tagName;
  }

  /**
   * 🆔 Identifiant propre et fortement typé de l'étiquette.
   * Réaligné fidèlement sur notre contrat d'interface métier sémantique.
   *
   * @public
   * @returns {TagId} Le Value Object de l'identifiant du tag.
   */
  public getTagId(): TagId {
    return this.m_idTag;
  }

  /**
   * 👤 Récupère l'identifiant unique et fortement typé de l'utilisateur propriétaire.
   *
   * @public
   * @returns {UserId} Le Value Object de l'identifiant de l'utilisateur.
   */
  public getUserId(): UserId {
    return this.m_sUserId;
  }

  /**
   * 💬 Récupère le nom textuel explicite du tag.
   *
   * @public
   * @returns {string} Le libellé du mot-clé.
   */
  public getTagName(): string {
    return this.m_sTagName;
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   * Aligné rigoureusement sur les propriétés typées sans contournement d'infrastructure.
   *
   * @public
   * @returns {ITagData} Structure de données brute d'infrastructure
   */
  public toData(): ITagData {
    return {
      idTag     : this.getTagId(),
      userId    : this.getUserId(),
      tagName   : this.getTagName(),
      createdAt : this.createdAt,
      updatedAt : this.updatedAt
    };
  }

  /**
   * 🖨️ Sérialise l'entité tag au format de texte JSON.
   *
   * @public
   * @override
   * @returns {string} Chaîne JSON formatée
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
