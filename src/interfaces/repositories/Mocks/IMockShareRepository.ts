// ——— fichier : src/interfaces/repositories/Mocks/IMockShareRepository.ts

import type { Share }       from '@/entities/Share';
import type { ShareId }     from '@/domain/value-objects/ids';
import type { IShareData }  from '@/interfaces/entities/share/IShareData';
import type { IShareRepository } from '@/interfaces/repositories/PostGres/IShareRepository';
import type { IMemoryRW }   from '@/interfaces/repositories/IMemoryRW';

/**
 * 🎰 Interface IMockShareRepository 🧮 (Le Contrat Volatil des Partages)
 * ----------------------------------------------------------------------------
 * Spécialisation en RAM du contrat d'infrastructure des passerelles d'accès.
 *
 * @interface IMockShareRepository
 * @extends {IShareRepository}
 * @extends {IMemoryRW<Share, IShareData, ShareId>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect)
 * @author Métallurgie des Octets : Gaïa (Graveuse de symétrie V4)
 */
export interface IMockShareRepository extends IShareRepository, IMemoryRW<Share, IShareData, ShareId> {
    //
}
