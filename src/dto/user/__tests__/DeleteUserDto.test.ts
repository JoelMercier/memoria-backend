// ——— fichier : src/dto/user/__tests__/DeleteUserDto.test.ts

import { describe, expect, it } from 'vitest';
import { DeleteUserDto }        from '../DeleteUserDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('DeleteUserDto', () => {

  const createValidPayload = () => ({
    password: 'EffacementAdministratifSecuriseV4!'
  });

  it('accepte un secret conforme et l\'extrait correctement pour la validation', () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new DeleteUserDto(l_oPayload);

    expect(l_oDto.password).toBe(l_oPayload.password);
  });

  it('rejette l\'instanciation si le secret de confirmation est vide ou blanc', () => {
    const l_oPayload = { password: '   ' };

    expect(() => new DeleteUserDto(l_oPayload)).toThrow();
  });

  it('bloque fermement l\'accès de soute en cas de payload vide', () => {
    expect(() => new DeleteUserDto({})).toThrow();
  });
});
