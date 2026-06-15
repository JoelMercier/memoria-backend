// ——— fichier : src/validation/zod/AppEventValidation.ts

import { z } from 'zod';
import { Categorie } from '@/constants/Categories';
import { Severite  } from '@/constants/Severites';
import { Secteur   } from '@/constants/Secteurs';
import { Action    } from '@/constants/Actions';

/**
 * 🗂️ Schémas de validation Zod pour les codes des Smart Enums d'audit.
 * Exploitent la validation statique .refine() héritée du socle SmartEnum.
 * Pas de .transform() aventureux si l'instance de classe n'expose pas de méthode d'usine.
 */
const eventCategorieSchema = z
  .string()
  .trim()
  .refine((val) => Categorie.isValidCode(val), {
    message: "Catégorie d'événement d'audit invalide"
  });

/** [RÉPARÉ V4] Passé en optional() pour permettre le repli industriel vers 'INFO' dans le DTO */
const eventSeveriteSchema = z
  .string()
  .trim()
  .refine((val) => Severite.isValidCode(val), {
    message: "Niveau de gravité d'audit invalide"
  })
  .optional();

/** [ALIGNE V4] Secteur technique éclatet - Reçoit et valide le quadrigramme fixe (ex: 'SYST') */
const eventSecteurSchema = z
  .string()
  .trim()
  .refine((val) => Secteur.isValidCode(val), {
    message: "Secteur fonctionnel d'audit invalide"
  });

/** [ALIGNE V4] Action technique éclatée - Reçoit et valide le quadrigramme fixe (ex: 'DEMA') */
const eventActionSchema = z
  .string()
  .trim()
  .refine((val) => Action.isValidCode(val), {
    message: "Opération technique d'audit invalide"
  });

/**
 * 🆔 Schémas des identifiants techniques (Value Objects au format de transport).
 */
const idEventSchema = z.string().trim().min(1, "Identifiant d'événement requis");
const userIdSchema = z.string().trim().nullable().optional();

/**
 * 🎯 Schémas pour les champs textuels et contextuels de l'audit.
 * messageSchema passe en Not Null strict et type varchar(255) sans limite.
 */
const messageSchema = z
  .string()
  .trim()
  .min(1, "Le message d'audit ne peut pas être vide")
  .max(255, 'Le message trop long (255 caractères max)');
const metadataSchema = z.record(z.string(), z.any()).default({});

/**
 * 🔔 Schéma de validation Zod pour la création d'un événement d'audit.
 */
const createAppEventSchema = z.object({
  idAppEvent     : idEventSchema,
  userId         : userIdSchema,
  eventCategorie : eventCategorieSchema,
  eventSecteur   : eventSecteurSchema,
  eventAction    : eventActionSchema,
  eventSeverite  : eventSeveriteSchema,
  message        : messageSchema,
  metadata       : metadataSchema
});

/**
 * 🔔 Schéma de validation Zod pour la mise à jour d'un événement d'audit.
 */
const updateAppEventSchema = z.object({
  idAppEvent     : idEventSchema,
  userId         : userIdSchema,
  eventCategorie : eventCategorieSchema,
  eventSecteur   : eventSecteurSchema,
  eventAction    : eventActionSchema,
  eventSeverite  : eventSeveriteSchema,
  message        : messageSchema,
  metadata       : metadataSchema
});

export type CreateAppEventSchemaType = z.infer<typeof createAppEventSchema>;
export type UpdateAppEventSchemaType = z.infer<typeof updateAppEventSchema>;

/**
 * 🏛️ Classe AppEventValidation
 * ----------------------------
 * Portier de sécurité gérant la validation stricte des payloads d'événements d'audit.
 *
 * @class AppEventValidation
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class AppEventValidation {
  /**
   * 🎯 Valide le payload de création d'un log d'audit.
   *
   * @static
   * @function validateCreate
   * @param {Record<string, unknown>} data - Les données brutes de l'infrastructure
   * @returns {CreateAppEventSchemaType} Le payload d'événement validé
   */
  public static validateCreate(data: Record<string, unknown>): CreateAppEventSchemaType {
    return createAppEventSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de mise à jour d'un log d'audit.
   *
   * @static
   * @function validateUpdate
   * @param {Record<string, unknown>} data - Les données brutes de l'infrastructure
   * @returns {UpdateAppEventSchemaType} Le payload d'événement validé
   */
  public static validateUpdate(data: Record<string, unknown>): UpdateAppEventSchemaType {
    return updateAppEventSchema.parse(data);
  }
}
