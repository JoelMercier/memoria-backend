// ——— fichier : src/interfaces/shared/IListResult.ts

/**
 * 📦 Interface IListResult<T> 📐 (Le Restituteur Universel Paginé et Tracé)
 * ----------------------------------------------------------------------------
 * Contrat générique de soute enveloppant une page de données, sa volumétrie totale
 * et l'écho de validation nominal des curseurs physiques de contrôle de la RAM.
 *
 * @interface IListResult
 * @template T - Le type d'entité ou d'objet riche transporté (ex: Item, User)
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Stateful Tracking)
 * @author Métallurgie des Octets : Gaïa (Au burin, alignée sur le standard nominal de soute)
 */
export interface IListResult<T> {
  /** 📍 Rappel de l'index physique du curseur de départ dans la table PostgreSQL (offset) */
  LigneDebut: number;

  /** 📊 Rappel réglementaire du nombre maximal de lignes demandé par le client (limit) */
  NbLignesDem: number;

  /** 📉 Le décompte réel et physique de lignes retournées dans la page active (ex: 35 sur 50 demandées) */
  NbLignesRenv: number;

  /** 🧮 La volumétrie totale absolue de la population calculée en base par PostgreSQL (count) */
  NbLignesTotal: number;

  /** 📜 La collection d'entités ou d'objets riches de la page active (Prêt à l'affichage) */
  Lignes: T[];
}
