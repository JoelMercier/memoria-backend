// ——— fichier : src/infrastructure/repositories/mocks/MockShareRepository.ts

import { Share }                    from '@/entities/Share';
import { ShareId, ItemId, UserId }  from '@/domain/value-objects/ids';
import type { IShareData }          from '@/interfaces/entities/share/IShareData';
import type { IListOptions }         from '@/interfaces/shared/IListOptions';
import type { IListResult }          from '@/interfaces/shared/IListResult';
import OrdreTriEnum                 from '@/constants/OrdreTriEnum';
import { IMockShareRepository } from '@/interfaces/repositories/PostGres/IShareRepository';

/**
 * 🗄️ Classe MockShareRepository 🧮 (Le Simulateur de Partages en RAM 🤖)
 * ----------------------------------------------------------------------------
 * Usine de simulation émulant à 100% le cycle de vie de la table "Shares".
 * [ALIGNÉ V4] Pagination obligatoire, éradication des "as any" et conformité getters.
 *
 * @class MockShareRepository
 * @implements {IMockShareRepository}
 * @author Vision : Joël ((très)Abstract Class - Nettoyeur de parenthèses)
 * @author Frapperie du code : Gaïa (Au burin, raccordée sur la Choupy Doctrine V4)
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
    return this.getShares().find((l_oShare: Share): boolean => l_oShare.idShare.estEgalA(p_axIdShare)) ?? null;
  }

  /**
   * 🔍 Localise l'ensemble des passerelles de partage créées pour une pépite spécifique 📥.
   * [SCELLÉ V4] Armé avec la pagination obligatoire et interrogation du vrai getter .idItem !
   *
   * @public
   * @async
   * @param {ItemId} p_axItemId - L'identifiant fort de la pépite cible
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoire
   * @returns {Promise<IListResult<Share>>} Le lot de résultats paginé en français d'élite
   */
  public async findByItemId(p_axItemId: ItemId, p_oOptions: IListOptions): Promise<IListResult<Share>> {
    // 🪓 [RÉPARÉ V4] Filtrage net via le vrai getter de surface .idItem sans parenthèses !
    const l_aoFiltres = this.getShares().filter((l_oShare: Share): boolean => l_oShare.idItem.estEgalA(p_axItemId));
    return this.appliquerPaginationRAM(l_aoFiltres, p_oOptions);
  }

  /**
   * 🔍 Localise un partage unique via son jeton de sécurité textuel (Token) 🔐.
   * [SCELLÉ V4] Plus de "as any" de contrebande, lecture directe du getter .jeton !
   *
   * @public
   * @async
   * @param {string} p_sJeton - Le jeton de sécurité cryptographique recherché
   * @returns {Promise<Share | null>} L'instance du partage ou null si inexistant
   */
  public async findByToken(p_sJeton: string): Promise<Share | null> {
    const l_sRecherche: string = p_sJeton.trim();
    return this.getShares().find((l_oShare: Share): boolean => l_oShare.jeton === l_sRecherche) ?? null;
  }

  /**
   * 🔍 Récupère l'ensemble des passerelles de partage engendrées par un acteur spécifique 👥.
   * [SCELLÉ V4] Armé avec la pagination obligatoire et interrogation du vrai getter .idUserOwner !
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant unique de l'acteur propriétaire
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoire
   * @returns {Promise<IListResult<Share>>} Le lot de résultats paginé en français d'élite
   */
  public async findByUserId(p_axUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Share>> {
    // 🪓 [RÉPARÉ V4] Utilisation du vrai getter .idUserOwner branché sur la dé-normalisation !
    const l_aoFiltres = this.getShares().filter((l_oShare: Share): boolean => l_oShare.idUserOwner.estEgalA(p_axUserId));
    return this.appliquerPaginationRAM(l_aoFiltres, p_oOptions);
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
    });
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
    const l_iIdx: number = this.getShares().findIndex((l_oShare: Share): boolean => l_oShare.idShare.estEgalA(p_axIdShare));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] Share unique ID ${p_axIdShare.toString()} introuvable pour l update.`);
    }

    const l_oDataCourant : IShareData = this.getShares()[l_iIdx].toData();
    const l_oMute = new Share({
      ...l_oDataCourant,
      ...p_oData,
      updatedAt : new Date()
    } as any);

    this.getShares()[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🏺 Contrat de base : Extrait l'intégralité absolue de la table de simulation de manière paginée.
   * Satisfait nominalement l'ancêtre d'infrastructure obligatoire IBaseRepository.
   *
   * @public
   * @async
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites universel obligatoires
   * @returns {Promise<IListResult<Share>>} Le tas complet des partages sous forme paginée d'état
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<Share>> {
    return this.appliquerPaginationRAM(this.m_aoShares, p_oOptions);
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
    this.m_aoShares = this.getShares().filter((l_oShare: Share): boolean => !l_oShare.idShare.estEgalA(p_axIdShare));
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
  private appliquerPaginationRAM(p_aoSource: Share[], p_oOptions: IListOptions): IListResult<Share> {
    const l_nTotal = p_aoSource.length;
    const l_nLimit = p_oOptions.NbLignes ?? 50;
    const l_nOffset = p_oOptions.LigneDebut ?? 0;

    // Tri déterministe en RAM adossé sur l'horloge ou les titres
    const l_sCleTri = p_oOptions.ColonneTri === 'shCreatedAt' ? 'createdAt' : 'idShare';
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
