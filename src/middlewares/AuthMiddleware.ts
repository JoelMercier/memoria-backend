// ——— fichier : src\middlewares\AuthMiddleware.ts

import type { NextFunction, Request, Response } from 'express';
import { TokenError } from '@/exceptions/TokenError';
import type { IBlacklistService } from '@/interfaces/security/IBlacklistService';
import type { ITokenManager } from '@/interfaces/security/ITokenManager';

/**
 * 🏛️ Classe AuthMiddleware
 * -------------------------
 * Intercepteur d'infrastructure sécurisant les frontières d'exposition HTTP.
 * Extrait, décode et valide la signature cryptographique du jeton Bearer JWT.
 * Injecte l'identité nominale forte de l'acteur (UserId) dans le contexte Express.
 *
 * @class AuthMiddleware
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class AuthMiddleware {

  public constructor(
    private readonly tokenManager: ITokenManager,
    private readonly blacklistService: IBlacklistService
  ) {}

  public requireAuth() {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        const authHeader : string | undefined = req.header('authorization');

        if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
          throw TokenError.missing();
        }

        const token : string = authHeader.slice('bearer '.length).trim();

        // 🪓 L'ALIGNEMENT DU COMMANDO : On récupère la charge utile pré-typée
        const chargeUtile = await this.tokenManager.verifyAccessToken(token);

        if (chargeUtile.jti && this.blacklistService.isBlacklisted(chargeUtile.jti)) {
          throw TokenError.revoked();
        }

        if (!chargeUtile.role) {
          throw TokenError.invalid('Rôle applicatif inconnu ou absent du jeton.');
        }

        // 🪓 PLUS AUCUN CONSTRUCTEUR DOUBLONNÉ : Tout arrive déjà armé du TokenManager !
        // On transfère directement les structures vivantes issues de la charge utile.
        // Le cast 'as any' global pacifie définitivement le cache récalcitrant d'Express.
        const sessionActeur = {
          id     : chargeUtile.sub,
          email  : chargeUtile.email,
          pseudo : chargeUtile.pseudo,
          role   : chargeUtile.role
        };

        req.user = sessionActeur as any;

        next();
      } catch (err) {
        next(err);
      }
    };
  }
}
