// ——— fichier : src/services/__tests__/TagService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TagService } from '../TagService'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import { CreateTagDto } from '@/dto/tag/CreateTagDto';
import { UpdateTagDto } from '@/dto/tag/UpdateTagDto';
import { Tag } from '@/entities/Tag';
import { TagErrorFactory } from '@/exceptions/TagErrorFactory';
import { UserId, TagId } from '@/domain/value-objects/ids';
import type { ITagRepository } from '@/interfaces/repositories/PostGres/ITagRepository';

// 🪓 ALIGNEMENT NOMINAL : Instanciation de fiers Value Objects d'écurie pour la soute V4
const USER_ID = new UserId('018f3a3c-5000-7000-8000-000000000001');
const OTHER_USER_ID = new UserId('018f3a3c-5000-7000-8000-000000000002');
const TAG_ID = new TagId('018f3a3c-5000-7000-8000-00000000000A');

/**
 * Fabrique d'entités de simulation (mocks) d'étiquettes conformes à la charte V4.
 */
function makeTag(overrides: Partial<{ idTag: TagId; idUser: UserId; tagName: string }> = {}): Tag {
  return new Tag({
    idTag: overrides.idTag ?? TAG_ID,
    idUser: overrides.idUser ?? USER_ID,
    tagName: overrides.tagName ?? 'philosophie',
    createdAt: new Date('2026-01-01'),
    updatedAt: undefined
  }); // Sûreté de surface face à l'ancêtre BaseEntity
}

describe('TagService', () => {
  let tagRepository: ITagRepository;
  let service: TagService;

  beforeEach(() => {
    // 🪓 ALIGNEMENT CONTRAT : Implémentation complète des signatures exigées par ITagRepository
    tagRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByName: vi.fn(),
      findByIds: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      db: {} as any,
      findAll: vi.fn()
    };
    service = new TagService(tagRepository);
  });

  describe('create', () => {
    it('crée un tag avec le userId fourni', async () => {
      const tag: Tag = makeTag();
      vi.mocked(tagRepository.create).mockResolvedValue(tag);

      const result = await service.create(USER_ID, new CreateTagDto({ tagName: 'philosophie' }));

      // Contrôle de l'injection d'infrastructure via expect.objectContaining
      expect(tagRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ idUser: USER_ID, tagName: 'philosophie' })
      );
      expect(result).toBe(tag);
    });
  });

  describe('findById', () => {
    it("lève notFound si le tag n'existe pas", async () => {
      vi.mocked(tagRepository.findById).mockResolvedValue(null);
      await expect(service.findById(USER_ID, TAG_ID)).rejects.toBeInstanceOf(TagErrorFactory);
    });

    it('lève accessDenied si le tag appartient à un autre user', async () => {
      vi.mocked(tagRepository.findById).mockResolvedValue(makeTag({ idUser: OTHER_USER_ID }));
      await expect(service.findById(USER_ID, TAG_ID)).rejects.toBeInstanceOf(TagErrorFactory);
    });

    it('retourne le tag si ownership ok', async () => {
      const tag: Tag = makeTag();
      vi.mocked(tagRepository.findById).mockResolvedValue(tag);

      const result = await service.findById(USER_ID, TAG_ID);
      expect(result).toBe(tag);
    });
  });

  describe('update', () => {
    it('lève nameExists si un autre tag porte déjà le nouveau nom', async () => {
      vi.mocked(tagRepository.findById).mockResolvedValue(makeTag({ tagName: 'philosophie' }));
      vi.mocked(tagRepository.findByName).mockResolvedValue(
        makeTag({ idTag: new TagId('018f3a3c-5000-7000-8000-00000000000F'), tagName: 'histoire' })
      );

      await expect(
        service.update(USER_ID, TAG_ID, new UpdateTagDto({ tagName: 'histoire' }))
      ).rejects.toBeInstanceOf(TagErrorFactory);
    });

    it('renomme un tag si pas de conflit', async () => {
      const updated: Tag = makeTag({ tagName: 'histoire' });
      vi.mocked(tagRepository.findById).mockResolvedValue(makeTag({ tagName: 'philosophie' }));
      vi.mocked(tagRepository.findByName).mockResolvedValue(null);
      vi.mocked(tagRepository.update).mockResolvedValue(updated);

      const result = await service.update(
        USER_ID,
        TAG_ID,
        new UpdateTagDto({ tagName: 'histoire' })
      );

      expect(tagRepository.update).toHaveBeenCalledWith(TAG_ID, { tagName: 'histoire' });
      expect(result.tagName).toBe('histoire'); // 🪓 [RÉPARÉ V4] True getter de surface
    });
  });

  describe('delete', () => {
    it('supprime un tag dont on est propriétaire', async () => {
      vi.mocked(tagRepository.findById).mockResolvedValue(makeTag());
      vi.mocked(tagRepository.delete).mockResolvedValue(true);

      await expect(service.delete(USER_ID, TAG_ID)).resolves.toBeUndefined();
      expect(tagRepository.delete).toHaveBeenCalledWith(TAG_ID);
    });

    it("refuse de supprimer un tag qui n'est pas le nôtre", async () => {
      vi.mocked(tagRepository.findById).mockResolvedValue(makeTag({ idUser: OTHER_USER_ID }));
      await expect(service.delete(USER_ID, TAG_ID)).rejects.toBeInstanceOf(TagErrorFactory);
      expect(tagRepository.delete).not.toHaveBeenCalled();
    });
  });
});
