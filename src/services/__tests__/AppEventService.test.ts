// ——— fichier : src/services/__tests__/AppEventService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { AppEventRepository } from '@/infrastructure/repositories/PostGres/AppEventRepository';
import { UserId, ItemId, ShareId } from '@/domain/value-objects/ids';

import { AppEventService } from '../AppEventService';
import { Categorie } from '@/constants/Categories';
import { Severite } from '@/constants/Severites';
import { Secteur } from '@/constants/Secteurs';
import { Action } from '@/constants/Actions';

const USER_ID = new UserId('018f3a3c-5000-7000-8000-000000000001');
const ITEM_ID = new ItemId('018f3a3c-5000-7000-8000-00000000000A');
const SHARE_ID = new ShareId('018f3a3c-5000-7000-8000-00000000000B');

describe('AppEventService', () => {
  // 🏛️ Utilisation de Partial pour n'implémenter que les méthodes requises
  let l_oRepository: Mocked<Partial<AppEventRepository>>;
  let l_oService: AppEventService;

  beforeEach(() => {
    // 🪓 Initialisation propre et typée sans aucun unknown
    l_oRepository = {
      create: vi.fn()
    };

    // Hydratation conforme du service avec notre contrat partiel
    l_oService = new AppEventService(l_oRepository as AppEventRepository);
  }); // <-- [RÉPARÉ V4] La fermeture manquante est ressoudée ici !

  describe('log', () => {
    it("engendre une trace d'audit générique en forgeant son identifiant et appliquant les types nominaux", async () => {
      await l_oService.log({
        userId: USER_ID,
        eventCategorie: Categorie.GENE,
        eventSecteur: Secteur.SYST,
        eventAction: Action.DEMA,
        eventSeverite: Severite.INFO,
        message: 'Test de trace'
      });

      expect(l_oRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aeUserId: USER_ID,
          aeCategorieId: Categorie.GENE,
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
          aeCategorieId: Categorie.MONI,
          aeMessage: 'Connexion réussie'
        })
      );
    });

    it("génère un log d'alerte orphelin d'humain en cas d'échec de connexion brute", async () => {
      await l_oService.authFailure('pirate@anonymous.com');

      expect(l_oRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aeUserId: null,
          aeCategorieId: Categorie.MONI,
          aeSeveriteId: Severite.WARN,
          aeMessage: 'Échec de connexion'
        })
      );
    });

    it("journalise l'indexation d'une nouvelle pépite d'or", async () => {
      await l_oService.itemCreated(USER_ID, ITEM_ID);

      expect(l_oRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aeUserId: USER_ID,
          aeCategorieId: Categorie.ANAL,
          aeMessage: 'Pépite créée'
        })
      );
    });

    it("journalise l'ouverture d'une passerelle de partage", async () => {
      await l_oService.shareCreated(USER_ID, SHARE_ID);

      expect(l_oRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aeUserId: USER_ID,
          aeCategorieId: Categorie.ANAL,
          aeMessage: 'Pépite partagée'
        })
      );
    });
  });
});
