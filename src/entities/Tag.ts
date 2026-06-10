// ——— fichier : src/entities/Tag.ts

import { BaseEntity }         from '@/entities/BaseEntity';
import type { ITag }          from '@/interfaces/entities/tag/ITag';
import type { ITagData }      from '@/interfaces/entities/tag/ITagData';
import type { UserId, TagId } from '@/domain/value-objects/ids';

/**
 * 🏛️ Classe Tag (Modèle Métier Immuable) 🏷️
 * ----------------------------------------------------------------------------
 * Modèle métier représentant une étiquette utilisateur.
 * Protégé par la notation hongroise, documenté et converti en vrais getters V4.
 *
 * @class Tag
 * @extends {BaseEntity<'tag', ITagData, TagId>}
 * @implements {ITag}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - True Getters Conversion)
 * @author Métallurgie des Octets : Gaïa (Au burin, lavée de ses accès sauvages et parenthèses)
 */
export class Tag extends BaseEntity<'tag', ITagData, TagId> implements ITag {

  /** 🔔 Caillou de couleur : Identifiant technique unique de l'étiquette (idTag) */
  private readonly m_idTag    : TagId;

  /** 👥 Caillou de couleur : Identifiant unique de l'utilisateur propriétaire (userId) */
  private readonly m_sUserId  : UserId;

  /** 📝 Libellé textuel unique de l'étiquette métier (tagName) */
  private readonly m_sTagName : string;

  /**
   * Instancie un tag immuable à partir de son contrat de données passif.
   *
   * @constructor
   * @param {ITagData} p_oData - Payload brut issu de l'infrastructure 3NF
   */
  public constructor(p_oData: ITagData) {
    super(p_oData);
    this.m_idTag    = p_oData.idTag;
    this.m_sUserId  = p_oData.idUser;
    this.m_sTagName = p_oData.tagName;
  }

  /**
   * 🆔 VRAI GETTER : Identifiant propre et fortement typé de l'étiquette.
   *
   * @public
   * @returns {TagId} Le Value Object de l'identifiant du tag
   */
  public get idTag(): TagId {
    // 🪓 [RÉPARÉ V4] Fin de getTagId(), place à la lecture pure !
    return this.m_idTag;
  }

  /**
   * 👤 VRAI GETTER : Identifiant unique de l'utilisateur propriétaire.
   *
   * @public
   * @returns {UserId} Le Value Object de l'identifiant de l'utilisateur
   */
  public get userId(): UserId {
    // 🪓 [RÉPARÉ V4] Fin de getUserId(), place à la lecture pure !
    return this.m_sUserId;
  }

  /**
   * 💬 VRAI GETTER : Le nom textuel explicite de l'étiquette.
   *
   * @public
   * @returns {string} Le libellé du mot-clé
   */
  public get tagName(): string {
    // 🪓 [RÉPARÉ V4] Fin de getTagName(), place à la lecture pure !
    return this.m_sTagName;
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   * [SCELLÉ RECOUVREMENT] Interrogation constitutionnelle et exclusive des variables hongroises.
   *
   * @public
   * @returns {ITagData} Structure de données brute d'infrastructure 3NF
   */
  public toData(): ITagData {
    return {
      idTag     : this.m_idTag,
      idUser    : this.m_sUserId,
      tagName   : this.m_sTagName,
      createdAt : this.createdAt,
      updatedAt : this.updatedAt
    };
  }

  /**
   * 🖨️ Sérialise l'entité tag au format de texte JSON.
   *
   * @public
   * @override
   * @returns {string} Chaîne JSON formatée plate
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
