// ——— fichier : src/services/__tests__/UserExportService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserExportService } from '../UserExportService'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import { UserId } from '@/domain/value-objects/ids';
import type { User } from '@/entities/User';
import type { IUserRepository } from '@/interfaces/repositories/PostGres/IUserRepository';
import type { IItemRepository } from '@/interfaces/repositories/PostGres/IItemRepository';
import type { IItemTagRepository } from '@/interfaces/repositories/PostGres/IItemTagRepository';
import type { ITagRepository } from '@/interfaces/repositories/PostGres/ITagRepository';
import type { IShareRepository } from '@/interfaces/repositories/PostGres/IShareRepository';

const ACTOR_ID = new UserId('018f3a3c-5000-7000-8000-000000000001');

const createMockUser = (): User =>
  ({
    idUser: ACTOR_ID,
    courriel: 'joel@memoria.fr',
    pseudo: 'DR-DOS-Maniac',
    role: { code: 'admin' } as any,
    authProvider: { code: 'local' } as any,
    settingsUser: {},
    rgpdConsent: true,
    rgpdConsentDate: new Date()
  }) as unknown as User;

describe('UserExportService', () => {
  let l_oUserRepository: IUserRepository;
  let l_oItemRepository: IItemRepository;
  let l_oItemTagRepository: IItemTagRepository;
  let l_oTagRepository: ITagRepository;
  let l_oShareRepository: IShareRepository;
  let l_oExportService: UserExportService;

  beforeEach(() => {
    l_oUserRepository = {
      findById: vi.fn()
    } as any;

    l_oItemRepository = {
      listByUser: vi.fn().mockResolvedValue({ Lignes: [], NbLignesRenv: 0, NbLignesTotal: 0 })
    } as any;

    l_oItemTagRepository = {
      findTagsForItem: vi.fn().mockResolvedValue([])
    } as any;

    l_oTagRepository = {
      findByUserId: vi.fn().mockResolvedValue({ Lignes: [], NbLignesRenv: 0, NbLignesTotal: 0 })
    } as any;

    l_oShareRepository = {
      findByUserId: vi.fn().mockResolvedValue({ Lignes: [], NbLignesRenv: 0, NbLignesTotal: 0 })
    } as any;

    l_oExportService = new UserExportService(
      l_oUserRepository,
      l_oItemRepository,
      l_oItemTagRepository,
      l_oTagRepository,
      l_oShareRepository
    );
  });

  describe('exportUserData', () => {
    it("lève une exception notFound si l'acteur requérant n'existe pas en base", async () => {
      vi.mocked(l_oUserRepository.findById).mockResolvedValue(null);

      await expect(l_oExportService.exportUserData(ACTOR_ID)).rejects.toThrow();
    });

    it("compile agressivement les 4 tables et restitue le DTO d'extraction plat", async () => {
      const l_oUser = createMockUser();
      vi.mocked(l_oUserRepository.findById).mockResolvedValue(l_oUser);

      const l_oResult = await l_oExportService.exportUserData(ACTOR_ID);

      expect(l_oUserRepository.findById).toHaveBeenCalledWith(ACTOR_ID);
      expect(l_oItemRepository.listByUser).toHaveBeenCalled();
      expect(l_oTagRepository.findByUserId).toHaveBeenCalled();
      expect(l_oShareRepository.findByUserId).toHaveBeenCalled();

      expect(l_oResult.user.pseudo).toBe('DR-DOS-Maniac');
    });
  });
});
