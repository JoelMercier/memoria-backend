// ——— fichier : src/interfaces/repositories/IMemoryRepository.ts

import type { IBaseRepository } from '@/interfaces/repositories/IBaseRepository';
import type { AllowedIdTypes } from '@/types/shared/AllowedIdTypes';

/**
 * 🗄️ Interface IMemoryRepository 🛡️
 * ----------------------------------------------------------------------------
 * Contrat cadre pour les structures de stockage volatiles résidant en RAM.
 * Dédié à la production locale rapide et à la capture des Mocks de tests unitaires.
 *
 * @interface IMemoryRepository
 * @extends {IBaseRepository<TEntity, TData, TId>}
 * @template TEntity - La classe ou interface de l'entité métier transitoire (ex: structure volatile)
 * @template TData   - Le contrat de données passif associé (ex: structure primitive)
 * @template TId     - Le type fort de la clé primaire (Par défaut string)
 *
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IMemoryRepository<TEntity, TData, TId extends AllowedIdTypes = string>
  extends IBaseRepository<TEntity, TData, TId> {

  /**
   * 🎛️ Accesseur exclusif sur le registre de stockage brut en RAM.
   * Fournit une visibilité totale sur le dictionnaire interne pour la tuyauterie des tests.
   */
  get memoryRegistry(): Map<TId, TData>;
 
}
