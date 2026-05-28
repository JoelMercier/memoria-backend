// ——— fichier : src/interfaces/repositories/IWriteableRepository.ts

import type { AllowedIdTypes } from '@/interfaces/entities/IBaseEntityData';
import { IBaseRepository } from './IBaseRepository';

/**
 * 💡 NOTE ARCHITECTURALE «JOJO-STYLE» et Nah !
 * --------------------------------------------
 *
 * C'est ici qu'on a balancé un "void(défensif)->DTC" dans les interfaces monolithiques de l'Ancien Régime !
 *
 * LE PROBLÈME : Les buses avaient mis "update" et "delete" directement dans la fondation commune (IBaseRepository).
 * Résultat : Notre dépôt de logs d'audit (app_events), qui doit constitutionnellement rester immuable
 * (Append-Only / écriture seule), se retrouvait obligé par le compilateur de trimballer des fonctions de destruction.
 * Une hérésie complète qui ouvrait la porte à l'effacement de preuves en base de données.
 *
 * LA MANŒUVRE (SOLID - Principe ISP) :
 *  1. On a amputé IBaseRepository de ses outils de démolition. Il ne fait plus que la lecture et la création stable.
 *  2. On a forgé ce fichier (IWriteableRepository) qui hérite de la base, mais qui rajoute EXCLUSIVEMENT pour les ressources
 *     mutables (les pépites, les users) le droit de modifier et de supprimer.
 *
 * Si dans 6 mois tu cherches où on a coupé la poire en deux pour étanchéifier le Domaine face aux fourmis charognardes,
 * No texto, no primitives « primitives », de l'acier hexagonal pur.
 *
 * @interface IWriteableRepository
 * @extends {IBaseRepository<TEntity, TData, TId>}
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
 */
export interface IWriteableRepository<
  TEntity,
  TData,
  TId extends AllowedIdTypes = string
> extends IBaseRepository<TEntity, TData, TId> {

  /** 🎛️ Met à jour les données partielles d'une entité via son identifiant fort. */
  update(id: TId, data: Partial<TData>): Promise<TEntity>;

  /** 🗑️ Supprime définitivement un enregistrement du stockage. */
  delete(id: TId): Promise<boolean>;
}
