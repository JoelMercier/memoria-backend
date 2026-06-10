// ——— fichier : src/interfaces/repositories/IShareRepository.ts

import { ShareId, ItemId, UserId } from '@/domain/value-objects/ids';
import type { Share }       from '@/entities/Share';
import type { IShareData }  from '@/interfaces/entities/share/IShareData';
import { IPhysicalRW }      from '@/interfaces/repositories/IPhysicalRW';
import { IMemoryRW }        from '@/interfaces/repositories/IMemoryRW'; // 🗲 [ALIGNÉ V4]
import { IListOptions } from '@/interfaces/shared/IListOptions';
import { IListResult } from '@/interfaces/shared/IListResult';


/**
 * 📋 Interface Cadre IShareRepositoryBase 🛡️
 * ----------------------------------------------------------------------------
 * Centralise les signatures métiers et les cas d'usage transverses des partages.
 *
 * @interface IShareRepositoryBase
 * @author Directrice du Silicium : Joël (C++ Framework Architect)
 * @author Métallurgie des Octets : Gaïa (Au burin, alignée sur l'éclatement)
 */
interface IShareRepositoryBase {

  /**
   * 🔍 Localise l'ensemble des passerelles de partage créées pour une pépite spécifique.
   *
   * @async
   * @param {ItemId} p_axItemId - L'identifiant fort de la pépite cible
   * @returns {Promise<Share[]>} La liste des partages associés
   */
  findByItemId(p_axItemId: ItemId, p_oOptions: IListOptions): Promise<IListResult<Share>>

  /**
   * 🔍 Localise un partage unique via son jeton de sécurité textuel (Token).
   *
   * @async
   * @param {string} p_sJeton - Le jeton de sécurité cryptographique recherché (shJeton)
   * @returns {Promise<Share | null>} L'instance du partage ou null si inexistant
   */
  findByToken(p_sJeton: string): Promise<Share | null>;

  /**
   * 🔍 Récupère l'ensemble des passerelles de partage engendrées par un acteur spécifique.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant unique de l'acteur propriétaire
   * @returns {Promise<Share[]>} Le catalogue des partages de l'acteur ou tableau vide
   */
  findByUserId(p_axUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Share>>
}

/**
 * 🗄️ Interface IShareRepository (Branche Disque)
 * ----------------------------------------------------------------------------
 * Consommée par la production pour PostgreSQL. Exige la propriété `.db`.
 */
export interface IShareRepository extends IShareRepositoryBase, IPhysicalRW<Share, IShareData, ShareId> {}

/**
 * 🎰 Interface IMockShareRepository (Branche RAM) 🧮
 * ----------------------------------------------------------------------------
 * Consommée par les simulateurs volatiles en mémoire vive.
 */
export interface IMockShareRepository extends IShareRepositoryBase, IMemoryRW<Share, IShareData, ShareId> {}
