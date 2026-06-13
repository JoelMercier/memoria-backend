// ——— fichier : src/validation/zod/AuthValidation.ts

import { z } from 'zod';

/**
 * 🔑 Schéma de validation Zod pour la connexion (Login).
 */
const loginSchema = z.object({
  courriel: z.string().trim().toLowerCase().email('Courriel invalide'),
  password: z.string().trim().min(1, 'Mot de passe requis')
});

/**
 * 🔄 Schéma de validation Zod pour le renouvellement de jeton (Refresh Token).
 * [RÉPARÉ V4] Ajout du .trim() obligatoire pour interdire l'injection de jetons vides ou blancs.
 */
const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, 'Refresh token requis')
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
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class AuthValidation {
  /**
   * 🎯 Valide le payload de connexion par rapport au schéma strict.
   *
   * @static
   * @param {Record<string, unknown>} data - Les données brutes de la soute
   * @returns {LoginSchemaType} Le DTO validé et nettoyé
   */
  public static validateLogin(data: Record<string, unknown>): LoginSchemaType {
    return loginSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de rafraîchissement par rapport au schéma strict.
   *
   * @static
   * @param {Record<string, unknown>} data - Les données brutes de la soute
   * @returns {RefreshTokenSchemaType} Le DTO de rafraîchissement validé
   */
  public static validateRefreshToken(data: Record<string, unknown>): RefreshTokenSchemaType {
    return refreshTokenSchema.parse(data);
  }
}
