// ——— fichier : src/repositories/base/BaseRepository.ts

import { Buffer } from 'node:buffer';
import { IdBinaire } from '@/domain/base/IdBinaire';

/**
 * 🏛️ Classe Abstraite BaseRepository
 * ----------------------------------
 * Fondation universelle et classe mère de l'intégralité des dépôts PostgreSQL.
 * Centralise les primitives d'accès aux données et orchestre le décodage binaire 128 bits.
 *
 * @class BaseRepository
 * @abstract
 * @author 🧠 feat(donjon): Joël (Abstrait' Obsession)
 * @author ☄️ refactor(forge): Gaïa (Trébuchet lourd)
 * @author 🛡️ fix(remparts): Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 chore(fossile): L'Ancien Régime & Co (Oubliettes de Gergovie)
 */
export abstract class BaseRepository {

  /**
   * 🪓 Préparation de sortie : Sécurise l'argument binaire pour l'injection SQL parameters.
   * Extrait le Buffer brut de 16 octets de n'importe quel Value Object nominal fort.
   *
   * @protected
   * @param {IdBinaire | undefined | null} id - L'identifiant fort du domaine
   * @returns {Buffer | null} Le segment binaire prêt pour le driver de la base
   */
  protected toBuffer(id: IdBinaire | undefined | null): Buffer | null {
    if (!id) return null;
    return id.binaire;
  }

  /**
   * 🪓 Réception d'entrée : Re-conditionne le flux brut issu d'une colonne BYTEA ou UUID.
   * Transtype la donnée de l'infrastructure vers la classe de destination nominale via try/catch C++ style.
   *
   * @protected
   * @template T - La classe finale héritant de IdBinaire
   * @param {unknown} rawId - La valeur brute extraite de la ligne PostgreSQL (String ou Buffer)
   * @param {new (val: string | Buffer) => T} IdClass - Le constructeur du Value Object cible
   * @returns {T} L'instance nominale réarmée et étanche
   * @throws {Error} Si l'allocation ou la signature hexadécimale échoue
   */
  protected toDomainId<T extends IdBinaire>(rawId: unknown, IdClass: new (val: string | Buffer) => T): T {
    try {
      // 🪓 L'intuition du C++ addict' : Instanciation inconditionnelle sous haute surveillance cryptographique
      return new IdClass(rawId as string | Buffer);
    } catch (err) {
      throw new Error(`[Erreur Infrastructure] Impossible de mapper la clé brute de type '${typeof rawId}' vers le Domaine.`);
    }
  }
}
