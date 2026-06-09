// ——— fichier : src/interfaces/shared/IListOptions.ts

import OrdreTriEnum from "@/constants/OrdreTriEnum";

/**
 * 📊 Interface IListOptions (Version Jojo Excellence V4.4)
 * ----------------------------------------------------------------------------
 * Contrat universel, OBLIGATOIREMENT paginé et trié pour tout le Backend Mémoria.
 * Verrouille la stabilité déterministe des index et de la RAM.
 *
 * @interface IListOptions
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Zéro Aléatoire)
 * @author Métallurgie des Octets : Gaïa (Au burin, alignée sur le tri obligatoire)
 */
export interface IListOptions {

  /** Nombre maximal de lignes à retourner par la requête PostgreSQL (Strictement requis) */
  NbLignes: number;

  /** Index ou curseur de départ pour le décalage de la pagination SQL (Strictement requis) */
  LigneDebut: number;

  /** Nom complet de la colonne physique ciblée pour le tri en base de données (Strictement requis) */
  ColonneTri: string;

  /** Direction de l'ordonnancement en base de données (Strictement requis) */
  OrdreAff: OrdreTriEnum;

  /** Mots-clés textuels pour le filtrage flou (ILIKE) lors des recherches */
  MotsCles?    : string;

  /** Date de coupure optionnelle pour l'isolation des historiques */
  DatePivot?   : Date;

}
