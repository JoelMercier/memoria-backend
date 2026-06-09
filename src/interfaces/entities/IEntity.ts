// ——— fichier : src\interfaces\entities\IEntity.ts

import type { AllowedIdTypes } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📜 Interface IEntity (Version Jojo Libérée)
 * -------------------------------------------
 * Contrat d'accès métier générique pour toutes les entités du système.
 * Désormais ouverte aux Value Objects d'identifiants et aux métadonnées d'audit.
 *
 * @interface IEntity
 * @template TData - Le contrat de données passif associé (DTO / Infra)
 * @template TId   - Le type fort de la clé primaire (Par défaut string)
 * @author Joël, Gaïa & Co
 */
export interface IEntity< TData,
  // @ts-expect-error - TId est déclaré pour l'extensibilité des classes héritières mais non lu directement ici
  TId extends AllowedIdTypes = string
> {

  /** 📅 Horodatage immuable de la création de l'enregistrement en base de données. */
  get createdAt(): Date;

  /** 📅 Horodatage de la dernière modification de l'enregistrement (Optionnel). */
  get updatedAt(): Date | undefined;

  /** 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité. */
  toData(): TData;

  /** 🖨️ Sérialise textuellement l'entité au format de texte JSON. */
  toString(): string;
}
