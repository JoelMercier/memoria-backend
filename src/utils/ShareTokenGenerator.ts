// ——— fichier : src/utils/ShareTokenGenerator.ts

import { randomBytes } from 'node:crypto';

/**
 * 🏛️ Classe ShareTokenGenerator
 * -----------------------------
 * Générateur de jetons d'accès cryptographiques hautement sécurisés et URL-safe.
 * Forge les signatures d'invitations anonymes intégrables directement dans les routes HTTP.
 *
 * SOLID :
 *  - SRP : Unique responsabilité d'allouer de l'entropie binaire et de la sérialiser textuellement.
 *
 * @class ShareTokenGenerator
 * @author Joël, Gaïa & Co
 */
export class ShareTokenGenerator {

  /**
   * 🏭 Fabrique statique : Génère un token cryptographique d'environ 32 caractères (≈192 bits d'entropie).
   * Exploite l'encodage 'base64url' (sans padding, expurgé des caractères perturbateurs « + » et « / »).
   *
   * @public
   * @static
   * @function generate
   * @returns {string} Un jeton de sécurité textuel fluide et directement intégrable dans une URL.
   */
  public static generate(): string {
    return randomBytes(24).toString('base64url');
  }
}
