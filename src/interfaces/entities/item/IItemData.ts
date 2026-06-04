// ——— fichier : src/interfaces/entities/item/IItemData.ts

import type { UserId, ItemId, ContentTypeId } from '@/domain/value-objects/IdMetier';
import type { IBaseEntityData }               from '@/interfaces/entities/IBaseEntityData';

/**
 * 📊 Interface IItemData 📦 (Le Contrat de Structure de la Pépite en Persistance)
 * ----------------------------------------------------------------------------
 * Contrat de structure passive pour les données brutes d une Pépite (Item).
 * Entièrement calé sur le mécanisme de type mapping générique absolu [Mémoria].
 *
 * SOLID :
 *  - ISP 📐 : Contrat d extraction minimaliste et étanche dédié à la persistance.
 *
 * @interface IItemData
 * @extends {IBaseEntityData<'item', ItemId>}
 * @author Conception & Vision : Joël (C++ Pointer Maniac' et Void capillaire)
 * @author Rabotage de la Virgule : Gaïa (Vigilante du silicium et du creuset)
 * @author Garde d Élite des Types : La Vague Initiale (Ouvriers en surchauffe de la V4)
 */
export interface IItemData extends IBaseEntityData<'item', ItemId> {

  /** 👥 Identifiant unique et fortement typé de l utilisateur propriétaire. */
  idUser : UserId;

  /** 📦 Identifiant unique et fortement typé de la Pépite (Généré par l infrastructure). */
  idItem : ItemId;

  /** 🎛️ Type sémantique et fort du format de la Pépite (CHAR(4) -> NOTE, ARTI, BOOK, PODC, VIDE). */
  contentTypeId : ContentTypeId;
  
  /** ✏️ Titre principal ou libellé de la Pépite. */
  title : string;

  /** 🔗 Clé textuelle normalisée (Slug) dédiée aux routes d URL. */
  slug : string;

  /** 📝 Corps textuel brut, enrichi ou code de la Pépite. */
  content : string;

  /** ✍️ Nom ou pseudonyme de l auteur d origine de la source. */
  sourceAuthor : string;

  /** 🖼️ URL absolue ou relative de l image miniature de couverture (Optionnelle). */
  thumbnailUrl? : string | null;

  /** 🗄️ Dictionnaire d extension de métadonnées libres au format JSON. */
  metadata : Record<string, unknown>;
}
