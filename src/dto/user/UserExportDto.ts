// ——— fichier : src/dto/user/UserExportDto.ts

import type { Item         } from '@/entities/Item';
import type { IShare       } from '@/interfaces/entities/share/IShare';
import type { ITag         } from '@/interfaces/entities/tag/ITag';
import type { IUser        } from '@/interfaces/entities/user/IUser';
import type { JsonLégitime } from '@/types/shared/JsonLégitime';


/**
 * 📦 Structure plate d'exportation pour une étiquette (Tag).
 */
interface IExportedTag {
  /** 🆔 Identifiant textuel de l'étiquette */
  id        : string;
  /** 📝 Libellé sémantique du tag */
  tagName   : string;
  /** ⏱️ Horodatage de création en soute */
  createdAt : Date | undefined;
  /** ⏱️ Horodatage de révision technique */
  updatedAt : Date | undefined;
}

/**
 * 📦 Structure plate d'exportation pour une pépite (Item) rattachée.
 */
interface IExportedItem {
  /** 🆔 Identifiant textuel de la pépite */
  id           : string;
  /** 🏷️ Code sémantique du type de contenu (ex: 'TEXT') */
  contentType  : string;
  /** 📝 Titre principal de la pépite */
  libelle      : string;
  /** Track normalisé d'accès visuel */
  slug         : string;
  /** 📄 Corps textuel ou charge utile brute */
  content      : string;
  /** ✍️ Auteur original ou source certifiée */
  sourceAuthor : string;
  /** 🖼️ URL de la miniature d'illustration */
  thumbnailUrl : string | null | undefined;
  /** 🎛️ Métadonnées d'infrastructure dynamiques */
  metadata     : JsonLégitime;
  /** ⏱️ Horodatage de création en soute */
  createdAt    : Date | undefined;
  /** ⏱️ Horodatage de révision technique */
  updatedAt    : Date | undefined;
  /** 🏷️ Collection des étiquettes associées à cette pépite */
  tags         : IExportedTag[];
}

/**
 * 📦 Structure plate d'exportation d'IHM publique pour un lien de partage (Share).
 */
interface IExportedShare {
  /** 🆔 Identifiant textuel du partage */
  id             : string;
  /** 📦 Identifiant de la pépite verrouillée */
  itemId         : string;
  /** 📧 Courriel électronique de l'acteur destinataire */
  recipientEmail : string | null;
  /** 🔑 Jeton cryptographique d'accès externe */
  shareToken     : string;
  /** ⚙️ Configuration d'infrastructure des restrictions d'accès */
  accessConfig   : {
    /** Palier d'accès sémantique (ex: 'read', 'write') */
    privilege          : string;
    /** Autorisation de téléchargement des pièces jointes */
    allowDownload      : boolean;
    /** Horodatage limite de validité du jeton */
    expiresAt          : Date | null | undefined;
  };
  /** ⏱️ Horodatage de création du partage */
  createdAt      : Date | undefined;
  /** ⏱️ Horodatage de modification du partage */
  updatedAt      : Date | undefined;
}

/**
 * 📦 Structure plate d'exportation pour le profil utilisateur racine.
 */
interface IExportedUser {
  /** 🆔 Identifiant unique textuel de l'utilisateur */
  id              : string;
  /** 📧 Adresse électronique unique de connexion */
  email           : string;
  /** 👤 Pseudonyme public d'affichage */
  pseudo          : string;
  /** 🗂️ Jeton textuel du rôle hiérarchique de sécurité */
  role            : string;
  /** 🌐 Jeton textuel du fournisseur d'authentification */
  authProvider    : string;
  /** 🗄️ Dictionnaire des préférences d'interface utilisateur */
  settingsUser    : Record<string, unknown>;
  /** 🛡️ Approbation légale des règles de protection des données (RGPD) */
  rgpdConsent     : boolean;
  /** ⏱️ Horodatage du scellage du consentement RGPD */
  rgpdConsentDate : Date | null | undefined;
  /** ⏱️ Horodatage de création de l'acteur */
  createdAt       : Date | undefined;
  /** ⏱️ Horodatage de dernière révision administrative */
  updatedAt       : Date | undefined;
}

/**
 * 📦 Structure d'infrastructure liant une pépite à ses étiquettes.
 */
export interface IItemWithTags {
  /** 📦 L'entité pépite concernée */
  item : Item;
  /** 🏷️ La liste des tags rattachés */
  tags : ITag[];
}

/**
 * 📦 Classe UserExportDto
 * ----------------------------------------------------------------------------
 * Objet de transfert de données pour l'extraction complète RGPD (Article 20).
 * Aplatit et purge les entités complexes riches pour générer un JSON de transport pur.
 *
 * @class UserExportDto
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class UserExportDto {

  /** 📅 Horodatage d'extraction et de génération du pack de données */
  public readonly exportDate : string;

  /** 👥 Bloc de données plat représentant l'identité de l'utilisateur */
  public readonly user       : IExportedUser;

  /** 📦 Collection des pépites détenues par l'utilisateur */
  public readonly items      : IExportedItem[];

  /** 🏷️ Collection exhaustive des étiquettes créées par l'utilisateur */
  public readonly tags       : IExportedTag[];

  /** 🔗 Collection des liens de partages configurés par l'utilisateur */
  public readonly shares     : IExportedShare[];

  /**
   * Construit le payload d'export en nettoyant méticuleusement les entités.
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

    this.user = {
      id              : user.idUser.valeur,
      email           : user.courriel,
      pseudo          : user.pseudo,
      role            : user.role.code,
      authProvider    : user.authProvider.code,
      settingsUser    : user.settingsUser,
      rgpdConsent     : user.rgpdConsent,     // 🪓 [REPASSÉ FRANCONIEN V4]
      rgpdConsentDate : user.rgpdConsentDate, // 🪓 [REPASSÉ FRANCONIEN V4]
      createdAt       : user.createdAt,
      updatedAt       : user.updatedAt
    };

    this.tags = tags.map(
      (t): IExportedTag => ({
        id        : t.idTag.valeur,
        tagName   : t.tagName,
        createdAt : t.createdAt,
        updatedAt : t.updatedAt
      })
    );

    this.items = itemsWithTags.map(
      ({ item, tags: itemTags }): IExportedItem => ({
        id           : item.idItem.valeur,
        contentType  : item.contentType.code,
        libelle      : item.libelle,
        slug         : item.slug,
        content      : item.content,
        sourceAuthor : item.sourceAuthor,
        thumbnailUrl : item.thumbnailUrl,
        metadata     : item.metadata,
        createdAt    : item.createdAt,
        updatedAt    : item.updatedAt,
        tags         : itemTags.map(
          (t): IExportedTag => ({
            id        : t.idTag.valeur,
            tagName   : t.tagName,
            createdAt : t.createdAt,
            updatedAt : t.updatedAt
          })
        )
      })
    );

    this.shares = shares.map(
      (s): IExportedShare => ({
        id             : s.idShare.valeur,
        itemId         : s.idItem.valeur,
        recipientEmail : s.courrielDest,
        shareToken     : s.jeton,
        accessConfig   : {
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