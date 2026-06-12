// ——— fichier : src\dto\user\auth\__tests__\RefreshTokenDto.test.ts

import { describe, expect, it } from 'vitest';
import { RefreshTokenDto }      from '../RefreshTokenDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('RefreshTokenDto', () => {

  const createValidPayload = () => ({
    refreshToken: 'def.018f3a3c500070008000000000000001.cache_session_v4'
  });

  it('accepte un payload de rafraîchissement conforme et extrait le jeton', () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new RefreshTokenDto(l_oPayload);

    expect(l_oDto.refreshToken).toBe(l_oPayload.refreshToken);
  });

  it('rejette l\'instanciation si le jeton de rafraîchissement est absent ou blanc', () => {
    const l_oPayload = { refreshToken: '   ' };

    expect(() => new RefreshTokenDto(l_oPayload)).toThrow();
  });

  it('bloque fermement l\'entrée si le payload est une structure vide', () => {
    expect(() => new RefreshTokenDto({})).toThrow();
  });
});