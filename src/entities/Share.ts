// ——— fichier : src/entities/Share.ts

import { BaseEntity    } from '@/entities/BaseEntity';
import { ItemId, ShareId } from '@/domain/value-objects/IdMetier';
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
 * @author Joël, Gaïa & Co
 */
export class Share extends BaseEntity<'share', IShareData, ShareId> implements IShare {

  /** 🔔 Caillou de couleur : Identifiant technique unique de l'entité de partage */
  private readonly m_idShare         : ShareId;

  /** 📦 Caillou de couleur : Identifiant de la pépite (Item) liée au partage */
  private readonly m_idItem          : ItemId;

  /** 📧 Courriel du destinataire ciblé ou NULL si le lien est public */
  private readonly m_sCourrielDest : string | null;

  /** 🔑 Jeton de sécurité aléatoire unique intégré dans la route HTTP d'accès */
  private readonly m_sJetonPartage     : string;

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
    this.m_idShare       = data.idShare;
    this.m_idItem        = data.shItemId;
    this.m_sCourrielDest = data.shCourrielDest;
    this.m_sJetonPartage = data.shJeton;
    this.m_rAccessConfig = data.shConfiguration;
  }

  /**
   * 🆔 Identifiant unique et fortement typé du partage.
   * Aligné sur notre contrat d'interface métier unifié.
   *
   * @public
   * @function getShareId
   * @returns {ShareId} Le caillou de couleur de l'enregistrement de partage.
   */
  public getShareId(): ShareId {
    return this.m_idShare;
  }

  /**
   * 📦 Récupère l'identifiant unique et fortement typé de la pépite partagée.
   *
   * @public
   * @function getItemId
   * @returns {ItemId} Le caillou de couleur de la pépite associée.
   */
  public getItemId(): ItemId {
    return this.m_idItem;
  }

  /**
   * 📧 Récupère l'adresse e-mail du destinataire (Ou NULL si partage public via lien).
   *
   * @public
   * @function getRecipientEmail
   * @returns {string | null} L'adresse de correspondance ou NULL.
   */
  public getCourrielDest(): string | null {
    return this.m_sCourrielDest;
  }

  /**
   * 🔑 Récupère le jeton de sécurité unique associé au lien de partage.
   *
   * @public
   * @function getShareToken
   * @returns {string} Le token de sécurité brut.
   */
  public getJeton(): string {
    return this.m_sJetonPartage;
  }

  /**
   * ⚙️ Récupère la configuration fine des droits et restrictions d'accès.
   *
   * @public
   * @function getAccessConfig
   * @returns {IAccessConfig} La structure de configuration.
   */
  public getAccessConfig(): IAccessConfig {
    return this.m_rAccessConfig;
  }

  /**
   * ⏱️ Vérifie si le lien de partage a dépassé sa date de validité chronologique.
   *
   * @public
   * @function isExpired
   * @returns {boolean} True si le partage est expiré
   */
  public isExpired(): boolean {
    if (!this.m_rAccessConfig.expiresAt) {
      return false;
    }
    return new Date(this.m_rAccessConfig.expiresAt) < new Date();
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   * Totalement synchronisé sur la clé dynamique idShare de l'infrastructure.
   *
   * @public
   * @function toData
   * @returns {IShareData} Structure de données brute d'infrastructure
   */
  public toData(): IShareData {
    return {
      idShare         : this.getShareId(),
      shItemId        : this.getItemId(),
      shCourrielDest  : this.getCourrielDest(),
      shJeton         : this.getJeton(),
      shConfiguration : this.getAccessConfig(),
      createdAt       : this.createdAt,
      updatedAt       : this.updatedAt
    };
  }

  /**
   * 🖨️ Sérialise textuellement l'entité de partage au format de texte JSON.
   *
   * @public
   * @override
   * @function toString
   * @returns {string} Le sac de données aplati sous forme de chaîne de caractères
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
