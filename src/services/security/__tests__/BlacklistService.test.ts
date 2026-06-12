// ——— fichier : src/services/security/__tests__/BlacklistService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBlacklistRepository } from '@/interfaces/repositories/IBlacklistRepository';
import { BlacklistService } from '../BlacklistService';

describe('BlacklistService', () => {
  let l_oRepository: IBlacklistRepository;
  let l_oService: BlacklistService;

  beforeEach(() => {
    l_oRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      purgeExpired: vi.fn().mockResolvedValue(undefined),
      exists: vi.fn(),
      count: vi.fn()
    };
    l_oService = new BlacklistService(l_oRepository);
  });

  describe('add', () => {
    it("enregistre le jeton banni en soute d'infrastructure et pilonne immédiatement une purge des périmés", async () => {
      const l_sFakeJti = 'jwt_id_unique_logout';
      const l_nExpiry = 1782739200;

      await l_oService.add(l_sFakeJti, l_nExpiry);

      expect(l_oRepository.save).toHaveBeenCalledWith(l_sFakeJti, l_nExpiry);
      expect(l_oRepository.purgeExpired).toHaveBeenCalledWith(expect.any(Number));
    });
  });

  describe('isBlacklisted', () => {
    it('renvoie vrai si le jeton est repéré dans le registre de quarantaine', async () => {
      vi.mocked(l_oRepository.exists).mockResolvedValue(true);

      const l_bResult = await l_oService.isBlacklisted('token_banni');

      expect(l_bResult).toBe(true);
      expect(l_oRepository.exists).toHaveBeenCalledWith('token_banni');
    });

    it('renvoie faux si la douane ne trouve aucune trace du jeton', async () => {
      vi.mocked(l_oRepository.exists).mockResolvedValue(false);

      const l_bResult = await l_oService.isBlacklisted('token_inconnu');

      expect(l_bResult).toBe(false);
    });
  });

  describe('size', () => {
    it('interroge la volumétrie globale des jetons actuellement sous clé', async () => {
      vi.mocked(l_oRepository.count).mockResolvedValue(42);

      const l_nSize = await l_oService.size();

      expect(l_nSize).toBe(42);
      expect(l_oRepository.count).toHaveBeenCalled();
    });
  });
});
