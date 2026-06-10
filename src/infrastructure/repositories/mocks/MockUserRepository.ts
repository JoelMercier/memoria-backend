// ——— fichier : src/infrastructure/repositories/mocks/MockUserRepository.ts

import { User }                 from '@/entities/User';
import { UserId }               from '@/domain/value-objects/ids';
import type { IUserData }       from '@/interfaces/entities/user/IUserData';
import type { IListOptions }         from '@/interfaces/shared/IListOptions';
import type { IListResult }          from '@/interfaces/shared/IListResult';
import OrdreTriEnum                 from '@/constants/OrdreTriEnum';
import { IMockUserRepository } from '@/interfaces/repositories/Mocks/IMockUserRepository';


/**
 * 🗄️ Classe MockUserRepository 🧮 (Le Banc de Test des Acteurs 🤖)
 * ----------------------------------------------------------------------------
 * Simulateur passif en RAM émulant le cycle de vie complet de la table "Users".
 * Garantit l'étanchéité contractuelle absolue face à l'interface IUserRepository V4.
 * Purifié définitivement de la bureaucratie des disques et raccordé sur IMemoryRW.
 *
 * @class MockUserRepository
 * @implements {IMockUserRepository}
 * @author Déconstruction : Joël (Nostalgique de l'ADA - Exterminateur de parenthèses)
 * @author Martelage du code : Gaïa (Au burin, calée sur le standard nominal V4)
 */
export class MockUserRepository implements IMockUserRepository {
  /** 🧠 La table virtuelle simulant le stockage physique contigu en mémoire vive */
  private m_aoUsers: User[] = [];

  /**
   * 🎰 Accesseur privé centralisé régissant l'accès à la soute de RAM.
   * [SCELLÉ C++] Garantit l'unicité du pointeur d'accès pour les itérations.
   *
   * @private
   * @returns {User[]} Le pointeur direct vers la collection active de simulation
   */
  private get Users(): User[] {
    return this.m_aoUsers;
  }
  private set Users(p_aUsers : User[]) {
    this.m_aoUsers = p_aUsers;
  }

