// ——— fichier : src/interfaces/repositories/IUserRepository.ts

import type { UserId          } from '@/domain/value-objects/IdMetier';
import type { User            } from '@/entities/User';
import type { IUserData       } from '@/interfaces/entities/user/IUserData';
import type { IBaseRepository } from '@/interfaces/repositories/IBaseRepository';

/**
 * 🗄️ Interface IUserRepository
 * ----------------------------
 * Contrat de persistance et d'accès aux données pour le domaine Utilisateur.
 * Connectée de bout en bout sur l'armure générique du Value Object UserId.
 *
 * @interface IUserRepository
 * @extends {IBaseRepository<User, IUserData, UserId>}
 * @author Joël, Gaïa & Co
 */
export interface IUserRepository extends IBaseRepository<User, IUserData, UserId> {

  /** 📧 Recherche un utilisateur unique via son adresse e-mail normalisée. */
  findByEmail(email: string): Promise<User | null>;

  /** 👤 Recherche un utilisateur unique via son pseudonyme public. */
  findByPseudo(pseudo: string): Promise<User | null>;

  /** 📧 Vérifie la présence physique d'une adresse e-mail dans le coffre-fort. */
  existsByEmail(email: string): Promise<boolean>;

  /** 👤 Vérifie la présence physique d'un pseudonyme sur la plateforme. */
  existsByPseudo(pseudo: string): Promise<boolean>;
}
