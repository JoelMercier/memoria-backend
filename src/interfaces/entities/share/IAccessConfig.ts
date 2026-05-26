// ——— fichier : src/interfaces/entities/share/IAccessConfig.ts

/**
 * ⚙️ Interface IAccessConfig
 * --------------------------
 * Configuration fine et restrictions d'infrastructure du JSONB `access_config` d'un partage.
 * Délimite les règles temporelles de validité à la frontière du système.
 *
 * @interface IAccessConfig
 * @author Joël, Gaïa & Co
 */
export interface IAccessConfig {

  /** ⏱️ Date d'expiration au format de chaîne de caractères ISO 8601. Si absente, le partage n'expire jamais. */
  expiresAt? : string;
}
