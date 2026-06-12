// ——— fichier : src/dto/user/__tests__/DeleteAccountDto.test.ts

import { describe, expect, it } from 'vitest';
import { DeleteAccountDto }     from '../DeleteAccountDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('DeleteAccountDto', () => {

  const createValidPayload = () => ({
    password: 'ConfirmationSecretDacierV4!'
  });

  it('accepte un secret de validation conforme et extrait le mot de passe', () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new DeleteAccountDto(l_oPayload);

    expect(l_oDto.password).toBe(l_oPayload.password);
  });

  it('rejette l\'instanciation si le mot de passe de confirmation est absent ou blanc', () => {
    const l_oPayload = { password: '   ' };

    expect(() => new DeleteAccountDto(l_oPayload)).toThrow();
  });

  it('bloque la soute si le payload fourni est une structure vide', () => {
    expect(() => new DeleteAccountDto({})).toThrow();
  });
});
