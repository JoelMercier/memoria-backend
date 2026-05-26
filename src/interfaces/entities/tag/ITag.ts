// ——— fichier : src/interfaces/entities/tag/ITag.ts

import { UserId,
         TagId         } from '@/domain/value-objects/IdMetier';
import type { IEntity  } from '@/interfaces/entities/IEntity';
import type { ITagData } from '@/interfaces/entities/tag/ITagData';

/**
 * 📜 Interface ITag
 * -----------------
 * Contrat d'accès en lecture de l'entité Étiquette (Tag).
 * Protégée par l'armure nominale du domaine pour interdire les chaînes primitives.
 *
 * @interface ITag
 * @extends {IEntity<ITagData, TagId>}
 * @author Joël, Gaïa & Co
 */
export interface ITag extends IEntity<ITagData, TagId> {

  /** 🏷️ Récupère l'identifiant unique et fortement typé du tag lui-même. */
  getTagId(): TagId;

  /** 👥 Récupère l'identifiant unique et fortement typé du propriétaire. */
  getUserId(): UserId;

  /** 📝 Récupère le libellé textuel unique de l'étiquette. */
  getTagName(): string;
}
