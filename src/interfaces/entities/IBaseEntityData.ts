// ——— fichier : src/interfaces/entities/IBaseEntityData.ts

import type { IdBinaire } from '@/domain/base/IdBinaire';

/**
 * 📋 Type AllowedIdTypes
 * ----------------------
 * Liste exhaustive des types physiques et d'objets autorisés pour les clés primaires.
 * Sert de balise absolue à travers tout le système (ex: IEntity, BaseEntity).
 *
 * @type AllowedIdTypes
 * @author Joël, Gaïa & Co
 */
export type AllowedIdTypes =

  | string
  | number
  | object
  | IdBinaire; // Accepte implicitement UserId, ItemId, ShareId, TagId par héritage !

/**
 * 📊 Interface IBaseEntityData (Version Jojo Générique Absolue)
 * -------------------------------------------------------------
 * Contrat de base générant dynamiquement la clé primaire typée selon l'entité.
 * Injecte également les métadonnées universelles de traçabilité d'audit.
 *
 * @type IBaseEntityData
 * @template TEntityName - Le nom sémantique de l'entité (ex: 'user', 'tag')
 * @template TId         - Le Value Object ou type physique affecté à la clé primaire
 * @author Joël, Gaïa & Co
 */
export type IBaseEntityData<
  TEntityName extends string,
  TId extends AllowedIdTypes = string
> = {

  /**
   * 🪓 Mappage dynamique calculé et chirurgical de la clé primaire.
   * Exemple : Le littéral 'tag' engendre automatiquement la propriété d'infra 'idTag'.
   */
  [K in `id${Capitalize<TEntityName>}`]: TId;

} & {

  /** 📅 Horodatage précis de la création de l'enregistrement en base (Audit). */
  createdAt? : Date;

  /** 📅 Horodatage précis de la dernière modification de l'enregistrement (Audit). */
  updatedAt? : Date;
};
