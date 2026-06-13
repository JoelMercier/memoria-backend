// ——— fichier : src/services/__tests__/AuthService.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../AuthService'; // 🪓 IMPORT DE PROXIMITÉ LOCAL
import type { User } from '@/entities/User';
import { UserId } from '@/domain/value-objects/ids';
import { CreateUserDto } from '@/dto/user/CreateUserDto';
import { LoginDto } from '@/dto/user/auth/LoginDto';
import { RefreshTokenDto } from '@/dto/user/auth/RefreshTokenDto';
import type { IUserRepository } from '@/interfaces/repositories/PostGres/IUserRepository';
import type { IPasswordHasher } from '@/interfaces/security/IPasswordHasher';
import type { ITokenManager } from '@/interfaces/security/ITokenManager';
import type { IBlacklistService } from '@/interfaces/security/IBlacklistService';

const ACTOR_ID = new UserId('018f3a3c-5000-7000-8000-000000000001');

const createMockUser = (): User =>
  ({
    idUser: ACTOR_ID,
    courriel: 'joel@memoria.fr',
    passwordHash: 'SECRET_HACHE_CONFORME',
    pseudo: 'DR-DOS-Maniac',
    role: { code: 'CUST' } as any,
    authProvider: { code: 'LOCA' } as any,
    settingsUser: {},
    rgpdConsent: true,
    rgpdConsentDate: new Date(),
    createdAt: new Date()
  }) as unknown as User;

describe('AuthService', () => {
  let l_oUserRepository: IUserRepository;
  let l_oPasswordHasher: IPasswordHasher;
  let l_oTokenManager: ITokenManager;
  let l_oBlacklistService: IBlacklistService;
  let l_oAuthService: AuthService;

  beforeEach(() => {
    l_oUserRepository = {
      findByEmail: vi.fn(),
      findByPseudo: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      db: {} as any,
      update: vi.fn(),
      delete: vi.fn()
    } as any;

    l_oPasswordHasher = {
      hash: vi.fn().mockResolvedValue('SECRET_HACHE_CONFORME'),
      verify: vi.fn()
    };

    // 🪓 ALIGNEMENT TOTAL : Ajout de verifyAccessToken exigé par l'interface ITokenManager
    l_oTokenManager = {
      generateTokens: vi
        .fn()
        .mockResolvedValue({ accessToken: 'access_jwt', refreshToken: 'refresh_jwt' }),
      verifyRefreshToken: vi.fn(),
      verifyAccessToken: vi.fn()
    };

    // 🪓 ALIGNEMENT TOTAL : Ajout des membres structurels de surface exigés par IBlacklistService
    l_oBlacklistService = {
      isBlacklisted: vi.fn().mockResolvedValue(false),
      add: vi.fn().mockResolvedValue(true),
      repository: {} as any,
      size: vi.fn().mockResolvedValue(0)
    };

    l_oAuthService = new AuthService(
      l_oUserRepository,
      l_oPasswordHasher,
      l_oTokenManager,
      l_oBlacklistService
    );
  });

  describe('register', () => {
    it("lève une exception si l'adresse électronique est déjà réservée sur le disque", async () => {
      vi.mocked(l_oUserRepository.findByEmail).mockResolvedValue(createMockUser());
      const l_oDto = new CreateUserDto({
        email: 'joel@memoria.fr',
        password: 'PasswordV4!',
        pseudo: 'Joel',
        gdprConsent: true
      });

      await expect(l_oAuthService.register(l_oDto)).rejects.toThrow();
    });

    it('persiste proprement le compte si le courriel et le pseudo sont vacants', async () => {
      vi.mocked(l_oUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(l_oUserRepository.findByPseudo).mockResolvedValue(null);
      const l_oUser = createMockUser();
      vi.mocked(l_oUserRepository.create).mockResolvedValue(l_oUser);

      const l_oDto = new CreateUserDto({
        email: 'joel@memoria.fr',
        password: 'PasswordV4!',
        pseudo: 'Joel',
        gdprConsent: true
      });
      const l_oResult = await l_oAuthService.register(l_oDto);

      expect(l_oUserRepository.create).toHaveBeenCalled();
      expect(l_oResult).toBe(l_oUser);
    });
  });

  describe('login', () => {
    it("rejette la connexion et lève une anomalie si le secret d'accès est invalide", async () => {
      vi.mocked(l_oUserRepository.findByEmail).mockResolvedValue(createMockUser());
      vi.mocked(l_oPasswordHasher.verify).mockResolvedValue(false);

      const l_oDto = new LoginDto({ email: 'joel@memoria.fr', password: 'FauxPassword123' });
      await expect(l_oAuthService.login(l_oDto)).rejects.toThrow();
    });

    it('signe et délivre les jetons de session si les secrets concordent à la frontière', async () => {
      const l_oUser = createMockUser();
      vi.mocked(l_oUserRepository.findByEmail).mockResolvedValue(l_oUser);
      vi.mocked(l_oPasswordHasher.verify).mockResolvedValue(true);

      const l_oDto = new LoginDto({ email: 'joel@memoria.fr', password: 'SECRET_CONFORME_V4' });
      const l_oResult = await l_oAuthService.login(l_oDto);

      expect(l_oResult.accessToken).toBe('access_jwt');
      expect(l_oResult.user).toBe(l_oUser);
    });
  });

  describe('refresh', () => {
    it('bloque instantanément le renouvellement si le jeton de rafraîchissement est sous quarantaine', async () => {
      // 🪓 [RÉPARÉ V4] Utilisation de "as any" pour satisfaire l'intégrité de ITokenPayload sansboilerplate inutile
      vi.mocked(l_oTokenManager.verifyRefreshToken).mockResolvedValue({
        jti: 'token_id_pirate',
        sub: ACTOR_ID
      } as any);
      vi.mocked(l_oBlacklistService.isBlacklisted).mockResolvedValue(true);

      const l_oDto = new RefreshTokenDto({ refreshToken: 'refresh_jwt_vole' });
      await expect(l_oAuthService.refresh(l_oDto)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('inscrit le jeton valide en liste noire pour invalider la session active', async () => {
      // 🪓 [RÉPARÉ V4] Utilisation de "as any" pour satisfaire l'intégrité de ITokenPayload
      vi.mocked(l_oTokenManager.verifyRefreshToken).mockResolvedValue({
        jti: 'session_id_valide',
        exp: 1782739200,
        sub: ACTOR_ID
      } as any);

      await l_oAuthService.logout('refresh_token_brut_deconnexion');

      expect(l_oBlacklistService.add).toHaveBeenCalledWith('session_id_valide', 1782739200);
    });
  });
});
