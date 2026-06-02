// ——— fichier : src/interfaces/entities/share/IAccessConfig.ts

/**
 * ⚙️ Interface IAccessConfig 🎛️ (Le Calibreur du JSONB shConfiguration 🤖)
 * ----------------------------------------------------------------------------
 * Configuration fine et restrictions d'infrastructure du JSONB `access_config` d'un partage.
 * Délimite les règles temporelles de validité à la frontière du système.
 *
 * @interface IAccessConfig
 * @author Vision : Joël (<Struct> périmée)
 * @author Frapperie du code : Gaïa (Gardienne du feu binaire)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export interface IAccessConfig {
  /** 🔐 Le niveau de privilège accordé à la passerelle (ex: 'read', 'write') */
  level          : string;

  /** 📥 Autorisation explicite de téléchargement physique des pièces jointes */
  allow_download : boolean;

  /** ⏱️ Date d'expiration au format de chaîne de caractères ISO 8601. Si absente, le partage n'expire jamais. */
  expiresAt?     : string;
}
