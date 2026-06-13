// ——— fichier : src/dto/user/__tests__/CreateUserDto.test.ts

import { describe, expect, it } from 'vitest';
import { CreateUserDto }        from '../CreateUserDto';

describe('CreateUserDto', () => {

  const createValidPayload = () => ({
    courriel    : 'nouvel.acteur@memoria.fr', // 🪓 LE FRANÇAIS REPREND SES DROITS
    password    : 'SecuriteAbsolueV4!',
    pseudo      : 'ChoupyOuvrier',
    rgpdConsent : true
  });

  it('accepte un payload d\'inscription conforme et mappe le consentement RGPD vers rgpdConsent', () => {
    const l_oPayload = createValidPayload();
    const l_oDto     = new CreateUserDto(l_oPayload);

    expect(l_oDto.courriel   ).toBe(l_oPayload.courriel);
    expect(l_oDto.password   ).toBe(l_oPayload.password);
    expect(l_oDto.pseudo     ).toBe(l_oPayload.pseudo  );
    expect(l_oDto.rgpdConsent).toBe(true);
  });

  it('rejette fermement l\'instanciation si l\'adresse ou le mot de passe viole la douane Zod', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.courriel = 'format_invalide';

    expect(() => new CreateUserDto(l_oPayload)).toThrow();
  });

  it('bloque la création si le consentement légal obligatoire (rgpdConsent) est à false', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.rgpdConsent = false;

    expect(() => new CreateUserDto(l_oPayload)).toThrow();
  });
});
