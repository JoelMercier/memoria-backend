// ——— fichier : src/interfaces/repositories/Mocks/IMockAppEventRepository.ts

import type { AppEvent }        from '@/entities/AppEvent';
import type { AppEventId }      from '@/domain/value-objects/ids';
import type { IAppEventData }   from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IAppEventRepository } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IMemoryRW }       from '@/interfaces/repositories/IMemoryRW';

/**
 * 🎰 Interface IMockAppEventRepository 🧮 (Le Contrat Volatil d'Audit)
 * ----------------------------------------------------------------------------
 * Spécialisation en RAM du contrat d'infrastructure des journaux d'audit.
 * Libérée de la propriété physique "db" pour les environnements de test.
 *
 * @interface IMockAppEventRepository
 * @extends {IAppEventRepository}
 * @extends {IMemoryRW<AppEvent, IAppEventData, AppEventId>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect)
 * @author Métallurgie des Octets : Gaïa (Graveuse de symétrie V4)
 */
export interface IMockAppEventRepository extends IAppEventRepository, IMemoryRW<AppEvent, IAppEventData, AppEventId> {}
