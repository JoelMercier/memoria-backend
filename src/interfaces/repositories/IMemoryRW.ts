// ——— fichier : src/interfaces/repositories/IMemoryRW.ts

import { IMemoryRepository } from '@/interfaces/repositories/IMemoryRepository';
import { AllowedIdTypes }    from '@/interfaces/entities/IBaseEntityData';

/**
 * 🛡️ Interface IMemoryRW (Read-Write Volatile) 🛡️
 * ----------------------------------------------------------------------------
 * Lecture et écriture simultanées en mémoire vive (Quarantaine, caches réactifs).
 * Reçoit l'attirail complet de findById, findAll, create de votre IBaseRepository !
 *
 * @interface IMemoryRW
 * @extends {IMemoryRepository<TEntity, TData, TId>}
 * @template TEntity - La classe ou interface de l'entité métier transitoire
 * @template TData   - Le contrat de données passif associé (ex: structure primitive)
 * @template TId     - Le type fort de la clé primaire (Par défaut string)
 *
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IMemoryRW<TEntity, TData, TId extends AllowedIdTypes = string>
  extends IMemoryRepository<TEntity, TData, TId> {
  // Contrat cadre étanche pour les extensions de stockage en mémoire vive avec mutation
}
