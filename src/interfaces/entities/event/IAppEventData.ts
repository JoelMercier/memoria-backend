// ——— fichier : src/interfaces/entities/event/IAppEventData.ts

import type { UserId, EventId  } from '@/domain/value-objects/ids';
import type { IBaseEntityData  } from '@/interfaces/entities/IBaseEntityData';

import type { Categorie } from '@/constants/Categories';
import type { Severite  } from '@/constants/Severites';
import type { Secteur   } from '@/constants/Secteurs';
import type { Action    } from '@/constants/Actions';
import type { JsonLégitime } from '@/types/shared/JsonLégitime';

/**
 * 📦 Type IAppEventData (Version Type Absolue - Jojo-Style)
 * ---------------------------------------------------------
 * Structure passive stockant les données brutes d'un événement d'audit.
 * Déclarée sous forme de 'type' pour injecter la signature d'index requise par l'ancêtre.
 *
 * @type IAppEventData
 * @author Directrice du Silicium : Joël (MANIAC du PascalCase et Abstract Class Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : Le Cartel du Donjon (Ouvriers de la V4 en surchauffe)
 */
export type IAppEventData = IBaseEntityData<'Event', EventId> & {

  /**
   * 👥 ID de l'utilisateur concerné (Peut être NULL pour les événements système).
   *
   * @type {UserId | null}
   */
  userId : UserId | null;

  /**
   * 📂 Catégorie fonctionnelle (Smart Enum lié à l'infrastructure).
   *
   * @type { Categorie }
   */
  categorie : Categorie;

  /**
   * 💻 Contexte fonctionnel (Smart Enum de structure V4 - Char(4)).
   *
   * @type {Secteur}
   */
  secteur : Secteur;

  /**
   * ⚙️ Action technique précise (Smart Enum d'opération V4 - Char(4)).
   *
   * @type {Action}
   */
  action : Action;

  /**
   * ⚠️ Niveau de gravité (Smart Enum opérationnel).
   *
   * @type {Severite}
   */
  severite : Severite;

  /**
   * 💬 Message textuel explicite du log d'audit.
   *
   * @type {string}
   */
  message : string;

  /**
   * 🎛️ Métadonnées contextuelles au format dictionnaire JSON.
   *
   * @type {JsonLégitime>}
   */
get metadata(): JsonLégitime;

};
