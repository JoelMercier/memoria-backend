// ——— fichier : src/validation/zod/__tests__/ShareValidation.test.ts

import { describe, expect, it } from 'vitest';
import { ShareValidation } from '../ShareValidation';

describe('ShareValidation', () => {
  const createValidSharePayload = () => ({
    itemId: '018f3a3c-5000-7000-8000-00000000000A',
    userId: '018f3a3c-5000-7000-8000-000000000001',
    shareId: '018f3a3c-5000-7000-8000-00000000000B',
    itemOwnerId: '018f3a3c-5000-7000-8000-000000000001',
    recipientCourriel: 'destinataire@memoria.lan',
    accessConfig: {
      expiresAt: '2026-12-31T23:59:59.000Z', //-- Format ISO 8601 strict exigé !
      canDownload: true //-- Avalé par le .passthrough() V4
    }
  });

  describe('validateCreate', () => {
    it('valide sans broncher un enregistrement brut de partage conforme', () => {
      const l_oRaw = createValidSharePayload();
      const l_oResult = ShareValidation.validateCreate(l_oRaw);

      expect(l_oResult.itemId).toBe(l_oRaw.itemId);
      expect(l_oResult.shareId).toBe(l_oRaw.shareId);
      expect(l_oResult.userId).toBe(l_oRaw.userId);
    });

    it("rejette les dates d'expiration qui ne respectent pas le format ISO 8601", () => {
      const l_oRaw = createValidSharePayload();
      l_oRaw.accessConfig.expiresAt = '31-12-2026 23:59:59'; //-- Format corrompu.

      expect(() => ShareValidation.validateCreate(l_oRaw)).toThrow();
    });

    it("bloque les partages orphelins de clés matérielles d'identification", () => {
      const l_oRaw = createValidSharePayload();
      l_oRaw.itemId = '   '; //-- Débusqué par le .trim().min(1)

      expect(() => ShareValidation.validateCreate(l_oRaw)).toThrow();
    });
  });

  describe('validateToken', () => {
    it("purifie et accepte un token matériel sain extrait de l'URL", () => {
      const l_sRawToken = '   mon-token-sain-de-partage-v4   ';
      const l_sResult = ShareValidation.validateToken(l_sRawToken);

      expect(l_sResult).toBe('mon-token-sain-de-partage-v4'); //-- Vérifie l'application du .trim()
    });

    it("jette une exception si le token extrait n'est qu'une suite d'espaces", () => {
      expect(() => ShareValidation.validateToken('      ')).toThrow();
    });
  });
});
