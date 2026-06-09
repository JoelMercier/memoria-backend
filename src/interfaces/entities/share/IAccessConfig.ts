// ——— fichier : src/interfaces/entities/share/IAccessConfig.ts

/** 🔐 Les paliers de privilèges constitutionnels autorisés pour une passerelle */
export type PrivilegeLevelType = 'LECTURE' | 'ECRITURE' | 'ADMINISTRATION';

/**
 * ⚙️ Interface IAccessConfig 🎛️ (Le Calibreur du JSONB shConfiguration 🤖)
 * ----------------------------------------------------------------------------
 * Configuration fine et restrictions d'infrastructure du JSONB `shConfiguration` d'un partage.
 * Délimite les règles temporelles et physiques de validité.
 *
 * @interface IAccessConfig
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Anti-Bâclage Nominal)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur le standard d'acier)
 */
export interface IAccessConfig {
  /** 🔐 Le niveau de privilège nominal accordé à la passerelle (Strictement typé) */
  Privilege: PrivilegeLevelType;

  /** 📥 Autorisation explicite de téléchargement physique des octets lourds (AutoriseTelechargement) */
  AutoriseTelechargement: boolean;

  /** ⏱️ Date de coupure et d'expiration déterministe de la passerelle. Si absente, le partage est éternel. */
  DateExpiration?: Date;
}
