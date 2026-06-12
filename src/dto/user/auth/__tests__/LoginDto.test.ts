// ——— fichier : src/dto/auth/__tests__/LoginDto.test.ts

import { describe, expect, it } from 'vitest';
import { LoginDto }             from '../LoginDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('LoginDto', () => {

  const createValidPayload = () => ({
    email:    'joel@memoria.internal',
    password: 'MonSecretSuperSecuriseV4!'
  });

  it('accepte un payload de connexion conforme et extrait proprement les identifiants', () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new LoginDto(l_oPayload);

    expect(l_oDto.email).toBe(l_oPayload.email);
    expect(l_oDto.password).toBe(l_oPayload.password);
  });

  it('rejette l\'instanciation si l\'adresse électronique ou le mot de passe est absent ou vide', () => {
    const l_oPayload = { email: '  ' }; // Pas de mot de passe, adresse blanche

    expect(() => new LoginDto(l_oPayload)).toThrow();
  });

  it('bloque fermement l\'entrée de soute si le format de l\'adresse courriel est invalide', () => {
    const l_oPayload = { email: 'adresse.corrompue', password: 'ValidPassword123' };

    expect(() => new LoginDto(l_oPayload)).toThrow();
  });
});