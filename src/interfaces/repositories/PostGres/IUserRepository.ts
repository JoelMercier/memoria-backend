// ——— fichier : src/interfaces/repositories/IUserRepository.ts

import type { IPhysicalRW } from '@/interfaces/repositories/IPhysicalRW';
import type { IUserData   } from '@/interfaces/entities/user/IUserData';
import type { User        } from '@/entities/User';

import { UserId } from '@/domain/value-objects/ids';


/**
 * 📋 Interface Cadre de Lecture Spécifique des Utilisateurs (Acteurs)
 * ----------------------------------------------------------------------------
 * Regroupe les signatures métiers d'extraction transversale applicables
 * autant sur les simulateurs volatiles en RAM que sur les dépôts PostgreSQL.
 */
interface IUserRepositoryBase {
  /**
   * 📧 Alignement nominal : Localise un acteur via son courriel normalisé.
   * Réalise un tir laser indexé direct en Cour Basse pour l'authentification.
   *
   * @async
   * @param {string} p_sCourriel - Le courriel à analyser et nettoyer
   * @returns {Promise<User | null>} L'entité correspondante ou null
   */
  findByCourriel(p_sCourriel: string): Promise<User | null>;

  /**
   * 👤 Alignement nominal : Localise un acteur via son pseudonyme public.
   * Utilisé lors de la douane d'inscription ou d'affichage de profil.
   *
   * @async
   * @param {string} p_sPseudo - Le pseudo public à localiser
   * @returns {Promise<User | null>} L'entité correspondante ou null
   */
  findByPseudo(p_sPseudo: string): Promise<User | null>;

  /**
   * 📧 Vérification d'existence : Valide la présence d'un courriel.
   * Évite le chargement complet de l'entité en RAM pour les contrôles rapides.
   *
   * @async
   * @param {string} p_sCourriel - Le courriel à vérifier
   * @returns {Promise<boolean>} True si le courriel est déjà capturé
   */
  existsByCourriel(p_sCourriel: string): Promise<boolean>;

  /**
   * 👤 Vérification d'existence : Valide la présence d'un pseudonyme public.
   * Évite le chargement complet de l'entité en RAM pour les contrôles rapides.
   *
   * @async
   * @param {string} p_sPseudo - Le pseudo public à éprouver
   * @returns {Promise<boolean>} True si le pseudo est déjà verrouillé
   */
  existsByPseudo(p_sPseudo: string): Promise<boolean>;

}

/**
 * 🗄️ Interface IUserRepository 🛡️ (Le Grand Contrat de Production)
 * ----------------------------------------------------------------------------
 * Contrat d'accès aux données gérant le cycle de vie de persistance des Utilisateurs (Users).
 * Hérite du droit de modification et de suppression via le contrat IPhysicalRW.
 * [ALIGNÉ CONSTITUTIONNEL V4] Toutes les extractions de masse imposent leur pagination !
 *
 * @interface IUserRepository
 * @extends {IUserRepositoryBase}
 * @extends {IPhysicalRW<User, IUserData, UserId>}
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Ouvriers de la V4 en surchauffe)
 */
export interface IUserRepository extends IUserRepositoryBase, IPhysicalRW<User, IUserData, UserId> {}
