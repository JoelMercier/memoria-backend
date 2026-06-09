// ——— fichier : src/interfaces/repositories/IUserRepository.ts

import { UserId }       from '@/domain/value-objects/ids';
import type { User }    from '@/entities/User';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import { IPhysicalRW }  from '@/interfaces/repositories/IPhysicalRW'; // [RECTIFIÉ V4] Raccord sémantique exact

/**
 * 🗄️ Interface IUserRepository 🛡️
 * ----------------------------------------------------------------------------
 * Contrat de persistance et d'accès aux données pour le domaine Utilisateur.
 * Connectée de bout en bout sur l'armure générique du Value Object UserId.
 * Hérite du droit de modification et de suppression via le contrat IPhysicalRW.
 *
 * @interface IUserRepository
 * @extends {IPhysicalRW<User, IUserData, UserId>}
 *
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Ouvriers de la V4 en surchauffe)
 */
export interface IUserRepository extends IPhysicalRW<User, IUserData, UserId> {

  /**
   * 📧 Recherche un utilisateur unique via son adresse e-mail normalisée.
   *
   * @async
   * @param {string} p_sEmail - L'adresse de courriel nettoyée et normalisée à rechercher
   * @returns {Promise<User | null>} L'entité User hydratée ou null s'il n'y a aucune concordance
   */
  findByEmail(p_sEmail: string): Promise<User | null>;

  /**
   * 👤 Recherche un utilisateur unique via son pseudonyme public.
   *
   * @async
   * @param {string} p_sPseudo - Le pseudonyme textuel à soumettre à la douane du disque
   * @returns {Promise<User | null>} L'entité User correspondante ou null
   */
  findByPseudo(p_sPseudo: string): Promise<User | null>;

  /**
   * 📧 Vérifie la présence physique d'une adresse e-mail dans le coffre-fort.
   *
   * @async
   * @param {string} p_sEmail - L'adresse de courriel à tester
   * @returns {Promise<boolean>} Vrai si le courriel est déjà détenu sur le disque
   */
  existsByEmail(p_sEmail: string): Promise<boolean>;

  /**
   * 👤 Vérifie la présence physique d'un pseudonyme sur la plateforme.
   *
   * @async
   * @param {string} p_sPseudo - Le pseudo d'affichage à tester
   * @returns {Promise<boolean>} Vrai si le pseudo fait déjà l'objet d'une réservation active
   */
  existsByPseudo(p_sPseudo: string): Promise<boolean>;
}
