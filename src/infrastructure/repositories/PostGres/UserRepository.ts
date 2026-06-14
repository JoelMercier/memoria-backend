// ——— fichier : src/infrastructure/repositories/PostGres/UserRepository.ts

import type { QueryResultRow } from 'pg';
import { BaseRepository } from '@/infrastructure/repositories/BaseRepositories';
import { UserId, RoleId, ProviderId } from '@/domain/value-objects/ids';
import { User } from '@/entities/User';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import type { IUserRepository } from '@/interfaces/repositories/PostGres/IUserRepository';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IListOptions } from '@/interfaces/shared/IListOptions';
import type { IListResult } from '@/interfaces/shared/IListResult';
import OrdreTriEnum from '@/constants/OrdreTriEnum';

/**
 * 🗄️ Interface IUserRow (Miroir Physique Jojo-Style des Acteurs 🔌)
 * Alignée au caractère près sur l'ordre physique décroissant anti-padding de la base.
 */
interface IUserRow extends QueryResultRow {
  usIdUser       : Buffer;                                              //-- 16 octets fixes tassés en RAM.
  usCourriel     : string;
  usPasswordHash : string;
  usPseudo       : string;
  usIdRole       : string;                                              // Char(4) dictionnaire.
  usIdProvider   : string;                                              // Char(4) dictionnaire.
  usSettingsUser : Record<string, string>;
  usGdprConsent  : boolean;
  usGdprDate     : Date | null;
  usCreatedAt    : Date;
  usUpdatedAt    : Date | null;
  rNbLignesTotal?: string;                                              // Volumétrie calculée par le chateau.
}

/**
 * 🗄️ Classe UserRepository 👥 (Le Donjon de Persistance des Acteurs 🤖)
 * ----------------------------------------------------------------------------
 * Implémentation PostgreSQL du stockage et du cycle de vie complet des Utilisateurs.
 * Purifiée du SQL volant de Phase 1 au profit des fonctions stockées exclusives.
 *
 * @class UserRepository
 * @extends {BaseRepository}
 * @implements {IUserRepository}
 * @author Conception & Vision : Joël (Purement infonctionnel et Void capillaire)
 * @author Rabotage du Code : Gaïa (Au burin, nettoyée de ses écarts de soute V4)
 */
export class UserRepository extends BaseRepository implements IUserRepository {
  /**
   * Initialise le dépôt des profils via le pool global d'infrastructure 🔌.
   *
   * @constructor
   * @param {IDatabaseConnection} p_oDb - L'instance de connexion active de Cour Basse
   */
  public constructor(p_oDb: IDatabaseConnection) {
    super(p_oDb);
  }

