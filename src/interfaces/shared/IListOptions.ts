// ——— fichier : src/interfaces/shared/IListOptions.ts

import { OrdreAff } from '@/constants/OrdreAff';

/**
 * 📊 Interface IListOptions (Version Jojo Excellence)
 * ----------------------------------------------------
 * Contrat universel de pagination, filtrage temporel et tri pour tout le Backend.
 * Éradication totale de la dette technique sémantique du Web.
 */
export interface IListOptions {

  /** Nombre maximal de lignes à retourner par la requête PostgreSQL */
  NbLignesMax? : number;

  /** Index ou curseur de départ pour le décalage de la pagination SQL */
  IndexDepart? : number;

  /** Chaîne de caractères pour la recherche textuelle floue (ILike) */
  search?      : string;

  /** Nom de la colonne physique ciblée pour le tri en base de données */
  ColTri?      : string;

  /** Direction de l'ordonnancement en base de données (Smart Enum) */
  OrdreAff?    : OrdreAff;

  /** Date de coupure optionnelle pour l'isolation des historiques */
  DatePivot?   : Date;
  
}
