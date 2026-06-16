// ——— fichier : src/infrastructure/repositories/PostGres/UserRepository.ts

import type { QueryResultRow      } from 'pg';
import type { IUserData           } from '@/interfaces/entities/user/IUserData';
import type { IUserRepository     } from '@/interfaces/repositories/PostGres/IUserRepository';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IListOptions        } from '@/interfaces/shared/IListOptions';
import type { IListResult         } from '@/interfaces/shared/IListResult';

import { BaseRepository       } from '@/infrastructure/repositories/BaseRepositories';
import { User                 } from '@/entities/User';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { UserErrorFactory     } from '@/exceptions/UserErrorFactory';
import { OrdreTriEnum         } from '@/constants/OrdreTriEnum';

import { UserId, RoleId, ProviderId } from '@/domain/value-objects/ids';


  /**
   * 🗄️ Interface IUserRow (Miroir Physique Jojo-Style des Acteurs 🔌)
 */
interface IUserRow extends QueryResultRow {
  usIdUser       : Buffer;                                              //-- [SCELLÉ] Maintien du format binaire compact de 16 octets !
  usCourriel     : string;
  usPasswordHash : string;
  usPseudo       : string;
  usRoleId       : string;
  usProviderId   : string;
  usSettingsUser : Record<string, string>;
  usRgpdConsent  : boolean;
  usRgpdDate     : Date | null;
  usCreatedAt    : Date;
  usUpdatedAt    : Date | null;
  rNbLignesTotal?: string;
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

  private LigneVersActeur(p_oRow: IUserRow): User {
    return new User({
      idUser         : new UserId(p_oRow.usIdUser),                     //-- Hydratation par Buffer pur [Mémoria]
      roleId         : new RoleId(p_oRow.usRoleId),
      authProviderId : new ProviderId(p_oRow.usProviderId),
      courriel       : p_oRow.usCourriel,
      passwordHash   : p_oRow.usPasswordHash,
      pseudo         : p_oRow.usPseudo,
      settingsUser   : p_oRow.usSettingsUser,
      rgpdConsent    : p_oRow.usRgpdConsent,
      rgpdConsentDate: p_oRow.usRgpdDate ?? undefined,
      createdAt      : p_oRow.usCreatedAt,
      updatedAt      : p_oRow.usUpdatedAt ?? undefined
    });
  }


  /**
   * 🔍 Lecture chirurgicale : Localise un acteur via son identifiant nominal fort 🤖.
   */
  public async findById(p_oIdUser: UserId): Promise<User | null> {
    try {

      const l_oResult = await this.db.query<IUserRow>(
        'Select * From public."TrouverActeurParCle"($1);', [ p_oIdUser.binaire ] );
      return l_oResult.rows && l_oResult.rows.length > 0 ? this.LigneVersActeur(l_oResult.rows[0]) : null;

    } catch (l_oErreur) {

      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.findById / TrouverActeurParCle()', l_sMsg);

    }
  }


  /**
   * 🔍 Alignement nominal : Localise un acteur via son courriel normalisé 📧.
   */
  public async findByCourriel(p_sCourriel: string): Promise<User | null> {
    try {

      const l_oResult = await this.db.query<IUserRow>(
        'Select * From public."TrouverActeurParCourriel"($1);', [ p_sCourriel ] );
      return l_oResult.rows && l_oResult.rows.length > 0 ? this.LigneVersActeur(l_oResult.rows[0]) : null;

    } catch (l_oErreur) {

      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.findByCourriel / TrouverActeurParCourriel', l_sMsg);

    }
  }


  /**
   * 🔍 Alignement nominal : Localise un acteur via son pseudonyme public.
   */
  public async findByPseudo(p_sPseudo: string): Promise<User | null> {
    try {

      const l_oResult = await this.db.query<IUserRow>(
        'Select * From public."TrouverActeurParPseudo"($1);', [ p_sPseudo ] );
      return l_oResult.rows && l_oResult.rows.length > 0 ? this.LigneVersActeur(l_oResult.rows[0]) : null;

    } catch (l_oErreur) {

      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.findByPseudo / TrouverActeurParPseudo', l_sMsg);

    }
  }


