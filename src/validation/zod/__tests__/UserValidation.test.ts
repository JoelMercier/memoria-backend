// ——— fichier : src/validation/zod/__tests__/UserValidation.test.ts

import { describe, expect, it } from 'vitest';
import { UserValidation } from '../UserValidation';

describe('UserValidation', () => {
  const createValidUserPayload = () => ({
    courriel: 'joel.mercier@memoria.lan',
    password: 'Securite123',
    pseudo: 'Joël_L-Ancien-ëï', //-- [SCELLÉ] Test unicode strict avec trémas franconiens !
    rgpdConsent: true
  });

  describe('validateCreate', () => {
    it("valide sans broncher un enregistrement brut d'acteur conforme", () => {
      const l_oRaw = createValidUserPayload();
      const l_oResult = UserValidation.validateCreate(l_oRaw);

      expect(l_oResult.courriel).toBe(l_oRaw.courriel.toLowerCase());
      expect(l_oResult.pseudo).toBe(l_oRaw.pseudo);
    });

    it('rejette les adresses de contact mal formées', () => {
      const l_oRaw = createValidUserPayload();
      l_oRaw.courriel = 'pirate-at-anonymous.com';

      expect(() => UserValidation.validateCreate(l_oRaw)).toThrow();
    });

    it('rejette les mots de passe trop courts ou sans majuscule', () => {
      const l_oRaw = createValidUserPayload();
      l_oRaw.password = 'secur12'; //-- Trop court et pas de majuscule.

      expect(() => UserValidation.validateCreate(l_oRaw)).toThrow();
    });

    it("interdit constitutionnellement l'accès sans acceptation du consentement RGPD", () => {
      const l_oRaw = createValidUserPayload();
      l_oRaw.rgpdConsent = false;

      expect(() => UserValidation.validateCreate(l_oRaw)).toThrow();
    });
  });

  describe('validateUpdateProfile', () => {
    it('accepte une révision partielle de profil', () => {
      const l_oRaw = {
        pseudo: 'Nouveau_Pseudo',
        settingsUser: { theme: 'sombre', police: 'monospace' }
      };
      const l_oResult = UserValidation.validateUpdateProfile(l_oRaw);

      expect(l_oResult.pseudo).toBe(l_oRaw.pseudo);
      expect(l_oResult.settingsUser).toEqual(l_oRaw.settingsUser);
    });
  });

  describe('validateDeleteAccount', () => {
    it("rejette les blancs d'espaces et exige un secret matériel", () => {
      const l_oRaw = { password: '    ' }; //-- [RÉPARÉ V4] Contrecarré par le .trim()

      expect(() => UserValidation.validateDeleteAccount(l_oRaw)).toThrow();
    });
  });
});
