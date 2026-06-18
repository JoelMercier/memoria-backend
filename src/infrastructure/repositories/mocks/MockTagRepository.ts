// ——— fichier : src/infrastructure/repositories/mocks/MockTagRepository.ts

import type { ITagData           } from '@/interfaces/entities/tag/ITagData';
import type { IListOptions       } from '@/interfaces/shared/IListOptions';
import type { IListResult        } from '@/interfaces/shared/IListResult';
import type { IMockTagRepository } from '@/interfaces/repositories/Mocks/IMockTagRepository';
import type { TagId, UserId      } from '@/domain/value-objects/ids';

import { Tag          } from '@/entities/Tag';
import { OrdreTriEnum } from '@/constants/OrdreTriEnum';

/**
 * 🗄️ Classe MockTagRepository 🧮 (Le Banc de Test des Étiquettes 🤖)
 * ----------------------------------------------------------------------------
 * Simulateur passif en RAM émulant le cycle de vie complet de la table "Tags".
 * [ALIGNÉ V4] Pagination obligatoire, extermination des parenthèses et getters POO.
 *
 * @class MockTagRepository
 * @implements {IMockTagRepository}
 * @author Déconstruction : Joël (Nostalgique de l'ADA - Nettoyeur de parenthèses)
 * @author Ciselage du code : Gaïa (Perle de la fonderie et du français d'élite)
 */
export class MockTagRepository implements IMockTagRepository {
  /** 🧠 La table virtuelle simulant le stockage physique contigu en mémoire vive */
  private m_aoTags: Tag[] = [];

  /**
   * 🎛️ Accesseur exclusif sur le registre de stockage brut en RAM.
   * Honore le contrat IMemoryRW en transformant dynamiquement le tableau en Map structurelle [1.1].
   *
   * @public
   * @returns {Map<TagId, ITagData>} Le registre des données plates de simulation
   */
  public get memoryRegistry(): Map<TagId, ITagData> {
    const l_oMap = new Map<TagId, ITagData>();

    for (const l_oTag of this.m_aoTags) {
      l_oMap.set(l_oTag.idTag, l_oTag.toData());
    }

    return l_oMap;
  }

  /**
   * 🎰 Accesseur privé centralisé régissant l'accès à la soute de RAM.
   * [SCELLÉ C++] Garantit l'unicité du pointeur d'accès pour les itérations.
   *
   * @private
   * @returns {Tag[]} Le pointeur direct vers la collection active de simulation
   */
  private get Tags(): Tag[] {
    return this.m_aoTags;
  }
  private set Tags(p_aTags : Tag[])  {
    this.m_aoTags = p_aTags;
  }

  /**
   * 🔍 Localise une étiquette via son identifiant nominal fort 🤖.
   *
   * @public
   * @async
   * @param {TagId} p_oId - L'identifiant unique encapsulant le Buffer
   * @returns {Promise<Tag | null>} L'instance trouvée ou null si absente
   */
  public async findById(p_oId: TagId): Promise<Tag | null> {
    // 🪓 [RÉPARÉ V4] Utilisation du vrai getter de surface .idTag sans parenthèses ! [Mémoria]
    return this.Tags.find((l_oTag: Tag): boolean => l_oTag.idTag.estEgalA(p_oId)) ?? null;
  }

