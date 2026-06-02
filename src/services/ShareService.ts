// ——— fichier : src/services/ShareService.ts

import { UserId, ShareId     } from '@/domain/value-objects/IdMetier';
import type { CreateShareDto      } from '@/dto/share/CreateShareDto';
import type { UpdateShareDto      } from '@/dto/share/UpdateShareDto';
import type { Item                } from '@/entities/Item';
import type { Share               } from '@/entities/Share';
import      { ItemErrorFactory    } from '@/exceptions/ItemErrorFactory';
import      { ShareErrorFactory   } from '@/exceptions/ShareErrorFactory';
import type { IItem               } from '@/interfaces/entities/item/IItem';
import type { IShare              } from '@/interfaces/entities/share/IShare';
import type { IShareData          } from '@/interfaces/entities/share/IShareData';
import type { IItemRepository     } from '@/interfaces/repositories/IItemRepository';
import type { IShareRepository    } from '@/interfaces/repositories/IShareRepository';
import type { IShareService       } from '@/interfaces/services/IShareService';
import      { ShareTokenGenerator } from '@/utils/ShareTokenGenerator';
import      { randomUUID          } from 'node:crypto';

/** ⚖️ Nombre maximal de tentatives de régénération en cas de collision de token */
const MAX_TOKEN_GEN_ATTEMPTS : number = 5;

/**
 * 🏛️ Classe ShareService
 * ----------------------
 * Service d'application orchestrant la logique métier et la sécurité des partages.
 * Applique l'armure du typage nominal fort et élimine les tirs directs dans les membres m_.
 *
 * @class ShareService
 * @implements {IShareService}
 * @author Joël, Gaïa & Co
 */
export class ShareService implements IShareService {

  /** 🗄️ Entrepôt de persistance des partages */
  private readonly m_rShareRepository : IShareRepository;

  /** 🗄️ Entrepôt de persistance des pépites (Items) */
  private readonly m_rItemRepository  : IItemRepository;

  /**
   * Initialise le service avec ses entrepôts de données requis (DI).
   *
   * @constructor
   * @param {IShareRepository} shareRepository - Entrepôt des partages
   * @param {IItemRepository} itemRepository - Entrepôt des pépites
   */
  public constructor(
    shareRepository : IShareRepository,
    itemRepository  : IItemRepository
  ) {
    this.m_rShareRepository = shareRepository;
    this.m_rItemRepository  = itemRepository;
  }

  /**
   * 🛡️ Accesseur privé vers l'entrepôt des partages.
   *
   * @private
   * @returns {IShareRepository} L'instance du dépôt.
   */
  private get shareRepository(): IShareRepository {
    return this.m_rShareRepository;
  }

  /**
   * 🛡️ Accesseur privé vers l'entrepôt des pépites.
   *
   * @private
   * @returns {IItemRepository} L'instance du dépôt.
   */
  private get itemRepository(): IItemRepository {
    return this.m_rItemRepository;
  }

  /**
   * 🔑 Génère un shareToken unique pour l'accès public non authentifié.
   * Récurrence défensive automatique si une collision hautement improbable survient.
   *
   * @private
   * @throws {ShareErrorFactory} Si la limite d'essais génératifs est dépassée
   * @returns {Promise<string>} Le jeton de sécurité unique validé
   */
  private async generateUniqueToken(): Promise<string> {
    for (let i : number = 0; i < MAX_TOKEN_GEN_ATTEMPTS; i++) {
      const token : string       = ShareTokenGenerator.generate();
      const existing : Share | null = await this.shareRepository.findByToken(token);
      if (!existing) {
        return token;
      }
    }
    throw ShareErrorFactory.tokenCollision();
  }

