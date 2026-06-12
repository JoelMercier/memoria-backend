// ——— fichier : src/dto/user/__tests__/ChangePasswordDto.test.ts

import { describe, expect, it } from 'vitest';
import { ChangePasswordDto }    from '../ChangePasswordDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('ChangePasswordDto', () => {

  const createValidPayload = () => ({
    currentPassword: 'AncienSecretUnique123!',
    newPassword:     'NouveauSecretDacierV4!'
  });

  it('accepte un doublet conforme et instancie correctement les secrets en mémoire', () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new ChangePasswordDto(l_oPayload);

    expect(l_oDto.currentPassword).toBe(l_oPayload.currentPassword);
    expect(l_oDto.newPassword).toBe(l_oPayload.newPassword);
  });

  it('rejette l\'instanciation si l\'un des deux secrets est absent ou vide', () => {
    const l_oPayload = { currentPassword: 'ValidPassword123!', newPassword: '   ' };

    expect(() => new ChangePasswordDto(l_oPayload)).toThrow();
  });

  it('bloque fermement l\'entrée si le nouveau mot de passe est identique aux critères de rejet Zod', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.newPassword = '123'; // Trop faible ou trop court

    expect(() => new ChangePasswordDto(l_oPayload)).toThrow();
  });
});