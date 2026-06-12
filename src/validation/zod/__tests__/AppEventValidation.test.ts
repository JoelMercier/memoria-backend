// ——— fichier : src/validation/zod/__tests__/AppEventValidation.test.ts

import { describe, expect, it } from 'vitest';
import { AppEventValidation }   from '../AppEventValidation'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('AppEventValidation', () => {

  const createValidRawData = () => ({
    idAppEvent    : '018f3a3c-5000-7000-8000-000000000001',
    userId        : '018f3a3c-5000-7000-8000-000000000002',
    eventCategory : 'AUDI',
    eventSecteur  : 'AUTH',
    eventAction   : 'CONN',
    severity      : 'INFO',
    message       : 'Accès sécurisé accordé au rôle MémoriaApplicatif',
    metadata      : { ip: '127.0.0.1' }
  });

  it('valide sans broncher un enregistrement brut conforme', () => {
    const l_oRaw = createValidRawData();
    const l_oResult = AppEventValidation.validateCreate(l_oRaw);

    expect(l_oResult.idAppEvent).toBe(l_oRaw.idAppEvent);
    expect(l_oResult.message).toBe(l_oRaw.message);
  });

  it('rejette les messages vides ou blancs pour honorer la contrainte Not Null', () => {
    const l_oRaw = createValidRawData();
    l_oRaw.message = '   ';

    expect(() => AppEventValidation.validateCreate(l_oRaw)).toThrow();
  });

  it('verrouille et rejette les messages dépassant strictement 255 caractères (Varchar255)', () => {
    const l_oRaw = createValidRawData();
    l_oRaw.message = 'Mémoria_'.repeat(300);

    expect(() => AppEventValidation.validateCreate(l_oRaw)).toThrow();
  });

  it('bloque les injections de catégories ou actions pirates absentes du dictionnaire', () => {
    const l_oRaw = createValidRawData();
    l_oRaw.eventCategory = 'HACK';
    l_oRaw.eventAction   = 'INJE';

    expect(() => AppEventValidation.validateCreate(l_oRaw)).toThrow();
  });
});