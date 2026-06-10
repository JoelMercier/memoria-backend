// ——— fichier : src/interfaces/repositories/Mocks/IMockItemTagRepository.ts

import type { IItemTagRepository } from '@/interfaces/repositories/PostGres/IItemTagRepository';

/**
 * 🎰 Interface IMockItemTagRepository 🧮 (Le Contrat Volatil des Liaisons)
 * ----------------------------------------------------------------------------
 * Spécialisation en RAM du pivot Many-to-Many entre les pépites et les tags.
 * Comme il s'agit d'une table de liaison pure sans entité propre, elle n'étend pas IMemoryRW.
 *
 * @interface IMockItemTagRepository
 * @extends {IItemTagRepository}
 * @author Directrice du Silicium : Joël (C++ Framework Architect)
 * @author Métallurgie des Octets : Gaïa (Graveuse de symétrie V4)
 */
export interface IMockItemTagRepository extends IItemTagRepository  {
    //
}
