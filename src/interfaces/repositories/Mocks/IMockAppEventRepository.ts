// ——— fichier : src/interfaces/repositories/Mocks/IMockAppEventRepository.ts

import type { AppEvent            } from '@/entities/AppEvent';
import type { EventId             } from '@/domain/value-objects/ids';
import type { IAppEventRepository } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IMemoryRW           } from '@/interfaces/repositories/IMemoryRW';
import type { IAppEventData       } from '@/interfaces/entities/event/IAppEventData'; //-- [RÉPARÉ V4] Connexion directe sur la source pure du Domaine [1.1] !

/**
 * 🎰 Interface IMockAppEventRepository 🧮 (Le Contrat Volatil d'Audit)
 * ----------------------------------------------------------------------------
 * Spécialisation en RAM du contrat d'infrastructure des journaux d'audit.
 * Libérée de la propriété physique "db" pour les environnements de test.
 */
export interface IMockAppEventRepository extends IAppEventRepository, IMemoryRW<AppEvent, IAppEventData, EventId> {}
