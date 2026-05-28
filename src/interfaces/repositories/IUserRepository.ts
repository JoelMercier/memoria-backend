// ——— fichier : src/interfaces/repositories/IUserRepository.ts

import { UserId } from '@/domain/value-objects/IdMetier';
import type { User } from '@/entities/User';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import type { IWriteableRepository } from '@/interfaces/repositories/IWriteableRepository';

/**
 * 🗄️ Interface IUserRepository
 * ----------------------------
 * Contrat de persistance et d'accès aux données pour le domaine Utilisateur.
 * Connectée de bout en bout sur l'armure générique du Value Object UserId.
 * Hérite du droit de modification et de suppression via le contrat IWriteableRepository.
 *
 * @interface IUserRepository
 * @extends {IWriteableRepository<User, IUserData, UserId>}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export interface IUserRepository extends IWriteableRepository<User, IUserData, UserId> {

  /** 📧 Recherche un utilisateur unique via son adresse e-mail normalisée. */
  findByEmail(email: string): Promise<User | null>;

  /** 👤 Recherche un utilisateur unique via son pseudonyme public. */
  findByPseudo(pseudo: string): Promise<User | null>;

  /** 📧 Vérifie la présence physique d'une adresse e-mail dans le coffre-fort. */
  existsByEmail(email: string): Promise<boolean>;

  /** 👤 Vérifie la présence physique d'un pseudonyme sur la plateforme. */
  existsByPseudo(pseudo: string): Promise<boolean>;
}
