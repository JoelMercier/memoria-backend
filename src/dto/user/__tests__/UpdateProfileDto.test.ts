// ——— fichier : src/dto/user/__tests__/UpdateProfileDto.test.ts

import { describe, expect, it } from 'vitest';
import { UpdateProfileDto } from '../UpdateProfileDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('UpdateProfileDto', () => {
  const createValidPayload = () => ({
    pseudo: 'JojoLeSilex',
    courriel: 'joel@memoria.internal',
    settingsUser: { theme: 'dark', compactMode: true }
  });

  it('accepte un payload de mise à jour complet et instancie correctement les propriétés', () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new UpdateProfileDto(l_oPayload);

    expect(l_oDto.pseudo).toBe(l_oPayload.pseudo);
    expect(l_oDto.courriel).toBe(l_oPayload.courriel);
    expect(l_oDto.settingsUser).toEqual(l_oPayload.settingsUser);
  });

  it("tolère la mise à jour partielle d'un profil (champs manquants ou optionnels)", () => {
    const l_oPayload = { pseudo: 'GaïaLaGraveuse' }; // courriel et préférences omis
    const l_oDto = new UpdateProfileDto(l_oPayload);

    expect(l_oDto.pseudo).toBe('GaïaLaGraveuse');
    expect(l_oDto.courriel).toBeUndefined();
    expect(l_oDto.settingsUser).toBeUndefined();
  });

  it('jette une exception de soute si la douane de validation Zod refuse le format', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.courriel = 'ADRESSE_ELECTRONIQUE_CORROMPUE'; // Rejet attendu sur le format courriel

    expect(() => new UpdateProfileDto(l_oPayload)).toThrow();
  });
});
