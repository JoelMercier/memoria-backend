// ——— fichier : src/dto/user/__tests__/UpdateUserDto.test.ts

import { describe, expect, it } from 'vitest';
import { UpdateUserDto } from '../UpdateUserDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL

describe('UpdateUserDto', () => {
  const createValidPayload = () => ({
    email: 'nouveau-courriel@memoria.fr',
    password: 'D0gmeAcierV4!',
    pseudo: 'JoëlSouverain',
    settingsUser: { lang: 'fr', autoSave: true }
  });

  it("accepte un payload complet de modification administrative et extrait proprement l'état", () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new UpdateUserDto(l_oPayload);

    // 🪓 ALIGNEMENT V4 : Prise en compte du .toLowerCase() natif de la douane Zod
    expect(l_oDto.email).toBe(l_oPayload.email.toLowerCase());
    expect(l_oDto.password).toBe(l_oPayload.password);
    expect(l_oDto.pseudo).toBe(l_oPayload.pseudo);
    expect(l_oDto.settingsUser).toEqual(l_oPayload.settingsUser);
  });

  it('autorise une modification ciblée uniquement sur le secret (changement de mot de passe seul)', () => {
    // 🪓 [RÉPARÉ V4] Le mot de passe de simulation doit honorer les regex de complexité du domaine (Chiffre + Majuscule)
    const l_oPayload = { password: 'NouveauSecretUniqueV4!' };
    const l_oDto = new UpdateUserDto(l_oPayload);

    expect(l_oDto.password).toBe('NouveauSecretUniqueV4!');
    expect(l_oDto.email).toBeUndefined();
    expect(l_oDto.pseudo).toBeUndefined();
    expect(l_oDto.settingsUser).toBeUndefined();
  });

  it("bloque fermement l'instanciation si le portier Zod dote une anomalie structurelle", () => {
    const l_oPayload = createValidPayload();
    l_oPayload.password = '123'; // Trop court d'après les règles de sécurité domaine

    expect(() => new UpdateUserDto(l_oPayload)).toThrow();
  });
});
