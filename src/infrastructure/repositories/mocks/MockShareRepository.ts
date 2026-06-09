// ——— fichier : src/infrastructure/repositories/mocks/MockShareRepository.ts

import { Share                   } from '@/entities/Share';
import { ShareId, ItemId, UserId } from '@/domain/value-objects/ids';
import type { IShareData         } from '@/interfaces/entities/share/IShareData';
import type { IShareRepository   } from '@/interfaces/repositories/IShareRepository';

/**
 * 🗄️ Classe MockShareRepository 🧮 (Le Simulateur de Partages en RAM 🤖)
 * ----------------------------------------------------------------------------
 * Usine de simulation émulant à 100% le cycle de vie de la table "Shares".
 * Verrouille la logique des passerelles de partage lors des tests Domaines.
 *
 * @class MockShareRepository
 * @implements {IShareRepository}
 * @author Vision : Joël ((très)Abstract Class)
 * @author Frapperie du code : Gaïa (Métallurgiste des octets)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export class MockShareRepository implements IShareRepository {
  /** 🧠 La collection virtuelle des partages stockée en mémoire vive active */
  private m_aoShares: Share[] = [];

  /**
   * 🔍 Lecture chirurgicale : Localise un partage via son identifiant binaire fort 🤖.
   *
   * @public
   * @async
   * @param {ShareId} p_axIdShare - L'identifiant fort du partage (Segment binaire)
   * @returns {Promise<Share | null>} L'instance du partage réarmée ou null
   */
  public async findById(p_axIdShare: ShareId): Promise<Share | null> {
    return this.m_aoShares.find((l_oShare: Share): boolean => l_oShare.getShareId().estEgalA(p_axIdShare)) ?? null;
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
    return this.m_aoShares.filter((l_oShare: Share): boolean => l_oShare.getItemId().estEgalA(p_axItemId));
  }

  /**
   * 🔍 Localise un partage unique via son jeton de sécurité textuel (Token) 🔐.
   * ----------------------------------------------------------------------------
   * Contournement d'acier : Extraction du sac passif pour lire la zone shJeton
   * sans dépendre d'une méthode getJeton() potentiellement absente de l'entité.
   *
   * @public
   * @async
   * @param {string} p_sJeton - Le jeton de sécurité cryptographique recherché (shJeton)
   * @returns {Promise<Share | null>} L'instance du partage ou null si inexistant
   */
  public async findByToken(p_sJeton: string): Promise<Share | null> {
    const l_sRecherche: string = p_sJeton.trim();
    return this.m_aoShares.find((l_oShare: Share): boolean => {
      const l_oData = l_oShare.toData() as any;
      // Lecture de la propriété brute (gère shJeton ou l'ancien shareToken de l'équipe)
      const l_sJetonCourant = l_oData.shJeton ?? l_oData.shareToken;
      return l_sJetonCourant === l_sRecherche;
    }) ?? null;
  }

  /**
   * 🔍 Récupère l'ensemble des passerelles de partage engendrées par un acteur spécifique 👥.
   * ----------------------------------------------------------------------------
   * Règle de l'Art : Pas de zone usUserId obsolète sur la table. Le filtrage remonte
   * par l'identifiant fort de la pépite liée pour isoler le propriétaire légitime.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant unique de l'acteur propriétaire
   * @returns {Promise<Share[]>} Le catalogue des partages de l'acteur ou tableau vide
   */
  public async findByUserId(p_axUserId: UserId): Promise<Share[]> {
    return this.m_aoShares.filter((l_oShare: Share): boolean => {
      const l_oData = l_oShare.toData() as any;
      // Lecture sécurisée du propriétaire de la ressource (itemOwnerId ou userId hérité)
      const l_oOwnerId = l_oData.itemOwnerId ?? l_oData.userId;
      return l_oOwnerId !== null && l_oOwnerId !== undefined && l_oOwnerId.estEgalA(p_axUserId);
    });
  }

  /**
   * 🪓 Enregistre un nouveau partage dans le catalogue factice 🪙.
   */
  public async create(p_oData: IShareData): Promise<Share> {
    const l_oShare = new Share({
      ...p_oData,
      createdAt : new Date(),
      updatedAt : new Date()
    } as any);
    this.m_aoShares.push(l_oShare);
    return l_oShare;
  }

  /**
   * 🪓 Mutation en mémoire vive : Modifie partiellement un partage simulé.
   */
  public async update(p_axIdShare: ShareId, p_oData: Partial<IShareData>): Promise<Share> {
    const l_iIdx: number = this.m_aoShares.findIndex((l_oShare: Share): boolean => l_oShare.getShareId().estEgalA(p_axIdShare));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] Share unique ID ${p_axIdShare.toString()} introuvable pour l update.`);
    }

    const l_oCourant : any = this.m_aoShares[l_iIdx].toData();
    const l_oMute    = new Share({
      ...l_oCourant,
      ...p_oData,
      shIdShare : p_axIdShare,
      idShare   : p_axIdShare, // Double cartouche pour calmer l'ancienne entité
      updatedAt : new Date()
    } as any);

    this.m_aoShares[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🏺 Contrat de base : Extrait l'intégralité absolue de la table de simulation.
   */
  public async findAll(): Promise<Share[]> {
    return [...this.m_aoShares];
  }

  /**
   * 🪓 Retrait physique : Supprime une passerelle de partage de la collection en RAM.
   */
  public async delete(p_axIdShare: ShareId): Promise<boolean> {
    const l_iTailleInitiale: number = this.m_aoShares.length;
    this.m_aoShares = this.m_aoShares.filter((l_oShare: Share): boolean => !l_oShare.getShareId().estEgalA(p_axIdShare));
    return this.m_aoShares.length < l_iTailleInitiale;
  }
}
