// ——— fichier : src/infrastructure/repositories/mocks/MockUserRepository.ts

import { User                 } from '@/entities/User';
import { UserId               } from '@/domain/value-objects/ids';
import type { IUserData       } from '@/interfaces/entities/user/IUserData';
import type { IUserRepository } from '@/interfaces/repositories/IUserRepository';

/**
 * 🗄️ Classe MockUserRepository 🧮 (Le Banc de Test des Acteurs 🤖)
 * ----------------------------------------------------------------------------
 * Simulateur passif en RAM émulant le cycle de vie complet de la table "Users".
 * Garantit l étanchéité contractuelle absolue face à l interface IUserRepository.
 *
 * @class MockUserRepository
 * @implements {IUserRepository}
 * @author Déconstruction : Joël (Nostalgique de l'ADA)
 * @author Martelage du code : Gaïa (Génie autoproclamée du burin)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class MockUserRepository implements IUserRepository {
  /** 🧠 La table virtuelle simulant le stockage physique contigu en mémoire vive */
  private m_aoUsers: User[] = [];

  /**
   * 🔍 Localise un acteur via son identifiant nominal fort 🤖.
   *
   * @public
   * @async
   * @param {UserId} p_oId - L identifiant unique encapsulant le Buffer
   * @returns {Promise<User | null>} L instance trouvée ou null si absente
   */
  public async findById(p_oId: UserId): Promise<User | null> {
    return this.m_aoUsers.find((l_oUser: User): boolean => l_oUser.getUserId().estEgalA(p_oId)) ?? null;
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son courriel normalisé 📧.
   *
   * @public
   * @async
   * @param {string} p_sEmail - Le courriel à analyser
   * @returns {Promise<User | null>} L entité correspondante ou null
   */
  public async findByEmail(p_sEmail: string): Promise<User | null> {
    const l_sRecherche: string = p_sEmail.toLowerCase().trim();
    return (
      this.m_aoUsers.find((l_oUser: User): boolean => l_oUser.getEmail().toLowerCase().trim() === l_sRecherche) ?? null
    );
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son pseudonyme public.
   *
   * @public
   * @async
   * @param {string} p_sPseudo - Le pseudo public à localiser
   * @returns {Promise<User | null>} L entité correspondante ou null
   */
  public async findByPseudo(p_sPseudo: string): Promise<User | null> {
    const l_sRecherche: string = p_sPseudo.toLowerCase().trim();
    return (
      this.m_aoUsers.find((l_oUser: User): boolean => l_oUser.getPseudo().toLowerCase().trim() === l_sRecherche) ?? null
    );
  }

  /**
   * 📧 Vérification d existence : Valide la présence d un courriel.
   */
  public async existsByEmail(p_sEmail: string): Promise<boolean> {
    const l_sRecherche: string = p_sEmail.toLowerCase().trim();
    return this.m_aoUsers.some((l_oUser: User): boolean => l_oUser.getEmail().toLowerCase().trim() === l_sRecherche);
  }

  /**
   * 👤 Vérification d existence : Valide la présence d un pseudonyme public.
   */
  public async existsByPseudo(p_sPseudo: string): Promise<boolean> {
    const l_sRecherche: string = p_sPseudo.toLowerCase().trim();
    return this.m_aoUsers.some((l_oUser: User): boolean => l_oUser.getPseudo().toLowerCase().trim() === l_sRecherche);
  }

  /**
   * 🪓 Écriture concrète : Insère un fausse acteur dans le catalogue de simulation 🪙.
   */
  public async create(p_oData: IUserData): Promise<User> {
    const l_oUser = new User({
      ...p_oData,
      createdAt : new Date(),
      updatedAt : new Date()
    });
    this.m_aoUsers.push(l_oUser);
    return l_oUser;
  }

  /**
   * 🪓 Mutation en mémoire : Modifie partiellement un acteur simulé.
   */
  public async update(p_oId: UserId, p_oData: Partial<IUserData>): Promise<User> {
    const l_iIdx: number = this.m_aoUsers.findIndex((l_oUser: User): boolean => l_oUser.getUserId().estEgalA(p_oId));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] User unique ID ${p_oId.valeur} introuvable pour la mise à jour.`);
    }

    const l_oCourant : IUserData = this.m_aoUsers[l_iIdx].toData();
    const l_oMute    = new User({
      ...l_oCourant,
      ...p_oData,
      idUser    : p_oId,
      updatedAt : new Date()
    });

    this.m_aoUsers[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🪓 Retrait physique : Supprime une ressource de la collection de simulation.
   */
  public async delete(p_oId: UserId): Promise<boolean> {
    const l_iTailleInitiale: number = this.m_aoUsers.length;
    this.m_aoUsers = this.m_aoUsers.filter((l_oUser: User): boolean => !l_oUser.getUserId().estEgalA(p_oId));
    return this.m_aoUsers.length < l_iTailleInitiale;
  }

  /**
   * 🏺 contrat de base : Extrait l intégralité absolue de la table de simulation.
   * Obligatoire tant que IBaseRepository déclare la présence réglementaire de la méthode [Mémoria].
   *
   * @public
   * @async
   * @returns {Promise<User[]>} Le catalogue complet des profils
   */
  public async findAll(): Promise<User[]> {
    return [...this.m_aoUsers];
  }

  /**
   * 🚀 Extraction contractuelle paginée Jojo-Style émulant la fonction stockée de Cour Basse 🌐 [Mémoria].
   */
  public async obtenirActeursPagine(p_iNbLignesMax: number, p_iIndexDepart: number): Promise<User[]> {
    const l_iLimit  : number = p_iNbLignesMax <= 0 || p_iNbLignesMax > 100 ? 50 : Math.floor(p_iNbLignesMax);
    const l_iOffset : number = p_iIndexDepart < 0 ? 0 : Math.floor(p_iIndexDepart);

    // CORRECTION PHYSIQUE DU UNDEFINED : Sécurisation absolue via l opérateur optionnel ?. et repli ?? 0 [Mémoria]
    const la_oTriees = [...this.m_aoUsers].sort((a, b) =>
      (b.toData().createdAt?.getTime() ?? 0) - (a.toData().createdAt?.getTime() ?? 0)
    );

    return la_oTriees.slice(l_iOffset, l_iOffset + l_iLimit);
  }
}
