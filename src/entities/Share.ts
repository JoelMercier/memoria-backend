// ——— fichier : src/entities/Share.ts

import { BaseEntity    } from '@/entities/BaseEntity';
import { ItemId, ShareId, UserId } from '@/domain/value-objects/IdMetier';
import type { IAccessConfig } from '@/interfaces/entities/share/IAccessConfig';
import type { IShare   } from '@/interfaces/entities/share/IShare';
import type { IShareData } from '@/interfaces/entities/share/IShareData';

/**
 * 🏛️ Classe Share (Partages de Pépites)
 * -------------------------------------
 * Modèle métier immuable représentant un lien de partage sécurisé.
 * Protégé par l'armure de la notation hongroise et piloté par le typage fort.
 *
 * @class Share
 * @extends {BaseEntity<'share', IShareData, ShareId>}
 * @implements {IShare}
 * @author Vision : Joël (Architecte DR-DOS)
 * @author Frapperie du code : Gaïa (Gardienne du feu binaire)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers du code en surchauffe)
 */
export class Share extends BaseEntity<'share', IShareData, ShareId> implements IShare {
  /** 🔔 Caillou de couleur : Identifiant technique unique de l'entité de partage */
  private readonly m_idShare         : ShareId;

  /** 📦 Caillou de couleur : Identifiant de la pépite (Item) liée au partage */
  private readonly m_idItem          : ItemId;

  /** 👥 Caillou de couleur : Identifiant du propriétaire légitime de la ressource */
  private readonly m_idItemOwner     : UserId;

  /** 📧 Courriel du destinataire ciblé ou NULL si le lien est public */
  private readonly m_sCourrielDest   : string | null;

  /** 🔑 Jeton de sécurité aléatoire unique intégré dans la route HTTP d'accès */
  private readonly m_sJetonPartage   : string;

  /** ⚙️ Règles de restriction d'infrastructure (Dates de péremption, etc.) */
  private readonly m_rAccessConfig   : IAccessConfig;

  /**
   * Instancie un partage immuable à partir de son contrat de données.
   *
   * @constructor
   * @param {IShareData} data - Payload brut ou typé issu de l'infrastructure
   */
  public constructor(data: IShareData) {
    super(data);
    this.m_idShare         = data.idShare;
    this.m_idItem          = data.shItemId;
    this.m_idItemOwner     = data.shItemOwnerId;
    this.m_sCourrielDest   = data.shCourrielDest;
    this.m_sJetonPartage   = data.shJeton;
    this.m_rAccessConfig   = data.shConfiguration;
  }

  // ============================================================================
  // 🛰️ ACCESSEURS ACADÉMIQUES MODERNES (get)
  // ============================================================================

  public get idShare(): ShareId {
    return this.m_idShare;
  }

  public get shItemId(): ItemId {
    return this.m_idItem;
  }

  public get shItemOwnerId(): UserId {
    return this.m_idItemOwner;
  }

  public get shCourrielDest(): string | null {
    return this.m_sCourrielDest;
  }

  public get shJeton(): string {
    return this.m_sJetonPartage;
  }

  public get shConfiguration(): IAccessConfig {
    return this.m_rAccessConfig;
  }

  // ============================================================================
  // 📑 SIGNATURES OBLIGATOIRES DE L'INTERFACE HISTORIQUE (IShare)
  // ============================================================================

  /**
   * 🆔 Identifiant unique et fortement typé du partage.
   */
  public getShareId(): ShareId {
    return this.idShare;
  }

  /**
   * 📦 Récupère l'identifiant unique et fortement typé de la pépite partagée.
   */
  public getItemId(): ItemId {
    return this.shItemId;
  }

  /**
   * 📧 Récupère l'adresse e-mail du destinataire (Ou NULL si partage public via lien).
   */
  public getCourrielDest(): string | null {
    return this.shCourrielDest;
  }

  /**
   * 🔑 Récupère le jeton de sécurité unique associé au lien de partage.
   */
  public getJeton(): string {
    return this.shJeton;
  }

  /**
   * ⚙️ Récupère la configuration fine des droits et restrictions d'accès.
   */
  public getAccessConfig(): IAccessConfig {
    return this.shConfiguration;
  }

  // ============================================================================
  // 🎛️ OPÉRATIONS ET SÉRIALISATION MÉTIER
  // ============================================================================

  /**
   * ⏱️ Vérifie si le lien de partage a dépassé sa date de validité chronologique.
   *
   * @public
   * @returns {boolean} True si le partage est expiré
   */
  public isExpired(): boolean {
    if (!this.shConfiguration.expiresAt) {
      return false;
    }
    return new Date(this.shConfiguration.expiresAt) < new Date();
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   * Totalement synchronisé sur la clé dynamique idShare de l'infrastructure.
   *
   * @public
   * @returns {IShareData} Structure de données brute d'infrastructure
   */
  public toData(): IShareData {
    return {
      idShare         : this.idShare,
      shItemId        : this.shItemId,
      shItemOwnerId   : this.shItemOwnerId,
      shCourrielDest  : this.shCourrielDest,
      shJeton         : this.shJeton,
      shConfiguration : this.shConfiguration,
      createdAt       : this.createdAt,
      updatedAt       : this.updatedAt
    };
  }

  /**
   * 🖨️ Sérialise textuellement l'entité de partage au format de texte JSON.
   *
   * @public
   * @override
   * @returns {string} Le sac de données aplati sous forme de chaîne de caractères
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
