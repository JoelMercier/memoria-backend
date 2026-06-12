// ——— fichier : src/interfaces/services/IItemService.ts

import type { Item      } from '@/entities/Item';
import type { IItemData } from '@/interfaces/entities/item/IItemData';

import { IBaseService  } from '@/interfaces/services/IBaseService';
import { ItemId        } from '@/domain/value-objects/ids';
import { CreateItemDto } from '@/dto/item/CreateItemDto';
import { UpdateItemDto } from '@/dto/item/UpdateItemDto';
import { IListResult   } from '@/interfaces/shared/IListResult';
import { IItemRepository, IItemRepositoryListOptions } from '@/interfaces/repositories/PostGres/IItemRepository';


/**
 * 🔒 Interface IItemService 🛡️
 * ----------------------------------------------------------------------------
 * Contrat métier régissant les cas d'usage applicatifs des Pépites (Items).
 * Agit comme le point d'ancrage sémantique principal de la logique applicative.
 * Descend de l'impératrice IBaseService en verrouillant son quadruple raccordement.
 *
 * 💡 JUSTIFICATION DES TYPES PRIMITIFS SUR CETTE FRONTIÈRE :
 * Pourquoi conserver "string" pour le "userId" et le "itemId" dans ce contrat ?
 * Cette interface fait office de passerelle directe avec l'infrastructure de transport (les Contrôleurs Express).
 * Pour respecter le couplage lâche et la séparation des responsabilités, le service accepte les primitives textuelles
 * directement issues des requêtes HTTP ou des paramètres d'URL, et prend la responsabilité d'instancier lui-même
 * les types nominaux stricts (new UserId, new ItemId) dès le franchissement de la frontière de sa logique métier.
 *
 * @interface IItemService
 * @extends {IBaseService<Item, IItemData, ItemId, IItemRepository>} Verrou tridimensionnel strict d'infrastructure
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, fusion doctrinale des notes de soute V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IItemService extends IBaseService<Item, IItemData, ItemId, IItemRepository> {

  /**
   * 🔔 Orchestre la validation et la création d'une nouvelle pépite métier pour l'utilisateur.
   * Charge le Domaine d'appliquer le chiffrement de soute avant écriture.
   *
   * @async
   * @param {string} p_sUserId - La primitive textuelle de l'identifiant de l'auteur de l'action (Douane HTTP)
   * @param {CreateItemDto} p_oDto - Les données brutes d'intention de création de la ressource
   * @returns {Promise<Item>} L'entité vivante de la pépite créée, chiffrée et indexée
   */
  create(p_sUserId: string, p_oDto: CreateItemDto): Promise<Item>;

  /**
   * 🔎 Récupère le détail complet d'une pépite par son identifiant unique après contrôle de propriété.
   *
   * @async
   * @param {string} p_sUserId - L'identifiant de l'acteur qui formule la requête de lecture (Douane HTTP)
   * @param {string} p_sItemId - La clé unique textuelle de la pépite recherchée sur le disque
   * @returns {Promise<Item>} L'entité riche de la pépite hydratée, prête pour le déchiffrement
   */
  findById(p_sUserId: string, p_sItemId: string): Promise<Item>;

  /**
   * 🛤️ Localise et extrait une pépite unique via son permalien normalisé (Slug).
   *
   * @async
   * @param {string} p_sUserId - L'identifiant de l'acteur qui formule la requête (Douane HTTP)
   * @param {string} p_sSlug - Le permalien textuel de la ressource recherchée
   * @returns {Promise<Item>} L'entité riche correspondante, validée et sécurisée
   */
  findBySlug(p_sUserId: string, p_sSlug: string): Promise<Item>;

  /**
   * 📜 Extrait la collection filtrée, paginée et ordonnée des pépites détenues par un utilisateur donné.
   * [RÉPARÉ V4] S'adosse constitutionnellement au dictionnaire d'options et au restituteur générique Lignes !
   *
   * @async
   * @param {string} p_sUserId - L'identifiant textuel de l'acteur cible (Douane HTTP)
   * @param {IItemRepositoryListOptions} p_oOptions - Le dictionnaire obligatoire de tri déterministe et de limites
   * @returns {Promise<IListResult<Item>>} Le lot de résultats paginé, tracé et structuré en français d'élite
   */
  listByUser(p_sUserId: string, p_oOptions: IItemRepositoryListOptions): Promise<IListResult<Item>>;

  /**
   * 🎛️ Applique des révisions partielles ou complètes sur les attributs d'une pépite existante.
   *
   * @async
   * @param {string} p_sUserId - L'identifiant de l'auteur de la mise à jour (Contrôle de propriété / Douane HTTP)
   * @param {string} p_sItemId - La clé unique textuelle de la pépite à réviser
   * @param {UpdateItemDto} p_oDto - Le lot d'attributs modifiés à appliquer
   * @returns {Promise<Item>} L'entité révisée, rechiffrée et sauvegardée
   */
  update(p_sUserId: string, p_sItemId: string, p_oDto: UpdateItemDto): Promise<Item>;

  /**
   * 🗑️ Supprime de manière destructive une ressource après validation de la propriété.
   *
   * @async
   * @param {string} p_sUserId - L'identifiant de l'auteur de l'ordre de destruction (Douane HTTP)
   * @param {string} p_sItemId - La clé unique textuelle de la pépite à éradiquer définitivement du disque
   * @returns {Promise<void>}
   */
  delete(p_sUserId: string, p_sItemId: string): Promise<void>;
}