  /**
   * 🔍 Localise un acteur via son identifiant nominal fort 🤖.
   *
   * @public
   * @async
   * @param {UserId} p_oId - L'identifiant unique encapsulant le Buffer
   * @returns {Promise<User | null>} L'instance trouvée ou null si absente
   */
  public async findById(p_oId: UserId): Promise<User | null> {
    // 🪓 [RÉPARÉ V4] Lecture directe par le vrai getter de surface .idUser sans parenthèses ! [Mémoria]
    return this.Users.find((l_oUser: User): boolean => l_oUser.idUser.estEgalA(p_oId)) ?? null;
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son courriel normalisé 📧.
   * [SCELLÉ V4] Plus de getEmail(), interrogation directe du getter .email ! [Mémoria]
   *
   * @public
   * @async
   * @param {string} p_sEmail - Le courriel à analyser
   * @returns {Promise<User | null>} L'entité correspondante ou null
   */
  public async findByEmail(p_sEmail: string): Promise<User | null> {
    const l_sRecherche: string = p_sEmail.toLowerCase().trim();
    return (
      this.Users.find((l_oUser: User): boolean => l_oUser.courriel.toLowerCase().trim() === l_sRecherche) ?? null
    );
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son pseudonyme public.
   * [SCELLÉ V4] Plus de getPseudo(), interrogation directe du getter .pseudo ! [Mémoria]
   *
   * @public
   * @async
   * @param {string} p_sPseudo - Le pseudo public à localiser
   * @returns {Promise<User | null>} L'entité correspondante ou null
   */
  public async findByPseudo(p_sPseudo: string): Promise<User | null> {
    const l_sRecherche: string = p_sPseudo.toLowerCase().trim();
    return (
      this.Users.find((l_oUser: User): boolean => l_oUser.pseudo.toLowerCase().trim() === l_sRecherche) ?? null
    );
  }

  /**
   * 📧 Vérification d'existence : Valide la présence d'un courriel.
   *
   * @public
   * @async
   * @param {string} p_sEmail - Le courriel à vérifier
   * @returns {Promise<boolean>} True si le courriel est déjà capturé
   */
  public async existsByEmail(p_sEmail: string): Promise<boolean> {
    const l_sRecherche: string = p_sEmail.toLowerCase().trim();
    return this.Users.some((l_oUser: User): boolean => l_oUser.courriel.toLowerCase().trim() === l_sRecherche);
  }

  /**
   * 👤 Vérification d'existence : Valide la présence d'un pseudonyme public.
   *
   * @public
   * @async
   * @param {string} p_sPseudo - Le pseudo public à éprouver
   * @returns {Promise<boolean>} True si le pseudo est déjà verrouillé
   */
  public async existsByPseudo(p_sPseudo: string): Promise<boolean> {
    const l_sRecherche: string = p_sPseudo.toLowerCase().trim();
    return this.Users.some((l_oUser: User): boolean => l_oUser.pseudo.toLowerCase().trim() === l_sRecherche);
  }

  /**
   * 🪓 Écriture concrète : Insère un fausse acteur dans le catalogue de simulation 🪙.
   *
   * @public
   * @async
   * @param {IUserData} p_oData - Le sac de données complet exigé par l'interface
   * @returns {Promise<User>} L'instance de l'entité d'acteur forgée
   */
  public async create(p_oData: IUserData): Promise<User> {
    const l_oUser = new User({
      ...p_oData,
      createdAt : new Date(),
      updatedAt : new Date()
    });
    this.Users.push(l_oUser);
    return l_oUser;
  }

  /**
   * 🪓 Mutation en mémoire : Modifie partiellement un acteur simulé.
   *
   * @public
   * @async
   * @param {UserId} p_oId - L'identifiant unique fort de soute
   * @param {Partial<IUserData>} p_oData - Le dictionnaire de modifications partielles
   * @returns {Promise<User>} L'entité modifiée hydratée
   */
  public async update(p_oId: UserId, p_oData: Partial<IUserData>): Promise<User> {
    const l_iIdx: number = this.Users.findIndex((l_oUser: User): boolean => l_oUser.idUser.estEgalA(p_oId));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] User unique ID ${p_oId.valeur} introuvable pour la mise à jour.`);
    }

    const l_oCourant : IUserData = this.Users[l_iIdx].toData();
    const l_oMute    = new User({
      ...l_oCourant,
      ...p_oData,
      idUser    : p_oId,
      updatedAt : new Date()
    });

    this.Users[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🪓 Retrait physique : Supprime une ressource de la collection de simulation.
   *
   * @public
   * @async
   * @param {UserId} p_oIdUser - L'identifiant fort de soute à détruire
   * @returns {Promise<boolean>} True si effectif
   */
  public async delete(p_oIdUser: UserId): Promise<boolean> {
    const l_iTailleInitiale: number = this.Users.length;
    this.Users = this.Users.filter((l_oUser: User): boolean => !l_oUser.idUser.estEgalA(p_oIdUser));
    return this.Users.length < l_iTailleInitiale;
  }

  /**
   * 🏺 Contrat de base universel : Extrait l'intégralité absolue sous forme paginée d'état.
   * [SCELLÉ RECOUVREMENT] Interrogation exclusive de la méthode appliquerPaginationRAM ! [Mémoria]
   *
   * @public
   * @async
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites universel obligatoires
   * @returns {Promise<IListResult<User>>} Le lot de résultats global paginé au standard français d'élite
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<User>> {
    return this.appliquerPaginationRAM(this.Users, p_oOptions);
  }

  /**
   * 🚀 Extraction contractuelle paginée Jojo-Style raccordée sur le français d'élite.
   * [ZÉRO TEXTE SQL] Émule à 100% l'extraction de Cour Basse.
   *
   * @public
   * @async
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites universel obligatoires
   * @returns {Promise<IListResult<User>>} Le lot de résultats global paginé au standard français d'élite
   */
  public async obtenirActeursPagine(p_oOptions: IListOptions): Promise<IListResult<User>> {
    return this.appliquerPaginationRAM(this.Users, p_oOptions);
  }

  /**
   * 🧮 Utilitaire privé d'infrastructure émulant le moteur de pagination et tri universel en RAM.
   */
  private appliquerPaginationRAM(p_aoSource: User[], p_oOptions: IListOptions): IListResult<User> {
    const l_nTotal = p_aoSource.length;
    const l_nLimit = p_oOptions.NbLignes ?? 50;
    const l_nOffset = p_oOptions.LigneDebut ?? 0;

    const l_sCleTri = p_oOptions.ColonneTri === 'usPseudo' ? 'pseudo' : 'idUser';
    p_aoSource.sort((l_oA: any, l_oB: any): number => {
      const l_vA = l_oA[l_sCleTri];
      const l_vB = l_oB[l_sCleTri];
      const l_sOrdre = p_oOptions.OrdreAff instanceof OrdreTriEnum ? p_oOptions.OrdreAff.code : 'DESC';
      return l_sOrdre === 'DESC' ? (l_vA > l_vB ? -1 : 1) : (l_vA < l_vB ? -1 : 1);
    });

    const l_aoPage = p_aoSource.slice(l_nOffset, l_nOffset + l_nLimit);

    return {
      LigneDebut:    l_nOffset,
      NbLignesDem:   l_nLimit,
      NbLignesRenv:  l_aoPage.length,
      NbLignesTotal: l_nTotal,
      Lignes:        l_aoPage
    };
  }
}
