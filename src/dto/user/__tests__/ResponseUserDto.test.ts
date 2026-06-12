// ——— fichier : src/dto/user/__tests__/ResponseUserDto.test.ts

import { describe, expect, it } from 'vitest';
import { ResponseUserDto }      from '../ResponseUserDto'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import { UserId }               from '@/domain/value-objects/ids';
import type { IUser }           from '@/interfaces/entities/user/IUser';

describe('ResponseUserDto', () => {

  // 🪓 [RÉPARÉ V4] Transtypage étanche de la doublure pour certifier la conformité de surface avec IUser
  const createMockUser = (): IUser => ({
    idUser          : new UserId('018f3a3c-5000-7000-8000-000000000001'),
    courriel        : 'joel.silicium@memoria.fr',
    pseudo          : 'DR-DOS-Maniac',
    role            : { code: 'admin' } as any,
    authProvider    : { code: 'local' } as any,
    settingsUser    : { theme: 'matrix' },
    rgpdConsent     : true,
    rgpdConsentDate : new Date('2026-01-01T12:00:00.000Z'),
    createdAt       : new Date('2026-01-01T12:00:00.000Z'),
    updatedAt       : new Date('2026-06-01T15:30:00.000Z')
  } as unknown as IUser);

  it('transforme une entité utilisateur en sac de données passif épuré de ses secrets', () => {
    const l_oUser = createMockUser();
    const l_oDto = ResponseUserDto.fromUser(l_oUser);

    expect(l_oDto.idUser).toBe(l_oUser.idUser);
    expect(l_oDto.courriel).toBe(l_oUser.courriel);
    expect(l_oDto.pseudo).toBe(l_oUser.pseudo);
    expect(l_oDto.role).toBe('admin');
    expect(l_oDto.authProvider).toBe('local');
    expect(l_oDto.settingsUser).toEqual(l_oUser.settingsUser);
    expect(l_oDto.rgpdConsent).toBe(true);
    expect(l_oDto.rgpdConsentDate).toEqual(l_oUser.rgpdConsentDate);

    // Vérité de soute absolue : la propriété passwordHash ne doit jamais exister sur ce DTO
    expect((l_oDto as any).passwordHash).toBeUndefined();
  });

  it('convertit de manière étanche un tableau complet d\'entités via sa factory de collection', () => {
    const l_aUsers = [createMockUser(), createMockUser()];
    const l_aDtos = ResponseUserDto.fromUsers(l_aUsers);

    expect(l_aDtos).toHaveLength(2);
    expect(l_aDtos[0].pseudo).toBe('DR-DOS-Maniac');
    expect(l_aDtos[0].courriel).toBe('joel.silicium@memoria.fr');
  });
});
