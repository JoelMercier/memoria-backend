// ——— fichier : src/interfaces/entities/share/IShare.ts

import type { ItemId,
              ShareId        } from '@/domain/value-objects/IdMetier';
import type { IAccessConfig  } from '@/interfaces/entities/share/IAccessConfig';
import type { IEntity        } from '@/interfaces/entities/IEntity';
import type { IShareData     } from '@/interfaces/entities/share/IShareData';

/**
 * 📜 Interface IShare
 * -------------------
 * Contrat d'accès métier pour l'entité Share (Partages).
 * Entièrement libérée des chaînes primitives grâce aux Value Objects.
 *
 * @interface IShare
 * @extends {IEntity<IShareData, ShareId>}
 * @author Joël, Gaïa & Co
 */
export interface IShare extends IEntity<IShareData, ShareId> {

  /** 🔔 Récupère l'identifiant unique et fortement typé du partage lui-même. */
  getShareId(): ShareId;

  /** 📦 Récupère l'identifiant unique et fortement typé de la pépite partagée. */
  getItemId(): ItemId;

  /** 📧 Récupère l'adresse e-mail du destinataire ciblé. */
  getRecipientEmail(): string | null;

  /** 🔑 Récupère le jeton de sécurité unique associé au lien. */
  getShareToken(): string;

  /** ⚙️ Récupère la configuration fine des restrictions et de validité. */
  getAccessConfig(): IAccessConfig;

  /** ⏱️ Vérifie si la validité temporelle du partage a expiré. */
  isExpired(): boolean;
}
