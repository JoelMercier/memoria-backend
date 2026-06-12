// ——— fichier : src/dto/user/__tests__/CreateUserDto.test.ts

import { describe, expect, it } from 'vitest';
import { CreateUserDto }        from '../CreateUserDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('CreateUserDto', () => {

  const createValidPayload = () => ({
    email:       'nouvel.acteur@memoria.fr',
    password:    'SecuriteAbsolueV4!',
    pseudo:      'ChoupyOuvrier',
    gdprConsent: true
  });

  it('accepte un payload d\'inscription conforme et mappe le consentement GDPR vers rgpdConsent', () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new CreateUserDto(l_oPayload);

    expect(l_oDto.email).toBe(l_oPayload.email);
    expect(l_oDto.password).toBe(l_oPayload.password);
    expect(l_oDto.pseudo).toBe(l_oPayload.pseudo);
    expect(l_oDto.rgpdConsent).toBe(true);
  });

  it('rejette fermement l\'instanciation si l\'adresse ou le mot de passe viole la douane Zod', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.email = 'format_invalide';

    expect(() => new CreateUserDto(l_oPayload)).toThrow();
  });

  it('bloque la création si le consentement légal obligatoire (gdprConsent) est à false', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.gdprConsent = false; // Rejet constitutionnel attendu sur la politique de soute

    expect(() => new CreateUserDto(l_oPayload)).toThrow();
  });
});
