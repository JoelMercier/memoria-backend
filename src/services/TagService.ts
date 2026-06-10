// ——— fichier : src/services/TagService.ts

import { IdForge }             from '@/domain/utils/IdForge'; // 🗲 [NEW V4] Fondeur UUID v7 du Domaine
import { UserId, TagId }       from '@/domain/value-objects/ids';
import { Tag }                 from '@/entities/Tag';
import { TagErrorFactory }     from '@/exceptions/TagErrorFactory';
import type { CreateTagDto }   from '@/dto/tag/CreateTagDto';
import type { UpdateTagDto }   from '@/dto/tag/UpdateTagDto';
import type { ITagData }       from '@/interfaces/entities/tag/ITagData';
import type { ITagRepository } from '@/interfaces/repositories/PostGres/ITagRepository';
import type { ITagService }    from '@/interfaces/services/ITagService';
import type { IListOptions }   from '@/interfaces/shared/IListOptions'; // 🗲 [INJECTÉ V4]
import type { IListResult }    from '@/interfaces/shared/IListResult';  // 🗲 [FRANÇAIS D'ÉLITE]

/**
 * 🏛️ Classe TagService
 * ----------------------------------------------------------------------------
 * Service de domaine orchestrant le cycle de vie métier complet des Étiquettes (Tags).
 * Supervise les contrôles d'accès exclusifs et les validations de libellés.
 * [ALIGNÉ PUR V4] Intègre constitutionnellement le bouclier de pagination et les True Getters.
 *
 * @class TagService
 * @implements {ITagService}
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class TagService implements ITagService {

  /** 🗄️ Entrepôt de persistance abstrait des étiquettes (ITagRepository) */
  private readonly m_oTagRepository : ITagRepository;

  /**
   * Initialise le cas d'usage par injection d'abstractions de dépôts.
   *
   * @constructor
   * @param {ITagRepository} p_oTagRepository - Entrepôt d'infrastructure abstrait des étiquettes
   */
  public constructor(p_oTagRepository: ITagRepository) {
    this.m_oTagRepository = p_oTagRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   * Centralise la souveraineté d'accès au dépôt d'infrastructure des étiquettes.
   *
   * @public
   * @returns {ITagRepository} L'instance du dépôt d'infrastructure principal abstrait
   */
  public get repository(): ITagRepository {
    return this.m_oTagRepository;
  }

  /**
   * 🛡️ Accesseur public secondaire conservé pour la rétrocompatibilité d'infrastructure.
   *
   * @public
   * @returns {ITagRepository} L'instance du dépôt des étiquettes
   */
  public get tagRepository(): ITagRepository {
    return this.m_oTagRepository;
  }

  /**
   * 🔔 Engendre et persiste un nouveau Tag au sein de l'espace de l'utilisateur.
   * [SCELLÉ V4] Retourne l'entité vivante Tag et non le type d'infrastructure plat !
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'action
   * @param {CreateTagDto} p_oDto - L'objet de transfert contenant l'intention de création
   * @returns {Promise<Tag>} L'entité de l'étiquette créée et indexée
   */
  public async create(p_axUserId: UserId, p_oDto: CreateTagDto): Promise<Tag> {
    // 🪓 [REARMÉ V4] Forgeage propre de l'ID nominal via notre usine à UUID v7
    const l_oData : ITagData = {
      idTag     : new TagId(IdForge.genererUuidV7()), // Exit le v4 bête 🐦 💨
      idUser    : p_axUserId,
      tagName   : p_oDto.tagName,
      createdAt : new Date()
    };

    return await this.m_oTagRepository.create(l_oData);
  }

  /**
   * 🔎 Récupère une étiquette par sa clé primaire après validation de l'ownership.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort de l'acteur qui formule la requête de lecture
   * @param {TagId} p_axTagId - L'identifiant binaire unique du tag recherché sur le disque
   * @throws {TagErrorFactory} Si l'étiquette n'existe pas ou si l'ownership est violé
   * @returns {Promise<Tag>} L'entité riche du tag réhydraté
   */
  public async findById(p_axUserId: UserId, p_axTagId: TagId): Promise<Tag> {
    const l_oTag : Tag | null = await this.m_oTagRepository.findById(p_axTagId);

    if (!l_oTag) {
      throw TagErrorFactory.notFound(p_axTagId);
    }

    // 🪓 [RÉPARÉ V4] Interrogation directe du vrai getter .userId de surface ! [Mémoria]
    if (!l_oTag.userId.estEgalA(p_axUserId)) {
      throw TagErrorFactory.accessDenied(p_axTagId, p_axUserId);
    }

    return l_oTag;
  }

  /**
   * 📜 Liste la collection filtrée, ordonnée et obligatoirement paginée des étiquettes détenues par un acteur.
   * [SCELLÉ RECOUVREMENT V4] Raccordement direct sur le français d'élite pour interdire les fuites de RAM !
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur cible
   * @param {IListOptions} p_oOptions - Le dictionnaire universel de limites et de tri obligatoire [Mémoria]
   * @returns {Promise<IListResult<Tag>>} Le lot de résultats paginé avec sa volumétrie globale [Mémoria]
   */
  public async listByUser(p_axUserId: UserId, p_oOptions: IListOptions): Promise<IListResult<Tag>> {
    // 🗲 Propagation obligatoire du bouclier anti-fuite vers le dépôt physique
    return await this.m_oTagRepository.findByUserId(p_axUserId, p_oOptions);
  }

  /**
   * 🎛️ Applique des corrections ou modifications de libellé sur une étiquette.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur (Contrôle de propriété)
   * @param {TagId} p_axTagId - L'identifiant binaire unique du tag à réviser
   * @param {UpdateTagDto} p_oDto - Le lot d'attributs contenant le nouveau libellé à appliquer
   * @throws {TagErrorFactory} Si le tag est introuvable, si l'accès est interdit ou si le nom crée un doublon
   * @returns {Promise<Tag>} L'entité du tag modifiée et sauvegardée
   */
  public async update(p_axUserId: UserId, p_axTagId: TagId, p_oDto: UpdateTagDto): Promise<Tag> {
    const l_oExisting : Tag | null = await this.m_oTagRepository.findById(p_axTagId);

    if (!l_oExisting) {
      throw TagErrorFactory.notFound(p_axTagId);
    }

    // 🪓 [RÉPARÉ V4] Vrai getter .userId sans parenthèses ! [Mémoria]
    if (!l_oExisting.userId.estEgalA(p_axUserId)) {
      throw TagErrorFactory.accessDenied(p_axTagId, p_axUserId);
    }

    // 🪓 [RÉPARÉ V4] Vrai getter .tagName sans parenthèses ! [Mémoria]
    if (p_oDto.tagName.toLowerCase() !== l_oExisting.tagName.toLowerCase()) {
      const l_oConflict : Tag | null = await this.m_oTagRepository.findByName(p_axUserId, p_oDto.tagName);
      if (l_oConflict) {
        throw TagErrorFactory.nameExists(p_axUserId, p_oDto.tagName);
      }
    }

    const l_oUpdated : Tag | null = await this.m_oTagRepository.update(p_axTagId, {
      tagName: p_oDto.tagName
    });

    if (!l_oUpdated) {
      throw TagErrorFactory.notFound(p_axTagId);
    }

    return l_oUpdated;
  }

  /**
   * 🗑️ Supprime de manière destructive un tag du catalogue de l'acteur.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'ordre d'éradication
   * @param {TagId} p_axTagId - L'identifiant binaire unique du tag à détruire du disque
   * @throws {TagErrorFactory} Si la ressource est inexistante ou l'ownership bafoué
   * @returns {Promise<void>}
   */
  public async delete(p_axUserId: UserId, p_axTagId: TagId): Promise<void> {
    const l_oExisting : Tag | null = await this.m_oTagRepository.findById(p_axTagId);

    if (!l_oExisting) {
      throw TagErrorFactory.notFound(p_axTagId);
    }

    // 🪓 [RÉPARÉ V4] Vrai getter .userId sans parenthèses ! [Mémoria]
    if (!l_oExisting.userId.estEgalA(p_axUserId)) {
      throw TagErrorFactory.accessDenied(p_axTagId, p_axUserId);
    }

    const l_bDeleted : boolean = await this.m_oTagRepository.delete(p_axTagId);
    if (!l_bDeleted) {
      throw TagErrorFactory.notFound(p_axTagId);
    }
  }
}