  /**
   * 🔍 Extraction chirurgicale : Récupère toutes les étiquettes rattachées à un acteur 👥.
   * [SCELLÉ V4] Armé avec la pagination obligatoire et interrogation du vrai getter .userId ! [Mémoria]
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L'identifiant de l'acteur propriétaire
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoire
   * @returns {Promise<IListResult<Tag>>} Le lot de résultats paginé en français d'élite
   */
  public async findByUserId(p_oUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Tag>> {
    const l_aoFiltres = this.Tags.filter((l_oTag: Tag): boolean => l_oTag.userId.estEgalA(p_oUserId));
    return this.appliquerPaginationRAM(l_aoFiltres, p_oOptions);
  }

  /**
   * 🔍 Localise une étiquette spécifique via son nom normalisé pour un acteur 🔍.
   * [SCELLÉ V4] Plus de getXxx() de contrebande, lecture directe des getters de façade ! [Mémoria]
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L'identifiant fort binaire de l'utilisateur propriétaire
   * @param {string} p_sTagName - Le libellé textuel de l'étiquette recherchée
   * @returns {Promise<Tag | null>} L'entité Tag correspondante ou null
   */
  public async findByName(p_oUserId: UserId, p_sTagName: string): Promise<Tag | null> {
    const l_sRecherche: string = p_sTagName.toLowerCase().trim();
    return (
      this.Tags.find((l_oTag: Tag): boolean =>
        l_oTag.userId.estEgalA(p_oUserId) && l_oTag.tagName.toLowerCase().trim() === l_sRecherche
      ) ?? null
    );
  }

  /**
   * 🔍 Lecture groupée : Localise un tableau d'étiquettes via un index d'identifiants binaires.
   * [SCELLÉ V4] Armé avec la pagination obligatoire face aux exigences de lot. [Mémoria]
   *
   * @public
   * @async
   * @param {ReadonlyArray<TagId>} p_aoIds - Le tableau immuable d'identifiants uniques forts de tags
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites obligatoire
   * @returns {Promise<IListResult<Tag>>} La collection paginée au standard français d'élite
   */
  public async findByIds(p_aoIds: ReadonlyArray<TagId>, p_oOptions: IListOptions): Promise<IListResult<Tag>> {
    if (p_aoIds.length === 0) {
      return { LigneDebut: 0, NbLignesDem: p_oOptions.NbLignes, NbLignesRenv: 0, NbLignesTotal: 0, Lignes: [] };
    }
    const l_aoFiltres = this.Tags.filter((l_oTag: Tag): boolean =>
      p_aoIds.some((l_oIdCible: TagId): boolean => l_oTag.idTag.estEgalA(l_oIdCible))
    );
    return this.appliquerPaginationRAM(l_aoFiltres, p_oOptions);
  }

  /**
   * 🪓 Écriture concrète : Insère une fausse étiquette dans la collection de simulation 🪙.
   *
   * @public
   * @async
   * @param {ITagData} p_oData - Sac de données d'infrastructure passive
   * @returns {Promise<Tag>} L'entité hydratée et stockée
   */
  public async create(p_oData: ITagData): Promise<Tag> {
    const l_oTag = new Tag({
      ...p_oData,
      createdAt : new Date(),
      updatedAt : new Date()
    });
    this.Tags.push(l_oTag);
    return l_oTag;
  }

  /**
   * 🪓 Mutation en mémoire : Modifie le nom d'une étiquette simulée.
   *
   * @public
   * @async
   * @param {TagId} p_oId - L'identifiant fort unique de soute
   * @param {Partial<ITagData>} p_oData - Dictionnaire de modification partielle
   * @returns {Promise<Tag>} L'entité modifiée réhydratée
   */
  public async update(p_oId: TagId, p_oData: Partial<ITagData>): Promise<Tag> {
    const l_iIdx: number = this.Tags.findIndex((l_oTag: Tag): boolean => l_oTag.idTag.estEgalA(p_oId));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] Tag unique ID ${p_oId.valeur} introuvable pour la mise à jour.`);
    }

    const l_oCourant : ITagData = this.Tags[l_iIdx].toData();
    const l_oMute    = new Tag({
      ...l_oCourant,
      ...p_oData,
      idTag     : p_oId,
      updatedAt : new Date()
    });

    this.Tags[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🪓 Extraction complète de la table factice sans filtrage sous forme paginée d'état.
   * Satisfait nominalement l'ancêtre d'infrastructure obligatoire IBaseRepository.
   * [SCELLÉ POO] Interrogation constitutionnelle et exclusive de l'accesseur Tags ! [Mémoria]
   *
   * @public
   * @async
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites universel obligatoires
   * @returns {Promise<IListResult<Tag>>} Le lot de résultats global paginé au standard français d'élite
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<Tag>> {
    return this.appliquerPaginationRAM(this.Tags, p_oOptions);
  }

  /**
   * 🪓 Retrait physique : Supprime une ressource de la collection.
   *
   * @public
   * @async
   * @param {TagId} p_oId - L'identifiant fort de soute à détruire
   * @returns {Promise<boolean>} True si effectif
   */
  public async delete(p_oId: TagId): Promise<boolean> {
    const l_iTailleInitiale: number = this.Tags.length;
    this.Tags = this.Tags.filter((l_oTag: Tag): boolean => !l_oTag.idTag.estEgalA(p_oId));
    return this.Tags.length < l_iTailleInitiale;
  }

  /**
   * 🧮 Utilitaire privé d'infrastructure émulant le moteur de pagination et tri universel en RAM.
   *
   * @private
   * @param {Tag[]} p_aoSource - Le tableau brut filtré à paginer
   * @param {IListOptions} p_oOptions - Les limites et tris d'IHM de surface
   * @returns {IListResult<Tag>} Le conteneur nominal d'acier en français d'élite
   */
  private appliquerPaginationRAM(p_aoSource: Tag[], p_oOptions: IListOptions): IListResult<Tag> {
    const l_nTotal    = p_aoSource.length;
    const l_nLimit    = p_oOptions.NbLignes   ?? 50;
    const l_nOffset   = p_oOptions.LigneDebut ?? 0;

    const l_sCleTri   = p_oOptions.ColonneTri === 'tgCreatedAt' ? 'createdAt' : 'tagName';

    p_aoSource.sort((l_oA: any, l_oB: any): number => {
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
