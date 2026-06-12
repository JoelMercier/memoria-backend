// ——— fichier : src/services/__tests__/ShareService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ShareService } from '../ShareService'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import type { Share } from '@/entities/Share';
import type { Item } from '@/entities/Item';
import { UserId, ShareId, ItemId } from '@/domain/value-objects/ids';
import { ShareErrorFactory } from '@/exceptions/ShareErrorFactory';
import type { IShareRepository } from '@/interfaces/repositories/PostGres/IShareRepository';
import type { IItemRepository } from '@/interfaces/repositories/PostGres/IItemRepository';

const USER_ID = new UserId('018f3a3c-5000-7000-8000-000000000001');
const OTHER_USER_ID = new UserId('018f3a3c-5000-7000-8000-000000000002');
const ITEM_ID = new ItemId('018f3a3c-5000-7000-8000-00000000000A');
const SHARE_ID = new ShareId('018f3a3c-5000-7000-8000-00000000000B');

const createMockShare = (): Share =>
  ({
    idShare: SHARE_ID,
    idItem: ITEM_ID,
    isExpired: vi.fn().mockReturnValue(false)
  }) as unknown as Share;

// 🪓 [RÉPARÉ V4] Typage explicite du gabarit de surcharge pour terrasser TS2339 définitivement
const createMockItem = (overrides: { idUser?: UserId } = {}): Item =>
  ({
    idItem: ITEM_ID,
    idUser: overrides.idUser ?? USER_ID
  }) as unknown as Item;

describe('ShareService', () => {
  let l_oShareRepository: IShareRepository;
  let l_oItemRepository: IItemRepository;
  let l_oShareService: ShareService;

  beforeEach(() => {
    l_oShareRepository = {
      findById: vi.fn(),
      findByToken: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      db: {} as any,
      findAll: vi.fn()
    } as any;

    l_oItemRepository = {
      findById: vi.fn()
    } as any;

    l_oShareService = new ShareService(l_oShareRepository, l_oItemRepository);
  });

  describe('findById', () => {
    it("lève une exception notFound si le partage n'existe pas en base", async () => {
      vi.mocked(l_oShareRepository.findById).mockResolvedValue(null);

      await expect(l_oShareService.findById(USER_ID, SHARE_ID)).rejects.toThrow();
    });

    it("lève une exception accessDenied si un acteur pirate tente d'intercepter le partage", async () => {
      vi.mocked(l_oShareRepository.findById).mockResolvedValue(createMockShare());
      vi.mocked(l_oItemRepository.findById).mockResolvedValue(
        createMockItem({ idUser: OTHER_USER_ID })
      );

      await expect(l_oShareService.findById(USER_ID, SHARE_ID)).rejects.toBeInstanceOf(
        ShareErrorFactory
      );
    });
  });

  describe('findItemByToken', () => {
    it('lève une exception expired si la passerelle temporelle de partage est dépassée', async () => {
      const l_oExpiredShare = createMockShare();
      vi.mocked(l_oExpiredShare.isExpired).mockReturnValue(true);
      vi.mocked(l_oShareRepository.findByToken).mockResolvedValue(l_oExpiredShare);

      await expect(l_oShareService.findItemByToken('jeton_expire')).rejects.toThrow();
    });

    it("restitue la pépite d'or de manière anonyme si le token est valide et non expiré", async () => {
      const l_oShare = createMockShare();
      const l_oItem = createMockItem();
      vi.mocked(l_oShareRepository.findByToken).mockResolvedValue(l_oShare);
      vi.mocked(l_oItemRepository.findById).mockResolvedValue(l_oItem);

      const l_oResult = await l_oShareService.findItemByToken('jeton_valide');

      expect(l_oResult).toBe(l_oItem);
    });
  });
});
