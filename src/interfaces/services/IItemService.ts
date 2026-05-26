// ——— fichier : src/interfaces/services/IItemService.ts

import type { CreateItemDto } from '@/dto/item/CreateItemDto';
import type { UpdateItemDto } from '@/dto/item/UpdateItemDto';
import type { IItem         } from '@/interfaces/entities/item/IItem';
import type { IItemListOptions,
              IItemListResult  } from '@/interfaces/repositories/IItemRepository';

/**
 * 🔒 Interface IItemService
 * ----------------------------
 * Contrat métier régissant les cas d'usage applicatifs des Pépites (Items).
 * Agit comme le point d'ancrage sémantique principal de la logique applicative.
 *
 * 💡 JUSTIFICATION DES TYPES PRIMITIFS SUR CETTE FRONTIÈRE :
 * Pourquoi conserver "string" pour le "userId" et le "itemId" dans ce contrat ?
 * Cette interface fait office de passerelle directe avec l'infrastructure de transport (les Contrôleurs Express).
 * Pour respecter le couplage lâche et la séparation des responsabilités, le service accepte les primitives textuelles
 * directement issues des requêtes HTTP ou des paramètres d'URL, et prend la responsabilité d'instancier lui-même
 * les types nominaux stricts (new UserId, new ItemId) dès le franchissement de la frontière de sa logique métier.
 *
 * @interface IItemService
 * @author Joël, Gaïa & Co
 */
export interface IItemService {

  /** 🔔 Orchestre la validation et la création d'une nouvelle pépite métier pour l'utilisateur. */
  create(userId: string, dto: CreateItemDto): Promise<IItem>;

  /** 🔎 Récupère le contrat complet d'une pépite par son identifiant unique après contrôle d'accès. */
  findById(userId: string, itemId: string): Promise<IItem>;

  /** 🛤️ Localise et extrait une pépite via son permalien normalisé (Slug). */
  findBySlug(userId: string, slug: string): Promise<IItem>;

  /** 📜 Extrait la collection complète ou filtrée des ressources détenues par un utilisateur donné. */
  listByUser(userId: string, options?: IItemListOptions): Promise<IItemListResult>;

  /** 🎛️ Applique des révisions partielles ou complètes sur les attributs d'une pépite existante. */
  update(userId: string, itemId: string, dto: UpdateItemDto): Promise<IItem>;

  /** 🗑️ Supprime de manière destructive une ressource après validation de la propriété. */
  delete(userId: string, itemId: string): Promise<void>;
}
