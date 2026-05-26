// ——— fichier : src/interfaces/http/index.ts

/**
 * 📦 Point d'entrée d'exposition (Barrel File) de la couche HTTP.
 * Centralise et réexporte exclusivement les contrats de types d'infrastructure.
 *
 * 💡 JUSTIFICATION DE LA LÉGITIMITÉ DE CE CONTRAT DE FAÇADE :
 * Contrairement aux index vivants qui injectent du code logique et provoquent des
 * dépendances circulaires, ce fichier utilise exclusivement la mention stricte 'export type'.
 * À la compilation, ce fichier s'évapore intégralement sans générer aucun effet de bord
 * ni perturber le Tree-Shaking. Il sert uniquement de vitrine d'exposition unifiée pour
 * les structures de transport du réseau, respectant le principe de cohésion de l'hexagone.
 *
 * @author Joël, Gaïa & Co
 */

export type {
  IApiResponseData,
  IApiResponseError,
  IApiResponseMeta,
  IPaginationMeta
} from '@/interfaces/http/IApiResponseData';

export type { IHandlerService } from '@/interfaces/http/IHandlerService';
