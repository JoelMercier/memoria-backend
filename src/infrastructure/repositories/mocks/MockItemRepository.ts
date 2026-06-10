// ——— fichier : src/infrastructure/repositories/mocks/MockItemRepository.ts

import { Item }                       from '@/entities/Item';
import { ItemId, UserId }             from '@/domain/value-objects/ids';
import type { IItemData }             from '@/interfaces/entities/item/IItemData';
import type { IListResult }           from '@/interfaces/shared/IListResult';
import { IListOptions }               from '@/interfaces/shared/IListOptions';
import { IMockItemRepository }        from '@/interfaces/repositories/Mocks/IMockItemRepository';
import { IItemRepositoryListOptions } from '@/interfaces/repositories/PostGres/IItemRepository';
import OrdreTriEnum                   from '@/constants/OrdreTriEnum';

/**
 * 🗄️ Classe MockItemRepository 🧮 (Le Simulateur de Pépites en RAM 🤖)
 * ----------------------------------------------------------------------------
 * Usine de simulation émulant à 100% le cycle de vie de la table "Items" en RAM.
 * Délivrée de la propriété physique .db grâce à l'héritage légitime de IMockItemRepository.
 *
 * @class MockItemRepository
 * @implements {IMockItemRepository}
 * @author Vision : Joël (Architecte DR-DOS - Nettoyeur de parenthèses)
 * @author Frapperie du code : Gaïa (Au burin, raccordée sur la Choupy Doctrine V4)
 */
export class MockItemRepository implements IMockItemRepository {
  /** 🧠 La collection virtuelle des pépites stockée en mémoire vive active */
  private m_aoItems: Item[] = [];

  /**
   * 🎰 Accesseur privé centralisé régissant l'accès à la soute de RAM.
   *
   * @private
   * @returns {Item[]} Le pointeur direct vers la collection active
   */
  private getItems(): Item[] {
    return this.m_aoItems;
  }

  /**
   * 🔍 Lecture chirurgicale : Localise une pépite via son identifiant binaire fort 🤖.
   *
   * @public
   * @async
   * @param {ItemId} p_oIdItem - L'identifiant fort du domaine
   * @returns {Promise<Item | null>} L'instance de pépite réarmée ou null
   */
  public async findById(p_oIdItem: ItemId): Promise<Item | null> {
    return this.getItems().find((l_oItem: Item): boolean => l_oItem.idItem.estEgalA(p_oIdItem)) ?? null;
  }

  /**
   * 🔍 Localise une pépite via son jeton textuel unique (slug) pour un acteur.
   */
  public async findBySlug(p_oUserId: UserId, p_sSlug: string): Promise<Item | null> {
    const l_sRecherche: string = p_sSlug.trim();
    return (
      this.getItems().find((l_oItem: Item): boolean =>
        l_oItem.idUser.estEgalA(p_oUserId) && l_oItem.slug === l_sRecherche
      ) ?? null
    );
  }

  /**
   * 🔍 Localise une pépite via son titre pour un acteur propriétaire.
   */
  public async findByTitle(p_oUserId: UserId, p_sTitle: string): Promise<Item | null> {
    const l_sRecherche: string = p_sTitle.toLowerCase().trim();
    return (
      this.getItems().find((l_oUserItem: Item): boolean =>
        l_oUserItem.idUser.estEgalA(p_oUserId) && l_oUserItem.title.toLowerCase().trim() === l_sRecherche
      ) ?? null
    );
  }

  /**
   * 🚀 Extraction contractuelle filtrée Jojo-Style simulant l'indexation SQL 🌐.
   */
  public async listByUser(p_oUserId: UserId, p_oOptions: IItemRepositoryListOptions): Promise<IListResult<Item>> {
    let l_aoFiltres: Item[] = this.getItems().filter((l_oItem: Item): boolean => l_oItem.idUser.estEgalA(p_oUserId));

    if (p_oOptions.contentTypeId) {
      l_aoFiltres = l_aoFiltres.filter((l_oItem: Item): boolean => l_oItem.contentType.code === p_oOptions.contentTypeId?.valeur);
    }

    if (p_oOptions.MotsCles) {
      const l_sMotCle: string = p_oOptions.MotsCles.toLowerCase().trim();
      l_aoFiltres = l_aoFiltres.filter((l_oItem: Item): boolean => l_oItem.title.toLowerCase().includes(l_sMotCle));
    }

    return this.appliquerPaginationRAM(l_aoFiltres, p_oOptions);
  }

  /**
   * 🪓 Écriture concrète : Enfourne une nouvelle pépite dans le catalogue de simulation 🪙.
   */
  public async create(p_oData: IItemData): Promise<Item> {
    const l_oItem = new Item({
      ...p_oData,
      createdAt : p_oData.createdAt || new Date(),
      updatedAt : p_oData.updatedAt
    });
    this.getItems().push(l_oItem);
    return l_oItem;
  }

  /**
   * 🪓 Mutation en mémoire vive : Applique les modifications partielles d'une pépite.
   */
  public async update(p_oIdItem: ItemId, p_oData: Partial<IItemData>): Promise<Item> {
    const l_iIdx: number = this.getItems().findIndex((l_oItem: Item): boolean => l_oItem.idItem.estEgalA(p_oIdItem));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] Item unique ID ${p_oIdItem.toString()} introuvable pour l'update.`);
    }

    const l_oCourant : IItemData = this.getItems()[l_iIdx].toData();
    const l_oMute    = new Item({
      ...l_oCourant,
      ...p_oData,
      updatedAt : new Date()
    } as any);

    this.getItems()[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🪓 Extraction complète requise par le contrat d'héritage de IBaseRepository [Mémoria].
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<Item>> {
    return this.appliquerPaginationRAM(this.getItems(), p_oOptions);
  }

  /**
   * 🪓 Retrait physique : Supprime une pépite du dictionnaire de simulation.
   */
  public async delete(p_oIdItem: ItemId): Promise<boolean> {
    const l_iTailleInitiale: number = this.getItems().length;
    this.m_aoItems = this.getItems().filter((l_oItem: Item): boolean => !l_oItem.idItem.estEgalA(p_oIdItem));
    return this.getItems().length < l_iTailleInitiale;
  }

  /**
   * 🧮 Utilitaire privé émulant la pagination et le tri universel en RAM.
   */
  private appliquerPaginationRAM(p_aoSource: Item[], p_oOptions: IListOptions): IListResult<Item> {
    const l_nTotal = p_aoSource.length;
    const l_nLimit = p_oOptions.NbLignes ?? 50;
    const l_nOffset = p_oOptions.LigneDebut ?? 0;

    const l_sCleTri = p_oOptions.ColonneTri === 'itCreatedAt' ? 'createdAt' : 'title';
    p_aoSource.sort((l_oA: any, l_oB: any): number => {
      const l_vA = l_oA[l_sCleTri];
      const l_vB = l_oB[l_sCleTri];
      const l_sOrdre = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';
      return l_sOrdre === 'DESC' ? (l_vA > l_vB ? -1 : 1) : (l_vA < l_vB ? -1 : 1);
    });

    const l_aoPage = p_aoSource.slice(l_nOffset, l_nOffset + l_nLimit);

    return {
      LigneDebut:    l_nOffset,
      NbLignesDem:   l_nLimit,
      NbLignesRenv:  l_aoPage.length,
      NbLignesTotal: l_nTotal,
      Lignes:        l_aoPage
    };
  }
}
