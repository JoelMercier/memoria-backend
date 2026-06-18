// ——— fichier : src/interfaces/services/IBaseService.ts

import type { IBaseRepository        } from '@/interfaces/repositories/IBaseRepository';
import type { IEntity                } from '@/interfaces/entities/IEntity';
import type { AllowedIdTypes         } from '@/types/shared/AllowedIdTypes';
import type { IdentifiantsSouverains } from '@/types/shared/IdentifiantsSouverains';


/**
 * 🏛️ Interface IBaseService 🛡️
 * ----------------------------------------------------------------------------
 * Contrat racine et impératrice suprême de tous les services métier de Mémoria.
 * Verrouille de façon croisée et tridimensionnelle la cohérence des types de soute.
 * Éradication totale et définitive du joker 'any' au profit de la vérité des types.
 *
 * @interface IBaseService
 * @template TEntity     - Le type d'entité vivante du Domaine (descendant d'IEntity)
 * @template TData       - La structure de données passive associée (descendant d'IBaseEntityData)
 * @template TId         - Le type fort de clé primaire de soute (descendant d'AllowedIdTypes)
 * @template TRepository - Le contrat de persistance, devant s'emboîter sur les trois types précédents
 *
 * @author Directeur du Silicium : Joël (C++ Framework Architect - Cross-Locking Engine)
 * @author Métallurgie des Octets : Gaïa (Au burin, calée sur l'armure lourde tridimensionnelle)
 */
export interface IBaseService<
  TEntity     extends IEntity<IdentifiantsSouverains, AllowedIdTypes >,
  TData       ,//extends IBaseEntityData<string, AllowedIdTypes>,
  TId         extends AllowedIdTypes,
  TRepository extends IBaseRepository<TEntity, TData, TId>
> {
  /**
   * Accesseur unique et immuable vers le dépôt d'infrastructure principal du service.
   * Centralise la souveraineté de l'accès aux données physiques pour l'Hexagone.
   *
   * @public
   * @returns {TRepository} Le contrat de dépôt d'infrastructure typé au couteau
   */
  get repository(): TRepository;
}
