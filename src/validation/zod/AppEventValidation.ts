// ——— fichier : src/validation/zod/AppEventValidation.ts

import { z }                from 'zod';
import { AppEventCategory } from '@/constants/AppEventCategory';
import { AppEventSeverity } from '@/constants/AppEventSeverity';
import { AppEventContext }  from '@/constants/AppEventSecteur'; // [NEW V4]
import { AppEventAction }   from '@/constants/AppEventAction';  // [NEW V4]

/**
 * 🗂️ Schémas de validation Zod pour les codes des Smart Enums d'audit.
 * Exploitent la validation statique .refine() héritée du socle SmartEnum.
 * Pas de .transform() aventureux si l'instance de classe n'expose pas de méthode d'usine.
 */
const eventCategorySchema = z.string().trim().refine(
  (val) => AppEventCategory.isValidCode(val),
  { message: 'Catégorie d\'événement d\'audit invalide' }
);

const severitySchema = z.string().trim().nullable().refine(
  (val) => val === null || AppEventSeverity.isValidCode(val),
  { message: 'Niveau de gravité d\'audit invalide' }
);

/** [NEW V4] Contexte fonctionnel éclaté - Reçoit et valide le quadrigramme fixe (ex: 'SYST') */
const eventContextSchema = z.string().trim().refine(
  (val) => AppEventContext.isValidCode(val),
  { message: 'Contexte fonctionnel d\'audit invalide' }
);

/** [NEW V4] Action technique éclatée - Reçoit et valide le quadrigramme fixe (ex: 'DEMA') */
const eventActionSchema = z.string().trim().refine(
  (val) => AppEventAction.isValidCode(val),
  { message: 'Opération technique d\'audit invalide' }
);

/**
 * 🆔 Schémas des identifiants techniques (Value Objects au format de transport).
 */
const idEventSchema       = z.string().trim().min(1, 'Identifiant d\'événement requis');
const userIdSchema        = z.string().trim().nullable().optional();

/**
 * 🎯 Schémas pour les champs textuels et contextuels de l'audit.
 */
const messageSchema       = z.string().trim().max(1024).nullable();
const metadataSchema      = z.record(z.string(), z.any()).default({});

/**
 * 🔔 Schéma de validation Zod pour la création d'un événement d'audit.
 */
const createAppEventSchema = z.object({
  idAppEvent    : idEventSchema,
  userId        : userIdSchema,
  eventCategory : eventCategorySchema,
  eventContext  : eventContextSchema, // [REARMÉ V4]
  eventAction   : eventActionSchema,  // [REARMÉ V4]
  severity      : severitySchema,
  message       : messageSchema,
  metadata      : metadataSchema
});

/**
 * 🔔 Schéma de validation Zod pour la mise à jour d'un événement d'audit.
 */
const updateAppEventSchema = z.object({
  idAppEvent    : idEventSchema,
  userId        : userIdSchema,
  eventCategory : eventCategorySchema,
  eventContext  : eventContextSchema, // [REARMÉ V4]
  eventAction   : eventActionSchema,  // [REARMÉ V4]
  severity      : severitySchema,
  message       : messageSchema,
  metadata      : metadataSchema
});

export type CreateAppEventSchemaType = z.infer<typeof createAppEventSchema>;
export type UpdateAppEventSchemaType = z.infer<typeof updateAppEventSchema>;

/**
 * 🏛️ Classe AppEventValidation
 * ----------------------------
 * Portier de sécurité gérant la validation stricte des payloads d'événements d'audit.
 *
 * @class AppEventValidation
 * @author Joël, Gaïa & Co
 */
export class AppEventValidation {

  /**
   * 🎯 Valide le payload de création d'un log d'audit.
   *
   * @static
   * @function validateCreate
   * @param {unknown} data - Les données brutes de l'infrastructure
   * @returns {CreateAppEventSchemaType} Le payload d'événement validé
   */
  public static validateCreate(data: unknown): CreateAppEventSchemaType {
    return createAppEventSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de mise à jour d'un log d'audit.
   *
   * @static
   * @function validateUpdate
   * @param {unknown} data - Les données brutes de l'infrastructure
   * @returns {UpdateAppEventSchemaType} Le payload d'événement validé
   */
  public static validateUpdate(data: unknown): UpdateAppEventSchemaType {
    return updateAppEventSchema.parse(data);
  }
}
