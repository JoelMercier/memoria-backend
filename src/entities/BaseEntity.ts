// ——— fichier : src/entities/BaseEntity.ts

import type { AllowedIdTypes,
              IBaseEntityData } from '@/interfaces/entities/IBaseEntityData';
import type { IEntity         } from '@/interfaces/entities/IEntity';

/**
 * 🏛️ Classe Abstraite BaseEntity (Version Générique Absolue)
 * -----------------------------------------------------------
 * Pivot architectural du système gérant les mécanismes d'audit temporels.
 * Encapsule les métadonnées de traçabilité communes sous la notation m_.
 *
 * @abstract
 * @class BaseEntity
 * @template TEntityName - Le nom strict et qualifié de l'entité (ex: 'user', 'tag')
 * @template TData       - Le contrat de structure passive associé (DTO / Infra)
 * @template TId         - Le Value Object ou type physique affecté à la clé primaire
 * @implements {IEntity<TData, TId>}
 * @author Joël, Gaïa & Co
 */
export abstract class BaseEntity<
  TEntityName extends string,
  TData       extends IBaseEntityData<TEntityName, TId>,
  TId         extends AllowedIdTypes = string
> implements IEntity<TData, TId> {

  /** 📅 Horodatage immuable de la création de l'enregistrement en base */
  protected readonly m_dBaseCreatedAt : Date;

  /** 📅 Horodatage de la dernière modification de l'enregistrement (Optionnel) */
  protected readonly m_dBaseUpdatedAt : Date | undefined;

  /**
   * Initialise les fondations d'audit communes à toutes les entités du domaine.
   *
   * @protected
   * @constructor
   * @param {TData} data - Le payload brut contenant les métadonnées temporelles
   */
  protected constructor(data: TData) {
    this.m_dBaseCreatedAt = data.createdAt || new Date();
    this.m_dBaseUpdatedAt = data.updatedAt;
  }

  /**
   * ⏱️ Accesseur de lecture direct pour la date de création de l'enregistrement.
   * C'est cette propriété plate qui désactive les getters d'infrastructure dans nos DTOs.
   *
   * @public
   * @returns {Date} L'horodatage de création originel.
   */
  public get createdAt(): Date {
    return this.m_dBaseCreatedAt;
  }

  /**
   * ⏱️ Accesseur de lecture direct pour la date de la dernière modification.
   *
   * @public
   * @returns {Date | undefined} L'horodatage de mise à jour ou undefined.
   */
  public get updatedAt(): Date | undefined {
    return this.m_dBaseUpdatedAt;
  }

  /**
   * 📦 Extrait le sac de données passif correspondant à l'état vivant de l'entité.
   *
   * @abstract
   * @function toData
   * @returns {TData} La structure de données plate générique.
   */
  public abstract toData(): TData;

  /**
   * 🖨️ Sérialise textuellement l'entité au format JSON.
   *
   * @abstract
   * @function toString
   * @returns {string} La chaîne de caractères sérialisée.
   */
  public abstract toString(): string;
}
