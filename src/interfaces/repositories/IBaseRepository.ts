// ——— fichier : src/interfaces/repositories/IBaseRepository.ts

import type { AllowedIdTypes } from '@/interfaces/entities/IBaseEntityData';
import type { IListOptions }  from '@/interfaces/shared/IListOptions'; // 🗲 [ALIGNÉ TRANSVERSE]
import type { IListResult }   from '@/interfaces/shared/IListResult';   // 🗲 [FRANÇAIS D'ÉLITE]

/**
 * 📜 Interface IBaseRepository (Version Jojo Libérée V4)
 * ----------------------------------------------------------------------------
 * Contrat d'accès aux données générique et souverain pour toute la Forteresse.
 * [RÉALIGNE V4] Imposition constitutionnelle de la pagination obligatoire sur le lot !
 *
 * @interface IBaseRepository
 * @template TEntity - La classe ou interface de l'entité métier (ex: User, Item)
 * @template TData   - Le contrat de données passif d'infrastructure (ex: IUserData)
 * @template TId     - Le type fort de la clé primaire (Value Object)
 */
export interface IBaseRepository<TEntity, TData, TId extends AllowedIdTypes = string> {

  /** 🔎 Recherche une entité unique via son identifiant fortement typé. */
  findById(id: TId): Promise<TEntity | null>;

  /**
   * 📜 Récupère l'état paginé, trié et filtré de la table d'infrastructure.
   * [BRIDER MEMOIRE] Interdiction absolue d'extraire des lignes sans options de soute.
   */
  findAll(p_oOptions: IListOptions): Promise<IListResult<TEntity>>;

  /** 💾 Insère ou persiste une nouvelle structure de données dans le stockage. */
  create(data: TData): Promise<TEntity>;
}
