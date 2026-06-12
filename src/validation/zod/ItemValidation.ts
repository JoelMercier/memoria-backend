// ——— fichier : src/validation/zod/ItemValidation.ts

import { z } from 'zod';
import { ContentType } from '@/constants/ContentType';

/**
 * 🏷️ Schéma de validation Zod pour le code du Smart Enum ContentType.
 * Utilise la configuration 'message' native attendue par la surcharge de z.enum.
 */
const contentTypeSchema = z.enum(ContentType.codes(), {
  message: 'Type de contenu (ContentType) invalide'
});

/**
 * ✏️ Schémas de validation pour les champs textuels principaux de la Pépite.
 */
const titleSchema = z.string().trim().min(1, 'Le titre est requis').max(255);
const contentSchema = z.string().min(1, 'Le contenu est requis');
const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9-]+$/, 'Le slug doit être en minuscules, chiffres et tirets uniquement');

/**
 * ✍️ Schémas pour les métadonnées de provenance, de couverture et d'extension.
 */
const sourceAuthorSchema = z.string().trim().max(50).default('N.C');
const thumbnailUrlSchema = z.string().url().max(255).nullable().optional();
const metadataSchema = z.record(z.string(), z.unknown()).default({});

/**
 * 🆔 Schéma pour la liste des identifiants de tags associés (Value Objects au format texte).
 */
const tagIdsSchema = z.array(z.string().trim().min(1, 'Identifiant de tag invalide')).optional();

/**
 * 📦 Schéma de validation Zod pour la création d'une Pépite (Item).
 */
const createItemSchema = z.object({
  contentType: contentTypeSchema,
  title: titleSchema,
  slug: slugSchema.optional(),
  content: contentSchema,
  sourceAuthor: sourceAuthorSchema,
  thumbnailUrl: thumbnailUrlSchema,
  metadata: metadataSchema,
  tagIds: tagIdsSchema
});

/**
 * 📦 Schéma de validation Zod pour la mise à jour d'une Pépite (Item).
 */
const updateItemSchema = z.object({
  contentType: contentTypeSchema.optional(),
  title: titleSchema.optional(),
  slug: slugSchema.optional(),
  content: contentSchema.optional(),
  sourceAuthor: sourceAuthorSchema.optional(),
  thumbnailUrl: thumbnailUrlSchema,
  metadata: metadataSchema.optional(),
  tagIds: tagIdsSchema
});

/** 📋 Type inféré extrait du schéma de création d'Item */
export type CreateItemSchemaType = z.infer<typeof createItemSchema>;

/** 📋 Type inféré extrait du schéma de mise à jour d'Item */
export type UpdateItemSchemaType = z.infer<typeof updateItemSchema>;

/**
 * 🏛️ Classe ItemValidation
 * -------------------------
 * Portier de sécurité gérant la validation stricte des payloads des Mots-clés (Tags).
 *
 * @class ItemValidation
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class ItemValidation {
  /**
   * 🎯 Valide le payload de création d'une Pépite.
   *
   * @static
   * @function validateCreate
   * @param {Record<string, unknown>} data - Les données brutes de la soute
   * @returns {CreateItemSchemaType} Le DTO d'item validé
   */
  public static validateCreate(data: Record<string, unknown>): CreateItemSchemaType {
    return createItemSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de mise à jour d'une Pépite.
   *
   * @static
   * @function validateUpdate
   * @param {Record<string, unknown>} data - Les données brutes de la soute
   * @returns {UpdateItemSchemaType} Le DTO d'item validé
   */
  public static validateUpdate(data: Record<string, unknown>): UpdateItemSchemaType {
    return updateItemSchema.parse(data);
  }
}
