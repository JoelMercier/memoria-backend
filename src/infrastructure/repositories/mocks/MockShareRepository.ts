// ——— fichier : src/infrastructure/repositories/mocks/MockShareRepository.ts

import type { IMockShareRepository    } from '@/interfaces/repositories/PostGres/IShareRepository';
import type { ShareId, ItemId, UserId } from '@/domain/value-objects/ids';
import type { IShareData              } from '@/interfaces/entities/share/IShareData';
import type { IListOptions            } from '@/interfaces/shared/IListOptions';
import type { IListResult             } from '@/interfaces/shared/IListResult';

import { Share        } from '@/entities/Share';
import { OrdreTriEnum } from '@/constants/OrdreTriEnum';

/**
 * 🗄️ Classe MockShareRepository 🧮 (Le Simulateur de Partages en RAM 🤖)
 * ----------------------------------------------------------------------------
 * Usine de simulation émulant à 100% le cycle de vie de la table "Shares".
 */
export class MockShareRepository implements IMockShareRepository {
  /** 🧠 La collection virtuelle des partages stockée en mémoire vive active */
  private m_aoShares : Share[] = [];

  /**
   * 🎰 True Getter privé centralisé régissant l'accès à la soute de RAM.
   */
  private get shares() : Share[] {
    return this.m_aoShares;
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un partage via son identifiant binaire fort 🤖.
   */
  public async findById(p_axIdShare: ShareId) : Promise<Share | null> {
    return this.shares.find((l_oShare: Share): boolean => l_oShare.idShare.estEgalA(p_axIdShare)) ?? null;
  }

  /**
   * 🔍 Localise l'ensemble des passerelles de partage créées pour une pépite spécifique 📥.
   */
  public async findByItemId(p_axItemId: ItemId, p_oOptions: IListOptions) : Promise<IListResult<Share>> {
    const l_aoFiltres = this.shares.filter((l_oShare: Share): boolean => l_oShare.idItem.estEgalA(p_axItemId));
    return this.appliquerPaginationRAM(l_aoFiltres, p_oOptions);
  }

  /**
   * 🔍 Localise un partage unique via son jeton de sécurité textuel (Token) 🔐.
   */
  public async findByToken(p_sJeton: string) : Promise<Share | null> {
    const l_sRecherche : string = p_sJeton.trim();
    return this.shares.find((l_oShare: Share): boolean => l_oShare.jeton === l_sRecherche) ?? null;
  }

  /**
   * 🔍 Récupère l'ensemble des passerelles de partage engendrées par un acteur spécifique 👥.
   */
  public async findByUserId(p_axUserId: UserId, p_oOptions: IListOptions) : Promise<IListResult<Share>> {
    const l_aoFiltres = this.shares.filter((l_oShare: Share): boolean => l_oShare.idUserOwner.estEgalA(p_axUserId));
    return this.appliquerPaginationRAM(l_aoFiltres, p_oOptions);
  }

  /**
   * 🏛️ Extracteur universel d'administration pour le grand fichier des partages du château.
   */
  public async findAllShares(p_oOptions: IListOptions) : Promise<IListResult<Share>> {
    return this.appliquerPaginationRAM(this.shares, p_oOptions);
  }

  /**
   * 🪓 Enregistre un nouveau partage dans le catalogue factice 🪙.
   */
  public async create(p_oData: IShareData) : Promise<Share> {
    const l_oShare = new Share({
      ...p_oData,
      createdAt : p_oData.createdAt || new Date(),
      updatedAt : p_oData.updatedAt
    });
    this.shares.push(l_oShare);
    return l_oShare;
  }

  /**
   * 🪓 Mutation en mémoire vive : Modifie partiellement un partage simulé.
   */
  public async update(p_axIdShare: ShareId, p_oData: Partial<IShareData>) : Promise<Share> {
    const l_iIdx : number = this.shares.findIndex((l_oShare: Share): boolean => l_oShare.idShare.estEgalA(p_axIdShare));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] Share unique ID ${p_axIdShare.toString()} introuvable pour l update.`);
    }

    const l_oDataCourant : IShareData = this.shares[l_iIdx].toData();
    const l_oMute         : Share      = new Share({
      ...l_oDataCourant,
      ...p_oData,
      updatedAt : new Date()
    });

    this.shares[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🏺 Contrat de base : Extrait l'intégralité absolue de la table de l'ancêtre d'infrastructure.
   */
  public async findAll(p_oOptions: IListOptions) : Promise<IListResult<Share>> {
    return this.appliquerPaginationRAM(this.shares, p_oOptions);
  }

  /**
   * 🪓 Retrait physique : Supprime une passerelle de partage de la collection en RAM.
   */
  public async delete(p_axIdShare: ShareId) : Promise<boolean> {
    const l_iTailleInitiale : number = this.shares.length;
    this.m_aoShares                  = this.shares.filter((l_oShare: Share): boolean => !l_oShare.idShare.estEgalA(p_axIdShare));
    return this.m_aoShares.length < l_iTailleInitiale;
  }

    /**
   * 🧮 Utilitaire privé d'infrastructure émulant le moteur de pagination et tri universel en RAM.
   *
   * @private
   * @param {Share[]} p_aoSource - Le tableau brut filtré à paginer
   * @param {IListOptions} p_oOptions - Les limites et tris d'IHM de surface
   * @returns {IListResult<Share>} Le conteneur nominal d'acier en français d'élite
   */
  private appliquerPaginationRAM(p_aoSource: Share[], p_oOptions: IListOptions) : IListResult<Share> {
    const l_nTotal    = p_aoSource.length;
    const l_nLimit    = p_oOptions.NbLignes   ?? 50;
    const l_nOffset   = p_oOptions.LigneDebut ?? 0;

    // Tri déterministe en RAM adossé sur l'horloge ou les titres
    const l_sCleTri   = p_oOptions.ColonneTri === 'shCreatedAt' ? 'createdAt' : 'idShare';

    p_aoSource.sort((l_oA: any, l_oB: any) : number => {
      const l_vA     = l_oA[l_sCleTri];
      const l_vB     = l_oB[l_sCleTri];
      const l_sOrdre = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';
      return l_sOrdre === 'DESC' ? (l_vA > l_vB ? -1 : 1) : (l_vA < l_vB ? -1 : 1);
    });

    const l_aoPage    = p_aoSource.slice(l_nOffset, l_nOffset + l_nLimit);

    return {
      LigneDebut    : l_nOffset,
      NbLignesDem   : l_nLimit,
      NbLignesRenv  : l_aoPage.length,
      NbLignesTotal : l_nTotal,
      Lignes        : l_aoPage
    };
  }
}
