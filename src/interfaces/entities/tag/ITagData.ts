// ——— fichier : src/interfaces/entities/tag/ITagData.ts

import type { UserId,
              TagId          } from '@/domain/value-objects/IdMetier';
import type { IBaseEntityData } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📦 Interface ITagData
 * ----------------------
 * Contrat de structure passive pour les données brutes d'un tag.
 * Entièrement aligné sur ton mécanisme de type mapping générique absolu.
 *
 * @interface ITagData
 * @extends {IBaseEntityData<'tag', TagId>}
 * @author Joël, Gaïa & Co
 */
export interface ITagData extends IBaseEntityData<'tag', TagId> {

  /** 👥 Identifiant unique et fortement typé de l'utilisateur propriétaire. */
  userId : UserId;

  /** 📝 Nom textuel explicite et qualifié du mot-clé (Tag). */
  tagName : string;
}
