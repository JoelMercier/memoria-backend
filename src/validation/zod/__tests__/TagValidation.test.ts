// ——— fichier : src/validation/zod/__tests__/TagValidation.test.ts

import { describe, expect, it } from 'vitest';
import { TagValidation } from '../TagValidation';

describe('TagValidation', () => {
  const createValidTagPayload = () => ({
    tagName: 'Fonderie_D_Acier_V4'
  });

  describe('validateCreate', () => {
    it('valide sans broncher un enregistrement brut de tag conforme', () => {
      const l_oRaw = createValidTagPayload();
      const l_oResult = TagValidation.validateCreate(l_oRaw);

      expect(l_oResult.tagName).toBe(l_oRaw.tagName);
    });

    it('rejette les noms de mots-clés vides ou blancs pour honorer la contrainte matérielle', () => {
      const l_oRaw = { tagName: '   ' }; //-- Débusqué par le .trim().min(1)

      expect(() => TagValidation.validateCreate(l_oRaw)).toThrow();
    });

    it('verrouille et rejette les noms dépassant strictement 50 caractères (Varchar50)', () => {
      const l_oRaw = { tagName: 'Tag_'.repeat(20) }; //-- Trop long pour la carrosserie

      expect(() => TagValidation.validateCreate(l_oRaw)).toThrow();
    });
  });

  describe('validateUpdate', () => {
    it("valide et nettoie les blancs d'espaces superflus lors d'une révision", () => {
      const l_oRaw = { tagName: '   Tag_Nettoyé_Au_Burin   ' };
      const l_oResult = TagValidation.validateUpdate(l_oRaw);

      expect(l_oResult.tagName).toBe('Tag_Nettoyé_Au_Burin'); //-- Vérifie l'effet du .trim() [Mémoria]
    });
  });
});
