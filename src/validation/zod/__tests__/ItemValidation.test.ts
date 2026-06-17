// ——— fichier : src/validation/zod/__tests__/ItemValidation.test.ts

import { describe, expect, it } from 'vitest';
import { ItemValidation } from '../ItemValidation';

describe('ItemValidation', () => {
  const createValidItemPayload = () => ({
    contentType: 'NOTE', //-- Code valide du SmartEnum ContentType
    title: "Une magnifique pépite d'or de soute",
    slug: 'une-magnifique-pepite-d-or-de-soute',
    content: 'Contenu hautement confidentiel de la V4 Pro',
    sourceAuthor: 'Joël',
    thumbnailUrl: 'https://memoria.lan',
    metadata: { version: '4.2.0' },
    tagIds: ['018f3a3c-5000-7000-8000-00000000000A']
  });

  describe('validateCreate', () => {
    it('valide sans broncher un enregistrement brut de pépite conforme', () => {
      const l_oRaw = createValidItemPayload();
      const l_oResult = ItemValidation.validateCreate(l_oRaw);

      expect(l_oResult.title).toBe(l_oRaw.title);
      expect(l_oResult.content).toBe(l_oRaw.content);
    });

    it('rejette les titres vides ou blancs pour honorer la contrainte matérielle', () => {
      const l_oRaw = createValidItemPayload();
      l_oRaw.title = '   ';

      expect(() => ItemValidation.validateCreate(l_oRaw)).toThrow();
    });

    it('bloque les slugs contenant des majuscules ou des caractères interdits', () => {
      const l_oRaw = createValidItemPayload();
      l_oRaw.slug = 'Slug_Invalide!'; //-- Majuscules et symboles interdits

      expect(() => ItemValidation.validateCreate(l_oRaw)).toThrow();
    });

    it("rejette les formats d'URL de miniature corrompus", () => {
      const l_oRaw = createValidItemPayload();
      l_oRaw.thumbnailUrl = 'pas-une-url-valide';

      expect(() => ItemValidation.validateCreate(l_oRaw)).toThrow();
    });
  });

  describe('validateUpdate', () => {
    it("accepte une mutation partielle d'item sans tous les champs requis", () => {
      const l_oRaw = {
        title: 'Titre révisé à chaud au burin'
      };
      const l_oResult = ItemValidation.validateUpdate(l_oRaw);

      expect(l_oResult.title).toBe(l_oRaw.title);
    });
  });
});
