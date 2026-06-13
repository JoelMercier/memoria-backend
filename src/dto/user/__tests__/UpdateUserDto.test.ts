// ——— fichier : src/dto/user/__tests__/UpdateUserDto.test.ts

import { describe, expect, it } from 'vitest';
import { UpdateUserDto } from '../UpdateUserDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('UpdateUserDto', () => {
  const createValidPayload = () => ({
    courriel     : 'nouveau-courriel@memoria.fr', // 🪓 PUR FRANÇAIS SOUVERAIN V4
    password     : 'D0gmeAcierV4!',
    pseudo       : 'JoëlSouverain',
    settingsUser : {} // 🪓 [REPARÉ V4] Initialisation à vide pour passer le portier JSONB sans friction
  });

  it("accepte un payload complet de modification administrative et extrait proprement l'état", () => {
    const l_oPayload = createValidPayload();
    const l_oDto     = new UpdateUserDto(l_oPayload);

    // 🪓 ALIGNEMENT V4 TOTAL : Zéro mot anglais, confrontation directe de l'armure franconienne
    expect(l_oDto.courriel).toBe(l_oPayload.courriel.toLowerCase());
    expect(l_oDto.password).toBe(l_oPayload.password);
    expect(l_oDto.pseudo).toBe(l_oPayload.pseudo);
    expect(l_oDto.settingsUser).toBeDefined();
  });

  it('autorise une modification ciblée uniquement sur le secret (changement de mot de passe seul)', () => {
    const l_oPayload = { password: 'NouveauSecretUniqueV4!' };
    const l_oDto     = new UpdateUserDto(l_oPayload);

    expect(l_oDto.password).toBe('NouveauSecretUniqueV4!');
    expect(l_oDto.courriel).toBeUndefined();
    expect(l_oDto.pseudo).toBeUndefined();
    expect(l_oDto.settingsUser).toBeUndefined();
  });

  it("bloque fermement l'instanciation si le portier Zod dote une anomalie structurelle", () => {
    const l_oPayload = createValidPayload();
    l_oPayload.password = '123'; // Trop court d'après la douane Zod

    expect(() => new UpdateUserDto(l_oPayload)).toThrow();
  });
});
