// ——— fichier : src/interfaces/repositories/IBaseRepository.ts

import type { AllowedIdTypes } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📜 Interface IBaseRepository (Version Jojo Libérée)
 * ----------------------------------------------------
 * Contrat d'accès aux données générique (CRUD) pour les infrastructures de stockage.
 * Ouverte aux Value Objects d'identifiants métiers typés.
 *
 * @interface IBaseRepository
 * @template TEntity - La classe ou interface de l'entité métier (ex: User)
 * @template TData   - Le contrat de données passif associé (ex: IUserData)
 * @template TId     - Le type fort de la clé primaire (Par défaut string)
 * @author Joël, Gaïa & Co
 */
export interface IBaseRepository<
  TEntity,
  TData,
  TId extends AllowedIdTypes = string
> {

  /** 🔎 Recherche une entité unique via son identifiant fortement typé. */
  findById(id: TId): Promise<TEntity | null>;

  /** 📜 Récupère l'intégralité des enregistrements de la table d'infrastructure. */
  findAll(): Promise<TEntity[]>;

  /** 💾 Insère ou persiste une nouvelle structure de données dans le stockage. */
  create(data: TData): Promise<TEntity>;

  /** 🎛️ Met à jour les données partielles d'une entité via son identifiant fort. */
  update(id: TId, data: Partial<TData>): Promise<TEntity>;

  /** 🗑️ Supprime définitivement un enregistrement du stockage. */
  delete(id: TId): Promise<boolean>;
}
