// ——— fichier : src/interfaces/entities/event/IAppEventData.ts

import { AppEventCategory } from '@/constants/Categories';
import { AppEventSeverity } from '@/constants/Severites';
import { AppEventSecteur  } from '@/constants/Secteurs';
import { AppEventAction   } from '@/constants/Actions';
import type { UserId,
              AppEventId      } from '@/domain/value-objects/ids';
import type { IBaseEntityData } from '@/interfaces/entities/IBaseEntityData';

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
export type IAppEventData = IBaseEntityData<'appEvent', AppEventId> & {

  /**
   * 👥 ID de l'utilisateur concerné (Peut être NULL pour les événements système).
   *
   * @type {UserId | null}
   */
  userId : UserId | null;

  /**
   * 📂 Catégorie fonctionnelle (Smart Enum lié à l'infrastructure).
   *
   * @type {AppEventCategory}
   */
  eventCategory : AppEventCategory;

  /**
   * 💻 Contexte fonctionnel (Smart Enum de structure V4 - Char(4)).
   *
   * @type {AppEventContext}
   */
  eventSecteur : AppEventSecteur;

  /**
   * ⚙️ Action technique précise (Smart Enum d'opération V4 - Char(4)).
   *
   * @type {AppEventAction}
   */
  eventAction : AppEventAction;

  /**
   * ⚠️ Niveau de gravité (Smart Enum opérationnel).
   *
   * @type {AppEventSeverity}
   */
  severity : AppEventSeverity;

  /**
   * 💬 Message textuel explicite du log d'audit.
   *
   * @type {string}
   */
  message : string;

  /**
   * 🎛️ Métadonnées contextuelles au format dictionnaire JSON.
   *
   * @type {Record<string, any>}
   */
  metadata : Record<string, any>;

};
