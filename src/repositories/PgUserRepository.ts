// ——— fichier : src/repositories/PgUserRepository.ts

import type { QueryResultRow } from 'pg';
import { BaseRepository } from '@/repositories/base/BaseRepository';
import { UserId } from '@/domain/value-objects/IdMetier';
import { User } from '@/entities/User';
import { Role } from '@/constants/Role';
import { ConflictErrorFactory } from '@/exceptions/ConflictErrorFactory';
import { DatabaseErrorFactory } from '@/exceptions/DatabaseErrorFactory';
import { UserErrorFactory } from '@/exceptions/UserErrorFactory';
import type { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';
import type { IUserData } from '@/interfaces/entities/user/IUserData';
import type { IUserRepository } from '@/interfaces/repositories/IUserRepository';

interface IUserRow extends QueryResultRow {
  id_user           : Buffer;
  email             : string;
  password_hash     : string;
  pseudo            : string;
  role_name         : string;
  auth_provider     : string;
  settings_user     : Record<string, unknown>;
  gdpr_consent      : boolean;
  gdpr_consent_date : Date | null;
  created_at        : Date;
  updated_at        : Date | null;
}

/**
 * 🗄️ Classe PgUserRepository
 * ---------------------------
 * Dépôt physique PostgreSQL administrant le cycle de vie complet des Utilisateurs.
 * Branche le flux binaire 128 bits pur sur les requêtes et l'indexation de la cour basse.
 *
 * @class PgUserRepository
 * @extends {BaseRepository}
 * @implements {IUserRepository}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export class PgUserRepository extends BaseRepository implements IUserRepository {

  /** 🎛️ Connexion physique à l'infrastructure de données */
  private readonly db: IDatabaseConnection;

  /**
   * Initialise le dépôt de persistance via injection de dépendance.
   *
   * @constructor
   */
  public constructor(db: IDatabaseConnection) {
    super();
    this.db = db;
  }

  /**
   * Mappe une ligne PostgreSQL brute (snake_case) vers une entité typée User.
   *
   * @private
   */
  private rowToUser(row: IUserRow): User {
    return new User({
      idUser          : this.toDomainId(row.id_user, UserId),
      email           : row.email,
      passwordHash    : row.password_hash,
      pseudo          : row.pseudo,
      role            : Role.fromSql(row.role_name)!,
      authProvider    : row.auth_provider as any,
      settingsUser    : row.settings_user,
      gdprConsent     : row.gdpr_consent,
      gdprConsentDate : row.gdpr_consent_date ?? undefined,
      createdAt       : row.created_at,
      updatedAt       : row.updated_at ?? undefined
    });
  }

  /**
   * 🔍 Lecture chirurgicale : Localise un acteur via son identifiant nominal fort.
   *
   * @public
   * @async
   */
  public async findById(idUser: UserId): Promise<User | null> {
    try {
      const result = await this.db.query<IUserRow>('SELECT * FROM users WHERE id_user = fn_bin_to_uuid($1)', [this.toBuffer(idUser)]);
      return result.rows[0] ? this.rowToUser(result.rows[0]) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findById', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son adresse électronique.
   *
   * @public
   * @async
   */
  public async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.db.query<IUserRow>('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] ? this.rowToUser(result.rows[0]) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findByEmail', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 🔍 Alignement nominal : Localise un acteur via son pseudonyme public.
   *
   * @public
   * @async
   */
  public async findByPseudo(pseudo: string): Promise<User | null> {
    try {
      const result = await this.db.query<IUserRow>('SELECT * FROM users WHERE pseudo = $1', [pseudo]);
      return result.rows[0] ? this.rowToUser(result.rows[0]) : null;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findByPseudo', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 📧 Vérification d'existence : Valide la présence d'un e-mail.
   *
   * @public
   * @async
   */
  public async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.db.query<{ exists: boolean } & QueryResultRow>('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) AS exists', [email]);
      return result.rows[0]?.exists ?? false;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('existsByEmail', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 👤 Vérification d'existence : Valide la présence d'un pseudonyme.
   *
   * @public
   * @async
   */
  public async existsByPseudo(pseudo: string): Promise<boolean> {
    try {
      const result = await this.db.query<{ exists: boolean } & QueryResultRow>('SELECT EXISTS(SELECT 1 FROM users WHERE pseudo = $1) AS exists', [pseudo]);
      return result.rows[0]?.exists ?? false;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('existsByPseudo', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 🪓 Écriture concrète : Insère un nouvel acteur via le soupirail binaire.
   *
   * @public
   * @async
   */
  public async create(data: IUserData): Promise<User> {
    try {
      const result = await this.db.query<IUserRow>(
        `INSERT INTO users (id_user, email, password_hash, pseudo, auth_provider, settings_user, gdpr_consent, gdpr_consent_date)
         VALUES (fn_bin_to_uuid($1), $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          this.toBuffer(data.idUser),
          data.email,
          data.passwordHash,
          data.pseudo,
          data.authProvider,
          data.settingsUser,
          data.gdprConsent,
          data.gdprConsentDate ?? (data.gdprConsent ? new Date() : null)
        ]
      );
      const row = result.rows[0];
      if (!row) throw UserErrorFactory.creation('No row returned from INSERT');
      return this.rowToUser(row);
    } catch (err) {
      if (err instanceof UserErrorFactory) throw err;
      const msg = err instanceof Error ? err.message : 'unknown';
      if (msg.includes('users_email_key')) throw UserErrorFactory.emailExists(data.email);
      if (msg.includes('users_pseudo_key')) throw ConflictErrorFactory.usernameExists(data.pseudo);
      throw UserErrorFactory.creation(msg);
    }
  }

  /**
   * 🪓 Mutation dynamique : Applique les modifications partielles d'un acteur.
   *
   * @public
   * @async
   */
  public async update(idUser: UserId, data: Partial<IUserData>): Promise<User> {
    const fields: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    const columnMap: Record<string, string> = {
      email: 'email',
      passwordHash: 'password_hash',
      pseudo: 'pseudo',
      authProvider: 'auth_provider',
      settingsUser: 'settings_user',
      gdprConsent: 'gdpr_consent',
      gdprConsentDate: 'gdpr_consent_date'
    };

    for (const [key, col] of Object.entries(columnMap)) {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined) {
        fields.push(`${col} = $${i++}`);
        params.push(value);
      }
    }

    if (data.role !== undefined) {
      fields.push(`role_name = $${i++}`);
      params.push(data.role.code); // 🪓 Alignement parfait sur le Smart Enum !
    }

    if (fields.length === 0) {
      const existing = await this.findById(idUser);
      if (!existing) throw UserErrorFactory.notFound(idUser);
      return existing;
    }
    params.push(this.toBuffer(idUser));

    try {
      const result = await this.db.query<IUserRow>(`UPDATE users SET ${fields.join(', ')} WHERE id_user = fn_bin_to_uuid($${i}) RETURNING *`, params);
      const row = result.rows[0];
      if (!row) throw UserErrorFactory.notFound(idUser);
      return this.rowToUser(row);
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('update', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 🪓 Destruction atomique : Supprime un acteur du donjon.
   *
   * @public
   * @async
   */
  public async delete(idUser: UserId): Promise<boolean> {
    try {
      const result = await this.db.query('DELETE FROM users WHERE id_user = fn_bin_to_uuid($1)', [this.toBuffer(idUser)]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('delete', err instanceof Error ? err.message : 'unknown');
    }
  }

  /**
   * 📜 Contrat d'infrastructure : Récupère l'intégralité absolue des utilisateurs.
   *
   * @public
   * @async
   */
  public async findAll(): Promise<User[]> {
    try {
      const result = await this.db.query<IUserRow>('SELECT * FROM users ORDER BY created_at DESC');
      return result.rows.map((row) => this.rowToUser(row));
    } catch (err) {
      throw DatabaseErrorFactory.queryFailed('findAll', err instanceof Error ? err.message : 'unknown');
    }
  }
}
