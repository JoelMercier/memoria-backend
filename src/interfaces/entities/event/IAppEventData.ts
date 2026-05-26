// ——— fichier : src/interfaces/entities/event/IAppEventData.ts

import { AppEventCategory } from '@/constants/AppEventCategory';
import { AppEventSeverity } from '@/constants/AppEventSeverity';
import { AppEventType     } from '@/constants/AppEventType';
import type { UserId,
              EventId     } from '@/domain/value-objects/IdMetier';
import type { IBaseEntityData } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📦 Type IAppEventData (Version Type Absolue - Jojo-Style)
 * ---------------------------------------------------------
 * Structure passive stockant les données brutes d'un événement d'audit.
 * Déclarée sous forme de 'type' pour injecter la signature d'index requise par l'ancêtre.
 *
 * @type IAppEventData
 * @author Joël, Gaïa & Co
 */
export type IAppEventData = IBaseEntityData<'appEvent', EventId> & {

  /** 👥 ID de l'utilisateur concerné (Peut être NULL pour les événements système) */
  userId : UserId | null;

  /** 📂 Catégorie fonctionnelle (Smart Enum lié à l'infrastructure) */
  eventCategory : AppEventCategory;

  /** 🎯 Type d'action précis (Smart Enum qualifié) */
  eventType : AppEventType;

  /** ⚠️ Niveau de gravité (Smart Enum opérationnel) */
  severity : AppEventSeverity;

  /** 💬 Message textuel explicite du log d'audit */
  message : string;

  /** 🎛️ Métadonnées contextuelles au format dictionnaire JSON */
  metadata : Record<string, any>;

};
