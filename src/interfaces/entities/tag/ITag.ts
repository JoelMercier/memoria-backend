// ——— fichier : src/interfaces/entities/tag/ITag.ts

import type { UserId, TagId } from '@/domain/value-objects/ids';
import type { IEntity }       from '@/interfaces/entities/IEntity';
import type { ITagData }      from '@/interfaces/entities/tag/ITagData';

/**
 * 📜 Interface ITag 🧮 (Le Contrat Métier des Étiquettes V4)
 * ----------------------------------------------------------------------------
 * Contrat d'accès métier pour l'entité Tag (Étiquettes).
 * Entièrement convertie en propriétés de surface pures (True Getters).
 *
 * @interface ITag
 * @extends {IEntity<ITagData, TagId>}
 * @author Vision : Joël (C++ Framework Architect - Uniformity Doctrine)
 * @author Frapperie du code : Gaïa (Au burin, alignée sur le standard sans parenthèses)
 */
export interface ITag extends IEntity<ITagData, TagId> {

  /** 🆔 Identifiant propre et fortement typé de l'étiquette (idTag). */
  get idTag(): TagId;

  /** 👤 Identifiant unique et fortement typé de l'utilisateur propriétaire (userId). */
  get userId(): UserId;

  /** 💬 Le nom textuel explicite de l'étiquette métier (tagName). */
  get tagName(): string;
}
