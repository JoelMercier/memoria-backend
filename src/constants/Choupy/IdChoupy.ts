// ——— fichier : src\constants\Choupy\IdChoupy.ts

// 🗲 [Choupy'Doctrine] Importation relative pour garantir l'autonomie (pas de '@/...')
// absolue et la portabilité universelle du bloc idCore dans mes futurs projets.
import { ChoupyEnum } from './ChoupyEnum';

/**
 * 🏛️ Classe Abstraite IdChoupy 🧮 (L'Armure Universelle du Silicium 🤖)
 * ----------------------------------------------------------------------------
 * Racine unique et centralisée pour tous les identifiants typés du système.
 *
 * @abstract
 * @class IdChoupy
 * @template TMarqueNominale - Le type marqueur de branding pour l'étanchéité nominale
 * @template TContenu - Le support physique de stockage (string | Buffer)
 * @author Directrice du Silicium : Joël (MANIAC de la Justification Technique)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur la V4)
 */
export abstract class IdChoupy<TMarqueNominale, TContenu extends string | Buffer> {

  /** 🕵️‍♂️ Expression régulière de validation d'un UUID compact pur de 32 caractères hexadécimaux 🔍 */
  private static readonly REGEX_HEX_COMPACT : RegExp = /^[0-9a-fA-F]{32}$/;

  /** 🔒 Sceau de Branding Générique : Verrouille l'étanchéité nominale dès la compilation */
  declare private readonly __nomUniqueId    : TMarqueNominale;

  /** 💾 Le support physique immuable stocké en RAM (Buffer de soute ou string de dictionnaire) */
  protected readonly m_vDonnee              : TContenu;

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
        } else {
          // Mutation polymorphe vers le type Buffer interne exigé par PostgreSQL sans triche "any" [1.1]
          this.m_vDonnee = Buffer.from(l_sCleanHex, 'hex') as unknown as TContenu;
        }
      } else {
        // Pour les quadrigrammes (DIM_4), normalisation industrielle en majuscules sans triche "any" [1.1]
        this.m_vDonnee = (p_oCalibreExige === ChoupyEnum.DIM_4 ? l_sTexteNettoye.toUpperCase() : l_sTexteNettoye) as unknown as TContenu;
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
  public get binaire() : Buffer {
    if (Buffer.isBuffer(this.m_vDonnee)) {
      return this.m_vDonnee;
    }
    throw new Error(`[Erreur Sémantique 🚨] L'identifiant n'est pas de nature binaire, impossible d'extraire son buffer.`);
  }

  /**
   * 🗜️ Convertisseur Universel d'Infrastructure : Fournit un Buffer exploitable par le pool de connexion.
   *
   * @public
   * @returns {Buffer} Le flux binaire d'acier prêt pour l'injection SQL
   */
  public toBuffer() : Buffer {
    if (Buffer.isBuffer(this.m_vDonnee)) {
      return this.binaire;                                    //-- [RÉPARÉ V4] Utilisation de l'accésseur de soute officiel [1.1].
    }
    return Buffer.from(this.valeur, 'ascii');                 //-- [RÉPARÉ V4] Utilisation de l'accésseur de soute officiel [1.1].
  }

  /**
   * 📜 Accesseur Côté Pile : Re-formate la valeur brute sous sa forme textuelle normalisée.
   *
   * @public
   * @returns {string} La représentation textuelle normalisée
   */
  public get valeur() : string {
    if (Buffer.isBuffer(this.m_vDonnee)) {
      const l_sHex = this.binaire.toString('hex');            //-- [RÉPARÉ V4] Utilisation de l'accésseur de soute officiel [1.1].
      return `${l_sHex.substring(0, 8)}-${l_sHex.substring(8, 12)}-${l_sHex.substring(12, 16)}-${l_sHex.substring(16, 20)}-${l_sHex.substring(20)}`;
    }
    return this.m_vDonnee;
  }

  /**
   * 🔄 Redéfinition sémantique de l'égalité au bit près en mémoire vive RAM.
   *
   * @public
   * @param {IdChoupy<unknown, string | Buffer>} p_oAutreId - L'autre instance d'identifiant à comparer 🧮
   * @returns {boolean} Vrai si les données sous-jacentes coïncident à 100% 🚀
   */
  public estEgalA(p_oAutreId: IdChoupy<unknown, string | Buffer>) : boolean {
    if (!p_oAutreId) return false;

    //-- [RÉPARÉ V4] Utilisation exclusive des accesseurs officiels pour les deux côtés de la forge [1.1]
    if (Buffer.isBuffer(this.m_vDonnee)) {
      return this.binaire.equals(p_oAutreId.binaire);
    }
    return this.valeur === p_oAutreId.valeur;
  }

  /**
   * Permet l'affichage propre ou l'injection directe dans les journaux d'audit.
   *
   * @public
   * @returns {string} La chaîne de caractères textuelle normalisée
   */
  public toString() : string {
    return this.valeur;
  }
}
export default IdChoupy;
