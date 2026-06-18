// ——— fichier : src/interfaces/entities/IBaseEntityData.ts


// 🎗 Connexion directe sur le Barillet Universel d'Élite du Domaine (Souveraineté DRY) [1.1]
import type {
  // --- 📝 LE BLOC D'AUDIT & ÉVÉNEMENTS (La meute de traçabilité) ---
  ActionId,       //-- Identifiant fort de l'action technique unitaire (ex: 'CREA', 'CONN') [Mémoria].
  CategorieId,    //-- Identifiant fort de la catégorie fonctionnelle parente (ex: 'SYST', 'SECU') [Mémoria].
  SecteurId,      //-- Identifiant fort du secteur applicatif de soute (ex: 'AUTH', 'PEPI') [Mémoria].
  SeveriteId,     //-- Identifiant fort du niveau de criticité de l'anomalie (ex: 'INFO', 'CRIT') [Mémoria].
  EventId,        //-- Identifiant unique universel (UUID) de la trame de log d'audit [Mémoria].

  // --- 👥 LE BLOC ACTEURS & SESSIONS (La sécurité des profils) ---
  RoleId,         //-- Identifiant fort du rôle de l'acteur dans le château (ex: 'ADM', 'USER') [Mémoria].
  ProviderId,     //-- Identifiant fort du fournisseur d'authentification tiers (ex: 'GOOG') [Mémoria].
  SessionId,      //-- Identifiant unique universel (UUID) de la session active de l'acteur [Mémoria].
  UserId,         //-- Identifiant unique universel (UUID) de l'acteur propriétaire [Mémoria].

  // --- 💎 LE CORE MÉTIER MÉMORIA (L'essence des pépites et partages) ---
  ContentTypeId,  //-- Identifiant fort du type de contenu de la pépite (ex: 'TEXT', 'IMAG') [Mémoria].
  ItemId,         //-- Identifiant unique universel (UUID) de la pépite stockée en soute [Mémoria].
  ShareId,        //-- Identifiant unique universel (UUID) du privilège d'accès et de partage [Mémoria].
  TagId           //-- Identifiant unique universel (UUID) de l'étiquette de classification [Mémoria].
} from '@/domain/value-objects/ids';

import type { AllowedIdTypes } from '@/types/shared/AllowedIdTypes';


/**
 * 📋 Type TIdentifiantsChoupy (Le TrucBiduleMachin Universel du Pascal-Objet 🦾)
 * ----------------------------------------------------------------------------
 * Liste exhaustive, fermée et triée par ordre alphabétique de la forge Choupy.
 */
export type TIdentifiantsChoupy =
  | ActionId
  | CategorieId
  | ContentTypeId
  | EventId
  | ItemId
  | ProviderId
  | RoleId
  | SecteurId
  | SessionId
  | SeveriteId
  | ShareId
  | TagId
  | UserId;


/**
 * 🏛️ Interface de base pour l'audit temporel de Mémoria
*/
interface IBaseAuditData {

    /** 📅 Horodatage précis, OBLIGATOIRE et immuable de la création de l'enregistrement (Présent partout). */
    createdAt : Date; // Verrouillé : Strictement obligatoire !

    /** 📅 Horodatage de la dernière modification (Optionnel pour tolérer l'Append-Only des tables d'audit). */
    updatedAt? : Date; // Remis en optionnel pour respecter la table Events de Joël !

}

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
