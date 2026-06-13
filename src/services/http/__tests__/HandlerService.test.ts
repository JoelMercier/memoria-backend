// ——— fichier : src/services/http/__tests__/HandlerService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { HandlerService }     from '../HandlerService'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import { ApiError }           from '@/exceptions/ApiError';
import { RequestIdGenerator } from '@/utils/RequestIdGenerator';

describe('HandlerService', () => {

  /** 🪓 Fabrique nominale de requêtes de simulation Express */
  const createMockRequest = (overrides = {}): Request =>
    ({
      method:      'GET',
      originalUrl: '/api/v4/pepites',
      headers:     {},
      ...overrides
    }) as unknown as Request;

  /** 🪓 Fabrique nominale de réponses de simulation chaînables */
  const createMockResponse = (): Response => {
    const res = {} as unknown as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json   = vi.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();

    // 🪓 ALIGNEMENT INDUSTRIEL : Bouclier d'interception sur le générateur d'IDs de requêtes
    vi.spyOn(RequestIdGenerator, 'getFromRequest').mockReturnValue('req-test-v4');

    // 🪓 BOUCLIER GLOBAL DE PROTECTION : Court-circuit immédiat sur le prototype de log d'ApiError
    vi.spyOn(ApiError.prototype, 'log').mockImplementation(function(this: any) { return this; });
  });

  it('intercepte une ApiError maîtrisée et renvoie le code HTTP et le payload unifié', () => {
    const l_oHandler  = new HandlerService();
    const l_oReq      = createMockRequest();
    const l_oRes      = createMockResponse();

    const l_oApiError = new ApiError('Paramètres invalides', 400, {
      field: 'pseudo',
      code:  'VALIDATION_FAILED'
    });

    // 🪓 EXÉCUTION DE LA MÉTHODE EN PREMIER
    l_oHandler.handleError(l_oApiError, l_oReq, l_oRes, mockNext);

    // 🪓 [RÉPARÉ V4] LES ASSERTIONS DE VÉRIFICATION APRÈS EXÉCUTION
    expect(l_oRes.status).toHaveBeenCalledWith(400);
    expect(l_oRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });

  it('intercepte une exception brute inconnue et bascule défensivement sur une 500 standard', () => {
    const l_oHandler  = new HandlerService();
    const l_oReq      = createMockRequest();
    const l_oRes      = createMockResponse();
    const l_oRawError = new Error('Crash physique du pool de stockage PostgreSQL');

    l_oHandler.handleError(l_oRawError, l_oReq, l_oRes, mockNext);

    expect(l_oRes.status).toHaveBeenCalledWith(500);
    expect(l_oRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });

  it("génère un payload 404 unifié en cas d'échec de routage sur une adresse inexistante", () => {
    const l_oHandler = new HandlerService();
    const l_oReq     = createMockRequest({ method: 'POST', originalUrl: '/api/v4/piratage' });
    const l_oRes     = createMockResponse();

    l_oHandler.handleNotFound(l_oReq, l_oRes, mockNext);

    expect(l_oRes.status).toHaveBeenCalledWith(404);
    expect(l_oRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });
});
