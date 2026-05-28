// ——— fichier : src/services/UserService.ts

import { UserId          } from '@/domain/value-objects/IdMetier';
import { User            } from '@/entities/User';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import type { ChangePasswordDto } from '@/dto/user/ChangePasswordDto';
import type { DeleteAccountDto } from '@/dto/user/DeleteAccountDto';
import type { UpdateProfileDto } from '@/dto/user/UpdateProfileDto';
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
 * @author Joël, Gaïa & Co
 */
export class UserService implements IUserService {

  public constructor(
    private readonly userRepository : IUserRepository,
    private readonly passwordHasher : IPasswordHasher
  ) {}

  /**
   * 👤 Met à jour le pseudonyme, le courriel ou les préférences graphiques de l'utilisateur.
   */
  public async updateProfile(userId: UserId, dto: UpdateProfileDto): Promise<IUser> {
    const existing : User | null = await this.userRepository.findById(userId);
    if (!existing) {
      throw UserErrorFactory.notFound(userId);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL REUSSIT : .getEmail() uniformisé
    if (dto.email && dto.email.toLowerCase() !== existing.getEmail().toLowerCase()) {
      const byEmail : User | null = await this.userRepository.findByEmail(dto.email);
      if (byEmail) {
        throw UserErrorFactory.profileConflict('email', dto.email);
      }
    }

    // 🪓 ALIGNEMENT INDUSTRIEL REUSSIT : .getPseudo() uniformisé
    if (dto.pseudo && dto.pseudo !== existing.getPseudo()) {
      const byPseudo : User | null = await this.userRepository.findByPseudo(dto.pseudo);
      if (byPseudo) {
        throw UserErrorFactory.profileConflict('pseudo', dto.pseudo);
      }
    }

    const updates : Partial<IUserData> = {};
    if (dto.email !== undefined) {
      updates.email = dto.email;
    }
    if (dto.pseudo !== undefined) {
      updates.pseudo = dto.pseudo;
    }
    if (dto.settingsUser !== undefined) {
      updates.settingsUser = dto.settingsUser;
    }

    const updated : User | null = await this.userRepository.update(userId, updates);
    if (!updated) {
      throw UserErrorFactory.notFound(userId);
    }
    return updated;
  }

  /**
   * 🔐 Remplace les secrets d'accès de l'utilisateur après double contrôle de l'infrastructure.
   */
  public async changePassword(userId: UserId, dto: ChangePasswordDto): Promise<void> {
    const user : User | null = await this.userRepository.findById(userId);
    if (!user) {
      throw UserErrorFactory.notFound(userId);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL REUSSIT : .getPasswordHash() uniformisé
    const ok : boolean = await this.passwordHasher.verify(
      dto.currentPassword,
      user.getPasswordHash()
    );
    if (!ok) {
      throw UserErrorFactory.wrongPassword();
    }

    const newHash : string = await this.passwordHasher.hash(dto.newPassword);
    const updated : User | null = await this.userRepository.update(userId, {
      passwordHash: newHash
    });
    if (!updated) {
      throw UserErrorFactory.notFound(userId);
    }
  }

  /**
   * 🗑️ Purge destructive et définitive du compte de l'utilisateur.
   */
  public async deleteAccount(userId: UserId, dto: DeleteAccountDto): Promise<void> {
    const user : User | null = await this.userRepository.findById(userId);
    if (!user) {
      throw UserErrorFactory.notFound(userId);
    }

    // 🪓 ALIGNEMENT INDUSTRIEL REUSSIT : .getPasswordHash() uniformisé
    const ok : boolean = await this.passwordHasher.verify(dto.password, user.getPasswordHash());
    if (!ok) {
      throw UserErrorFactory.wrongPassword();
    }

    const deleted : boolean = await this.userRepository.delete(userId);
    if (!deleted) {
      throw UserErrorFactory.notFound(userId);
    }
  }
}
