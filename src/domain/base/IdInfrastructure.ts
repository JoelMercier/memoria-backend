// ——— fichier : src/domain/base/IdInfrastructure.ts

/**
 * 🧱 Classe Abstraite IdInfrastructure 🧪 (L'Ancêtre Suprême des Clés Disque)
 * ----------------------------------------------------------------------------
 * Fondation universelle et exportable pour tous les identifiants uniques.
 * Gère l'immuabilité en RAM et la comparaison sémantique via accesseur.
 *
 * @class IdInfrastructure
 * @abstract
 * @template T Le type de stockage physique brut (Buffer pour le binaire, string pour l'ASCII)
 * @author Vision & Conception : Joël (C++ Framework Architect)
 * @author Forge & Martelage du Code : Gaïa (Gardienne du silicium)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers de la première heure)
 */
export abstract class IdInfrastructure<T extends string | Buffer> {

  /** 🔒 Le stockage physique brut crypté ou empaqueté pour l'infrastructure */
  private readonly m_rContenuBrut: T;

  /**
   * Construit et scelle l'identifiant dans la mémoire vive.
   *
   * @protected
   * @constructor
   * @param {T} p_rContenuBrut - Le segment ou la chaîne brute d'infrastructure
   */
  protected constructor(p_rContenuBrut: T) {
    this.m_rContenuBrut = p_rContenuBrut;
    Object.freeze(this); // Immuabilité absolue de l'objet en RAM 🧠
  }

  /**
   * 🎛️ Accesseur Public (Getter) : Unique point de passage pour extraire la valeur brute.
   * Respect absolu des règles d'encapsulation de la Forge [Mémoria].
   *
   * @public
   * @returns {T} Le contenu brut de stockage (Buffer ou string).
   */
  public get infrastructureBrute(): T {
    return this.m_rContenuBrut;
  }

  /**
   * 🔄 Redéfinition sémantique de l'égalité au bit près en mémoire vive 🧠 RAM.
   * Utilisation exclusive des accesseurs publics pour interdire l'accès aux membres privés.
   *
   * @public
   * @param {IdInfrastructure<T>} p_oAutreId - L'autre instance d'identifiant à comparer
   * @returns {boolean} Vrai si les contenus sous-jacents coïncident à 100% 🚀
   */
  public estEgalA(p_oAutreId: IdInfrastructure<T>): boolean {
    const l_rMonContenu = this.infrastructureBrute;
    const l_rSonContenu = p_oAutreId.infrastructureBrute;

    if (Buffer.isBuffer(l_rMonContenu) && Buffer.isBuffer(l_rSonContenu)) {
      return l_rMonContenu.equals(l_rSonContenu);
    }

    return l_rMonContenu === l_rSonContenu;
  }
}
