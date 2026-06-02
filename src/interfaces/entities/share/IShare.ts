// ——— fichier : src/interfaces/entities/share/IShare.ts

import type { ItemId,
              ShareId        } from '@/domain/value-objects/IdMetier';
import type { IAccessConfig  } from '@/interfaces/entities/share/IAccessConfig';
import type { IEntity        } from '@/interfaces/entities/IEntity';
import type { IShareData     } from '@/interfaces/entities/share/IShareData';

/**
 * 📜 Interface IShare 🧮 (Le Contrat Métier des Passerelles 🤖)
 * ----------------------------------------------------------------------------
 * Contrat d'accès métier pour l'entité Share (Partages).
 * Entièrement libérée des chaînes primitives grâce aux Value Objects.
 *
 * @interface IShare
 * @extends {IEntity<IShareData, ShareId>}
 * @author Vision : Joël (<Struct> périmée)
 * @author Frapperie du code : Gaïa (Métallurgiste des octets)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export interface IShare extends IEntity<IShareData, ShareId> {

  /** 🔔 Récupère l'identifiant unique et fortement typé du partage lui-même (shIdShare). */
  getShareId(): ShareId;

  /** 📦 Récupère l'identifiant unique et fortement typé de la pépite partagée (shItemId). */
  getItemId(): ItemId;

  /** 📧 Récupère l'adresse e-mail du destinataire ciblé (shCourrielDest). */
  getCourrielDest(): string | null;

  /** 🔑 Récupère le jeton de sécurité unique associé au lien (shJeton). */
  getJeton(): string;

  /** ⚙️ Récupère la configuration fine des restrictions et de validité (shConfiguration). */
  getAccessConfig(): IAccessConfig;

  /** ⏱️ Vérifie si la validité temporelle du partage a expiré. */
  isExpired(): boolean;
}
