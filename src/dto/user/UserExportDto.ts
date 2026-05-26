// ——— fichier : src/dto/user/UserExportDto.ts

import type { IAccessConfig } from '@/interfaces/entities/share/IAccessConfig';
import type { IItem         } from '@/interfaces/entities/item/IItem';
import type { IShare        } from '@/interfaces/entities/share/IShare';
import type { ITag          } from '@/interfaces/entities/tag/ITag';
import type { IUser         } from '@/interfaces/entities/user/IUser';

/** 📦 Structure plate d'exportation pour une étiquette (Tag) */
interface IExportedTag {
  id        : string;
  tagName   : string;
  createdAt : Date | undefined;
  updatedAt : Date | undefined;
}

/** 📦 Structure plate d'exportation pour une pépite (Item) rattachée */
interface IExportedItem {
  id           : string;
  contentType  : string;
  title        : string;
  slug         : string;
  content      : string;
  sourceAuthor : string;
  thumbnailUrl : string | null | undefined;
  metadata     : Record<string, unknown>;
  createdAt    : Date | undefined;
  updatedAt    : Date | undefined;
  tags         : IExportedTag[];
}

/** 📦 Structure plate d'exportation pour un lien de partage (Share) */
interface IExportedShare {
  id             : string;
  itemId         : string;
  recipientEmail : string | null;
  shareToken     : string;
  accessConfig   : IAccessConfig;
  createdAt      : Date | undefined;
  updatedAt      : Date | undefined;
}

/** 📦 Structure plate d'exportation pour le profil utilisateur racine */
interface IExportedUser {
  id              : string;
  email           : string;
  pseudo          : string;
  role            : string;
  authProvider    : string;
  settingsUser    : Record<string, unknown>;
  gdprConsent     : boolean;
  gdprConsentDate : Date | null | undefined;
  createdAt       : Date | undefined;
  updatedAt       : Date | undefined;
}

/** 📦 Structure d'infrastructure liant une pépite à ses étiquettes */
export interface IItemWithTags {
  item : IItem;
  tags : ITag[];
}

/**
 * 📦 Classe UserExportDto
 * ------------------------
 * Objet de transfert de données pour l'extraction complète RGPD (Article 20).
 * Aplatit et purge les entités complexes riches pour générer un JSON de transport pur.
 *
 * @class UserExportDto
 * @author Joël, Gaïa & Co
 */
export class UserExportDto {

  /** 📅 Horodatage d'extraction et de génération du pack de données */
  public readonly exportDate : string;

  /** 👥 Bloc de données plat représentant l'identité de l'utilisateur */
  public readonly user : IExportedUser;

  /** 📦 Collection des pépites détenues par l'utilisateur */
  public readonly items : IExportedItem[];

  /** 🏷️ Collection exhaustive des étiquettes créées par l'utilisateur */
  public readonly tags : IExportedTag[];

  /** 🔗 Collection des liens de partages configurés par l'utilisateur */
  public readonly shares : IExportedShare[];

  /**
   * Construit le payload d'export en nettoyant méticuleusement les entités.
   * Chasse les peaux de bananes de fonctions et s'aligne sur les vrais accesseurs.
   *
   * @private
   * @constructor
   * @param {IUser} user - Entité de l'utilisateur demandeur
   * @param {IItemWithTags[]} itemsWithTags - Collection des pépites et de leurs étiquettes rattachées
   * @param {ITag[]} tags - Collection de toutes les étiquettes de l'utilisateur
   * @param {IShare[]} shares - Collection de tous les partages actifs ou expirés
   */
  private constructor(user: IUser, itemsWithTags: IItemWithTags[], tags: ITag[], shares: IShare[]) {
    this.exportDate = new Date().toISOString();

    // 🪓 Correction chirurgicale : IAppUser/IUser n'exposent que des propriétés de données directes
    this.user = {
      id              : user.idUser as unknown as string,
      email           : user.Email,
      pseudo          : user.Pseudo,
      role            : user.Role.code,
      authProvider    : user.AuthProvider.code,
      settingsUser    : user.SettingsUser,
      gdprConsent     : user.GdprConsent,
      gdprConsentDate : user.GdprConsentDate,
      createdAt       : user.createdAt,
      updatedAt       : user.updatedAt
    };

    this.tags = tags.map(
      (t): IExportedTag => ({
        id        : t.getTagId() as unknown as string, // Utilisation de la clé nominale scellée
        tagName   : t.getTagName(),
        createdAt : t.createdAt,                       // Accès aux propriétés directes d'IEntity
        updatedAt : t.updatedAt
      })
    );

    this.items = itemsWithTags.map(
      ({ item, tags: itemTags }): IExportedItem => ({
        id           : item.getItemId() as unknown as string, // Utilisation de la clé nominale scellée
        contentType  : item.getContentType() as unknown as string,
        title        : item.getTitle(),
        slug         : item.getSlug(),
        content      : item.getContent(),
        sourceAuthor : item.getSourceAuthor(),
        thumbnailUrl : item.getThumbnailUrl(),
        metadata     : item.getMetadata(),
        createdAt    : item.createdAt,                        // Accès aux propriétés directes d'IEntity
        updatedAt    : item.updatedAt,
        tags         : itemTags.map(
          (t): IExportedTag => ({
            id        : t.getTagId() as unknown as string,
            tagName   : t.getTagName(),
            createdAt : t.createdAt,
            updatedAt : t.updatedAt
          })
        )
      })
    );

    this.shares = shares.map(
      (s): IExportedShare => ({
        id             : s.getShareId() as unknown as string, // Utilisation de la clé nominale scellée
        itemId         : s.getItemId() as unknown as string,
        recipientEmail : s.getRecipientEmail(),
        shareToken     : s.getShareToken(),
        accessConfig   : s.getAccessConfig(),
        createdAt      : s.createdAt,                         // Accès aux propriétés directes d'IEntity
        updatedAt      : s.updatedAt
      })
    );
  }

  /**
   * 🏭 Factory statique : Agrège l'ensemble des données d'infrastructure vers le DTO d'exportation.
   *
   * @static
   * @function fromData
   * @param {IUser} user - Profil utilisateur
   * @param {IItemWithTags[]} itemsWithTags - Pépites indexées
   * @param {ITag[]} tags - Étiquettes associées
   * @param {IShare[]} shares - Partages actifs
   * @returns {UserExportDto} Le package RGPD sérialisé
   */
  public static fromData(
    user          : IUser,
    itemsWithTags : IItemWithTags[],
    tags          : ITag[],
    shares        : IShare[]
  ): UserExportDto {
    return new UserExportDto(user, itemsWithTags, tags, shares);
  }
}
