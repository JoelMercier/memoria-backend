// ——— fichier : src/services/__tests__/AppEventService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppEventService } from '../AppEventService'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import { AppEventCategory } from '@/constants/Categories';
import { AppEventSeverity } from '@/constants/Severity';
import { AppEventSecteur } from '@/constants/Secteur';
import { AppEventAction } from '@/constants/Actions';
import { UserId, ItemId, ShareId } from '@/domain/value-objects/ids';
import type { AppEventRepository } from '@/infrastructure/repositories/PostGres/AppEventRepository';

const USER_ID = new UserId('018f3a3c-5000-7000-8000-000000000001');
const ITEM_ID = new ItemId('018f3a3c-5000-7000-8000-00000000000A');
const SHARE_ID = new ShareId('018f3a3c-5000-7000-8000-00000000000B');

describe('AppEventService', () => {
  let l_oRepository: AppEventRepository;
  let l_oService: AppEventService;

  beforeEach(() => {
    l_oRepository = {
      create: vi.fn()
    } as any;

    l_oService = new AppEventService(l_oRepository);
  });

  describe('log', () => {
    it("engendre une trace d'audit générique en forgeant son identifiant et appliquant les types nominaux", async () => {
      await l_oService.log({
        userId: USER_ID,
        eventCategory: AppEventCategory.AUDI,
        eventSecteur: AppEventSecteur.SYST,
        eventAction: AppEventAction.DEMA,
        message: 'Test de trace'
      });

      expect(l_oRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aeUserId: USER_ID,
          aeCategoryId: AppEventCategory.AUDI,
          aeMessage: 'Test de trace'
        })
      );
    });
  });

  describe("Méthodes contextuelles d'écriture d'audit", () => {
    it("génère un log étanche lors d'une connexion réussie", async () => {
      await l_oService.authSuccess(USER_ID);

      expect(l_oRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aeUserId: USER_ID,
          aeCategoryId: AppEventCategory.AUDI,
          aeMessage: 'Connexion réussie'
        })
      );
    });

    it("génère un log d'alerte orphelin d'humain en cas d'échec de connexion brute", async () => {
      await l_oService.authFailure('pirate@anonymous.com');

      expect(l_oRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aeUserId: null,
          aeCategoryId: AppEventCategory.AUDI,
          aeSeverityId: AppEventSeverity.WARN,
          aeMessage: 'Échec de connexion'
        })
      );
    });

    it("journalise l'indexation d'une nouvelle pépite d'or", async () => {
      await l_oService.itemCreated(USER_ID, ITEM_ID);

      expect(l_oRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aeUserId: USER_ID,
          aeCategoryId: AppEventCategory.ANAL,
          aeMessage: 'Pépite créée'
        })
      );
    });

    it("journalise l'ouverture d'une passerelle de partage", async () => {
      await l_oService.shareCreated(USER_ID, SHARE_ID);

      expect(l_oRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aeUserId: USER_ID,
          aeCategoryId: AppEventCategory.ANAL,
          aeMessage: 'Pépite partagée'
        })
      );
    });
  });
});
