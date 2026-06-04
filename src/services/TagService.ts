// ——— fichier : src/services/TagService.ts

import      { UserId, TagId  } from '@/domain/value-objects/IdMetier';
import      { Tag            } from '@/entities/Tag';
import      { TagErrorFactory} from '@/exceptions/TagErrorFactory';
import type { CreateTagDto   } from '@/dto/tag/CreateTagDto';
import type { UpdateTagDto   } from '@/dto/tag/UpdateTagDto';
import type { ITag           } from '@/interfaces/entities/tag/ITag';
import type { ITagData       } from '@/interfaces/entities/tag/ITagData';
import type { ITagRepository } from '@/interfaces/repositories/ITagRepository';
import type { ITagService    } from '@/interfaces/services/ITagService';
import      { randomUUID          } from 'node:crypto';

/**
 * 🏛️ Classe TagService
 * --------------------
 * Service de domaine orchestrant le cycle de vie métier complet des Étiquettes (Tags).
 * Supervise les contrôles d'accès exclusifs et les validations de libellés.
 *
 * @class TagService
 * @implements {ITagService}
 * @author Joël, Gaïa & Co
 */
export class TagService implements ITagService {

  /** 🗄️ Entrepôt de persistance des étiquettes */
  private readonly m_rTagRepository : ITagRepository;

  /**
   * Initialise le cas d'usage par injection d'abstractions de dépôts.
   *
   * @constructor
   * @param {ITagRepository} tagRepository - Entrepôt des étiquettes
   */
  public constructor(tagRepository: ITagRepository) {
    this.m_rTagRepository = tagRepository;
  }

  /**
   * 🛡️ Accesseur privé vers l'entrepôt des étiquettes.
   *
   * @private
   * @returns {ITagRepository} L'instance du dépôt.
   */
  private get tagRepository(): ITagRepository {
    return this.m_rTagRepository;
  }

  /**
   * 🔔 Engendre et persiste un nouveau Tag au sein de l'espace de l'utilisateur.
   *
   * @public
   * @async
   */
  public async create(userId: UserId, dto: CreateTagDto): Promise<ITag> {
    // 🪓 ALIGNEMENT INDUSTRIEL : Forgeage propre de l'ID avec l'outil crypto natif
    const data : ITagData = {
      idTag     : new TagId(randomUUID()),
      userId    : userId,
      tagName   : dto.tagName,
      createdAt : new Date()
    };

    return await this.tagRepository.create(data);
  }

  /**
   * 🔎 Récupère une étiquette par sa clé primaire après validation de l'ownership.
   *
   * @public
   * @async
   */
  public async findById(userId: UserId, tagId: TagId): Promise<ITag> {
    const tag : Tag | null = await this.tagRepository.findById(tagId);

    if (!tag) {
      throw TagErrorFactory.notFound(tagId);
    }

    if (tag.getUserId().valeur !== userId.valeur) {
      throw TagErrorFactory.accessDenied(tagId, userId);
    }

    return tag;
  }

  /**
   * 📜 Extrait l'intégralité de la collection de tags détenus par l'acteur connecté.
   *
   * @public
   * @async
   */
  public async listByUser(userId: UserId): Promise<ITag[]> {
    return await this.tagRepository.findByUserId(userId);
  }

  /**
   * 🎛️ Applique des corrections ou modifications de libellé sur une étiquette.
   *
   * @public
   * @async
   */
  public async update(userId: UserId, tagId: TagId, dto: UpdateTagDto): Promise<ITag> {
    const existing : Tag | null = await this.tagRepository.findById(tagId);

    if (!existing) {
      throw TagErrorFactory.notFound(tagId);
    }

    if (existing.getUserId().valeur !== userId.valeur) {
      throw TagErrorFactory.accessDenied(tagId, userId);
    }

    // Pré-vérification d'unicité insensible à la casse si le nom est modifié
    if (dto.tagName.toLowerCase() !== existing.getTagName().toLowerCase()) {
      const conflict : Tag | null = await this.tagRepository.findByName(userId, dto.tagName);
      if (conflict) {
        throw TagErrorFactory.nameExists(userId, dto.tagName);
      }
    }

    const updated : Tag | null = await this.tagRepository.update(tagId, {
      tagName: dto.tagName
    });

    if (!updated) {
      throw TagErrorFactory.notFound(tagId);
    }

    return updated;
  }

  /**
   * 🗑️ Supprime de manière destructive un tag du catalogue de l'acteur.
   *
   * @public
   * @async
   */
  public async delete(userId: UserId, tagId: TagId): Promise<void> {
    const existing : Tag | null = await this.tagRepository.findById(tagId);

    if (!existing) {
      throw TagErrorFactory.notFound(tagId);
    }

    if (existing.getUserId().valeur !== userId.valeur) {
      throw TagErrorFactory.accessDenied(tagId, userId);
    }

    const deleted : boolean = await this.tagRepository.delete(tagId);
    if (!deleted) {
      throw TagErrorFactory.notFound(tagId);
    }
  }
}
