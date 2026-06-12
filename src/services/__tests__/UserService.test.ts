// ——— fichier : src/services/__tests__/UserService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserService } from '../UserService'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import type { User } from '@/entities/User';
import { UserId } from '@/domain/value-objects/ids';
import { UpdateProfileDto } from '@/dto/user/UpdateProfileDto';
import { ChangePasswordDto } from '@/dto/user/ChangePasswordDto';
import type { IUserRepository } from '@/interfaces/repositories/PostGres/IUserRepository';
import type { IPasswordHasher } from '@/interfaces/security/IPasswordHasher';

const ACTOR_ID = new UserId('018f3a3c-5000-7000-8000-000000000001');

const createMockUser = (): User =>
  ({
    idUser: ACTOR_ID,
    courriel: 'joel@memoria.fr',
    passwordHash: 'MOT_DE_PASSE_CRYPTE_V4',
    pseudo: 'DR-DOS-Maniac'
  }) as unknown as User;

describe('UserService', () => {
  let l_oUserRepository: IUserRepository;
  let l_oPasswordHasher: IPasswordHasher;
  let l_oUserService: UserService;

  beforeEach(() => {
    l_oUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByPseudo: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    } as any;

    l_oPasswordHasher = {
      hash: vi.fn().mockResolvedValue('NOUVEAU_HASH_SÛR'),
      verify: vi.fn()
    };

    l_oUserService = new UserService(l_oUserRepository, l_oPasswordHasher);
  });

  describe('updateProfile', () => {
    it("lève une exception si un tiers utilise déjà l'adresse électronique demandée", async () => {
      vi.mocked(l_oUserRepository.findById).mockResolvedValue(createMockUser());
      // Simulation : un autre utilisateur possède déjà cet e-mail en base
      vi.mocked(l_oUserRepository.findByEmail).mockResolvedValue({
        idUser: new UserId('018f3a3c-5000-7000-8000-00000000000F')
      } as any);

      const l_oDto = new UpdateProfileDto({ email: 'collision@memoria.fr' });
      await expect(l_oUserService.updateProfile(ACTOR_ID, l_oDto)).rejects.toThrow();
    });
  });

  describe('changePassword', () => {
    it('lève une exception de soute si le mot de passe actuel fourni est erroné', async () => {
      vi.mocked(l_oUserRepository.findById).mockResolvedValue(createMockUser());
      vi.mocked(l_oPasswordHasher.verify).mockResolvedValue(false); // Échec de validation du vieux secret

      const l_oDto = new ChangePasswordDto({
        currentPassword: 'FauxPassword',
        newPassword: 'ValidPasswordV4!'
      });
      await expect(l_oUserService.changePassword(ACTOR_ID, l_oDto)).rejects.toThrow();
    });

    it("met à jour le hash sur le disque PostgreSQL si le vieux secret est validé par l'infrastructure", async () => {
      vi.mocked(l_oUserRepository.findById).mockResolvedValue(createMockUser());
      vi.mocked(l_oPasswordHasher.verify).mockResolvedValue(true);
      vi.mocked(l_oUserRepository.update).mockResolvedValue(createMockUser());

      const l_oDto = new ChangePasswordDto({
        currentPassword: 'VieuxPasswordConfirme',
        newPassword: 'ValidPasswordV4!'
      });
      await expect(l_oUserService.changePassword(ACTOR_ID, l_oDto)).resolves.toBeUndefined();

      expect(l_oPasswordHasher.hash).toHaveBeenCalledWith('ValidPasswordV4!');
      expect(l_oUserRepository.update).toHaveBeenCalledWith(ACTOR_ID, {
        passwordHash: 'NOUVEAU_HASH_SÛR'
      });
    });
  });
});
