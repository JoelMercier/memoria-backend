// ——— fichier : src/services/ShareService.ts

import type { CreateShareDto   } from '@/dto/share/CreateShareDto';
import type { UpdateShareDto   } from '@/dto/share/UpdateShareDto';
import type { Item             } from '@/entities/Item';
import type { Share            } from '@/entities/Share';
import type { IItem            } from '@/interfaces/entities/item/IItem';
import type { IShare           } from '@/interfaces/entities/share/IShare';
import type { IShareData       } from '@/interfaces/entities/share/IShareData';
import type { IItemRepository  } from '@/interfaces/repositories/IItemRepository';
import type { IShareRepository } from '@/interfaces/repositories/IShareRepository';
import type { IShareService    } from '@/interfaces/services/IShareService';

import { IdForge             } from '@/domain/utils/IdForge'; // 🗲 [NEW V4] Fondeur UUID v7 du Domaine
import { UserId, ShareId     } from '@/domain/value-objects/ids';
import { ItemErrorFactory    } from '@/exceptions/ItemErrorFactory';
import { ShareErrorFactory   } from '@/exceptions/ShareErrorFactory';
import { ShareTokenGenerator } from '@/utils/ShareTokenGenerator';

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
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class ShareService implements IShareService {

  /** 🗄️ Entrepôt de persistance des partages */
  private readonly m_oShareRepository : IShareRepository;

  /** 🗄️ Entrepôt de persistance des pépites (Items) */
  private readonly m_oItemRepository  : IItemRepository;

  /**
   * Initialise le service avec ses entrepôts de données requis (DI).
   *
   * @constructor
   * @param {IShareRepository} p_oShareRepository - Entrepôt d'infrastructure des partages
   * @param {IItemRepository} p_oItemRepository - Entrepôt d'infrastructure des pépites
   */
  public constructor(
    p_oShareRepository : IShareRepository,
    p_oItemRepository  : IItemRepository
  ) {
    this.m_oShareRepository = p_oShareRepository;
    this.m_oItemRepository  = p_oItemRepository;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   * Centralise la souveraineté d'accès au dépôt d'infrastructure des partages.
   *
   * @public
   * @returns {IShareRepository} L'instance du dépôt d'infrastructure principal
   */
  public get repository(): IShareRepository {
    return this.m_oShareRepository;
  }

  /**
   * 🛡️ Accesseur public secondaire conservé pour la rétrocompatibilité d'infrastructure.
   *
   * @public
   * @returns {IShareRepository} L'instance du dépôt des partages
   */
  public get shareRepository(): IShareRepository {
    return this.m_oShareRepository;
  }

  /**
   * 🛡️ Accesseur public vers l'entrepôt des pépites.
   *
   * @public
   * @returns {IItemRepository} L'instance du dépôt des pépites
   */
  public get itemRepository(): IItemRepository {
    return this.m_oItemRepository;
  }

  /**
   * 🔑 Génère un shareToken unique pour l'accès public non authentifié.
   * Récurrence défensive automatique si une collision hautement improbable survient.
   *
   * @private
   * @async
   * @throws {ShareErrorFactory} Si la limite d'essais génératifs est dépassée
   * @returns {Promise<string>} Le jeton de sécurité unique validé
   */
  private async generateUniqueToken(): Promise<string> {
    for (let l_nIdx : number = 0; l_nIdx < MAX_TOKEN_GEN_ATTEMPTS; l_nIdx++) {
      const l_sToken : string       = ShareTokenGenerator.generate();
      const l_oExisting : Share | null = await this.m_oShareRepository.findByToken(l_sToken);
      if (!l_oExisting) {
        return l_sToken;
      }
    }
    throw ShareErrorFactory.tokenCollision();
  }

  /**
   * 🧱 Armure du Domaine : Valide la propriété exclusive d'un partage vis-à-vis d'un utilisateur.
   * Empêche l'usurpation latérale à la frontière de l'infrastructure de persistance.
   *
   * @private
   * @async
   * @param {UserId} p_axUserId - L'identifiant immuable de l'acteur connecté
   * @param {ShareId} p_axShareId - L'identifiant immuable du partage ciblé
   * @throws {ShareErrorFactory} Si le partage n'existe pas ou si l'accès est interdit
   * @returns {Promise<Share>} L'entité Share vivante et sécurisée
   */
  private async ensureOwnership(p_axUserId: UserId, p_axShareId: ShareId): Promise<Share> {
    const l_oShare : Share | null = await this.m_oShareRepository.findById(p_axShareId);
    if (!l_oShare) {
      throw ShareErrorFactory.notFound(p_axShareId.valeur);
    }
    const l_oItem : Item | null = await this.m_oItemRepository.findById(l_oShare.getItemId());

    // 🪓 Utilisation du getter getUserId() de l'Ancien Régime sur Item
    if (!l_oItem || l_oItem.getUserId().valeur !== p_axUserId.valeur) {
      throw ShareErrorFactory.accessDenied(p_axShareId, p_axUserId);
    }
    return l_oShare;
  }

  /**
   * 🔗 Génère un nouveau lien de partage sécurisé et immuable pour une pépite.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'action
   * @param {CreateShareDto} p_oDto - Le dictionnaire de configuration du partage sortant
   * @throws {ItemErrorFactory} Si la pépite cible est introuvable sur le disque
   * @returns {Promise<IShare>} L'entité de partage configurée et persistante
   */
  public async create(p_axUserId: UserId, p_oDto: CreateShareDto): Promise<IShare> {
    const l_oItem : Item | null = await this.m_oItemRepository.findById(p_oDto.idItem);
    if (!l_oItem) {
      throw ItemErrorFactory.notFound(p_oDto.idItem);
    }

    // 🪓 Utilisation du getter getUserId() de l'Ancien Régime sur Item
    if (l_oItem.getUserId().valeur !== p_axUserId.valeur) {
      throw ItemErrorFactory.accessDenied(p_oDto.idItem, p_axUserId);
    }

    const l_sToken : string = await this.generateUniqueToken();

    // 🪓 [REARMÉ V4] Utilisation de IdForge pour injecter un vrai UUID v7 chronologique
    const l_oData : IShareData = {
      idShare         : new ShareId(IdForge.genererUuidV7()), // Fin de la passoire v4 bête 🐦 💨
      shItemOwnerId   : p_oDto.idUser,
      shItemId        : p_oDto.idItem,
      shCourrielDest  : p_oDto.recipientEmail,
      shJeton         : l_sToken,
      shConfiguration : p_oDto.accessConfig,
      createdAt       : new Date()
    };

    return await this.m_oShareRepository.create(l_oData);
  }

  /**
   * 🔎 Récupère le détail d'un partage après double vérification de propriété.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort de l'acteur qui formule la requête
   * @param {ShareId} p_axShareId - L'identifiant binaire unique du lien de partage
   * @returns {Promise<IShare>} L'entité riche de partage hydratée
   */
  public async findById(p_axUserId: UserId, p_axShareId: ShareId): Promise<IShare> {
    return await this.ensureOwnership(p_axUserId, p_axShareId);
  }

  /**
   * 📜 Liste l'intégralité des partages détenus par un utilisateur spécifique.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur cible
   * @returns {Promise<IShare[]>} La collection des contrats de partage actifs
   */
  public async listByUser(p_axUserId: UserId): Promise<IShare[]> {
    return await this.m_oShareRepository.findByUserId(p_axUserId);
  }

  /**
   * 🎛️ Modifie la configuration ou les restrictions d'accès d'un partage actif.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur (Contrôle de propriété)
   * @param {ShareId} p_axShareId - L'identifiant binaire unique du lien à réviser
   * @param {UpdateShareDto} p_oDto - Le lot de restrictions ou options modifiées à appliquer
   * @throws {ShareErrorFactory} Si le partage est inexistant
   * @returns {Promise<IShare>} L'entité de partage révisée et sauvegardée
   */
  public async update(p_axUserId: UserId, p_axShareId: ShareId, p_oDto: UpdateShareDto): Promise<IShare> {
    await this.ensureOwnership(p_axUserId, p_axShareId);

    const l_oUpdates : Partial<IShareData> = {};
    if (p_oDto.recipientEmail !== undefined) {
      l_oUpdates.shCourrielDest = p_oDto.recipientEmail;
    }
    if (p_oDto.accessConfig !== undefined) {
      l_oUpdates.shConfiguration = p_oDto.accessConfig;
    }

    const l_oUpdated : Share | null = await this.m_oShareRepository.update(p_axShareId, l_oUpdates);
    if (!l_oUpdated) {
      throw ShareErrorFactory.notFound(p_axShareId.valeur);
    }
    return l_oUpdated;
  }

  /**
   * 🗑️ Révoque et supprime définitivement un lien de partage du système.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'auteur de l'ordre d'éradication
   * @param {ShareId} p_axShareId - L'identifiant binaire unique du lien de partage à détruire
   * @throws {ShareErrorFactory} Si l'opération d'effacement échoue
   * @returns {Promise<void>}
   */
  public async delete(p_axUserId: UserId, p_axShareId: ShareId): Promise<void> {
    await this.ensureOwnership(p_axUserId, p_axShareId);

    const l_bDeleted : boolean = await this.m_oShareRepository.delete(p_axShareId);
    if (!l_bDeleted) {
      throw ShareErrorFactory.notFound(p_axShareId.valeur);
    }
  }

  /**
   * 🌐 Passerelle publique : Localise une pépite via son jeton anonyme d'URL.
   * Aligné fidèlement sur la signature sémantique exigée par IShareService.
   *
   * @public
   * @async
   * @param {string} p_sToken - La chaîne du jeton cryptographique compact d'accès public
   * @throws {ShareErrorFactory} Si le jeton est expiré ou invalide
   * @returns {Promise<IItem>} L'entité de la pépite rattachée pour affichage anonyme
   */
  public async findItemByToken(p_sToken: string): Promise<IItem> {
    const l_oShare : Share | null = await this.m_oShareRepository.findByToken(p_sToken);
    if (!l_oShare) {
      throw ShareErrorFactory.notFound(p_sToken);
    }
    if (l_oShare.isExpired()) {
      throw ShareErrorFactory.expired(p_sToken);
    }

    const l_oItem : Item | null = await this.m_oItemRepository.findById(l_oShare.getItemId());

    // Cas pathologique : le share existe mais son item a disparu (FK CASCADE normalement = ne devrait pas arriver)
    if (!l_oItem) {
      throw ShareErrorFactory.notFound(p_sToken);
    }
    return l_oItem;
  }
}
