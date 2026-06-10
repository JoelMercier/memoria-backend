// ——— fichier : src/dto/user/UserExportDto.ts

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

/** 📦 Structure plate d'exportation d'IHM publique pour un lien de partage (Share) */
interface IExportedShare {
  id             : string;
  itemId         : string;
  recipientEmail : string | null;
  shareToken     : string;
  accessConfig   : {
    privilege          : string;
    allowDownload      : boolean;
    expiresAt          : Date | null | undefined;
  };
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
 * ----------------------------------------------------------------------------
 * Objet de transfert de données pour l'extraction complète RGPD (Article 20).
 * Aplatit et purge les entités complexes riches pour générer un JSON de transport pur.
 * [RÉPARÉ V4] Utilisation exclusive des vrais getters de surface du Domaine !
 *
 * @class UserExportDto
 * @author Joël, Gaïa & Co (C++ Framework Architect - Clean Getters Alignment)
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

    // 🪓 [RÉPARÉ V4] Interrogation via les propriétés de surface sans parenthèses !
    this.user = {
      id              : user.idUser.valeur,
      email           : user.courriel,
      pseudo          : user.pseudo,
      role            : user.role.code,
      authProvider    : user.authProvider.code,
      settingsUser    : user.settingsUser,
      gdprConsent     : user.rgpdConsent,
      gdprConsentDate : user.rgpdConsentDate,
      createdAt       : user.createdAt,
      updatedAt       : user.updatedAt
    };

    this.tags = tags.map(
      (t): IExportedTag => ({
        id        : t.idTag.valeur,       // 🗲 [RÉPARÉ V4] Vrai getter d'écurie sans getTagId() ! [Mémoria]
        tagName   : t.tagName,           // 🗲 [RÉPARÉ V4] Vrai getter d'écurie sans getTagName() ! [Mémoria]
        createdAt : t.createdAt,
        updatedAt : t.updatedAt
      })
    );

    this.items = itemsWithTags.map(
      ({ item, tags: itemTags }): IExportedItem => ({
        id           : item.idItem.valeur,    // 🗲 [RÉPARÉ V4] Vrai getter de surface ! [Mémoria]
        contentType  : item.contentType.code, // 🗲 [RÉPARÉ V4] Accès direct au code de l'Enum ! [Mémoria]
        title        : item.title,
        slug         : item.slug,
        content      : item.content,
        sourceAuthor : item.sourceAuthor,
        thumbnailUrl : item.thumbnailUrl,
        metadata     : item.metadata,
        createdAt    : item.createdAt,
        updatedAt    : item.updatedAt,
        tags         : itemTags.map(
          (t): IExportedTag => ({
            id        : t.idTag.valeur,   // 🗲 [RÉPARÉ V4] Vrai getter ! [Mémoria]
            tagName   : t.tagName,        // 🗲 [RÉPARÉ V4] Vrai getter ! [Mémoria]
            createdAt : t.createdAt,
            updatedAt : t.updatedAt
          })
        )
      })
    );

    this.shares = shares.map(
      (s): IExportedShare => ({
        id             : s.idShare.valeur,     // 🗲 [RÉPARÉ V4] Vrai getter ! [Mémoria]
        itemId         : s.idItem.valeur,      // 🗲 [RÉPARÉ V4] Vrai getter ! [Mémoria]
        recipientEmail : s.courrielDest,       // 🗲 [RÉPARÉ V4] Vrai getter ! [Mémoria]
        shareToken     : s.jeton,              // 🗲 [RÉPARÉ V4] Vrai getter ! [Mémoria]
        accessConfig   : {                     // 🗲 [MAPPAGE PUBLIC D'IHM] Aligné sans "as any" ! [Mémoria]
          privilege     : s.accessConfig.Privilege === 'ECRITURE' ? 'write' : 'read',
          allowDownload : s.accessConfig.AutoriseTelechargement,
          expiresAt     : s.accessConfig.DateExpiration
        },
        createdAt      : s.createdAt,
        updatedAt      : s.updatedAt
      })
    );
  }

  /**
   * 🏭 Factory statique : Agrège l'ensemble des données d'infrastructure vers le DTO d'exportation.
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
