// ——— fichier : src/dto/share/CreateShareDto.ts

import      { ItemId, ShareId, UserId         } from '@/domain/value-objects/IdMetier';
import type { IAccessConfig  } from '@/interfaces/entities/share/IAccessConfig';
import { type CreateShareSchemaType,
         ShareValidation     } from '@/validation/zod/ShareValidation';

/**
 * 📦 Classe CreateShareDto
 * -------------------------
 * Objet de transfert de données pour la création d'un lien de partage sécurisé.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 * Armé avec le caillou de couleur (Value Object) pour verrouiller la pépite ciblée.
 *
 * @class CreateShareDto
 * @author Joël, Gaïa & Co
 */
export class CreateShareDto {

  /** 📦 Caillou de couleur : Identifiant unique immuable de la pépite à partager */
  public readonly idItem : ItemId;

  public readonly idShare : ShareId;

  public readonly idUser : UserId;

  /** 📧 Adresse électronique optionnelle du destinataire du partage */
  public readonly recipientEmail : string | null;

  /** ⚙️ Configuration d'infrastructure des restrictions d'accès (Expiration, etc.) */
  public readonly accessConfig : IAccessConfig;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   * Effectue le scellage nominal immédiat de la pépite associée.
   *
   * @constructor
   * @param {unknown} data - Payload brut d'infrastructure issu de la requête
   */
  public constructor(data: unknown) {
    const validated : CreateShareSchemaType = ShareValidation.validateCreate(data);

    // Passage sécurisé de la frontière : conversion directe vers le type nominal fort
    this.idItem         = new ItemId(validated.itemId);
    this.idUser         = new UserId(validated.userId);
    this.idShare        = new ShareId(validated.shareId)
    this.recipientEmail = validated.recipientEmail ?? null;
    this.accessConfig   = new (validated.accessConfig.expiresAt, validated.allow_download)

  }

}
