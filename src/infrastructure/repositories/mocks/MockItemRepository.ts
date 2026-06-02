// ——— fichier : src/infrastructure/repositories/mocks/MockItemRepository.ts

import { Item }                 from '@/entities/Item';
import { ItemId, UserId }       from '@/domain/value-objects/IdMetier';
import { ContentType }          from '@/constants/ContentType';
import type { IItemData }       from '@/interfaces/entities/item/IItemData';
import type {
  IItemListOptions,
  IItemListResult,
  IItemRepository
}                               from '@/interfaces/repositories/IItemRepository';

/**
 * 🗄️ Classe MockItemRepository 🧮 (Le Simulateur de Pépites en RAM 🤖)
 * ----------------------------------------------------------------------------
 * Usine de simulation émulant à 100% le cycle de vie de la table "Items".
 * Permet de faire tourner le Donjon applicatif en isolation sans toucher au disque.
 *
 * @class MockItemRepository
 * @implements {IItemRepository}
 * @author Déconstruction : Joël (Purement infonctionnel)
 * @author Frapperie du code : Gaïa (Génie autoproclamée du burin)
 * @author Reliques Git->Origin : La Vague Initiale (Ouvriers de la première heure)
 */
export class MockItemRepository implements IItemRepository {
  /** 🧠 La collection virtuelle des pépites stockée en mémoire vive active */
  private m_aoItems: Item[] = [];

  /**
   * 🔍 Lecture chirurgicale : Localise une pépite via son identifiant binaire fort 🤖.
   *
   * @public
   * @async
   * @param {ItemId} p_oIdItem - L identifiant fort du domaine
   * @returns {Promise<Item | null>} L instance de pépite réarmée ou null
   */
  public async findById(p_oIdItem: ItemId): Promise<Item | null> {
    return this.m_aoItems.find((l_oItem: Item): boolean => l_oItem.getItemId().estEgalA(p_oIdItem)) ?? null;
  }

  /**
   * 🔍 Localise une pépite via son jeton textuel unique (slug) pour un acteur.
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L identifiant de l acteur propriétaire
   * @param {string} p_sSlug - Le slug exact recherché
   * @returns {Promise<Item | null>} La pépite correspondante ou null
   */
  public async findBySlug(p_oUserId: UserId, p_sSlug: string): Promise<Item | null> {
    const l_sRecherche: string = p_sSlug.trim();
    return (
      this.m_aoItems.find((l_oItem: Item): boolean =>
        l_oItem.getUserId().estEgalA(p_oUserId) && l_oItem.getSlug() === l_sRecherche
      ) ?? null
    );
  }

  /**
   * 🔍 Localise une pépite via son titre pour un acteur propriétaire.
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L identifiant de l acteur propriétaire
   * @param {string} p_sTitle - Le titre textuel recherché
   * @returns {Promise<Item | null>} La pépite correspondante ou null
   */
  public async findByTitle(p_oUserId: UserId, p_sTitle: string): Promise<Item | null> {
    const l_sRecherche: string = p_sTitle.toLowerCase().trim();
    return (
      this.m_aoItems.find((l_oItem: Item): boolean =>
        l_oItem.getUserId().estEgalA(p_oUserId) && l_oItem.getTitle().toLowerCase().trim() === l_sRecherche
      ) ?? null
    );
  }

  /**
   * 🚀 Extraction contractuelle filtrée Jojo-Style simulant l indexation SQL 🌐.
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L identifiant de l acteur propriétaire connecté
   * @param {IItemListOptions} [p_oOptions] - Filtres optionnels (Recherche, Média)
   * @returns {Promise<IItemListResult>} Le dictionnaire paginé contenant le total
   */
  public async listByUser(p_oUserId: UserId, p_oOptions?: IItemListOptions): Promise<IItemListResult> {
    let la_oFiltres: Item[] = this.m_aoItems.filter((l_oItem: Item): boolean => l_oItem.getUserId().estEgalA(p_oUserId));

    if (p_oOptions?.contentType) {
      // Alignement sémantique sur nos Smart Enums typés de Phase 2 ! [Mémoria]
      const l_eTypeCible = ContentType.DeCode<ContentType>(p_oOptions.contentType);
      la_oFiltres = la_oFiltres.filter((l_oItem: Item): boolean => l_oItem.getContentType() === l_eTypeCible);
    }

    if (p_oOptions?.search) {
      const l_sMotCle: string = p_oOptions.search.toLowerCase().trim();
      la_oFiltres = la_oFiltres.filter((l_oItem: Item): boolean => l_oItem.getTitle().toLowerCase().includes(l_sMotCle));
    }

    const l_iTotal  : number = la_oFiltres.length;
    const l_iOffset : number = p_oOptions?.offset ?? 0;
    const l_iLimit  : number = p_oOptions?.limit  ?? 20;

    return {
      items : la_oFiltres.slice(l_iOffset, l_iOffset + l_iLimit),
      total : l_iTotal
    };
  }

  /**
   * 🪓 Écriture concrète : Enfourne une nouvelle pépite dans le catalogue de simulation 🪙.
   *
   * @public
   * @async
   * @param {IItemData} p_oData - Le sac de données brutes issues du Domaine
   * @returns {Promise<Item>} L instance de l entité forgée
   */
  public async create(p_oData: IItemData): Promise<Item> {
    const l_oItem = new Item({
      ...p_oData,
      createdAt : new Date(),
      updatedAt : new Date()
    });
    this.m_aoItems.push(l_oItem);
    return l_oItem;
  }

  /**
   * 🪓 Mutation en mémoire vive : Applique les modifications partielles d une pépite.
   *
   * @public
   * @async
   * @param {ItemId} p_oIdItem - L identifiant fort de la pépite à modifier
   * @param {Partial<IItemData>} p_oData - Les colonnes partielles soumises
   * @returns {Promise<Item>} L entité Domaine modifiée au bit près
   */
  public async update(p_oIdItem: ItemId, p_oData: Partial<IItemData>): Promise<Item> {
    const l_iIdx: number = this.m_aoItems.findIndex((l_oItem: Item): boolean => l_oItem.getItemId().estEgalA(p_oIdItem));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] Item unique ID ${p_oIdItem.valeur} introuvable pour l update.`);
    }

    const l_oCourant : IItemData = this.m_aoItems[l_iIdx].toData();
    const l_oMute    = new Item({
      ...l_oCourant,
      ...p_oData,
      idItem    : p_oIdItem,
      updatedAt : new Date()
    });

    this.m_aoItems[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🪓 Extraction complète requise par le contrat d héritage de IBaseRepository [Mémoria].
   *
   * @public
   * @async
   * @returns {Promise<Item[]>} L intégralité absolue de la collection simulée
   */
  public async findAll(): Promise<Item[]> {
    return [...this.m_aoItems];
  }

  /**
   * 🪓 Retrait physique : Supprime une pépite du dictionnaire de simulation.
   *
   * @public
   * @async
   * @param {ItemId} p_oIdItem - L identifiant unique fort de la pépite
   * @returns {Promise<boolean>} True si la suppression en RAM est effective
   */
  public async delete(p_oIdItem: ItemId): Promise<boolean> {
    const l_iTailleInitiale: number = this.m_aoItems.length;
    this.m_aoItems = this.m_aoItems.filter((l_oItem: Item): boolean => !l_oItem.getItemId().estEgalA(p_oIdItem));
    return this.m_aoItems.length < l_iTailleInitiale;
  }
}
