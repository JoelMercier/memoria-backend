// ——— fichier : src/infrastructure/repositories/UserRepository.ts

import { BaseRepository       } from '@/infrastructure/repositories/BaseRepositories';
import { UserId               } from '@/domain/value-objects/IdMetier';
import { User                 } from '@/entities/User';
import { Role                 } from '@/constants/Role';
import { AuthProvider         } from '@/constants/AuthProvider';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { UserErrorFactory     } from '@/exceptions/UserErrorFactory';
import { IListOptions         } from '@/interfaces/shared/IListOptions';
import { IUserRepository      } from '@/interfaces/repositories/IUserRepository';
import { IDatabaseConnection  } from '@/interfaces/database/IDatabaseConnection';

/**
 * 🗄️ Interface IUserRow (Miroir Physique Jojo-Style des Souterrains 🔌)
 */
interface IUserRow {
  usIdUser        : UserId;
  usCourriel      : string;
  usPasswordHash  : string;
  usPseudo        : string;
  usIdRole        : string;
  usIdProvider    : string;
  usSettingsUser  : Record<string, unknown>;
  usGdprConsent   : boolean;
  usGdprDate      : Date | null;
  usCreatedAt     : Date;
  usUpdatedAt     : Date | null;
}

/**
 * 👥 Classe UserRepository 🗄️ (Le Maître des Clés des Acteurs 🤖)
 * ----------------------------------------------------------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Utilisateurs.
 *
 * @class UserRepository
 * @extends {BaseRepository}
 * @author Déconstruction : Joël (Nostalgique de l'ADA)
 * @author Tréfilage du code : Gaïa (Polisseuse de bronze)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class UserRepository extends BaseRepository implements IUserRepository {

  /**
   * Initialise le dépôt de persistance via le gestionnaire de connexion universel 🔌.
   *
   * @constructor
   * @param {IDatabaseConnection} p_oDb - Le gestionnaire de connexion officiel de la Forge.
   */
  public constructor(p_oDb: IDatabaseConnection) {
    // On extrait le pool proprement pour la classe mère, comme son grand frère Item !
    super(p_oDb);
  }

  /**
   * Mappe une ligne PostgreSQL brute unifiée vers une entité typée User 🔄.
   *
   * @private
   * @param {IUserRow} p_oLigne - La ligne brute extraite de la Cour Basse
   * @returns {User} L instance de destination nominale réarmée
   */
  private LigneVersActeur(p_oLigne: IUserRow): User {
    return new User({
      idUser          : this.toDomainId(p_oLigne.usIdUser, UserId),
      email           : p_oLigne.usCourriel,
      passwordHash    : p_oLigne.usPasswordHash,
      pseudo          : p_oLigne.usPseudo,
      role            : Role.DeCode<Role>(p_oLigne.usIdRole),
      authProvider    : AuthProvider.DeCode<AuthProvider>(p_oLigne.usIdProvider),
      settingsUser    : p_oLigne.usSettingsUser,
      gdprConsent     : p_oLigne.usGdprConsent,
      gdprConsentDate : p_oLigne.usGdprDate ?? undefined,
      createdAt       : p_oLigne.usCreatedAt,
      updatedAt       : p_oLigne.usUpdatedAt ?? undefined
    });
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un acteur via son identifiant binaire fort 🤖.
   *
   * @public
   * @async
   * @param {UserId} p_oIdUser - L identifiant fort encapsulant le Buffer
   * @returns {Promise<User | null>} L entité Domaine réarmée ou null si absent
   */
  public async findById(p_oIdUser: UserId): Promise<User | null> {
    try {
      const la_oLignes = await this.executer<IUserRow>(
        'Select * From "Users" Where "usIdUser" = $1;',
        [p_oIdUser]
      );
      return la_oLignes && la_oLignes.length > 0 ? this.LigneVersActeur(la_oLignes[0]) : null;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('findById', (l_oErreur as Error).message);
    }
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son adresse francisée unifiée 📧.
   *
   * @public
   * @async
   * @param {string} p_sEmail - L adresse électronique brute à analyser
   * @returns {Promise<User | null>} L entité Domaine correspondante ou null
   */
  public async findByEmail(p_sEmail: string): Promise<User | null> {
    try {
      const la_oLignes = await this.executer<IUserRow>(
        'Select * From "Users" Where "usCourriel" = $1;',
        [p_sEmail.trim().toLowerCase()]
      );
      return la_oLignes && la_oLignes.length > 0 ? this.LigneVersActeur(la_oLignes[0]) : null;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('findByEmail', (l_oErreur as Error).message);
    }
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son pseudonyme public.
   *
   * @public
   * @async
   * @param {string} p_sPseudo - Le pseudonyme unique recherché
   * @returns {Promise<User | null>} L entité Domaine correspondante ou null
   */
  public async findByPseudo(p_sPseudo: string): Promise<User | null> {
    try {
      const la_oLignes = await this.executer<IUserRow>(
        'Select * From "Users" Where "usPseudo" = $1;',
        [p_sPseudo]
      );
      return la_oLignes && la_oLignes.length > 0 ? this.LigneVersActeur(la_oLignes[0]) : null;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('findByPseudo', (l_oErreur as Error).message);
    }
  }

  /**
   * 📧 Vérification d existence : Valide la présence d un courriel en base de données.
   *
   * @public
   * @async
   * @param {string} p_sEmail - Le courriel à tester
   * @returns {Promise<boolean>} True si le courriel est déjà sous clé
   */
  public async existsByEmail(p_sEmail: string): Promise<boolean> {
    try {
      const la_oLignes = await this.executer<{ exists: boolean }>(
        'Select Exists(Select 1 From "Users" Where "usCourriel" = $1) As exists;',
        [p_sEmail.trim().toLowerCase()]
      );
      return la_oLignes && la_oLignes.length > 0 ? la_oLignes[0].exists : false;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('existsByEmail', (l_oErreur as Error).message);
    }
  }

  /**
   * 👤 Vérification d existence : Valide la présence d un pseudonyme public.
   *
   * @public
   * @async
   * @param {string} p_sPseudo - Le pseudonyme à tester
   * @returns {Promise<boolean>} True si le pseudo est déjà pris
   */
  public async existsByPseudo(p_sPseudo: string): Promise<boolean> {
    try {
      const la_oLignes = await this.executer<{ exists: boolean }>(
        'Select Exists(Select 1 From "Users" Where "usPseudo" = $1) As exists;',
        [p_sPseudo]
      );
      return la_oLignes && la_oLignes.length > 0 ? la_oLignes[0].exists : false;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('existsByPseudo', (l_oErreur as Error).message);
    }
  }


  /**
   * 🪓 Écriture concrète : Insère un nouvel acteur via les types d acier de la Cour Basse 🪙.
   *
   * @public
   * @async
   * @param {any} p_oData - Le sac de données de création issu de l interface d entrée
   * @returns {Promise<User>} L entité Domaine fraîchement forgée et retournée
   * @throws {UserErrorFactory} En cas de collision d index unique détectée
   */
  public async create(p_oData: any): Promise<User> {
    try {
      const la_oLignes = await this.executer<IUserRow>(
        `Insert Into "Users" (
          "usIdUser", "usCourriel", "usPasswordHash", "usPseudo",
          "usIdRole", "usIdProvider", "usSettingsUser", "usGdprConsent", "usGdprDate", "usCreatedAt"
        ) Values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) Returning *;`,
        [
          this.toBuffer(p_oData.idUser),
          p_oData.email.trim().toLowerCase(),
          p_oData.passwordHash,
          p_oData.pseudo,
          p_oData.role.code,
          p_oData.authProvider.code,
          p_oData.settingsUser ?? {},
          p_oData.gdprConsent,
          p_oData.gdprConsentDate ?? (p_oData.gdprConsent ? new Date() : null),
          p_oData.createdAt ?? new Date()
        ]
      );

      if (!la_oLignes || la_oLignes.length === 0) throw UserErrorFactory.creation('Aucun enregistrement renvoyé.');
      return this.LigneVersActeur(la_oLignes[0]); // Extraction de l index 0 via notre méthode ! [Mémoria]
    } catch (l_oErreur) {
      if (l_oErreur instanceof UserErrorFactory) throw l_oErreur;
      const l_sMessage = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';

      // Alignement nominal sur les index d unicité d acier de notre nuit de forge [Mémoria]
      if (l_sMessage.includes('Users_usCourriel_Udx')) throw UserErrorFactory.emailExists(p_oData.email);
      throw UserErrorFactory.creation(l_sMessage);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles d un acteur en RAM 🧠.
   *
   * @public
   * @async
   * @param {UserId} p_oIdUser - L identifiant fort du profil à muter
   * @param {Partial<any>} p_oData - Les modifications partielles soumises
   * @returns {Promise<User>} L entité Domaine mise à jour au bit près
   */
  public async update(p_oIdUser: UserId, p_oData: Partial<any>): Promise<User> {
    const la_sChamps     : string[] = [];
    const la_oParametres : any[]    = [];
    let   l_iCompteur               = 1;

    if (p_oData.email           !== undefined) { la_sChamps.push(`"usCourriel"     = $${l_iCompteur++}`); la_oParametres.push(p_oData.email.trim().toLowerCase()); }
    if (p_oData.passwordHash    !== undefined) { la_sChamps.push(`"usPasswordHash" = $${l_iCompteur++}`); la_oParametres.push(p_oData.passwordHash              ); }
    if (p_oData.pseudo          !== undefined) { la_sChamps.push(`"usPseudo"       = $${l_iCompteur++}`); la_oParametres.push(p_oData.pseudo                    ); }
    if (p_oData.settingsUser    !== undefined) { la_sChamps.push(`"usSettingsUser" = $${l_iCompteur++}`); la_oParametres.push(p_oData.settingsUser              ); }
    if (p_oData.gdprConsent     !== undefined) { la_sChamps.push(`"usGdprConsent"  = $${l_iCompteur++}`); la_oParametres.push(p_oData.gdprConsent               ); }
    if (p_oData.gdprConsentDate !== undefined) { la_sChamps.push(`"usGdprDate"     = $${l_iCompteur++}`); la_oParametres.push(p_oData.gdprConsentDate           ); }
    if (p_oData.role            !== undefined) { la_sChamps.push(`"usIdRole"       = $${l_iCompteur++}`); la_oParametres.push(p_oData.role.code                 ); }
    if (p_oData.authProvider    !== undefined) { la_sChamps.push(`"usIdProvider"   = $${l_iCompteur++}`); la_oParametres.push(p_oData.authProvider.code         ); }

    if (la_sChamps.length === 0) {
      const l_oExistant = await this.findById(p_oIdUser);
      if (!l_oExistant) throw UserErrorFactory.notFound(p_oIdUser);
      return l_oExistant;
    }

    la_oParametres.push(this.toBuffer(p_oIdUser));

    try {
      const la_oLignes = await this.executer<IUserRow>(
        `Update "Users" Set ${la_sChamps.join(', ')} Where "usIdUser" = $${l_iCompteur} Returning *;`,
        la_oParametres
      );
      if (!la_oLignes || la_oLignes.length === 0) throw UserErrorFactory.notFound(p_oIdUser);
      return this.LigneVersActeur(la_oLignes[0]); // Extraction de l index 0 du tableau ! [Mémoria]
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('update', (l_oErreur as Error).message);
    }
  }

  /**
   * 🪓 Destruction physique d infrastructure (À n utiliser qu en cas de purge complète) 🚨.
   *
   * @public
   * @async
   * @param {UserId} p_oIdUser - L identifiant fort du profil à éradiquer
   * @returns {Promise<boolean>} True si l impact physique est validé sur le disque
   */
  public async delete(p_oIdUser: UserId): Promise<boolean> {
    try {
      await this.executer<any>(
        'Delete From "Users" Where "usIdUser" = "Bin-UUID"($1);',
        [p_oIdUser]
      );
      return true;
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('delete', (l_oErreur as Error).message);
    }
  }

  /**
   * 🚀 Extraction contractuelle paginée Jojo-Style via l USINE DE FONCTION STOCKÉE 🌐 [Mémoria].
   *
   * @public
   * @async
   * @param {number} p_iNbLignesMax - Quantité maximale de profils autorisés en RAM (Garde-fou 100)
   * @param {number} p_iIndexDepart - Point d ancrage du curseur logique de décalage
   * @returns {Promise<User[]>} La liste des entités Domaines triée et réarmée
   */
  public async obtenirActeursPagine(p_iNbLignesMax: number, p_iIndexDepart: number): Promise<User[]> {
    const { limit, offset } = this.calculerPaginationContractuelle(p_iNbLignesMax, p_iIndexDepart);

    try {
      const la_oLignesBrutes = await this.executer<IUserRow>(
        'Select * From "LireActeursSysteme"($1, $2);',
        [limit, offset]
      );
      return la_oLignesBrutes.map((l_oLigne: IUserRow) => this.LigneVersActeur(l_oLigne));
    } catch (l_oErreur) {
      throw DatabaseErrorFactory.queryFailed('obtenirActeursPagine', (l_oErreur as Error).message);
    }
  }

  /**
   * 📊 Récupération paginée contractuelle des utilisateurs (Anti-Cramage Jojo-Style 🛡️).
   * Raccordée directement sur l'usine de fonction stockée de la base de données.
   *
   * @public
   * @async
   * @param {IListOptions} [p_oOptions] - Les filtres d'excellence (pagination, tri, limite).
   * @returns {Promise<User[]>} La liste bridée et réarmée des instances Domaines.
   */
  public async findAll(p_oOptions?: IListOptions): Promise<User[]> {
    // Extraction des options avec nos gardes-fous réglementaires
    const l_nLimit = p_oOptions?.NbLignesMax ?? 100;
    const l_nOffset = p_oOptions?.IndexDepart ?? 0;

    // Raccordement direct sur votre fonction stockée performante !
    return this.obtenirActeursPagine(l_nLimit, l_nOffset);
  }
}