  /**
   * 🧱 Armure du Domaine : Valide la propriété exclusive d'un partage vis-à-vis d'un utilisateur.
   * Empêche l'usurpation latérale à la frontière de l'infrastructure de persistance.
   *
   * @private
   * @param {UserId} userId - L'identifiant immuable de l'acteur connecté
   * @param {ShareId} shareId - L'identifiant immuable du partage ciblé
   * @throws {ShareErrorFactory} Si le partage n'existe pas ou si l'accès est interdit
   * @returns {Promise<Share>} L'entité Share vivante et sécurisée
   */
  private async ensureOwnership(userId: UserId, shareId: ShareId): Promise<Share> {
    const share : Share | null = await this.shareRepository.findById(shareId);
    if (!share) {
      throw ShareErrorFactory.notFound(shareId.valeur);
    }
    const item : Item | null = await this.itemRepository.findById(share.getItemId());
    // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation du getter getUserId() de l'Ancien Régime sur Item
    if (!item || item.getUserId().valeur !== userId.valeur) {
      throw ShareErrorFactory.accessDenied(shareId, userId);
    }
    return share;
  }

  /**
   * 🔗 Génère un nouveau lien de partage sécurisé et immuable pour une pépite.
   *
   * @public
   * @async
   */
  public async create(userId: UserId, dto: CreateShareDto): Promise<IShare> {
    const item : Item | null = await this.itemRepository.findById(dto.idItem);
    if (!item) {
      throw ItemErrorFactory.notFound(dto.idItem);
    }
    // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation du getter getUserId() de l'Ancien Régime sur Item
    if (item.getUserId().valeur !== userId.valeur) {
      throw ItemErrorFactory.accessDenied(dto.idItem, userId);
    }

    const token : string = await this.generateUniqueToken();

    // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation de randomUUID() propre au lieu de undefined
    const data : IShareData = {
      idShare         : new ShareId(randomUUID()),
      shItemOwnerId   : dto.idUser,
      shItemId        : dto.idItem,
      shCourrielDest  : dto.recipientEmail,
      shJeton         : token,
      shConfiguration : dto.accessConfig
    };

    return await this.shareRepository.create(data);
  }

  /**
   * 🔎 Récupère le détail d'un partage après double vérification de propriété.
   *
   * @public
   * @async
   */
  public async findById(userId: UserId, shareId: ShareId): Promise<IShare> {
    return await this.ensureOwnership(userId, shareId);
  }

  /**
   * 📜 Liste l'intégralité des partages détenus par un utilisateur spécifique.
   *
   * @public
   * @async
   */
  public async listByUser(userId: UserId): Promise<IShare[]> {
    return await this.shareRepository.findByUserId(userId);
  }

  /**
   * 🎛️ Modifie la configuration ou les restrictions d'accès d'un partage actif.
   *
   * @public
   * @async
   */
  public async update(userId: UserId, shareId: ShareId, dto: UpdateShareDto): Promise<IShare> {
    await this.ensureOwnership(userId, shareId);

    const updates : Partial<IShareData> = {};
    if (dto.recipientEmail !== undefined) {
      updates.shCourrielDest = dto.recipientEmail;
    }
    if (dto.accessConfig !== undefined) {
      updates.shConfiguration = dto.accessConfig;
    }

    const updated : Share | null = await this.shareRepository.update(shareId, updates);
    if (!updated) {
      throw ShareErrorFactory.notFound(shareId.valeur);
    }
    return updated;
  }

  /**
   * 🗑️ Révoque et supprime définitivement un lien de partage du système.
   *
   * @public
   * @async
   */
  public async delete(userId: UserId, shareId: ShareId): Promise<void> {
    await this.ensureOwnership(userId, shareId);

    const deleted : boolean = await this.shareRepository.delete(shareId);
    if (!deleted) {
      throw ShareErrorFactory.notFound(shareId.valeur);
    }
  }

  /**
   * 🌐 Passerelle publique : Localise une pépite via son jeton anonyme d'URL.
   * Aligné fidèlement sur la signature sémantique exigée par IShareService.
   *
   * @public
   * @async
   */
  public async findItemByToken(token: string): Promise<IItem> {
    const share : Share | null = await this.shareRepository.findByToken(token);
    if (!share) {
      throw ShareErrorFactory.notFound(token);
    }
    if (share.isExpired()) {
      throw ShareErrorFactory.expired(token);
    }

    const item : Item | null = await this.itemRepository.findById(share.getItemId());
    // Cas pathologique : le share existe mais son item a disparu (FK CASCADE normalement = ne devrait pas arriver)
    if (!item) {
      throw ShareErrorFactory.notFound(token);
    }
    return item;
  }
}
