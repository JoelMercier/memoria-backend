// ——— fichier : src/services/UserService.ts

import type { ChangePasswordDto } from '@/dto/user/ChangePasswordDto';
import type { DeleteAccountDto } from '@/dto/user/DeleteAccountDto';
import type { UpdateProfileDto } from '@/dto/user/UpdateProfileDto';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import type { IUserRepository } from '@/interfaces/repositories/PostGres/IUserRepository';
import type { IPasswordHasher } from '@/interfaces/security/IPasswordHasher';
import type { IUserService } from '@/interfaces/services/IUserService';

import type { UserId } from '@/domain/value-objects/ids';
import type { User } from '@/entities/User';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';

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
  private readonly m_oUserRepository: IUserRepository;

  /** 🛡️ Service d'encodage et de vérification cryptographique des secrets */
  private readonly m_oPasswordHasher: IPasswordHasher;

  /**
   * Initialise les fondations de gestion d'identité par injection d'abstractions.
   *
   * @constructor
   * @param {IUserRepository} p_oUserRepository - Le dépôt d'infrastructure abstrait des utilisateurs
   * @param {IPasswordHasher} p_oPasswordHasher - Le hacheur de mots de passe
   */
  public constructor(p_oUserRepository: IUserRepository, p_oPasswordHasher: IPasswordHasher) {
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
   * Accesseur public immuable pour le service de hachage cryptographique.
   * Centralise la souveraineté d'accès aux outils de chiffrement des secrets.
   *
   * @public
   * @returns {IPasswordHasher} L'instance du hacheur de mots de passe
   */
  public get hasher(): IPasswordHasher {
    return this.m_oPasswordHasher;
  }

  /**
   * 👤 Met à jour le pseudonyme, le courriel ou les préférences de l'utilisateur.
   *
   * @public
   * @async
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur cible
   * @param {UpdateProfileDto} p_oDto - Les nouveaux attributs de profil à appliquer
   * @throws {UserErrorFactory} Si la ressource est introuvable ou si le courriel/pseudo est déjà réservé
   * @returns {Promise<User>} L'entité de l'utilisateur mise à jour
   */
  public async updateProfile(p_axUserId: UserId, p_oDto: UpdateProfileDto): Promise<User> {
    const l_oExisting: User | null = await this.repository.findById(p_axUserId);
    if (!l_oExisting) {
      throw UserErrorFactory.notFound(p_axUserId);
    }

    if (p_oDto.courriel && p_oDto.courriel.toLowerCase() !== l_oExisting.courriel.toLowerCase()) {
      const l_oByEmail: User | null = await this.repository.findByCourriel(p_oDto.courriel);
      if (l_oByEmail) {
        throw UserErrorFactory.profileConflict('courriel', p_oDto.courriel);
      }
    }

    if (p_oDto.pseudo && p_oDto.pseudo !== l_oExisting.pseudo) {
      const l_oByPseudo: User | null = await this.repository.findByPseudo(p_oDto.pseudo);
      if (l_oByPseudo) {
        throw UserErrorFactory.profileConflict('pseudo', p_oDto.pseudo);
      }
    }

    const l_oUpdates: Partial<IUserData> = {};
    if (p_oDto.courriel !== undefined) {
      l_oUpdates.courriel = p_oDto.courriel;
    }
    if (p_oDto.pseudo !== undefined) {
      l_oUpdates.pseudo = p_oDto.pseudo;
    }
    if (p_oDto.settingsUser !== undefined) {
      l_oUpdates.settingsUser = p_oDto.settingsUser;
    }

    const l_oUpdated: User | null = await this.repository.update(p_axUserId, l_oUpdates);
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
    const l_oUser: User | null = await this.repository.findById(p_axUserId);
    if (!l_oUser) {
      throw UserErrorFactory.notFound(p_axUserId);
    }

    const l_bOk: boolean = await this.hasher.verify(p_oDto.currentPassword, l_oUser.passwordHash);
    if (!l_bOk) {
      throw UserErrorFactory.wrongPassword();
    }

    const l_sNewHash: string = await this.hasher.hash(p_oDto.newPassword);
    const l_oUpdated: User | null = await this.repository.update(p_axUserId, {
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
    const l_oUser: User | null = await this.repository.findById(p_axUserId);
    if (!l_oUser) {
      throw UserErrorFactory.notFound(p_axUserId);
    }

    const l_bOk: boolean = await this.hasher.verify(p_oDto.password, l_oUser.passwordHash);
    if (!l_bOk) {
      throw UserErrorFactory.wrongPassword();
    }

    const l_bDeleted: boolean = await this.repository.delete(p_axUserId);
    if (!l_bDeleted) {
      throw UserErrorFactory.notFound(p_axUserId);
    }
  }
}
