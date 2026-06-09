// ——— fichier : src/interfaces/entities/share/IShare.ts

import type { ItemId, ShareId, UserId } from '@/domain/value-objects/ids';
import type { IAccessConfig }   from '@/interfaces/entities/share/IAccessConfig';
import type { IEntity }         from '@/interfaces/entities/IEntity';
import type { IShareData }      from '@/interfaces/entities/share/IShareData';

/**
 * 📜 Interface IShare 🧮 (Le Contrat Métier des Passerelles V4)
 * ----------------------------------------------------------------------------
 * Contrat d'accès métier pour l'entité Share (Partages).
 * Entièrement convertie en propriétés de surface pures (True Getters).
 *
 * @interface IShare
 * @extends {IEntity<IShareData, ShareId>}
 * @author Vision : Joël (C++ Framework Architect - Uniformity Doctrine)
 * @author Frapperie du code : Gaïa (Au burin, alignée sur le standard sans parenthèses)
 */
export interface IShare extends IEntity<IShareData, ShareId> {

  /** 🔔 Identifiant unique et fortement typé du partage lui-même (shIdShare). */
  get idShare(): ShareId;

  /** 📦 Identifiant unique et fortement typé de la pépite partagée (shItemId). */
  get idItem(): ItemId;

  /** 👥 Identifiant unique de l'acteur propriétaire de la ressource. */
  get idUserOwner(): UserId;

  /** 📧 Adresse e-mail du destinataire ciblé (shCourrielDest). */
  get courrielDest(): string | null;

  /** 🔑 Jeton de sécurité unique associé au lien (shJeton). */
  get jeton(): string;

  /** ⚙️ Configuration fine des restrictions et de validité (shConfiguration). */
  get accessConfig(): IAccessConfig;

  /** ⏱️ MÉTHODE VIVANTE : Vérifie si la validité temporelle du partage a expiré. */
  isExpired(): boolean;
}
