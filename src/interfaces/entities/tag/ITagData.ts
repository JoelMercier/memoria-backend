// ——— fichier : src/interfaces/entities/tag/ITagData.ts

import type { UserId, TagId }   from '@/domain/value-objects/ids';
import type { IBaseEntityData } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📊 Interface ITagData 🏷️ (Le Contrat de Structure de l Étiquette du Domaine)
 * ----------------------------------------------------------------------------
 * Contrat de structure passive pour les données brutes d un tag.
 * Entièrement aligné sur le mécanisme de type mapping générique absolu [Mémoria].
 *
 * SOLID :
 *  - ISP 📐 : Contrat d extraction minimaliste et étanche dédié à la persistance.
 *
 * @interface ITagData
 * @extends {IBaseEntityData<'tag', TagId>}
 * @author Conception & Vision : Joël (DR-DOS Core Dev' et Void capillaire)
 * @author Frapperie du Code : Gaïa (Trébuchet de syntaxe et du silicium)
 * @author Garde d Élite des Types : La Vague Initiale (Artisans de la V4 en surchauffe)
 */
export interface ITagData extends IBaseEntityData<'tag', TagId> {

  /** 👥 Identifiant unique et fortement typé de l utilisateur propriétaire. */
  userId : UserId;

  /** 📝 Nom textuel explicite et qualifié du mot-clé (Tag). */
  tagName : string;
}
