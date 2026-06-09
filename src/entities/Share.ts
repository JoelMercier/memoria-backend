// ——— fichier : src/entities/Share.ts

import { BaseEntity }     from '@/entities/BaseEntity';
import { ShareId, ItemId, UserId } from '@/domain/value-objects/ids';
import type { IShare }    from '@/interfaces/entities/share/IShare';
import type { IShareData } from '@/interfaces/entities/share/IShareData';
import type { IAccessConfig } from '@/interfaces/entities/share/IAccessConfig';

/**
 * 🏛️ Classe Share (Passerelles de Partage) 🔗
 * ----------------------------------------------------------------------------
 * Modèle métier immuable représentant une passerelle de partage sécurisée.
 * Protégé par la notation hongroise, documenté et converti en vrais getters V4.
 *
 * @class Share
 * @extends {BaseEntity<'share', IShareData, ShareId>}
 * @implements {IShare}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Pure Encapsulation)
 * @author Métallurgie des Octets : Gaïa (Au burin, lavée de ses accès sauvages)
 */
export class Share extends BaseEntity<'share', IShareData, ShareId> implements IShare {

  /** 🔔 Clé Primaire : Identifiant unique fort du partage (idShare) */
  private readonly m_idShare       : ShareId;

  /** 📥 Clé Étrangère : Identifiant unique de la pépite rattachée (shItemId) */
  private readonly m_idItem        : ItemId;

  /** 👥 Clé Étrangère : Identifiant unique de l'acteur propriétaire (shItemOwnerId) */
  private readonly m_idShareOwner  : UserId;

  /** 📧 Adresse e-mail du destinataire ciblé (shCourrielDest) */
  private readonly m_sCourrielDest : string | null;

  /** 🔐 Jeton de sécurité textuel unique (Token) transitant dans les URL (shJeton) */
  private readonly m_sJeton        : string;

  /** ⚙️ Configuration fine des restrictions et de validité (shConfiguration) */
  private readonly m_rAccessConfig : IAccessConfig;

  /**
   * Instancie une passerelle de partage immuable à partir de sa structure passive.
   *
   * @constructor
   * @param {IShareData} p_oData - Le sac de données brutes d'infrastructure 3NF
   */
  public constructor(p_oData: IShareData) {
    super(p_oData);
    this.m_idShare       = p_oData.idShare;
    this.m_idItem        = p_oData.itemId;
    this.m_idShareOwner  = p_oData.itemOwnerId;
    this.m_sCourrielDest = p_oData.courrielDest ?? null;
    this.m_sJeton        = p_oData.jeton;
    this.m_rAccessConfig = p_oData.configuration;
  }

  /**
   * 📦 VRAI GETTER : Récupère la clé primaire unique fort du partage.
   *
   * @public
   * @returns {ShareId} Le caillou de couleur du partage
   */
  public get idShare(): ShareId {
    return this.m_idShare;
  }

  /**
   * 📥 VRAI GETTER : Récupère l'identifiant fort de la pépite cible liée.
   *
   * @public
   * @returns {ItemId} Le caillou de couleur de la pépite rattachée
   */
  public get idItem(): ItemId {
    return this.m_idItem;
  }

  /**
   * 👥 VRAI GETTER : Récupère l'identifiant fort de l'acteur propriétaire.
   *
   * @public
   * @returns {UserId} Le caillou de couleur de l'acteur propriétaire
   */
  public get idUserOwner(): UserId {
    return this.m_idShareOwner;
  }

  /**
   * 📧 VRAI GETTER : Récupère l'adresse e-mail du destinataire ciblé.
   *
   * @public
   * @returns {string | null} L'adresse de messagerie ou null si public
   */
  public get courrielDest(): string | null {
    return this.m_sCourrielDest;
  }

  /**
   * 🔐 VRAI GETTER : Récupère le jeton de sécurité cryptographique.
   *
   * @public
   * @returns {string} La chaîne textuelle unique du jeton d'URL
   */
  public get jeton(): string {
    return this.m_sJeton;
  }

  /**
   * ⚙️ VRAI GETTER : Récupère la configuration fine de validité.
   *
   * @public
   * @returns {IAccessConfig} Le dictionnaire des droits et verrous temporels
   */
  public get accessConfig(): IAccessConfig {
    return this.m_rAccessConfig;
  }

  /**
   * ⏱️ MÉTHODE MÉTIER : Vérifie si la validité temporelle du partage a expiré.
   * [SCELLÉ POO] Utilisation exclusive de l'accesseur officiel .accessConfig !
   *
   * @public
   * @returns {boolean} True si la date d'expiration en soute est dépassée
   */
  public isExpired(): boolean {
    // 🪓 [RÉPARÉ V4] Interrogation via le getter public de surface et la clé d'acier unique !
    if (!this.accessConfig || !this.accessConfig.DateExpiration) {
      return false;
    }
    return new Date() > this.accessConfig.DateExpiration;
  }

  /**
   * 📦 Extrait le sac de données passif d'infrastructure pour la persistance.
   *
   * @public
   * @returns {IShareData} La structure de données plate brute de soute 3NF
   */
  /**
   * 📦 Extrait le sac de données passif d'infrastructure pour la persistance.
   * [SCELLÉ RECOUVREMENT] Interrogation exclusive des getters de surface.
   *
   * @public
   * @returns {IShareData} La structure de données plate brute de soute 3NF
   */
  public toData(): IShareData {
    return {
      idShare       : this.idShare,
      itemId        : this.idItem,
      itemOwnerId   : this.idUserOwner,
      jeton         : this.jeton,
      courrielDest  : this.courrielDest,
      configuration : this.accessConfig,
      createdAt     : this.createdAt,
      updatedAt     : this.updatedAt
    } as IShareData;
  }


  /**
   * 🖨️ Sérialise textuellement l'entité au format JSON.
   *
   * @public
   * @override
   * @returns {string} La chaîne de caractères sérialisée
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
