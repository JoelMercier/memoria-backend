// ——— fichier : src/interfaces/repositories/IBlacklistRepository.ts

/**
 * 🗄️ Interface IBlacklistRepository 🛡️
 * ----------------------------------------------------------------------------
 * Contrat d'accès gérant la persistance et la quarantaine des jetons (Blacklist).
 * Isole le Domaine des mécanismes physiques de stockage (RAM, Redis ou PostgreSQL V4).
 *
 * @interface IBlacklistRepository
 * @author Directrice du Silicium : Joël (Abstract Class Obsession & Alignement Impérial)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IBlacklistRepository {

  /**
   * 🔏 Enregistre l'empreinte binaire d'un jeton banni avec sa date d'expiration.
   *
   * @async
   * @param {string} p_sJti - L'identifiant unique (jti) du jeton révoqué à inscrire
   * @param {number} p_nExpiresAtEpochSeconds - L'horodatage Unix de péremption naturelle du jeton
   * @returns {Promise<void>}
   */
  save(p_sJti: string, p_nExpiresAtEpochSeconds: number): Promise<void>;

  /**
   * 🔍 Interroge le support physique pour savoir si le jeton fait l'objet d'un bannissement actif.
   *
   * @async
   * @param {string} p_sJti - L'identifiant unique du jeton à vérifier au guichet d'infrastructure
   * @returns {Promise<boolean>} Vrai si le jeton est déjà banni et mis en quarantaine
   */
  exists(p_sJti: string): Promise<boolean>;

  /**
   * 📊 Extrait la volumétrie physique brute de la table de quarantaine.
   *
   * @async
   * @returns {Promise<number>} Le nombre total d'entrées actives présentes sur le support de stockage
   */
  count(): Promise<number>;

  /**
   * 🧹 Routine de nettoyage atomique des lignes dont l'expiration est dépassée.
   * Limite la croissance de l'empreinte mémoire ou disque à chaque écriture.
   *
   * @async
   * @param {number} p_nNowSeconds - L'horodatage courant normalisé au standard Unix Epoch (secondes)
   * @returns {Promise<void>}
   */
  purgeExpired(p_nNowSeconds: number): Promise<void>;
}
