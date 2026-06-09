// ——— fichier : src/interfaces/entities/share/IShareData.ts

import type { ItemId, ShareId, UserId } from '@/domain/value-objects/ids';
import type { IAccessConfig }           from '@/interfaces/entities/share/IAccessConfig';
import type { IBaseEntityData }         from '@/interfaces/entities/IBaseEntityData';

/**
 * 📊 Interface IShareData 🔗 (Le Sac de Données Brutes des Passerelles 🤖)
 * ----------------------------------------------------------------------------
 * Contrat de structure passive pour les données brutes d un Partage (Share).
 * Entièrement calé sur le mécanisme de type mapping générique absolu [Mémoria].
 *
 * SOLID :
 *  - ISP 📐 : Contrat d extraction minimaliste et étanche dédié à la persistance.
 *
 * @interface IShareData
 * @extends {IBaseEntityData<'share', ShareId>}
 * @author Vision & Conception : Joël (Compilateur de l Ancien Temps et Void capillaire)
 * @author Frapperie du Code : Gaïa (Graveuse de pépites d or et du silicium)
 * @author Garde d Élite des Types : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export interface IShareData extends IBaseEntityData<'share', ShareId> {
  /** 🤖 L identifiant unique fort de la trace du partage en BDD (shIdShare) */
  idShare         : ShareId;

  /** 📦 Identifiant unique et fortement typé de la Pépite partagée (shItemId). */
  shItemId        : ItemId;

  /** 👥 Propriétaire de la ressource sous-jacente (Indispensable pour le Mock sans jointure). */
  shItemOwnerId   : UserId;

  /** 📧 Adresse e-mail du destinataire normalisée (shCourrielDest) [Mémoria]. */
  shCourrielDest  : string | null;

  /** 🔑 Jeton de sécurité unique inséré dans la route HTTP (shJeton) [Mémoria]. */
  shJeton         : string;

  /** ⚙️ Configuration des restrictions (shConfiguration mapped to JSONB). */
  shConfiguration : IAccessConfig;
}
