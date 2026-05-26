// ——— fichier : src/interfaces/entities/share/IShareData.ts

import type { ItemId,
              ShareId        } from '@/domain/value-objects/IdMetier';
import type { IAccessConfig  } from '@/interfaces/entities/share/IAccessConfig';
import type { IBaseEntityData } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📦 Interface IShareData
 * ----------------------
 * Contrat de structure passive pour les données brutes d'un Partage (Share).
 * Entièrement calé sur le mécanisme de type mapping générique absolu.
 *
 * @interface IShareData
 * @extends {IBaseEntityData<'share', ShareId>}
 * @author Joël, Gaïa & Co
 */
export interface IShareData extends IBaseEntityData<'share', ShareId> {

  /** 📦 Identifiant unique et fortement typé de la Pépite (Item) partagée. */
  itemId : ItemId;

  /** 📧 Adresse e-mail du destinataire (Ou NULL si le partage est public par lien). */
  recipientEmail : string | null;

  /** 🔑 Jeton de sécurité unique inséré dans la route HTTP de partage. */
  shareToken : string;

  /** ⚙️ Configuration fine des restrictions et de la validité temporelle de l'accès. */
  accessConfig : IAccessConfig;
}
