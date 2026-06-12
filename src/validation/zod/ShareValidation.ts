// ——— fichier : src/validation/zod/ShareValidation.ts

import { z } from 'zod';

/**
 * 📧 Schéma de validation pour l'adresse e-mail du destinataire.
 */
const recipientEmailSchema = z.string().email().max(255).nullable().optional();

/**
 * ⏱️ Schéma de validation pour l'horodatage d'expiration du lien.
 */
const expiresAtSchema = z
  .string()
  .datetime({ message: 'expiresAt doit être au format ISO 8601' })
  .optional();

/**
 * ⚙️ Schéma d'encapsulation pour la configuration fine des accès.
 * [DÉBRIDE V4] Ajout de .passthrough() pour ingurgiter les propriétés de niveau d'accès et téléchargement.
 */
const accessConfigSchema = z
  .object({
    expiresAt: expiresAtSchema
  })
  .passthrough()
  .default({});

/**
 * 🆔 Schéma de l'identifiant technique de la Pépite (Value Object au format de transport).
 */
const itemIdSchema = z.string().trim().min(1, "L'identifiant de la pépite (itemId) est requis");

const shareIdSchema = z.string().trim().min(1, "L'identifiant du partage (shareId) est requis");

const userIdSchema = z.string().trim().min(1, "L'identifiant de l'utilisateur (userId) est requis");

/**
 * 🔗 Schéma de validation Zod pour la création d'un Partage (Share).
 */
const createShareSchema = z.object({
  itemId: itemIdSchema,
  userId: userIdSchema,
  shareId: shareIdSchema,
  itemOwnerId: z.string().trim().optional(),
  recipientEmail: recipientEmailSchema,
  accessConfig: accessConfigSchema
});

/**
 * 🔗 Schéma de validation Zod pour la mise à jour d'un Partage (Share).
 */
const updateShareSchema = z.object({
  recipientEmail: recipientEmailSchema,
  accessConfig: accessConfigSchema.optional()
});

/** 📋 Type inféré extrait du schéma de création de Partage */
export type CreateShareSchemaType = z.infer<typeof createShareSchema>;

/** 📋 Type inféré extrait du schéma de mise à jour de Partage */
export type UpdateShareSchemaType = z.infer<typeof updateShareSchema>;

/**
 * 🏛️ Classe ShareValidation
 * --------------------------
 * Portier de sécurité gérant la validation stricte des payloads de Partages (Shares).
 * Sécurise les liaisons de pépites et valide le format ISO des expirations temporelles.
 *
 * @class ShareValidation
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class ShareValidation {
  /**
   * 🎯 Valide le payload de création d'un lien de partage.
   *
   * @static
   * @param {Record<string, unknown>} data - Les données brutes de la soute
   * @returns {CreateShareSchemaType} Le DTO de partage validé
   */
  public static validateCreate(data: Record<string, unknown>): CreateShareSchemaType {
    return createShareSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de mise à jour d'un lien de partage.
   *
   * @static
   * @param {Record<string, unknown>} data - Les données brutes de la soute
   * @returns {UpdateShareSchemaType} Le DTO de partage validé
   */
  public static validateUpdate(data: Record<string, unknown>): UpdateShareSchemaType {
    return updateShareSchema.parse(data);
  }

  /**
   * 🎯 Valide et nettoie un jeton de partage brut extrait de l'URL Express.
   *
   * @static
   * @param {unknown} token - Le paramètre brut issu de req.params.token
   * @throws {ZodError} Si le token est absent, vide ou structurellement invalide
   * @returns {string} Le token purifié et nettoyé
   */
  public static validateToken(token: unknown): string {
    return z.string().trim().min(1, 'Token de partage manquant ou invalide').parse(token);
  }
}
