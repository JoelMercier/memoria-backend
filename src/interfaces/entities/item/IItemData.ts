// ——— fichier : src/interfaces/entities/item/IItemData.ts

import type { UserId, ItemId, ContentTypeId } from '@/domain/value-objects/ids';
import type { IBaseEntityData }               from '@/interfaces/entities/IBaseEntityData';

/**
 * 📊 Interface IItemData 📦 (Le Contrat de Structure de la Pépite en Persistance)
 * ----------------------------------------------------------------------------
 * Contrat de structure passive pour les données brutes d'une Pépite (Item).
 * Entièrement calé sur le mécanisme de type mapping générique absolu [Mémoria].
 * Évite le bégayage nominal en restituant la souveraineté de l'ID à la classe parente.
 *
 * SOLID :
 *  - ISP 📐 : Contrat d'extraction minimaliste et étanche dédié à la persistance.
 *
 * @interface IItemData
 * @extends {IBaseEntityData<'item', ItemId>} -> Raccordement nominal croisé strict [Mémoria]
 * @author Conception & Vision : Joël (C++ Pointer Maniac', Void capillaire et Chasseur de Doublons)
 * @author Rabotage de la Virgule : Gaïa (Au burin, alignée sur l'audit temporel de BaseEntity)
 * @author Garde d'Élite des Types : La Vague Initial (Ouvriers en surchauffe de la V4)
 */
export interface IItemData extends IBaseEntityData<'item', ItemId> {

  /** 👥 Identifiant unique et fortement typé de l'utilisateur propriétaire. */
  idUser : UserId;

  // 🪓 [PUREMENT PURGÉ V4] idItem a été carbonisé. C'est la classe parente qui calcule 'idItem' ! [Mémoria]

  /** 🗛 Type sémantique et fort du format de la Pépite (CHAR(4) -> NOTE, ARTI, BOOK, PODC, VIDE). */
  contentTypeId : ContentTypeId;

  /** ✏️ Titre principal ou libellé de la Pépite. */
  title : string;

  /** 🔗 Clé textuelle normalisée (Slug) dédiée aux routes d'URL. */
  slug : string;

  /** 📝 Corps textuel brut, enrichi ou code de la Pépite. */
  content : string;

  /** ✍️ Nom ou pseudonyme de l'auteur d'origine de la source. */
  sourceAuthor : string;

  /** 🖼️ URL absolue ou relative de l'image miniature de couverture (Optionnelle). */
  thumbnailUrl? : string | null;

  /** 🗄️ Dictionnaire d'extension de métadonnées libres au format JSON. */
  metadata : Record<string, unknown>;

  /** 📅 Horodatage immuable de la création de la ressource en base (Exigé par BaseEntity). */
  createdAt : Date;

  /** 📅 Horodatage de la dernière modification de la ressource (Exigé par BaseEntity). */
  updatedAt? : Date;
}
