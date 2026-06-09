// ——— fichier : src/dto/share/CreateShareDto.ts

import      { ItemId, ShareId, UserId                     } from '@/domain/value-objects/ids';
import type { IAccessConfig                               } from '@/interfaces/entities/share/IAccessConfig';
import      { type CreateShareSchemaType, ShareValidation } from '@/validation/zod/ShareValidation';

/**
 * 📦 Classe CreateShareDto 🧮 (L'Aiguilleur du Payload des Passerelles 🤖)
 * ----------------------------------------------------------------------------
 * Objet de transfert de données pour la création d'un lien de partage sécurisé.
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 * Armé avec le caillou de couleur (Value Object) pour verrouiller la pépite ciblée.
 *
 * @class CreateShareDto
 * @author Vision : Joël (Architecte DR-DOS)
 * @author Frapperie du code : Gaïa (Gardienne du feu binaire)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export class CreateShareDto {
  /** 📦 Caillou de couleur : Identifiant unique immuable de la pépite à partager */
  public readonly idItem : ItemId;

  /** 🤖 Identifiant unique et fortement typé de la trace du partage */
  public readonly idShare : ShareId;

  /** 👥 Identifiant de l'acteur émetteur du partage à la frontière */
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
   * @param {unknown} p_vData - Payload brut d'infrastructure issu de la requête
   */
  public constructor(p_vData: unknown) {
    const l_oValidated: CreateShareSchemaType = ShareValidation.validateCreate(p_vData);

    // Passage sécurisé de la frontière : conversion directe vers le type nominal fort
    this.idItem         = new ItemId(l_oValidated.itemId);
    this.idUser         = new UserId(l_oValidated.userId);
    this.idShare        = new ShareId(l_oValidated.shareId);
    this.recipientEmail = l_oValidated.recipientEmail ?? null;

    // Reconstruction d'acier du littéral d'objet calé sur IAccessConfig
    this.accessConfig   = {
      level          : (l_oValidated.accessConfig as any).level ?? 'read',
      allow_download : (l_oValidated.accessConfig as any).allow_download ?? false,
      expiresAt      : l_oValidated.accessConfig.expiresAt
    };
  }
}
