// ——— fichier : src/validation/zod/TagValidation.ts

import { z } from 'zod';

/**
 * 🏷️ Schéma de validation pour le nom textuel du mot-clé (Tag).
 */
const tagNameSchema = z
  .string()
  .trim()
  .min(1, 'Le nom du tag est requis')
  .max(50, 'Le nom du tag est trop long (50 caractères max)');

/**
 * 🏷️ Schéma de validation Zod pour la création d'un Tag.
 */
const createTagSchema = z.object({ tagName: tagNameSchema });

/**
 * 🏷️ Schéma de validation Zod pour la mise à jour d'un Tag.
 */
const updateTagSchema = z.object({ tagName: tagNameSchema });

/** 📋 Type inféré extrait du schéma de création de Tag */
export type CreateTagSchemaType = z.infer<typeof createTagSchema>;

/** 📋 Type inféré extrait du schéma de mise à jour de Tag */
export type UpdateTagSchemaType = z.infer<typeof updateTagSchema>;

/**
 * 🏛️ Classe TagValidation
 * -------------------------
 * Portier de sécurité gérant la validation stricte des payloads des Mots-clés (Tags).
 * Valide les longueurs de chaînes et nettoie les entrées utilisateur avant persistance.
 *
 * @class TagValidation
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class TagValidation {
  /**
   * 🎯 Valide le payload de création d'un Tag.
   *
   * @static
   * @param {Record<string, unknown>} data - Les données brutes de la soute
   * @returns {CreateTagSchemaType} Le DTO de tag validé
   */
  public static validateCreate(data: Record<string, unknown>): CreateTagSchemaType {
    return createTagSchema.parse(data);
  }

  /**
   * 🎯 Valide le payload de mise à jour d'un Tag.
   *
   * @static
   * @param {Record<string, unknown>} data - Les données brutes de la soute
   * @returns {UpdateTagSchemaType} Le DTO de tag validé
   */
  public static validateUpdate(data: Record<string, unknown>): UpdateTagSchemaType {
    return updateTagSchema.parse(data);
  }
}
