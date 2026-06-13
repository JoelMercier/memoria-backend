// ——— fichier : src\constants\Choupy\IdBinaire.ts

import { Buffer } from 'node:buffer';

/**
 * 🏛️ Classe Abstraite IdBinaire 🧮 (Armure Nominale 128 bits Pure 🤖)
 * -------------------------------------------------------------
 * Fondation universelle pour tous les identifiants uniques du système.
 * Encapsule un Buffer Node.js immuable 💾 de 16 octets (128 bits tassés en 🧠 RAM).
 *
 * SOLID :
 *  - SRP 📐 : Unique responsabilité de garantir l'intégrité binaire.
 *
 * @class IdBinaire
 * @abstract
 * @author Vision & Conception : Joël (C++ Addict')
 * @author Forge & Martelage du Code : Gaïa (Trébuchet de bataille)
 * @author Décabossage : Le Cartel du Donjon (Soudure de boucliers)
 * @author Code fossile Git->Origin : L'Ancien Régime & Co (Gergovie textuelle)
 */
export abstract class IdBinaire {

  /** 🕵️‍♂️ Expression régulière de validation d'un UUID compact pur de 32 caractères hexadécimaux 🔍 */
  private static readonly REGEX_HEX_COMPACT: RegExp = /^[0-9a-f]{32}$/;

  /** 💾 Le Côté Face : Segment de mémoire binaire pur 🤖 de 16 octets (128 bits tassés sans aucun alignement) */
  private readonly m_rBuffer: Buffer;

  /**
   * Construit et verrouille l'armure nominale binaire ⛓️.
   *
   * @protected
   * @constructor
   * @param {string | Buffer} idBrut - L'identifiant brut sous sa forme textuelle ou binaire 📥
   * @throws {Error} Si la syntaxe hexadécimale épurée ou la taille du Buffer est invalide 🚨
   */
  protected constructor(idBrut: string | Buffer) {
    if (typeof idBrut === 'string') {
      // Nettoyage rapide en ligne droite pour soulager le microprocesseur 🎛️ CPU
      const cleanHex = idBrut.toLowerCase().replace(/[^0-9a-f]/g, '');

      if (!IdBinaire.REGEX_HEX_COMPACT.test(cleanHex)) {
        throw new Error(`[Erreur Sécurité 🚨] Format d'identifiant binaire invalide : attendu 32 caractères hexadécimaux, reçu ${cleanHex.length}.`);
      }

      this.m_rBuffer = Buffer.from(cleanHex, 'hex');
    } else {
      // Verrouillage de sécurité physique impératif sur le Buffer invité 🔒
      if (idBrut.length !== 16) {
        throw new Error(`[Erreur Sécurité 🚨] Taille de segment mémoire invalide : attendu exactement 16 octets, reçu ${idBrut.length} octets.`);
      }
      this.m_rBuffer = idBrut;
    }
  }

  /**
   * 🎛️ Accesseur Côté Face : Renvoie le segment binaire 🤖 de 16 octets pour le pilote PostgreSQL 🔌.
   *
   * @public
   * @returns {Buffer} Le buffer d'infrastructure mémoire pur.
   */
  public get binaire(): Buffer {
    return this.m_rBuffer;
  }

  /**
   * 📜 Accesseur Côté Pile : Re-formate l'UUID standardisé avec ses 4 tirets réglementaires ⛓️.
   *
   * @public
   * @returns {string} La représentation textuelle 🌐 UUID normalisée (Format standard: 8-4-4-4-12)
   */
  public get valeur(): string {
    const hex = this.m_rBuffer.toString('hex');
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
  }

  /**
   * 🔄 Redéfinition sémantique de l'égalité au bit près en mémoire vive 🧠 RAM.
   *
   * @public
   * @param {IdBinaire} autreId - L'autre instance d'identifiant à comparer 🧮
   * @returns {boolean} Vrai si les segments binaires sous-jacents coïncident à 100% 🚀
   */
  public estEgalA(autreId: IdBinaire): boolean {
    return this.m_rBuffer.equals(autreId.binaire); // Utilisation de l'accesseur binaire sécurisé
  }

  /**
   * Permet l'affichage propre ou l'injection classique dans les logs d'infrastructure 📜.
   *
   * @public
   * @returns {string} La chaîne de caractères de l'UUID canonique avec ses tirets 🌐
   */
  public toString(): string {
    return this.valeur;
  }
}
