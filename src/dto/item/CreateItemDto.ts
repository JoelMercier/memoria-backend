// ——— fichier : src/dto/item/CreateItemDto.ts

import { TagId               } from '@/domain/value-objects/ids';
import { type CreateItemSchemaType,
         ItemValidation       } from '@/validation/zod/ItemValidation';

/**
 * 📦 Classe CreateItemDto (Version Pure Hexagonale)
 * ---------------------------------------------------
 * Objet de transfert de données pour la création d'une pépite (Item).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 * Armé avec les cailloux de couleur (Value Objects) pour la sécurité nominale.
 *
 * Version: 4.2.1 (Alignement Franconien & Purge Anglo-Saxonne) [1.1]
 *
 * @class CreateItemDto
 * @author Joël, Gaïa & Co
 */
export class CreateItemDto {

  /** 🔌 [RÉPARÉ V4] Quadrigramme physique fixe de soute remplace le SmartEnum brut (Char(4)) [1.1] */
  public readonly contentTypeId : string;

  /** 💎 [RÉPARÉ V4] Libellé principal nominal de la pépite (Adieu 'title') [1.1] */
  public readonly libelle       : string;

  /** 🛤️ Permalien normalisé (Slug) optionnel */
  public readonly slug?         : string;

  /** 📄 Corps du texte ou payload brut de la pépite */
  public readonly content       : string;

  /** 💎 [RÉPARÉ V4] Origine ou auteur original de la collecte (Adieu 'sourceAuthor') [1.1] */
  public readonly auteurSource  : string;

  /** 🖼️ URL optionnelle de la miniature d'illustration */
  public readonly thumbnailUrl? : string | null;

  /** 🎛️ Métadonnées d'infrastructure dynamiques */
  public readonly metadata      : Record<string, unknown>;

  /** 🏷️ Collection optionnelle de cailloux de couleur (Tags rattachés) */
  public readonly tagIds?       : TagId[];

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   * Effectue le scellage nominal immédiat vers nos Value Objects.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const l_oRawBody : Record<string, unknown> = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const validated  : CreateItemSchemaType = ItemValidation.validateCreate(l_oRawBody);

    // 🛡️ Réalignement chirurgical sur le métal franconien renvoyé par le validateur Zod [1.1]
    this.contentTypeId = validated.contentTypeId; // 🔌 Alignement direct sur la clé fixe.
    this.libelle       = validated.libelle;       // 💎 Substitution définitive de title [1.1].
    this.slug          = validated.slug;
    this.content       = validated.content;
    this.auteurSource  = validated.auteurSource;  // 💎 Substitution définitive de sourceAuthor [1.1].
    this.thumbnailUrl  = validated.thumbnailUrl;
    this.metadata      = validated.metadata;

    // Scellage nominal de la collection d'identifiants de tags
    this.tagIds        = validated.tagIds
      ? validated.tagIds.map((id: string) => new TagId(id))
      : undefined;
  }

}
