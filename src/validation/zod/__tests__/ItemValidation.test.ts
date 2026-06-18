// ——— fichier : src/validation/zod/__tests__/ItemValidation.test.ts

import { describe, expect, it } from 'vitest';
import { ItemValidation }       from '../ItemValidation';

describe('🏛️ [BANC D\'ESSAI ZOD V4] : ItemValidation', () => {

  /**
   * 📦 Fabrique de charge utile conforme et nettoyée sur le franconien de soute.
   * [SCELLÉ ESLINT] Type de retour explicité pour honorer la contrainte de fonction stricte.
   *
   * @returns {Record<string, unknown>} L'objet de données brutes prêt pour le douanier Zod.
   */
  const createValidItemPayload = (): Record<string, unknown> => ({
    contentTypeId : 'NOTE', // 🔌 [RÉPARÉ V4] Aligné sur le quadrigramme fixe.
    libelle       : "Une magnifique pépite d'or de soute", // 💎 [RÉPARÉ V4] Adieu 'title'.
    slug          : 'une-magnifique-pepite-d-or-de-soute',
    content       : 'Contenu hautement confidentiel de la V4 Pro',
    auteurSource  : 'Joël', // 💎 [RÉPARÉ V4] Adieu 'sourceAuthor'.
    thumbnailUrl  : 'https://memoria.lan',
    metadata      : { version: '4.2.1' },
    tagIds        : ['018f3a3c-5000-7000-8000-00000000000A']
  });

  describe('validateCreate', () => {
    it('✅ [Douane] : Valide sans broncher un enregistrement brut de pépite conforme', () => {
      const l_oRaw    = createValidItemPayload();
      const l_oResult = ItemValidation.validateCreate(l_oRaw);

      // On force le typage ici pour apaiser les contrôles de propriétés dynamiques
      expect((l_oResult as Record<string, unknown>).libelle).toBe(l_oRaw.libelle);
      expect(l_oResult.content).toBe(l_oRaw.content);
    });

    it('❌ [Contrainte] : Rejette les libellés vides ou blancs pour honorer la contrainte matérielle', () => {
      const l_oRaw   = createValidItemPayload();
      l_oRaw.libelle = '   '; // 💎 Test de collision à blanc.

      expect(() => ItemValidation.validateCreate(l_oRaw)).toThrow();
    });

    it('❌ [Format] : Bloque les slugs contenant des majuscules ou des caractères interdits', () => {
      const l_oRaw = createValidItemPayload();
      l_oRaw.slug  = 'Slug_Invalide!';

      expect(() => ItemValidation.validateCreate(l_oRaw)).toThrow();
    });

    it("❌ [Sécurité] : Rejette les formats d'URL de miniature corrompus", () => {
      const l_oRaw        = createValidItemPayload();
      l_oRaw.thumbnailUrl = 'pas-une-url-valide';

      expect(() => ItemValidation.validateCreate(l_oRaw)).toThrow();
    });
  });

  describe('validateUpdate', () => {
    it("✅ [Mutation] : Accepte une mutation partielle d'item sans tous les champs requis", () => {
      const l_oRaw = {
        libelle: 'Libellé révisé à chaud au burin' // 💎 Alignement de la mise à jour partielle.
      };
      const l_oResult = ItemValidation.validateUpdate(l_oRaw);

      expect((l_oResult as Record<string, unknown>).libelle).toBe(l_oRaw.libelle);
    });
  });
});
