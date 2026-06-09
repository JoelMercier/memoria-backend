// ——— fichier : src/interfaces/entities/IBaseEntityData.ts

import      { Buffer           } from 'node:buffer';
import type { IdInfrastructure } from '@/domain/base/IdInfrastructure';
import type { IdBinaire        } from '@/domain/base/IdBinaire';
import { IdChoupy } from '@/domain/base/idCore/IdChoupy';


/**
 * 📋 Type AllowedIdTypes (Version Jojo Alignement Binaire Pur 🔬)
 * ----------------------------------------------------------------------------
 * Liste exhaustive des types physiques et d'objets autorisés pour les clés primaires.
 */
export type AllowedIdTypes =

  | string                // Pour nos codes fixes (Char(4)) et le transit Web
  | number                // Rétrocompatibilité des index de dictionnaire numériques
  | Buffer                // ALIGNEMENT BYTEA : Le flux binaire pur de PostgreSQL !

  | IdInfrastructure<any> // L'Ancêtre Suprême de la Forge
  | IdBinaire             // Accepte implicitement UserId, ItemId, ShareId, TagId...
  | IdChoupy<any, any>;   // Accepte implicitement RoleId, SeverityId, EventCategoryId...


/**
 * 🏛️ Interface de base pour l'audit temporel de Mémoria
*/
interface IBaseAuditData {

    /** 📅 Horodatage précis, OBLIGATOIRE et immuable de la création de l'enregistrement (Présent partout). */
    createdAt : Date; // Verrouillé : Strictement obligatoire !

    /** 📅 Horodatage de la dernière modification (Optionnel pour tolérer l'Append-Only des tables d'audit). */
    updatedAt? : Date; // Remis en optionnel pour respecter la table Events de Joël !

};

/**
 * 📊 Interface IBaseEntityData (Version Jojo Équilibre de l'Audit 🛡️)
 * ----------------------------------------------------------------------------
 * Contrat de base générant dynamiquement la clé primaire typée selon l'entité.
 * Garantit la présence universelle de l'horodatage de création, tout en laissant
 * la date de modification optionnelle pour respecter les flux Append-Only (Logs).
 *
 * @type IBaseEntityData
 * @template TEntityName - Le nom sémantique de l'entité (ex: 'user', 'tag')
 * @template TId         - Le Value Object ou type physique affecté à la clé primaire
 * @author Joël, Gaïa & Co
 */

export type IBaseEntityData< TEntityName extends string, TId extends AllowedIdTypes = string > = {

  /**
   * 🪓 Mappage dynamique calculé et chirurgical de la clé primaire.
   */
  [K in `id${Capitalize<TEntityName>}`]: TId;

} & IBaseAuditData;
