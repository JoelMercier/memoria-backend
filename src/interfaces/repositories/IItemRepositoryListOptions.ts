// ——— fichier : src\interfaces\repositories\IItemRepositoryListOptions.ts

import { IListOptions }  from '@/interfaces/shared/IListOptions';
import { ContentTypeId } from '@/domain/value-objects/ids';

/**
 * 🎛️ Interface IItemRepositoryListOptions 📐
 * ----------------------------------------------------------------------------
 * Dictionnaire d'options de filtrage et d'ordonnancement exclusif pour les Pépites (Items).
 * S'adosse constitutionnellement au verrou de pagination et de tri déterministe.
 * Isolé dans son casier de transport pour maintenir l'étanchéité des contrats d'accès.
 *
 * @interface IItemRepositoryListOptions
 * @extends {IListOptions}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Zéro Bâclage)
 * @author Métallurgie des Octets : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 */
export interface IItemRepositoryListOptions extends IListOptions {
  /** 📦 [RÉPARÉ V4] Le format typé fixe remplace définitivement l'ancien concept textuel */
  contentTypeId?: ContentTypeId;
}
