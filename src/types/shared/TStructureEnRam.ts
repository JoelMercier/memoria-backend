// ——— fichier : src/types/shared/TStructureEnRam.ts

import type { Buffer } from 'node:buffer';

/**
 * 🎛️ Type TStructureEnRam 📐 (Le Calibreur d'Octets Volatils 🤖)
 * Verrouille constitutionnellement les deux seules formes physiques acceptées en RAM
 * pour le transport et la manipulation des données d'infrastructure de Mémoria V4.
 *
 * @type TStructureEnRam
 * @author Direction du Silicium : Joël (Nettoyeur de diamants kilométriques)
 */
export type TStructureEnRam = string | Buffer;
