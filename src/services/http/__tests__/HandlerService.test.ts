// ——— fichier : src/services/http/__tests__/HandlerService.test.ts

import { describe, expect, it, vi } from 'vitest';
import { HandlerService } from '../HandlerService'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import { ApiError } from '@/exceptions/ApiError';

describe('HandlerService', () => {
  const createMockRequest = (overrides = {}) =>
    ({
      method: 'GET',
      originalUrl: '/api/v4/pepites',
      headers: {},
      ...overrides
    }) as any;

  const createMockResponse = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = vi.fn();

  it('intercepte une ApiError maîtrisée et renvoie le code HTTP et le payload unifié', () => {
    const l_oHandler = new HandlerService();
    const l_oReq = createMockRequest();
    const l_oRes = createMockResponse();

    // Simulation d'une erreur de validation du domaine (ex: 400 Bad Request)
    const l_oApiError = new ApiError('Paramètres invalides', 400, {
      field: 'pseudo',
      code: 'VALIDATION_FAILED'
    });
    vi.spyOn(l_oApiError, 'log').mockReturnThis(); // 🪓 [RÉPARÉ V4] Utilisation de mockReturnThis pour respecter le chaînage fluide de l'ApiError

    l_oHandler.handleError(l_oApiError, l_oReq, l_oRes, mockNext);

    expect(l_oRes.status).toHaveBeenCalledWith(400);
    expect(l_oRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: 'Paramètres invalides',
          code: 'VALIDATION_FAILED'
        })
      })
    );
  });

  it('intercepte une exception brute inconnue et bascule défensivement sur une 500 standard', () => {
    const l_oHandler = new HandlerService();
    const l_oReq = createMockRequest();
    const l_oRes = createMockResponse();
    const l_oRawError = new Error('Crash physique du pool de stockage PostgreSQL');

    l_oHandler.handleError(l_oRawError, l_oReq, l_oRes, mockNext);

    expect(l_oRes.status).toHaveBeenCalledWith(500);
    expect(l_oRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'INTERNAL_ERROR'
        })
      })
    );
  });

  it("génère un payload 404 unifié en cas d'échec de routage sur une adresse inexistante", () => {
    const l_oHandler = new HandlerService();
    const l_oReq = createMockRequest({ method: 'POST', originalUrl: '/api/v4/piratage' });
    const l_oRes = createMockResponse();

    l_oHandler.handleNotFound(l_oReq, l_oRes, mockNext);

    expect(l_oRes.status).toHaveBeenCalledWith(404);
    expect(l_oRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'ROUTE_NOT_FOUND'
        })
      })
    );
  });
});
