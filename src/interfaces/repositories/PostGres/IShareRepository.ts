// ——— fichier : src/interfaces/repositories/IShareRepository.ts

import type { ShareId, ItemId, UserId } from '@/domain/value-objects/ids';
import type { Share }              from '@/entities/Share';
import type { IShareData }         from '@/interfaces/entities/share/IShareData';
import type { IPhysicalRW }             from '@/interfaces/repositories/IPhysicalRW';
import type { IMemoryRW }               from '@/interfaces/repositories/IMemoryRW'; // 🗲 [ALIGNÉ V4]
import type { IListOptions }            from '@/interfaces/shared/IListOptions';
import type { IListResult }             from '@/interfaces/shared/IListResult';

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
   * @param {IListOptions} p_oOptions - Options de tri et de pagination de soute
   * @returns {Promise<IListResult<Share>>} Structure paginée contenant la meute et le compte total
   */
  findByItemId(p_axItemId: ItemId, p_oOptions: IListOptions): Promise<IListResult<Share>>;

  /**
   * 🔍 Localise un partage unique via son jeton de sécurité textuel (Token).
   *
   * @async
   * @param {string} p_sJeton - Le jeton de sécurité cryptographique recherché (shAccesJeton)
   * @returns {Promise<Share | null>} L'instance du partage ou null si inexistant
   */
  findByToken(p_sJeton: string): Promise<Share | null>;

  /**
   * 🔍 Récupère l'ensemble des passerelles de partage engendrées par un acteur spécifique.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant unique de l'acteur propriétaire
   * @param {IListOptions} p_oOptions - Options de tri et de pagination de soute
   * @returns {Promise<IListResult<Share>>} Structure paginée contenant la meute et le compte total
   */
  findByUserId(p_axUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Share>>;

  /**
   * 🏛️ Extracteur universel d'administration pour le grand fichier des partages du château.
   *
   * @async
   * @param {IListOptions} p_oOptions - Options de tri et de pagination globales
   * @returns {Promise<IListResult<Share>>} Le registre complet et paginé de tous les partages du système
   */
  findAllShares(p_oOptions: IListOptions): Promise<IListResult<Share>>;
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
