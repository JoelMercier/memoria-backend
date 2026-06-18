// ——— fichier : src/entities/User.ts

import type { IUser } from '@/interfaces/entities/user/IUser';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import { ProviderId, RoleId, type UserId } from '@/domain/value-objects/ids';

import { BaseEntity } from '@/entities/BaseEntity';
import { Role } from '@/constants/Roles';
import { AuthProvider } from '@/constants/AuthProviders';

/**
 * 🏛️ Classe User 👥 (Le Modèle Métier Immuable de l'Acteur)
 * ----------------------------------------------------------------------------
 * Représente un utilisateur authentifié au sein du Domaine de Mémoria.
 * Protégé nominalement par la notation hongroise et piloté par les Smart Enums.
 *
 * @class User
 * @extends {BaseEntity<'user', IUserData, UserId>}
 * @implements {IUser}
 * @author Conception & Vision : Joël (Purement infonctionnel et Void capillaire)
 * @author Rabotage du Code : Gaïa (Au burin, alignée sur le standard sans parenthèses V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers en surchauffe de la V4)
 */
export class User extends BaseEntity<'user', IUserData, UserId> implements IUser {
  /** 🔔 Caillou de couleur : Identifiant unique immuable de l'utilisateur (idUser) */
  private readonly m_idUser: UserId;

  /** 📧 Adresse électronique unique servant d'identifiant de connexion (email) */
  private readonly m_sCourriel: string;

  /** 🔐 Empreinte cryptographique du mot de passe haché (passwordHash) */
  private readonly m_sPasswordHash: string;

  /** 👤 Pseudonyme public d'affichage de l'utilisateur (pseudo) */
  private readonly m_sPseudo: string;

  /** 🗂️ Instance de Smart Enum gérant les privilèges de sécurité hiérarchiques (role) */
  private readonly m_eRole: Role;

  /** 🌐 Instance de Smart Enum fixant le fournisseur d'identité d'origine (authProvider) */
  private readonly m_eAuthProvider: AuthProvider;

  /** 🗄️ Dictionnaire de configuration des préférences de l'interface utilisateur (settingsUser) */
  private readonly m_rSettingsUser: Record<string, unknown>; // 🪓 [RÉPARÉ V4] Fin du any lâche !

  /** 🛡️ Indicateur légal d'approbation des conditions d'utilisation (rgpdConsent) */
  private readonly m_bRgpdConsent: boolean;

  /** ⏱️ Horodatage précis du scellage du consentement aux règles RGPD (rgpdConsentDate) */
  private readonly m_dRgpdConsentDate: Date | null;

  /**
   * Instancie un utilisateur immuable à partir de son contrat de données.
   *
   * @constructor
   * @param {IUserData} p_oData - Payload brut ou typé issu de l'infrastructure ou des DTO
   */
  public constructor(p_oData: IUserData) {
    super(p_oData);
    this.m_idUser        = p_oData.idUser;
    this.m_sCourriel     = p_oData.courriel;
    this.m_sPasswordHash = p_oData.passwordHash;
    this.m_sPseudo       = p_oData.pseudo;

    // 🪓 TRADUCTION INDUSTRIELLE : Extraction via le Smart Enum avec fallback sécurisé sans aucun "any" menteur !
    const l_oPotentialRole = Role.fromSql ? Role.fromSql(p_oData.roleId.valeur) : null;
    if (!l_oPotentialRole) {
      throw new Error(
        `[Erreur Silicium 🚨] Impossible de résoudre le rôle d'infrastructure pour l'utilisateur.`
      );
    }
    this.m_eRole            = l_oPotentialRole;
    this.m_eAuthProvider    = AuthProvider.fromSql(p_oData.authProviderId.valeur);
    this.m_rSettingsUser    = p_oData.settingsUser || {};
    this.m_bRgpdConsent     = p_oData.rgpdConsent;
    this.m_dRgpdConsentDate = p_oData.rgpdConsentDate ?? null;
  }

