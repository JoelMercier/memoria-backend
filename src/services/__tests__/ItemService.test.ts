// ——— fichier : src/services/__tests__/ItemService.test.ts

/* eslint-disable @typescript-eslint/unbound-method */ // 🛡️ [IMMUNITÉ SOUTE] Désactivation requise pour l'inspection des mocks Vitest [1.1].

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ItemService }                          from '../ItemService';
import { Item }                                 from '@/entities/Item';
import { UserId, ItemId, ContentTypeId }        from '@/domain/value-objects/ids';
import { ItemErrorFactory }                     from '@/exceptions/ItemErrorFactory';
import type { IItemRepository }                 from '@/interfaces/repositories/PostGres/IItemRepository';
import type { IItemTagRepository }              from '@/interfaces/repositories/PostGres/IItemTagRepository';

const USER_ID       = new UserId('018f3a3c-5000-7000-8000-000000000001');
const OTHER_USER_ID = new UserId('018f3a3c-5000-7000-8000-000000000002');
const ITEM_ID       = new ItemId('018f3a3c-5000-7000-8000-00000000000A');

/**
 * 🎰 Fabrique de fausses pépites certifiée conforme à l'entité vivante V4.
 */
const createMockItem = (overrides: { idUser?: UserId } = {}): Item =>
  new Item({
    idItem        : ITEM_ID,
    idUser        : overrides.idUser ?? USER_ID,
    contentTypeId : new ContentTypeId('TEXT'),
    libelle       : "Pépite d'or V4",
    slug          : 'pepite-or-v4',
    content       : 'Données précieuses',
    auteurSource  : 'Joël et Gaïa',
    thumbnailUrl  : null,
    metadata      : {},
    createdAt     : new Date(), // ⚡ [RÉPARÉ V4] Propriété obligatoire réintégrée au micron près [1.1].
    updatedAt     : undefined
  });

describe('ItemService', () => {
  let l_oItemRepository: IItemRepository;
  let l_oItemTagRepository: IItemTagRepository;
  let l_oItemService: ItemService;

  beforeEach(() => {
    l_oItemRepository = {
      findById      : vi.fn(),
      findBySlug    : vi.fn(),
      findByLibelle : vi.fn(),
      listByUser    : vi.fn(),
      create        : vi.fn(),
      update        : vi.fn(),
      delete        : vi.fn(),
      db            : {} as any,
      findAll       : vi.fn()
    };

    l_oItemTagRepository = {
      sync: vi.fn().mockResolvedValue(undefined)
    } as any;

    const l_oTagRepository = {
      findByIds: vi.fn().mockResolvedValue({ Lignes: [] })
    } as any;

    l_oItemService = new ItemService(l_oItemRepository, l_oItemTagRepository, l_oTagRepository);
  });

  describe('findById', () => {
    it('❌ [Introuvable] : Lève une exception notFound si la pépite est inexistante sur le disque', async () => {
      vi.mocked(l_oItemRepository.findById).mockResolvedValue(null);

      await expect(l_oItemService.findById(USER_ID.valeur, ITEM_ID.valeur)).rejects.toThrow();
    });

    it('❌ [Sécurité] : Lève une exception accessDenied si un acteur tiers tente de dérober une pépite', async () => {
      vi.mocked(l_oItemRepository.findById).mockResolvedValue(
        createMockItem({ idUser: OTHER_USER_ID })
      );

      await expect(l_oItemService.findById(USER_ID.valeur, ITEM_ID.valeur)).rejects.toBeInstanceOf(
        ItemErrorFactory
      );
    });

    it("✅ [Restauration] : Restitue l'entité pépite complète si le contrôle de propriété est valide", async () => {
      const l_oItem = createMockItem();
      vi.mocked(l_oItemRepository.findById).mockResolvedValue(l_oItem);

      const l_oResult = await l_oItemService.findById(USER_ID.valeur, ITEM_ID.valeur);

      expect(l_oResult).toBe(l_oItem);
    });
  });

  describe('delete', () => {
    it("❌ [Propriété] : Bloque la destruction si l'ownership de l'acteur est bafoué", async () => {
      vi.mocked(l_oItemRepository.findById).mockResolvedValue(
        createMockItem({ idUser: OTHER_USER_ID })
      );

      await expect(l_oItemService.delete(USER_ID.valeur, ITEM_ID.valeur)).rejects.toThrow();
      expect(l_oItemRepository.delete).not.toHaveBeenCalled();
    });

    it("✅ [Ablation] : Exécute l'effacement physique sur le disque Postgres si l'acteur est propriétaire", async () => {
      vi.mocked(l_oItemRepository.findById).mockResolvedValue(createMockItem());
      vi.mocked(l_oItemRepository.delete).mockResolvedValue(true);

      await expect(l_oItemService.delete(USER_ID.valeur, ITEM_ID.valeur)).resolves.toBeUndefined();
      expect(l_oItemRepository.delete).toHaveBeenCalledWith(ITEM_ID, expect.any(UserId));
    });
  });
});
