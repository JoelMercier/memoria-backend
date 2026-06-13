// ——— fichier : src/dto/share/__tests__/CreateShareDto.test.ts

import { describe, expect, it } from 'vitest';
import { CreateShareDto }       from '../CreateShareDto';

describe('CreateShareDto', () => {

  const createValidPayload = () => ({
    itemId            : '018f3a3c-5000-7000-8000-00000000000A',
    userId            : '018f3a3c-5000-7000-8000-00000000000B',
    shareId           : '018f3a3c-5000-7000-8000-00000000000C',
    itemOwnerId       : '018f3a3c-5000-7000-8000-00000000000D' as string | undefined,
    recipientCourriel : 'visiteur@memoria.fr' as string | undefined,
    accessConfig      : {
      level:          'read',
      allow_download: true,
      expiresAt:      '2026-12-31T23:59:59.000Z' as string | undefined
    }
  });

  it('accepte un payload conforme et mappe correctement les configurations d\'accès en PascalCase', () => {
    const l_oPayload = createValidPayload();
    const l_oDto     = new CreateShareDto(l_oPayload);

    expect(l_oDto.idItem     .valeur.toLowerCase()).toBe(l_oPayload.itemId .toLowerCase());
    expect(l_oDto.idUser     .valeur.toLowerCase()).toBe(l_oPayload.userId .toLowerCase());
    expect(l_oDto.idShare    .valeur.toLowerCase()).toBe(l_oPayload.shareId.toLowerCase());
    expect(l_oDto.itemOwnerId.valeur.toLowerCase()).toBe(l_oPayload.itemOwnerId?.toLowerCase());
    expect(l_oDto.recipientCourriel ).toBe(l_oPayload.recipientCourriel);

    expect(l_oDto.accessConfig.Privilege).toBe('LECTURE');
    expect(l_oDto.accessConfig.AutoriseTelechargement).toBe(true);
    expect(l_oDto.accessConfig.DateExpiration).toBeInstanceOf(Date);
  });

  it('replie l\'ownership de sécurité sur l\'émetteur si le itemOwnerId est absent', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.itemOwnerId = undefined; // 🪓 [RÉPARÉ V4] Le vide sémantique Zod passe par undefined

    const l_oDto = new CreateShareDto(l_oPayload);
    expect(l_oDto.itemOwnerId.valeur.toLowerCase()).toBe(l_oPayload.userId.toLowerCase());
  });

  it('accepte un partage anonyme sans adresse électronique cible', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.recipientCourriel = undefined; // 🪓 [RÉPARÉ V4] Le vide sémantique Zod passe par undefined

    const l_oDto = new CreateShareDto(l_oPayload);
    expect(l_oDto.recipientCourriel).toBeNull();
  });

  it('gère l\'absence de date d\'expiration pour les partages permanents', () => {
    const l_oPayload = createValidPayload();
    delete (l_oPayload.accessConfig as any).expiresAt;

    const l_oDto = new CreateShareDto(l_oPayload);
    expect(l_oDto.accessConfig.DateExpiration).toBeUndefined();
  });

  it('rejette fermement le payload si le portier Zod détecte une anomalie d\'infrastructure', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.itemId = ''; // Chaîne vide interdite par la règle de format UUID

    expect(() => new CreateShareDto(l_oPayload)).toThrow();
  });
});
