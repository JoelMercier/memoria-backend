// ——— fichier : src\types\shared\AllowedIdTypes.ts

import type { TStructureEnRam     } from "./TStructureEnRam";
import type { IdInfrastructure    } from "@/constants/Choupy/IdInfrastructure";
import type { TIdentifiantsChoupy } from "@/interfaces/entities/IBaseEntityData";

/**
 * 📋 Type AllowedIdTypes (Version Jojo Alignement Binaire Pur 🔬)
 * ----------------------------------------------------------------------------
 * Liste exhaustive des types physiques et d'objets autorisés pour les clés primaires.
 */
export type AllowedIdTypes =
  | string                            // Pour nos codes fixes (Char(4)) et le transit Web
  | number                            // Rétrocompatibilité des index de dictionnaire numériques
  | Buffer                            // ALIGNEMENT BYTEA : Le flux binaire pur de PostgreSQL !
  | IdInfrastructure<TStructureEnRam> // L'Ancêtre Suprême de la Forge purifié de tout any.
  | TIdentifiantsChoupy;              // Le bloc de soute unifié (TBM), connecté au Barillet du Domaine.
