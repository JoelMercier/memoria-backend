// ——— fichier : src\types\shared\IdentifiantsSouverains.ts

import type { AllowedIdTypes } from "./AllowedIdTypes";

/**
 * 💎 Type IdentifiantsSouverains
 * ----------------------------------------------------------------------------
 * Type d'union explicite verrouillant les structures d'identifiants valides.
 * Élimine le 'any' au profit des primitives de soute et des objets de domaine encapsulés.
 */
export type IdentifiantsSouverains =
  | AllowedIdTypes             // Les primitives brutes (string, number...)
  | { value: AllowedIdTypes }; // La structure standard des Value Objects encapsulés
  //| unknown;                 // Contrat universel strict forçant la validation
