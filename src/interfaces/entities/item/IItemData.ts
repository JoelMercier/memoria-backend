// ——— fichier : src/interfaces/entities/item/IItemData.ts

import type { ContentType }     from '@/constants/ContentType';
import type { UserId,
              ItemId }          from '@/domain/value-objects/IdMetier';
import type { IBaseEntityData } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📦 Interface IItemData
 * ----------------------
 * Contrat de structure passive pour les données brutes d'une Pépite (Item).
 * Entièrement calé sur le mécanisme de type mapping générique absolu.
 *
 * @interface IItemData
 * @extends {IBaseEntityData<'item', ItemId>}
 * @author Joël, Gaïa & Co
 */
export interface IItemData extends IBaseEntityData<'item', ItemId> {

  /** 👥 Identifiant unique et fortement typé de l'utilisateur propriétaire. */
  idUser : UserId;

  /** 📦 Identifiant unique et fortement typé de la Pépite (Généré par l'infrastructure). */
  idItem : ItemId;

  /** 🏷️ Type sémantique et catégorisation du contenu de la Pépite (Smart Enum). */
  contentType : ContentType;

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
}
