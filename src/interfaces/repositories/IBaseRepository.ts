// ——— fichier : src/interfaces/repositories/IBaseRepository.ts

import type { AllowedIdTypes } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📜 Interface IBaseRepository (Version Jojo Libérée)
 * ----------------------------------------------------
 * Contrat d'accès aux données générique pour les infrastructures de stockage.
 * Limité constitutionnellement aux flux en lecture et écriture seule (Append/Read).
 * Isole les structures immuables (comme les traces d'audit app_events) des dangers de mutation.
 *
 * @interface IBaseRepository
 * @template TEntity - La classe ou interface de l'entité métier (ex: User)
 * @template TData   - Le contrat de données passif associé (ex: IUserData)
 * @template TId     - Le type fort de la clé primaire (Par défaut string)
 *
 * @author 🧠 Conception : Joël (Abstract' Obsession)
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
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
}
