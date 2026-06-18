// ——— fichier : src/interfaces/repositories/IPhysicalRW.ts

import type { IPhysicalRepository } from '@/interfaces/repositories/IPhysicalRepository';
import type { AllowedIdTypes } from '@/types/shared/AllowedIdTypes';


/**
 * 🛡️ Interface IPhysicalRW (Read-Write - Ancien IWriteableRepository)
 * ----------------------------------------------------------------------------
 * Persistance complète en lecture/écriture avec droit de mutation sur le disque PostgreSQL.
 * Réservé exclusivement aux entités mutables (Users, Items, Partages).
 *
 * @interface IPhysicalRW
 * @extends {IPhysicalRepository<TEntity, TData, TId>}
 * @template TEntity - La classe ou interface de l'entité métier (ex: User)
 * @template TData   - Le contrat de données passif associé (ex: IUserData)
 * @template TId     - Le type fort de la clé primaire (Par défaut string)
 *
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IPhysicalRW<TEntity, TData, TId extends AllowedIdTypes = string>
  extends IPhysicalRepository<TEntity, TData, TId> {

  /**
   * 🎛️ Applique des modifications partielles sur une entité existante via son ID fort.
   *
   * @async
   * @param {TId} p_axId - L'identifiant fort binaire de l'entité cible à réviser
   * @param {Partial<TData>} p_oUpdates - Le lot partiel d'attributs modifiés à appliquer sur le disque
   * @returns {Promise<TEntity | null>} L'entité révisée hydratée ou null si introuvable
   */
  update(p_axId: TId, p_oUpdates: Partial<TData>): Promise<TEntity | null>;

  /**
   * 🗑️ Supprime de manière destructive un enregistrement physique du disque.
   *
   * @async
   * @param {TId} p_axId - L'identifiant fort binaire de la ligne à éradiquer de PostgreSQL
   * @returns {Promise<boolean>} Vrai si la suppression physique a bien été confirmée par l'infrastructure
   */
  delete(p_axId: TId): Promise<boolean>;
}
