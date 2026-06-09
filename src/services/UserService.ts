// ——— fichier : src/services/UserService.ts

import { UserId          } from '@/domain/value-objects/ids';
import { User            } from '@/entities/User';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import type { ChangePasswordDto } from '@/dto/user/ChangePasswordDto';
import type { DeleteAccountDto }  from '@/dto/user/DeleteAccountDto';
import type { UpdateProfileDto }  from '@/dto/user/UpdateProfileDto';
import type { IUser           } from '@/interfaces/entities/user/IUser';
import type { IUserData       } from '@/interfaces/entities/user/IUserData';
import type { IUserRepository    } from '@/interfaces/repositories/IUserRepository';
import type { IPasswordHasher    } from '@/interfaces/security/IPasswordHasher';
import type { IUserService       } from '@/interfaces/services/IUserService';

/**
 * 🏛️ Classe UserService
 * ---------------------
 * Service de domaine orchestrant la gestion d'identité, la sécurité et le profil des utilisateurs.
 * Applique le standard sémantique pour la modification des secrets et le respect des unicités.
 *
 * @class UserService
 * @implements {IUserService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class UserService implements IUserService {

  /** 🗄️ Entrepôt de persistance abstrait des utilisateurs (IUserRepository) */
  private readonly m_oUserRepository : IUserRepository;

  /** 🛡️ Service d'encodage et de vérification cryptographique des secrets */
  private readonly m_oPasswordHasher : IPasswordHasher;

  /**
   * Initialise les fondations de gestion d'identité par injection d'abstractions.
   *
   * @constructor
   * @param {IUserRepository} p_oUserRepository - Le dépôt d'infrastructure abstrait des utilisateurs
   * @param {IPasswordHasher} p_oPasswordHasher - Le hacheur de mots de passe
   */
  public constructor(
    p_oUserRepository : IUserRepository,
    p_oPasswordHasher : IPasswordHasher
  ) {
    this.m_oUserRepository = p_oUserRepository;
    this.m_oPasswordHasher = p_oPasswordHasher;
  }

  /**
   * Accesseur public immuable exigé par le contrat ancêtre IBaseService.
   * Centralise la souveraineté d'accès au dépôt d'infrastructure des utilisateurs.
   *
   * @public
   * @returns {IUserRepository} L'instance du dépôt d'infrastructure abstrait
   */
  public get repository(): IUserRepository {
    return this.m_oUserRepository;
  }

  /**
   * 👤 Met à jour le pseudonyme, le courriel ou les préférences graphiques de l'utilisateur.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur cible
   * @param {UpdateProfileDto} p_oDto - Les nouveaux attributs de profil à appliquer
   * @throws {UserErrorFactory} Si la ressource est introuvable ou si le courriel/pseudo est déjà réservé
   * @returns {Promise<IUser>} L'entité de l'utilisateur mise à jour
   */
  public async updateProfile(p_axUserId: UserId, p_oDto: UpdateProfileDto): Promise<IUser> {
    const l_oExisting : User | null = await this.m_oUserRepository.findById(p_axUserId);
    if (!l_oExisting) {
      throw UserErrorFactory.notFound(p_axUserId);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL RÉUSSI : .getEmail() uniformisé
    if (p_oDto.email && p_oDto.email.toLowerCase() !== l_oExisting.getEmail().toLowerCase()) {
      const l_oByEmail : User | null = await this.m_oUserRepository.findByEmail(p_oDto.email);
      if (l_oByEmail) {
        throw UserErrorFactory.profileConflict('email', p_oDto.email);
      }
    }

    // 🪓 ALIGNEMENT INDUSTRIEL RÉUSSI : .getPseudo() uniformisé
    if (p_oDto.pseudo && p_oDto.pseudo !== l_oExisting.getPseudo()) {
      const l_oByPseudo : User | null = await this.m_oUserRepository.findByPseudo(p_oDto.pseudo);
      if (l_oByPseudo) {
        throw UserErrorFactory.profileConflict('pseudo', p_oDto.pseudo);
      }
    }

    const l_oUpdates : Partial<IUserData> = {};
    if (p_oDto.email !== undefined) {
      l_oUpdates.email = p_oDto.email;
    }
    if (p_oDto.pseudo !== undefined) {
      l_oUpdates.pseudo = p_oDto.pseudo;
    }
    if (p_oDto.settingsUser !== undefined) {
      l_oUpdates.settingsUser = p_oDto.settingsUser;
    }

    const l_oUpdated : User | null = await this.m_oUserRepository.update(p_axUserId, l_oUpdates);
    if (!l_oUpdated) {
      throw UserErrorFactory.notFound(p_axUserId);
    }
    return l_oUpdated;
  }

  /**
   * 🔐 Remplace les secrets d'accès de l'utilisateur après double contrôle de l'infrastructure.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur concerné
   * @param {ChangePasswordDto} p_oDto - Le doublet d'anciens et de nouveaux mots de passe bruts
   * @throws {UserErrorFactory} Si l'utilisateur est introuvable ou si le mot de passe actuel est erroné
   * @returns {Promise<void>}
   */
  public async changePassword(p_axUserId: UserId, p_oDto: ChangePasswordDto): Promise<void> {
    const l_oUser : User | null = await this.m_oUserRepository.findById(p_axUserId);
    if (!l_oUser) {
      throw UserErrorFactory.notFound(p_axUserId);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL RÉUSSI : .getPasswordHash() uniformisé
    const l_bOk : boolean = await this.m_oPasswordHasher.verify(
      p_oDto.currentPassword,
      l_oUser.getPasswordHash()
    );
    if (!l_bOk) {
      throw UserErrorFactory.wrongPassword();
    }

    const l_sNewHash : string = await this.m_oPasswordHasher.hash(p_oDto.newPassword);
    const l_oUpdated : User | null = await this.m_oUserRepository.update(p_axUserId, {
      passwordHash: l_sNewHash
    });
    if (!l_oUpdated) {
      throw UserErrorFactory.notFound(p_axUserId);
    }
  }

  /**
   * 🗑️ Purge destructive et définitive du compte de l'utilisateur.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire du compte à éradiquer
   * @param {DeleteAccountDto} p_oDto - Le payload de confirmation contenant le secret de validation
   * @throws {UserErrorFactory} Si l'utilisateur est introuvable ou si la validation du secret échoue
   * @returns {Promise<void>}
   */
  public async deleteAccount(p_axUserId: UserId, p_oDto: DeleteAccountDto): Promise<void> {
    const l_oUser : User | null = await this.m_oUserRepository.findById(p_axUserId);
    if (!l_oUser) {
      throw UserErrorFactory.notFound(p_axUserId);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL RÉUSSI : .getPasswordHash() uniformisé
    const l_bOk : boolean = await this.m_oPasswordHasher.verify(p_oDto.password, l_oUser.getPasswordHash());
    if (!l_bOk) {
      throw UserErrorFactory.wrongPassword();
    }

    const l_bDeleted : boolean = await this.m_oUserRepository.delete(p_axUserId);
    if (!l_bDeleted) {
      throw UserErrorFactory.notFound(p_axUserId);
    }
  }
}
