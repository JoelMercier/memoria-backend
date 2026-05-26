// ——— fichier : src/validation/zod/UserValidation.ts

import { z } from 'zod';

/**
 * 📧 Schéma de validation pour l'adresse e-mail utilisateur.
 */
const emailSchema = z.string().trim().toLowerCase().email('Email invalide').max(255);

/**
 * 🔑 Schéma de validation strict pour la robustesse des mots de passe système.
 */
const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit faire au moins 8 caractères')
  .max(128, 'Le mot de passe est trop long')
  .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Doit contenir au moins un chiffre');

/**
 * 👤 Schéma de validation pour le pseudonyme public.
 */
const pseudoSchema = z
  .string()
  .trim()
  .min(3, 'Pseudo trop court (3 caractères min)')
  .max(30, 'Pseudo trop long (30 caractères max)')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Caractères autorisés : lettres, chiffres, _ et -');

/**
 * 👥 Schéma de validation Zod pour l'inscription d'un nouvel utilisateur (RGPD inclus).
 */
const createUserSchema = z.object({
  email       : emailSchema,
  password    : passwordSchema,
  pseudo      : pseudoSchema,
  gdprConsent : z.boolean().refine((v): v is true => v === true, {
    message: 'Le consentement RGPD est obligatoire'
  })
});

/**
 * 👥 Schéma de validation Zod pour la modification globale (Administration).
 */
const updateUserSchema = z.object({
  email        : emailSchema.optional(),
  password     : passwordSchema.optional(),
  pseudo       : pseudoSchema.optional(),
  settingsUser : z.record(z.string(), z.unknown()).optional()
});

/**
 * 👥 Schéma de validation Zod pour la destitution administrative d'un compte.
 */
const deleteUserSchema = z.object({
  password : z.string().min(1, 'Le mot de passe est requis')
});

/**
 * 👥 Schéma de validation Zod pour la mise à jour autonome du profil.
 */
const updateProfileSchema = z.object({
  pseudo       : z.string().trim().min(3).max(30).optional(),
  email        : z.string().email().max(255).optional(),
  settingsUser : z.record(z.string(), z.unknown()).optional()
});

/**
 * 🔑 Schéma de validation Zod pour le renouvellement sécurisé du mot de passe.
 */
const changePasswordSchema = z.object({
  currentPassword : z.string().min(1, 'Mot de passe actuel requis'),
  newPassword     : z
    .string()
    .min(8, '8 caractères minimum')
    .max(72)
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[a-z]/, 'Une minuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis')
});

/**
 * 🚪 Schéma de validation Zod pour la clôture définitive et légale du compte (RGPD).
 */
const deleteAccountSchema = z.object({
  password : z.string().min(1, 'Mot de passe requis pour confirmer la suppression')
});

/** 📋 Types inférés extraits des schémas d'accès et d'évolution du profil */
export type UpdateProfileSchemaType  = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type DeleteAccountSchemaType  = z.infer<typeof deleteAccountSchema>;
export type CreateUserSchemaType     = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaType     = z.infer<typeof updateUserSchema>;
export type DeleteUserSchemaType     = z.infer<typeof deleteUserSchema>;

/**
 * 🏛️ Classe UserValidation
 * -------------------------
 * Portier de sécurité gérant la validation stricte des payloads du domaine Utilisateur.
 * Applique la politique de complexité des mots de passe et sécurise le consentement RGPD.
 *
 * @class UserValidation
 */
export class UserValidation {

  /**
   * 🎯 Valide le payload d'inscription d'un utilisateur.
   *
   * @static
   * @param {unknown} data - Les données brutes de la requête HTTP
   * @returns {CreateUserSchemaType} Le DTO validé
   */
  public static validateCreate(data: unknown): CreateUserSchemaType {
    return createUserSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de modification administrative d'un utilisateur.
   *
   * @static
   * @param {unknown} data - Les données brutes de la requête HTTP
   * @returns {UpdateUserSchemaType} Le DTO validé
   */
  public static validateUpdate(data: unknown): UpdateUserSchemaType {
    return updateUserSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de suppression administrative d'un utilisateur.
   *
   * @static
   * @param {unknown} data - Les données brutes de la requête HTTP
   * @returns {DeleteUserSchemaType} Le DTO validé
   */
  public static validateDelete(data: unknown): DeleteUserSchemaType {
    return deleteUserSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de mise à jour autonome de profil.
   *
   * @static
   * @param {unknown} data - Les données brutes de la requête HTTP
   * @returns {UpdateProfileSchemaType} Le DTO de profil validé
   */
  public static validateUpdateProfile(data: unknown): UpdateProfileSchemaType {
    return updateProfileSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de changement de mot de passe.
   *
   * @static
   * @param {unknown} data - Les données brutes de la requête HTTP
   * @returns {ChangePasswordSchemaType} Le DTO de changement de mot de passe validé
   */
  public static validateChangePassword(data: unknown): ChangePasswordSchemaType {
    return changePasswordSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de clôture définitive de compte.
   *
   * @static
   * @param {unknown} data - Les données brutes de la requête HTTP
   * @returns {DeleteAccountSchemaType} Le DTO de clôture validé
   */
  public static validateDeleteAccount(data: unknown): DeleteAccountSchemaType {
    return deleteAccountSchema.parse(data);
  }
}
