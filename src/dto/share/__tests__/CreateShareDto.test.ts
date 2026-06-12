// ——— fichier : src/dto/share/__tests__/CreateShareDto.test.ts

import { describe, expect, it } from 'vitest';
import { CreateShareDto }       from '../CreateShareDto';

describe('CreateShareDto', () => {

  const createValidPayload = () => ({
    itemId        : '018f3a3c-5000-7000-8000-00000000000A',
    userId        : '018f3a3c-5000-7000-8000-00000000000B',
    shareId       : '018f3a3c-5000-7000-8000-00000000000C',
    itemOwnerId   : '018f3a3c-5000-7000-8000-00000000000D' as string | null,
    recipientEmail: 'visiteur@memoria.fr' as string | null,
    accessConfig  : {
      level:          'read',
      allow_download: true,
      expiresAt:      '2026-12-31T23:59:59.000Z' as string | undefined
    }
  });

  it('accepte un payload conforme et mappe correctement les configurations d\'accès en PascalCase', () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new CreateShareDto(l_oPayload);

    expect(l_oDto.idItem.valeur).toBe(l_oPayload.itemId);
    expect(l_oDto.idUser.valeur).toBe(l_oPayload.userId);
    expect(l_oDto.idShare.valeur).toBe(l_oPayload.shareId);
    expect(l_oDto.itemOwnerId.valeur).toBe(l_oPayload.itemOwnerId);
    expect(l_oDto.recipientEmail).toBe(l_oPayload.recipientEmail);

    expect(l_oDto.accessConfig.Privilege).toBe('LECTURE');
    expect(l_oDto.accessConfig.AutoriseTelechargement).toBe(true);
    expect(l_oDto.accessConfig.DateExpiration).toBeInstanceOf(Date);
  });

  it('replie l\'ownership de sécurité sur l\'émetteur si le itemOwnerId est absent', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.itemOwnerId = null;

    const l_oDto = new CreateShareDto(l_oPayload);
    expect(l_oDto.itemOwnerId.valeur).toBe(l_oPayload.userId);
  });

  it('accepte un partage anonyme sans adresse électronique cible', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.recipientEmail = null;

    const l_oDto = new CreateShareDto(l_oPayload);
    expect(l_oDto.recipientEmail).toBeNull();
  });

  it('gère l\'absence de date d\'expiration pour les partages permanents', () => {
    const l_oPayload = createValidPayload();
    // 🪓 [REPARÉ V4] Transtypage chirurgical pour autoriser le delete sur le champ optionnel
    delete (l_oPayload.accessConfig as any).expiresAt;

    const l_oDto = new CreateShareDto(l_oPayload);
    expect(l_oDto.accessConfig.DateExpiration).toBeUndefined();
  });

  it('rejette fermement le payload si le portier Zod détecte une anomalie d\'infrastructure', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.itemId = '';

    expect(() => new CreateShareDto(l_oPayload)).toThrow();
  });
});
