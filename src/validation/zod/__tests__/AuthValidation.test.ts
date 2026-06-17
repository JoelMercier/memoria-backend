// ——— fichier : src/validation/zod/__tests__/AuthValidation.test.ts

import { describe, expect, it } from 'vitest';
import { AuthValidation } from '../AuthValidation';

describe('AuthValidation', () => {
  const createValidLoginPayload = () => ({
    courriel: 'capitaine.joel@memoria.lan',
    password: 'MotDePasseSuperSecurise123'
  });

  describe('validateLogin', () => {
    it('valide sans broncher une connexion brute conforme', () => {
      const l_oRaw = createValidLoginPayload();
      const l_oResult = AuthValidation.validateLogin(l_oRaw);

      expect(l_oResult.courriel).toBe(l_oRaw.courriel.toLowerCase());
      expect(l_oResult.password).toBe(l_oRaw.password);
    });

    it('rejette les adresses de contact mal formées au niveau de la douane', () => {
      const l_oRaw = createValidLoginPayload();
      l_oRaw.courriel = 'structure_manquante.lan';

      expect(() => AuthValidation.validateLogin(l_oRaw)).toThrow();
    });

    it('rejette les connexions orphelines de mot de passe', () => {
      const l_oRaw = createValidLoginPayload();
      l_oRaw.password = '   '; //-- Interdit par le .trim().min(1) [Mémoria]

      expect(() => AuthValidation.validateLogin(l_oRaw)).toThrow();
    });
  });

  describe('validateRefreshToken', () => {
    it('valide un jeton de rafraîchissement matériel conforme', () => {
      const l_oRaw = { refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' };
      const l_oResult = AuthValidation.validateRefreshToken(l_oRaw);

      expect(l_oResult.refreshToken).toBe(l_oRaw.refreshToken);
    });

    it('bloque les injections de chaînes blanches ou vides', () => {
      const l_oRaw = { refreshToken: '\t  \n' }; //-- Contrecarré par le .trim() [Mémoria]

      expect(() => AuthValidation.validateRefreshToken(l_oRaw)).toThrow();
    });
  });
});