  /**
   * 📧 Vérification d'existence : Valide la présence d'un courriel.
   * Fusion par non-nullité : appel direct à findByCourriel.
   */
  public async existsByCourriel(p_sCourriel: string): Promise<boolean> {
    const l_oActeur = await this.findByCourriel(p_sCourriel);
    return l_oActeur !== null;
  }

  /**
   * 👤 Vérification d'existence : Valide la présence d'un pseudonyme public.
   * Fusion par non-nullité : appel direct à findByPseudo.
   */
  public async existsByPseudo(p_sPseudo: string): Promise<boolean> {
    const l_oActeur = await this.findByPseudo(p_sPseudo);
    return l_oActeur !== null;
  }


  /**
   * 🪓 Écriture concrète : Insère un nouvel acteur via la fonction stockée exclusive.
   */
  public async create(p_oData: IUserData): Promise<User> {
    try {
      const l_oResult = await this.db.query<IUserRow>(
        'Select * From "CreerActeur"($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);',
        [
          p_oData.idUser.binaire,
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
          p_oIdUser.binaire,
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
      throw DatabaseErrorFactory.queryFailed('User.update / ModifierActeur', l_sMsg);

    }
  }


  /**
   * 🛡️ Décontamination Sémantique (Ex-Delete physique obsolète)
   * [SCELLÉ V4] Déclenche l'anonymisation irréversible RGPD. Plus aucun DELETE volant !
   */
  public async delete(p_oIdUser: UserId): Promise<boolean> {
    try {

      const l_oResult = await this.db.query(
        'Select * From public."AnonymiserActeurSysteme"($1);', [p_oIdUser.binaire] );
      return (l_oResult.rowCount ?? 0) > 0;

    } catch (l_oErreur) {

      const l_sMsg = l_oErreur instanceof Error ? l_oErreur.message : 'unknown';
      throw DatabaseErrorFactory.queryFailed('User.delete (AnonymiserActeurSysteme)', l_sMsg);
      
    }
  }

  /**
   * 📜 FINDALL 🏛️
   * ----------------------------------------------------------------------------
   * Extrait l'intégralité absolue de la table Users de manière globale (Mode Système/Admin).
   * Avec ses options de pagination et la fonction stockée TousLesActeursDuChateau
   *
   * @public
   * @async
   * @param {IListOptions} p_oOptions - Le dictionnaire de tri et limites universel obligatoires
   * @returns {Promise<IListResult<User>>} Le lot de résultats global paginé
   */
  public async findAll(p_oOptions: IListOptions): Promise<IListResult<User>> {
    try {
      const l_nLimit  = p_oOptions.NbLignes  ?? 50;
      const l_nOffset = p_oOptions.LigneDebut ?? 0;

      // 🪓 ALIGNEMENT DIRECTIVE DE RAM : Remplacement du texte dur par la valeur SQL de l'écurie
      const l_sOrdreTri = p_oOptions.OrdreAff instanceof OrdreTriEnum
        ? (p_oOptions.OrdreAff as any).m_sValueSql : 'DESC';

      // 🗲 Appel de l'extracteur global de soute sans un seul pixel de SQL volant !
      const l_oResult = await this.db.query<IUserRow>(
        'Select * From "TousLesActeursDuChateau"($1, $2, $3, $4);',
        [l_nLimit, l_nOffset, p_oOptions.ColonneTri ?? 'usCreatedAt', l_sOrdreTri] );

      // Extraction de la volumétrie calculée sur la première ligne du tableau !
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
      throw DatabaseErrorFactory.queryFailed('User.findAll / TousLesActeursDuChateau', l_sMsg);
    }
  }
}
