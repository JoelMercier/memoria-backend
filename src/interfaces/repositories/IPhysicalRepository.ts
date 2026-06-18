// ——— fichier : src/interfaces/repositories/IPhysicalRepository.ts

import type { IBaseRepository     } from '@/interfaces/repositories/IBaseRepository';
import type { AllowedIdTypes      } from '@/interfaces/entities/IBaseEntityData';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';

/**
 * 🗄️ Interface IPhysicalRepository 🛡️
 * ----------------------------------------------------------------------------
 * Contrat cadre pour les structures de persistance lourdes sur le disque dur.
 * Point d'ancrage obligatoire pour les requêtes SQL à destination de PostgreSQL 17+.
 *
 * @interface IPhysicalRepository
 * @extends {IBaseRepository<TEntity, TData, TId>}
 * @template TEntity - La classe ou interface de l'entité métier (ex: User)
 * @template TData   - Le contrat de données passif associé (ex: IUserData)
 * @template TId     - Le type fort de la clé primaire (Par défaut string)
 *
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IPhysicalRepository<TEntity, TData, TId extends AllowedIdTypes = string> extends IBaseRepository<TEntity, TData, TId> {
  /**
   * Accesseur unique vers l'instance de connexion active à la base de données.
   * Centralise la souveraineté du pool d'infrastructure vers PostgreSQL.
   *
   * @returns {DatabaseConnection} La passerelle d'infrastructure SQL active
   */
  get db(): IDatabaseConnection;
}
