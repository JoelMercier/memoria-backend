// ——— fichier : src/zod/AuthValidation.ts

import { z } from 'zod';

/**
 * 🔑 Schéma de validation Zod pour la connexion (Login).
 */
const loginSchema = z.object({
  email    : z.string().trim().toLowerCase().email('Email invalide'),
  password : z.string().min(1, 'Mot de passe requis')
});

/**
 * 🔄 Schéma de validation Zod pour le renouvellement de jeton (Refresh Token).
 */
const refreshTokenSchema = z.object({
  refreshToken : z.string().min(1, 'Refresh token requis')
});

/** 📋 Type inféré extrait du schéma de connexion */
export type LoginSchemaType = z.infer<typeof loginSchema>;

/** 📋 Type inféré extrait du schéma de rafraîchissement */
export type RefreshTokenSchemaType = z.infer<typeof refreshTokenSchema>;

/**
 * 🏛️ Classe AuthValidation
 * -------------------------
 * Portier de sécurité gérant la validation stricte des payloads d'authentification.
 * Filtre et valide les flux de données brutes avant l'aiguillage vers les services.
 *
 * @class AuthValidation
 */
export class AuthValidation {

  /**
   * 🎯 Valide le payload de connexion par rapport au schéma strict.
   *
   * @static
   * @param {unknown} data - Les données brutes issues de la requête HTTP
   * @returns {LoginSchemaType} Le DTO validé et nettoyé
   */
  public static validateLogin(data: unknown): LoginSchemaType {
    return loginSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de rafraîchissement par rapport au schéma strict.
   *
   * @static
   * @param {unknown} data - Les données brutes issues de la requête HTTP
   * @returns {RefreshTokenSchemaType} Le DTO de rafraîchissement validé
   */
  public static validateRefreshToken(data: unknown): RefreshTokenSchemaType {
    return refreshTokenSchema.parse(data);
  }
}