  /**
   * 🆔 VRAI GETTER : Identifiant unique du profil utilisateur.
   *
   * @public
   * @returns {UserId} Le Value Object de l'identifiant utilisateur
   */
  public get idUser(): UserId {
    return this.m_idUser;
  }

  /**
   * 📧 VRAI GETTER : Adresse email de connexion unique.
   *
   * @public
   * @returns {string} L'adresse email de l'utilisateur
   */
  public get courriel(): string {
    return this.m_sCourriel;
  }

  /**
   * 🔑 VRAI GETTER : Empreinte cryptographique du mot de passe haché.
   *
   * @public
   * @returns {string} Le hash sécurisé du mot de passe
   */
  public get passwordHash(): string {
    return this.m_sPasswordHash;
  }

  /**
   * 👤 VRAI GETTER : Pseudonyme public de l'utilisateur.
   *
   * @public
   * @returns {string} Le nom d'affichage public
   */
  public get pseudo(): string {
    return this.m_sPseudo;
  }

  /**
   * 🗂️ VRAI GETTER : Rôle de sécurité hiérarchique.
   *
   * @public
   * @returns {Role} Le Smart Enum représentant le rôle utilisateur
   */
  public get role(): Role {
    return this.m_eRole;
  }

  /**
   * 🌐 VRAI GETTER : Fournisseur d'authentification d'origine.
   *
   * @public
   * @returns {AuthProvider} Le type de fournisseur d'identité
   */
  public get authProvider(): AuthProvider {
    return this.m_eAuthProvider;
  }

  /**
   * 🗄️ VRAI GETTER : Dictionnaire des préférences d'interface.
   *
   * @public
   * @returns {Record<string, unknown>} Bloc JSON contenant la configuration utilisateur
   */
  public get settingsUser(): Record<string, unknown> {
    // 🪓 [RÉPARÉ V4] Aligné sur unknown
    return this.m_rSettingsUser;
  }

  /**
   * 🛡️ VRAI GETTER : Statut du consentement aux règles RGPD.
   *
   * @public
   * @returns {boolean} True si les conditions d'utilisation sont validées
   */
  public get rgpdConsent(): boolean {
    return this.m_bRgpdConsent;
  }

  /**
   * ⏱️ VRAI GETTER : Horodatage du consentement RGPD.
   *
   * @public
   * @returns {Date | null} Date précise de la signature ou NULL
   */
  public get rgpdConsentDate(): Date | null {
    return this.m_dRgpdConsentDate;
  }

  /**
   * 🛡️ Sécurité Nominale : Vérifie les privilèges d'accès de l'utilisateur.
   *
   * @public
   * @param {Role} p_oRoleMinimalRequis - Le palier de sécurité à éprouver
   * @returns {boolean} True si l'acteur possède des privilèges supérieurs ou égaux
   */
  public aLeDroitAccederA(p_oRoleMinimalRequis: Role): boolean {
    return this.m_eRole.estSuperieurOuEgalA(p_oRoleMinimalRequis);
  }
  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   * [SCELLÉ RECOUVREMENT] Interrogation constitutionnelle et exclusive des variables hongroises.
   *
   * @public
   * @returns {IUserData} Structure de données brute d'infrastructure
   */
  public toData(): IUserData {
    return {
      idUser         : this.idUser,
      courriel       : this.courriel,
      passwordHash   : this.passwordHash,
      pseudo         : this.pseudo,
      roleId         : new RoleId(this.role.code.toString()),
      authProviderId : new ProviderId(this.authProvider.code.toString()),
      settingsUser   : this.settingsUser,
      rgpdConsent    : this.rgpdConsent,
      rgpdConsentDate: this.rgpdConsentDate ?? new Date(),
      createdAt      : this.createdAt,
      updatedAt      : this.updatedAt
    };
  }

  /**
   * 🖨️ Sérialise textuellement l'entité utilisateur au format de texte JSON.
   *
   * @public
   * @override
   * @returns {string} Chaîne JSON plate sérialisée
   */
  public override toString(): string {
    return JSON.stringify(this.toData());
  }
}
