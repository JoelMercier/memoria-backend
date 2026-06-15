// ——— fichier : src/constants/Role.ts

import { SmartEnum } from '@/constants/Choupy/SmartEnum';

/**
 * 👥 Classe Role 🧮 (Le Régulateur des Rangs Applicatifs 🤖)
 * ----------------------------------------------------------------------------
 * Centralise les rôles de sécurité pour le contrôle des accès (ACL) de "Users".
 * Aligné au bit près sur les quadrigrammes de production de la table "Roles" [Mémoria].
 *
 * @class Role
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (Void capillaire)
 * @author Sculpture d'octets : Gaïa (Sculptrice de silicium)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers de la première heure)
 */
export class Role extends SmartEnum<string> {
  /** 🤖 Le poids numérique unique de pouvoir pour les contrôles de sécurité (ex: 10, 20, 30) [Mémoria] */
  private readonly m_nNiveau: number;

  /**
   * Moule une instance immuable de privilège dans la RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - Désignation intelligible pour le front-end
   * @param {string} p_sCode - Le quadrigramme d'infrastructure immuable (4 majuscules) [Mémoria]
   * @param {number} p_nNiveau - Poids hiérarchique pour le contrôle machine [Mémoria]
   * @param {number} p_nOrdreAff - Position numérique unique pour le tri logique visuel [Mémoria]
   * @param {boolean} p_bDefaut - Drapeau de repli nominal V4 Pro pour la base locale
   */
  private constructor(p_sLibelle: string, p_sCode: string, p_nNiveau: number, p_nOrdreAff: number, p_bDefaut: boolean = false) {
    super(p_sLibelle, p_sCode, p_nOrdreAff, p_bDefaut);
    this.m_nNiveau = Math.floor(p_nNiveau);
  }

  /**
   * 🤖 Obtient le poids numérique de sécurité lié au rôle.
   */
  public get niveau(): number {
    return this.m_nNiveau;
  }

  /**
   * 🛡️ Accesseur rétrocompatible pour éviter de casser ton code existant [Mémoria] */
  public get libelleAffichage(): string {
    return this.libelle;
  }

  /**
   * 🛡️ Vérifie si ce rôle possède des privilèges supérieurs ou égaux à un autre [Mémoria].
   * Supprime définitivement les cascades de "if" dans la logique métier.
   *
   * @param {Role} p_oAutreRole - Le rôle minimal requis pour l'action
   * @returns {boolean} True si l'accès est légitime
   */
  public estSuperieurOuEgalA(p_oAutreRole: Role): boolean {
    return this.m_nNiveau >= p_oAutreRole.niveau;
  }

  /** 🚀 Passerelle rétrocompatible pour tes DTOs existants [Mémoria] */
  public static values(): Role[] {
    return this.ObtenirToutes<Role>();
  }

  /** 🗄️ Convertisseur d'infrastructure historique branché sur le décodeur central [Mémoria] */
  public static fromSql(p_sCodeSql: string): Role {
    return this.DeCode<Role>(p_sCodeSql);
  }

  // ----------------------------------------------------------------------------
  // 🏺 ENSEMENCEMENT DE LA RAM (Les trois piliers du contrôle d'accès - Format 4 lettres)
  // ----------------------------------------------------------------------------

  /** 🪙 CUST - Rôle Utilisateur : Droits de capture sémantique de base (Le Choupy de repli !) */
  public static readonly CUST = new Role('Utilisateur', 'CUST', 10, 10, true); // 🔒 Bit True nominal !

  /** 💾 ADMN - Rôle Administrateur : Pouvoirs de supervision et modération [Mémoria] */
  public static readonly ADMN = new Role('Administrateur', 'ADMN', 20, 20);

  /** 💽 SADM - Rôle Super Administrateur : Pouvoir absolu sur les infrastructures [Mémoria] */
  public static readonly SADM = new Role('Super Administrateur', 'SADM', 30, 30);
}

export default Role;
