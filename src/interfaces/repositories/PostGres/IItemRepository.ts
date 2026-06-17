// ——— fichier : src/interfaces/repositories/PostGres/IItemRepository.ts

import type { UserId, ItemId, ContentTypeId } from '@/domain/value-objects/ids';
import type { Item } from '@/entities/Item';
import type { IItemData } from '@/interfaces/entities/item/IItemData';
import type { IPhysicalRW } from '@/interfaces/repositories/IPhysicalRW';
import type { IListOptions } from '@/interfaces/shared/IListOptions';
import type { IListResult } from '@/interfaces/shared/IListResult';

/**
 * 🎛️ Interface IItemRepositoryListOptions 📐
 * ----------------------------------------------------------------------------
 * Dictionnaire d'options de filtrage et d'ordonnancement exclusif pour les Pépites (Items).
 * S'adosse constitutionnellement au verrou de pagination et de tri déterministe.
 *
 * @interface IItemRepositoryListOptions
 * @extends {IListOptions}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Zéro Bâclage)
 * @author Métallurgie des Octets : Gaïa (Au burin, raccordée sur la Choupy Doctrine)
 */
export interface IItemRepositoryListOptions extends IListOptions {
  /** 👥 Filtre optionnel pour cibler l'acteur propriétaire de la soute */
  itemOwnerId?: UserId;

  /** 🔌 Le format typé fixe remplace définitivement l'ancien concept textuel */
  contentTypeId?: ContentTypeId;

  /** 🔍 Chaîne textuelle libre pour la recherche par mot-clé (ILIKE) sur le titre */
  MotsCles?: string;
}

/**
 * 🗄️ Interface IItemRepository 🏛️
 * ----------------------------------------------------------------------------
 * Contrat d'accès gérant la persistance et le cycle de vie exclusif sur disque (PostgreSQL).
 * S'adosse constitutionnellement à la branche lourde IPhysicalRW. Exige la propriété `.db`.
 *
 * @interface IItemRepository
 * @extends {IPhysicalRW<Item, IItemData, ItemId>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Cohesive Packaging)
 * @author Graveuse de Pépites : Gaïa (Au burin, coulée dans le bronze V4)
 */
export interface IItemRepository extends IPhysicalRW<Item, IItemData, ItemId> {
  /**
   * 🛤️ Localise et extrait une Pépite unique via son permalien textuel (Slug).
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @param {string} p_sSlug - Le permalien normalisé à rechercher sur le disque
   * @returns {Promise<Item | null>} L'entité de la pépite hydratée ou null s'il n'y a rien
   */
  findBySlug(p_axUserId: UserId, p_sSlug: string): Promise<Item | null>;

  /**
   * 📝 Recherche une Pépite unique par son titre exact sur l'espace d'un utilisateur.
   * Utilisé en amont lors des créations pour bloquer les collisions d'intitulés.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @param {string} p_sTitle - Le titre textuel brut à vérifier à la douane
   * @returns {Promise<Item | null>} L'entité de la pépite correspondante ou null
   */
  findByTitle(p_axUserId: UserId, p_sTitle: string): Promise<Item | null>;

  /**
   * 📜 Extrait la collection filtrée, ordonnée et paginée des ressources détenues par un acteur.
   * Exploite l'enveloppe générique d'IHM et s'aligne sur les variables sacrées Jojo-Style.
   *
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur cible
   * @param {IItemRepositoryListOptions} p_oOptions - Le dictionnaire de configuration de tri, filtres et limites
   * @returns {Promise<IListResult<Item>>} Le lot de résultats paginé et structuré en français d'élite
   */
  listByUser(
    p_axUserId: UserId,
    p_oOptions: IItemRepositoryListOptions
  ): Promise<IListResult<Item>>;

  /**
   * 🗑️ Destruction physique d'infrastructure restreinte à l'espace de l'acteur.
   * [SCELLÉ JOJO-STYLE V4] Surcharge par arité optionnelle pour compatibilité IPhysicalRW.
   *
   * @async
   * @param {ItemId} p_axIdItem - L'identifiant unique fort de la pépite à éradiquer
   * @param {UserId} [p_axUserId] - L'identifiant optionnel du propriétaire (Verrou de sécurité)
   * @returns {Promise<boolean>} Vrai si la suppression physique est confirmée par le tas
   */
  delete(p_axIdItem: ItemId, p_axUserId?: UserId): Promise<boolean>;
}
