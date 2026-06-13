// ——— fichier : src\constants\Choupy\IdChoupy.ts


// 🗲 [Choupy'Doctrine] Importation relative pour garantir l'autonomie (pas de '@/...')
// absolue et la portabilité universelle du bloc idCore dans mes futurs projets.
import { ChoupyEnum } from './ChoupyEnum';

/**
 * 🏛️ Classe Abstraite IdChoupy 🧮 (L'Armure Universelle du Silicium 🤖)
 * ----------------------------------------------------------------------------
 * Racine unique et centralisée pour tous les identifiants typés du système.
 */
export abstract class IdChoupy<TMarqueNominale, TContenu extends string | Buffer> {

  /** 🕵️‍♂️ Expression régulière de validation d'un UUID compact pur de 32 caractères hexadécimaux 🔍 */
  private static readonly REGEX_HEX_COMPACT: RegExp = /^[0-9a-fA-F]{32}$/;

  /** 🔒 Sceau de Branding Générique : Verrouille l'étanchéité nominale dès la compilation */
  declare private readonly __nomUniqueId: TMarqueNominale;

  /** 💾 Le support physique immuable stocké en RAM (Buffer de soute ou string de dictionnaire) */
  protected readonly m_vDonnee: TContenu;

  /**
   * Construit, valide et gèle l'identifiant nominal face à son calibre de sécurité.
   *
   * @protected
   * @constructor
   * @param {TContenu} p_vBrut - La donnée brute textuelle ou binaire à encapsuler 📥
   * @param {ChoupyEnum} p_oCalibreExige - Le guichet de douane ChoupyEnum chargé de valider la taille
   */
  protected constructor(p_vBrut: TContenu, p_oCalibreExige: ChoupyEnum) {
    // 1. Validation immédiate par le douanier injecté au constructeur
    p_oCalibreExige.validerContenance(p_vBrut);

    if (typeof p_vBrut === 'string') {
      const l_sTexteNettoye = p_vBrut.trim();

      // Normalisation uniforme pour le calibre 16 octets (UUID v7 avec ou sans tirets)
      if (p_oCalibreExige === ChoupyEnum.DIM_16) {
        const l_sCleanHex = l_sTexteNettoye.toLowerCase().replace(/[^0-9a-f]/g, '');
        if (!IdChoupy.REGEX_HEX_COMPACT.test(l_sCleanHex)) {
          throw new Error(`[Erreur Sécurité 🚨] Format d'UUID textuel invalide : attendu 32 caractères hexadécimaux épurés.`);
        }
        // Mutation polymorphe vers le type Buffer interne exigé par PostgreSQL
        this.m_vDonnee = Buffer.from(l_sCleanHex, 'hex') as TContenu;
      } else {
        // Pour les quadrigrammes (DIM_4), normalisation industrielle en majuscules
        this.m_vDonnee = (p_oCalibreExige === ChoupyEnum.DIM_4 ? l_sTexteNettoye.toUpperCase() : l_sTexteNettoye) as TContenu;
      }
    } else {
      this.m_vDonnee = p_vBrut;
    }

    // Gel constitutionnel de l'instance pour interdire toute altération des octets en RAM
    Object.freeze(this);
  }

  /**
   * 🎛️ Accesseur Côté Face : Renvoie le segment binaire brut (uniquement pour la lignée des UUIDs).
   *
   * @public
   * @returns {Buffer} Le buffer d'infrastructure mémoire pur pour PostgreSQL
   */
  public get binaire(): Buffer {
    if (Buffer.isBuffer(this.m_vDonnee)) {
      return this.m_vDonnee;
    }
    throw new Error(`[Erreur Sémantique 🚨] L'identifiant n'est pas de nature binaire, impossible d'extraire son buffer.`);
  }

  /**
   * 🗜️ Convertisseur Universel d'Infrastructure : Fournit un Buffer exploitable par le pool de connexion.
   * Extrait le buffer natif ou convertit le quadrigramme à la volée en ASCII pur à 0% padding.
   *
   * @public
   * @returns {Buffer} Le flux binaire d'acier prêt pour l'injection SQL
   */
  public toBuffer(): Buffer {
    if (Buffer.isBuffer(this.m_vDonnee)) {
      return this.m_vDonnee;
    }
    return Buffer.from(this.m_vDonnee as string, 'ascii');
  }

  /**
   * 📜 Accesseur Côté Pile : Re-formate la valeur brute sous sa forme textuelle normalisée.
   *
   * @public
   * @returns {string} La représentation textuelle normalisée
   */
  public get valeur(): string {
    if (Buffer.isBuffer(this.m_vDonnee)) {
      const l_sHex = this.m_vDonnee.toString('hex');
      return `${l_sHex.substring(0, 8)}-${l_sHex.substring(8, 12)}-${l_sHex.substring(12, 16)}-${l_sHex.substring(16, 20)}-${l_sHex.substring(20)}`;
    }
    return this.m_vDonnee;
  }

  /**
   * 🔄 Redéfinition sémantique de l'égalité au bit près en mémoire vive RAM.
   *
   * @public
   * @param {IdChoupy<any, any>} p_oAutreId - L'autre instance d'identifiant à comparer 🧮
   * @returns {boolean} Vrai si les données sous-jacentes coïncident à 100% 🚀
   */
  public estEgalA(p_oAutreId: IdChoupy<any, any>): boolean {
    if (!p_oAutreId) return false;

    const l_bThisIsBuffer = Buffer.isBuffer(this.m_vDonnee);
    const l_bAutreIsBuffer = p_oAutreId.toBuffer() && Buffer.isBuffer((p_oAutreId as any).m_vDonnee);

    if (l_bThisIsBuffer && l_bAutreIsBuffer) {
      return (this.m_vDonnee as Buffer).equals((p_oAutreId as any).m_vDonnee);
    }
    return this.valeur === p_oAutreId.valeur;
  }

  /**
   * Permet l'affichage propre ou l'injection directe dans les journaux d'audit.
   *
   * @public
   * @returns {string} La chaîne de caractères textuelle normalisée
   */
  public toString(): string {
    return this.valeur;
  }
}
