// ——— fichier : src/infrastructure/repositories/mocks/MockShareRepository.ts

import { Share }                    from '@/entities/Share';
import { ShareId, ItemId, UserId }  from '@/domain/value-objects/ids';
import type { IShareData }          from '@/interfaces/entities/share/IShareData';
import type { IMockShareRepository } from '@/interfaces/repositories/IShareRepository'; // 🗲 [ALIGNÉ V4]

/**
 * 🗄️ Classe MockShareRepository 🧮 (Le Simulateur de Partages en RAM 🤖)
 * ----------------------------------------------------------------------------
 * Usine de simulation émulant à 100% le cycle de vie de la table "Shares".
 * Verrouille la logique des passerelles de partage lors des tests Domaines.
 * S'adosse à IMemoryRW pour s'affranchir de la plomberie physique de base de données.
 *
 * @class MockShareRepository
 * @implements {IMockShareRepository}
 * @author Vision : Joël ((très)Abstract Class - Nettoyeur de parenthèses)
 * @author Frapperie du code : Gaïa (Métallurgiste des octets V4)
 */
export class MockShareRepository implements IMockShareRepository {
  /** 🧠 La collection virtuelle des partages stockée en mémoire vive active */
  private m_aoShares: Share[] = [];

  /**
   * 🎰 Accesseur privé centralisé régissant l'accès à la soute de RAM.
   *
   * @private
   * @returns {Share[]} Le pointeur direct vers la collection active
   */
  private getShares(): Share[] {
    return this.m_aoShares;
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un partage via son identifiant binaire fort 🤖.
   *
   * @public
   * @async
   * @param {ShareId} p_axIdShare - L'identifiant fort du partage (Segment binaire)
   * @returns {Promise<Share | null>} L'instance du partage réarmée ou null
   */
  public async findById(p_axIdShare: ShareId): Promise<Share | null> {
    // 🪓 [RÉPARÉ V4] Utilisation du getter de surface .idShare sans parenthèses !
    return this.getShares().find((l_oShare: Share): boolean => l_oShare.idShare.estEgalA(p_axIdShare)) ?? null;
  }

  /**
   * 🔍 Localise l'ensemble des passerelles de partage créées pour une pépite spécifique 📥.
   *
   * @public
   * @async
   * @param {ItemId} p_axItemId - L'identifiant fort de la pépite cible
   * @returns {Promise<Share[]>} La liste des partages associés
   */
  public async findByItemId(p_axItemId: ItemId): Promise<Share[]> {
    // 🪓 [RÉPARÉ V4] Utilisation du getter .idItem
    return this.getShares().filter((l_oShare: Share): boolean => l_oShare.idItem.estEgalA(p_axItemId));
  }

  /**
   * 🔍 Localise un partage unique via son jeton de sécurité textuel (Token) 🔐.
   */
  public async findByToken(p_sJeton: string): Promise<Share | null> {

    const l_sRecherche: string = p_sJeton.trim();

    return this.getShares().find((l_oShare: Share): boolean => {

      const l_oData = l_oShare.toData() as any;
      const l_sJetonCourant = l_oData.shJeton ?? l_oData.shareToken;
      return l_sJetonCourant === l_sRecherche;

    }) ?? null;
    
  }

  /**
   * 🔍 Récupère l'ensemble des passerelles de partage engendrées par un acteur spécifique 👥.
   */
  public async findByUserId(p_axUserId: UserId): Promise<Share[]> {
    return this.getShares().filter((l_oShare: Share): boolean => {
      const l_oData = l_oShare.toData() as any;
      const l_oOwnerId = l_oData.itemOwnerId ?? l_oData.userId;
      return l_oOwnerId !== null && l_oOwnerId !== undefined && l_oOwnerId.estEgalA(p_axUserId);
    });
  }

  /**
   * 🪓 Enregistre un nouveau partage dans le catalogue factice 🪙.
   *
   * @public
   * @async
   * @param {IShareData} p_oData - Le sac de données brutes issues du Domaine
   * @returns {Promise<Share>} L'instance de l'entité forgée
   */
  public async create(p_oData: IShareData): Promise<Share> {
    const l_oShare = new Share({
      ...p_oData,
      createdAt : p_oData.createdAt || new Date(),
      updatedAt : p_oData.updatedAt
    } as any);
    this.getShares().push(l_oShare);
    return l_oShare;
  }

  /**
   * 🪓 Mutation en mémoire vive : Modifie partiellement un partage simulé.
   *
   * @public
   * @async
   * @param {ShareId} p_axIdShare - L'identifiant unique fort de soute
   * @param {Partial<IShareData>} p_oData - Le dictionnaire de modifications partielles
   * @returns {Promise<Share>} L'entité modifiée hydratée
   */
  public async update(p_axIdShare: ShareId, p_oData: Partial<IShareData>): Promise<Share> {
    // 🪓 [RÉPARÉ V4] Alignement sur .idShare
    const l_iIdx: number = this.getShares().findIndex((l_oShare: Share): boolean => l_oShare.idShare.estEgalA(p_axIdShare));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] Share unique ID ${p_axIdShare.toString()} introuvable pour l update.`);
    }

    const l_oCourant : any = this.getShares()[l_iIdx].toData();
    const l_oMute    = new Share({
      ...l_oCourant,
      ...p_oData,
      updatedAt : new Date()
    } as any);

    this.getShares()[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🏺 Contrat de base : Extrait l'intégralité absolue de la table de simulation.
   *
   * @public
   * @async
   * @returns {Promise<Share[]>} L'ensemble de la collection simulée
   */
  public async findAll(): Promise<Share[]> {
    return [...this.getShares()];
  }

  /**
   * 🪓 Retrait physique : Supprime une passerelle de partage de la collection en RAM.
   *
   * @public
   * @async
   * @param {ShareId} p_axIdShare - L'identifiant fort de soute
   * @returns {Promise<boolean>} True si effectif
   */
  public async delete(p_axIdShare: ShareId): Promise<boolean> {
    const l_iTailleInitiale: number = this.getShares().length;
    // 🪓 [RÉPARÉ V4] Alignement sur .idShare
    this.m_aoShares = this.getShares().filter((l_oShare: Share): boolean => !l_oShare.idShare.estEgalA(p_axIdShare));
    return this.m_aoShares.length < l_iTailleInitiale;
  }
}
