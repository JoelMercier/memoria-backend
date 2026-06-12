// ——— fichier : src/services/__tests__/AppEventAdminService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppEventAdminService } from '../AppEventAdminService'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import type { IAppEventRepository } from '@/interfaces/repositories/PostGres/IAppEventRepository';
import type { IAppEventService } from '@/interfaces/services/IAppEventService';

describe('AppEventAdminService', () => {
  let l_oRepository: IAppEventRepository;
  let l_oLogService: IAppEventService;
  let l_oAdminService: AppEventAdminService;

  beforeEach(() => {
    l_oRepository = {
      findById: vi.fn(),
      listByOptions: vi.fn(),
      deleteOlderThan: vi.fn()
    } as any;

    l_oLogService = {
      log: vi.fn()
    } as any;

    l_oAdminService = new AppEventAdminService(l_oRepository, l_oLogService);
  });

  describe('updateLog et deleteLog', () => {
    it("bloque hermétiquement toute tentative de mise à jour unitaire d'un log d'audit", async () => {
      await expect(l_oAdminService.updateLog()).rejects.toThrow('[Erreur Sécurité]');
    });

    it("bloque hermétiquement toute tentative de suppression unitaire d'un log d'audit", async () => {
      await expect(l_oAdminService.deleteLog()).rejects.toThrow('[Erreur Sécurité]');
    });
  });

  describe('purgeOlderThan', () => {
    it('lève une exception de sécurité si la date de rétention demandée est inférieure aux 180 jours légaux CNIL', async () => {
      const l_dDateInvalideTropRecente = new Date(Date.now() - 24 * 60 * 60 * 1000);

      await expect(l_oAdminService.purgeOlderThan(l_dDateInvalideTropRecente)).rejects.toThrow(
        '[Erreur RGPD]'
      );
      expect(l_oLogService.log).not.toHaveBeenCalled();
      expect(l_oRepository.deleteOlderThan).not.toHaveBeenCalled();
    });

    it("autorise la purge, consigne d'abord l'intention en soute, puis exécute l'effacement physique si le cutoff est supérieur à 6 mois", async () => {
      const l_dDateValideAncienne = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000);
      vi.mocked(l_oRepository.deleteOlderThan).mockResolvedValue(150);

      const l_nLignesPurgees = await l_oAdminService.purgeOlderThan(l_dDateValideAncienne);

      expect(l_nLignesPurgees).toBe(150);
      expect(l_oLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Lancement de la purge réglementaire')
        })
      );
      expect(l_oRepository.deleteOlderThan).toHaveBeenCalledWith(l_dDateValideAncienne);
    });
  });
});
