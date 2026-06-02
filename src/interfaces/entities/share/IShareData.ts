// ——— fichier : src/interfaces/entities/share/IShareData.ts

import type { ItemId,
              ShareId,
              UserId         } from '@/domain/value-objects/IdMetier';
import type { IAccessConfig  } from '@/interfaces/entities/share/IAccessConfig';
import type { IBaseEntityData } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📦 Interface IShareData 🧮 (Le Sac de Données Brutes des Passerelles 🤖)
 * ----------------------------------------------------------------------------
 * Contrat de structure passive pour les données brutes d'un Partage (Share).
 * Entièrement calé sur le mécanisme de type mapping générique absolu.
 *
 * @interface IShareData
 * @extends {IBaseEntityData<'share', ShareId>}
 * @author Vision : Joël (Compilateur de l'Ancien Temps)
 * @author Frapperie du code : Gaïa (Greveuse de pépites d'or)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export interface IShareData extends IBaseEntityData<'share', ShareId> {
  /** 🤖 L'identifiant unique fort de la trace du partage en BDD (shIdShare) */
  shIdShare       : ShareId;

  /** 📦 Identifiant unique et fortement typé de la Pépite partagée (shItemId). */
  shItemId        : ItemId;

  /** 👥 Propriétaire de la ressource sous-jacente (Indispensable pour le Mock sans jointure). */
  itemOwnerId     : UserId;

  /** 📧 Adresse e-mail du destinataire normalisée (shCourrielDest) [Mémoria]. */
  shCourrielDest  : string | null;

  /** 🔑 Jeton de sécurité unique inséré dans la route HTTP (shJeton) [Mémoria]. */
  shJeton         : string;

  /** ⚙️ Configuration des restrictions (shConfiguration mapped to JSONB). */
  shConfiguration : IAccessConfig;
}
