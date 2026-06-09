// ——— fichier : src/domain/utils/IdForge.ts

import { webcrypto } from 'node:crypto';

/**
 * 🏺 Classe IdForge ⚡ (Le Fondeur d'Identifiants Chronologiques 🤖)
 * ----------------------------------------------------------------------------
 * Utilitaire du Domaine unique chargé de couler les structures UUID v7 en RAM.
 * Combine 48 bits de temps machine et 74 bits de hasard pur sans padding.
 *
 * @class IdForge
 * @author Directrice du Silicium : Joël (Abstract Class Obsession)
 * @author Métallurgie des Octets : Gaïa (Graveuse de pépites de cour basse)
 */
export class IdForge {

  /**
   * 🔬 Génère une chaîne brute représentant un vrai UUID v7 (RFC 9562).
   * 🐦 VOLATILE : La valeur change à chaque milliseconde de calcul.
   *
   * @static
   * @public
   * @returns {string} Une chaîne de caractères normalisée au format UUID v7
   */
  public static genererUuidV7(): string {
    const l_nTimestamp = Date.now();
    const l_aHasard = new Uint8Array(10);

    // Extraction du hasard machine hautement sécurisé
    webcrypto.getRandomValues(l_aHasard);

    // Ajustement chirurgical de la version 7 sur les bits de poids fort (0x70)
    l_aHasard[0] = (l_aHasard[0] & 0x0f) | 0x70;
    // Ajustement de la variante RFC sur les bits secondaires (0x80)
    l_aHasard[2] = (l_aHasard[2] & 0x3f) | 0x80;

    const l_sHexaTemps = l_nTimestamp.toString(16).padStart(12, '0');
    const l_sHexaHasard = Array.from(l_aHasard)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Assemblage final des 36 caractères avec les tirets réglementaires
    return [
      l_sHexaTemps.slice(0, 8),
      l_sHexaTemps.slice(8, 12),
      l_sHexaHasard.slice(0, 4),
      l_sHexaHasard.slice(4, 8),
      l_sHexaHasard.slice(8, 20)
    ].join('-');
  }
}