  /**
   * Mappe une ligne PostgreSQL brute vers une entité typée User 🔄.
   * [RÉPARÉ V4] Instanciation POO pure directe de Bloc 1 sans toDomainId paresseux !
   *
   * @private
   * @param {IUserRow} p_oRow - La ligne brute PostgreSQL
   * @returns {User} L'entité vivante du Domaine hydratée et scellée
   */
  private LigneVersActeur(p_oRow: IUserRow): User {
    return new User({
      idUser         : new UserId(p_oRow.usIdUser),                     // Instanciation directe étanche [Mémoria]
      roleId         : new RoleId(p_oRow.usIdRole),
      authProviderId : new ProviderId(p_oRow.usIdProvider),
      courriel       : p_oRow.usCourriel,
      passwordHash   : p_oRow.usPasswordHash,
      pseudo         : p_oRow.usPseudo,
      settingsUser   : p_oRow.usSettingsUser,
      rgpdConsent    : p_oRow.usGdprConsent,
      rgpdConsentDate: p_oRow.usGdprDate ?? undefined,
      createdAt      : p_oRow.usCreatedAt,
      updatedAt      : p_oRow.usUpdatedAt ?? undefined
    });
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un actor via son identifiant nominal fort 🤖.
   */
  public async findById(p_oIdUser: UserId): Promise<User | null> {
    try {
      const l_oResult = await this.db.query<IUserRow>(
        'Select * From public."Users" Where "usIdUser" = "Bin-UUID"($1);',
        [p_oIdUser]
      );
      return l_oResult.rows && l_oResult.rows.length > 0 ? this.LigneVersActeur(l_oResult.rows[0]) : null;
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.findById', l_sMsg);
    }
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son courriel normalisé 📧.
   * [SCELLÉ V4] Raccordement direct sur votre turbine User_Recherche_Par_Courriel.
   */
  public async findByCourriel(p_sCourriel: string): Promise<User | null> {
    try {
      const l_oResult = await this.db.query<IUserRow>(
        'Select * From "User_Recherche_Par_Courriel"($1);',
        [p_sCourriel]
      );
      return l_oResult.rows && l_oResult.rows.length > 0 ? this.LigneVersActeur(l_oResult.rows[0]) : null;
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.findByCourriel', l_sMsg);
    }
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son pseudonyme public.
   */
  public async findByPseudo(p_sPseudo: string): Promise<User | null> {
    try {
      const l_oResult = await this.db.query<IUserRow>(
        'Select * From "Users" Where "usPseudo" = Trim($1);',
        [p_sPseudo]
      );
      return l_oResult.rows && l_oResult.rows.length > 0 ? this.LigneVersActeur(l_oResult.rows[0]) : null;
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.findByPseudo', l_sMsg);
    }
  }

  /**
   * 📧 Vérification d'existence : Valide la présence d'un courriel.
   */
  public async existsByCourriel(p_sCourriel: string): Promise<boolean> {
    try {
      const l_oResult = await this.db.query<{ exists: boolean }>(
        'Select Exists(Select 1 From public."Users" Where "usCourriel" = Lower(Trim($1))) as "exists";',
        [p_sCourriel]
      );
      return Boolean(l_oResult.rows?.[0]?.exists ?? false);
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.existsByCourriel', l_sMsg);
    }
  }

  /**
   * 👤 Vérification d'existence : Valide la présence d'un pseudonyme public.
   * [SCELLÉ V4] Raccordement direct sur votre turbine binaire User_Verifie_Existence_Pseudo.
   */
  public async existsByPseudo(p_sPseudo: string): Promise<boolean> {
    try {
      const l_oResult = await this.db.query<{ exists: boolean }>(
        'Select "User_Verifie_Existence_Pseudo"($1) as "exists";',
        [p_sPseudo]
      );
      return Boolean(l_oResult.rows?.[0]?.exists ?? false);
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.existsByPseudo', l_sMsg);
    }
  }

  /**
   * 🪓 Écriture concrète : Insère un nouvel acteur via la fonction stockée exclusive.
   */
  public async create(p_oData: IUserData): Promise<User> {
    try {
      const l_oResult = await this.db.query<IUserRow>(
        'Select * From "CreerActeur"($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);',
        [
          p_oData.idUser,
          p_oData.courriel,
          p_oData.passwordHash,
          p_oData.pseudo,
          p_oData.roleId.valeur,
          p_oData.authProviderId.valeur,
          p_oData.settingsUser ?? {},
          p_oData.rgpdConsent,
          p_oData.rgpdConsentDate ?? new Date(),
          p_oData.createdAt ?? new Date()
        ]
      );

      if (!l_oResult.rows || l_oResult.rows.length === 0) {
        throw UserErrorFactory.creation('Aucun enregistrement renvoyé.');
      }
      return this.LigneVersActeur(l_oResult.rows[0]);
    } catch (l_oErreur) {
      if (l_oErreur instanceof UserErrorFactory) throw l_oErreur;
      const l_sMessage = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';

      if (l_sMessage.includes('Users_usCourriel_Udx'))
        throw UserErrorFactory.courrielExists(p_oData.courriel);
      throw UserErrorFactory.creation(l_sMessage);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles d'un acteur via la fonction stockée.
   */
  public async update(p_oIdUser: UserId, p_oData: Partial<IUserData>): Promise<User> {
    try {
      const l_oResult = await this.db.query<IUserRow>(
        'Select * From "ModifierActeur"($1, $2, $3, $4, $5, $6, $7, $8, $9);',
        [
          p_oIdUser,
          p_oData.courriel ?? null,
          p_oData.passwordHash ?? null,
          p_oData.pseudo ?? null,
          p_oData.settingsUser ?? null,
          p_oData.rgpdConsent ?? null,
          p_oData.rgpdConsentDate ?? null,
          p_oData.roleId ? p_oData.roleId.valeur : null,
          p_oData.authProviderId ? p_oData.authProviderId.valeur : null
        ]
      );

      if (!l_oResult.rows || l_oResult.rows.length === 0)
        throw UserErrorFactory.notFound(p_oIdUser);
      return this.LigneVersActeur(l_oResult.rows[0]);
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.update', l_sMsg);
    }
  }

  /**
   * 🪓 Destruction physique d'infrastructure.
   */
  public async delete(p_oIdUser: UserId): Promise<boolean> {
    try {
      const l_oResult = await this.db.query(
        'Delete From public."Users" Where "usIdUser" = "Bin-UUID"($1);',
        [p_oIdUser]
      );
      return (l_oResult.rowCount ?? 0) > 0;
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.delete', l_sMsg);
    }
  }

  /**
   * 📜 VRAI FINDALL CONSTITUTIONNEL V4 🏛️
   * ----------------------------------------------------------------------------
   * Extrait l'intégralité absolue de la table Users de manière globale (Mode Système/Admin).
   * [BRIDER MEMOIRE] Exige obligatoirement ses options de pagination pour interdire les fuites.
   * [ZÉRO SQL VOLANT] Interroge exclusivement la fonction stockée TousLesActeursDuChateau !
   *
   * @public
   * @async
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites universel obligatoires
   * @returns {Promise<IListResult<User>>} Le lot de résultats global paginé au standard français d'élite
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<User>> {
    try {
      const l_nLimit  = p_oOptions.NbLignes  ?? 50;
      const l_nOffset = p_oOptions.LigneDebut ?? 0;

      // 🪓 ALIGNEMENT DIRECTIVE DE RAM : Remplacement du texte dur par la valeur SQL de l'écurie
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum
        ? (p_oOptions.OrdreAff as any).m_sValueSql
        : 'DESC';

      // 🗲 Appel de l'extracteur global de soute sans un seul pixel de SQL volant !
      const l_oResult = await this.db.query<IUserRow>(
        'Select * From "TousLesActeursDuChateau"($1, $2, $3, $4);',
        [l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'usCreatedAt', l_sOrdreTri]
      );

      // 🪓 [RÉPARÉ TS2339] Extraction de la volumétrie absolue calculée sur la première ligne du tableau !
      const l_nTotal   = Number(l_oResult.rows?.[0]?.rNbLignesTotal ?? 0);
      const l_aoLignes = l_oResult.rows.map((l_oRow) => this.LigneVersActeur(l_oRow));

      return {
        LigneDebut:    l_nOffset,
        NbLignesDem:   l_nLimit,
        NbLignesRenv:  l_aoLignes.length,
        NbLignesTotal: l_nTotal,
        Lignes:        l_aoLignes
      };
    } catch (l_oErreur) {
      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.findAll', l_sMsg);
    }
  }
}
