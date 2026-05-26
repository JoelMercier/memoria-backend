// ——— fichier : src/constants/Role.ts

import { SmartEnum } from './base/SmartEnum';

/**
 * 🏛️ Classe Role (Smart Enum)
 * ----------------------------
 * Gère la hiérarchie de sécurité et les droits d'accès au sein du système.
 * Encapsule la logique de supériorité des privilèges.
 */
export class Role extends SmartEnum<string> {

  /** 👥 Utilisateur standard / Client final de la plateforme */
  public static readonly CUSTOMER    = new Role('CUSTOMER', 'customer', 1, '👤 Client');

  /** 🛠️ Administrateur doté des droits d'exploitation courants */
  public static readonly ADMIN       = new Role('ADMIN', 'admin', 2, '🛠️ Administrateur');

  /** 👑 Super-Administrateur détenant l'accès destructeur total */
  public static readonly SUPER_ADMIN = new Role('SUPER_ADMIN', 'super_admin', 3, '👑 Super Admin');

  /**
   * Constructeur privé assurant l'immuabilité des privilèges.
   *
   * @param {string} libelle - Identifiant interne textuel
   * @param {string} codeSql - Chaîne brute stockée dans PostgreSQL
   * @param {number} niveau - Poids hiérarchique (plus le chiffre est haut, plus le rôle est puissant)
   * @param {string} libelleAffichage - Libellé destiné à l'interface de gestion
   */
  private constructor(
    libelle: string,
    codeSql: string,
    public readonly niveau: number,
    public readonly libelleAffichage: string
  ) {
    super(libelle, codeSql);
  }

  /**
   * Liste exhaustive des rôles du système.
   */
  public static values(): Role[] {
    return [
      Role.CUSTOMER,
      Role.ADMIN,
      Role.SUPER_ADMIN
    ];
  }

  /**
   * Vérifie si ce rôle possède des privilèges supérieurs ou égaux à un autre.
   * Supprime définitivement les cascades de "if" dans le code.
   *
   * @param {Role} autreRole - Le rôle minimal requis pour l'action
   * @returns {boolean} True si l'accès est légitime
   */
  public estSuperieurOuEgalA(autreRole: Role): boolean {
    return this.niveau >= autreRole.niveau;
  }

  /**
   * Convertit la chaîne brute de la DB en instance sécurisée.
   */
  public static fromSql(codeSql: string): Role {
    const found = this.values().find(r => r.code === codeSql);

    if (!found) {
      throw new Error(`[Erreur Sécurité] Code de rôle SQL inconnu : '${codeSql}'`);
    }

    return found;
  }

}

export default Role;
