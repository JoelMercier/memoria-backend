// ——— fichier : src\repositories\MockUserRepository.ts

import { User } from '@/entities/User';
import { UserId } from '@/domain/value-objects/IdMetier';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import type { IUserRepository } from '@/interfaces/repositories/IUserRepository';

export class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  public async findById(id: UserId): Promise<User | null> {
    // 🪓 ALIGNEMENT INDUSTRIEL : Utilisation du getter getUserId() unifié
    return this.users.find((u): boolean => u.getUserId().valeur === id.valeur) ?? null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return (
      this.users.find((u): boolean => u.getEmail().toLowerCase() === email.toLowerCase()) ?? null
    );
  }

  public async findByPseudo(pseudo: string): Promise<User | null> {
    return (
      this.users.find((u): boolean => u.getPseudo().toLowerCase() === pseudo.toLowerCase()) ?? null
    );
  }

  public async existsByEmail(email: string): Promise<boolean> {
    return this.users.some((u): boolean => u.getEmail().toLowerCase() === email.toLowerCase());
  }

  public async existsByPseudo(pseudo: string): Promise<boolean> {
    return this.users.some((u): boolean => u.getPseudo().toLowerCase() === pseudo.toLowerCase());
  }

  public async create(data: IUserData): Promise<User> {
    // L'ID est déjà forgé par le service sous forme de UserId dans l'objet data
    const user = new User({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.users.push(user);
    return user;
  }

  public async update(id: UserId, data: Partial<IUserData>): Promise<User> {
    const idx: number = this.users.findIndex((u): boolean => u.getUserId().valeur === id.valeur);
    if (idx === -1) {
      throw new Error(`User with ID ${id.valeur} not found for update`);
    }
    const current: IUserData = this.users[idx].toData();
    const updated = new User({
      ...current,
      ...data,
      idUser: id, // Alignement nominal sur le champ idUser attendu par l'IUserData
      updatedAt: new Date()
    });
    this.users[idx] = updated;
    return updated;
  }

  public async delete(id: UserId): Promise<boolean> {
    const before: number = this.users.length;
    this.users = this.users.filter((u): boolean => u.getUserId().valeur !== id.valeur);
    return this.users.length < before;
  }

  /**
   * 🪓 ALIGNEMENT CONTRAT BASE : Extrait l'intégralité absolue de la table de simulation.
   * Requis par l'héritage strict de IBaseRepository via IUserRepository.
   *
   * @public
   * @async
   * @returns {Promise<User[]>} Le catalogue complet des utilisateurs simulés.
   */
  public async findAll(): Promise<User[]> {
    return [...this.users];
  }
}
