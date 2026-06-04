// ——— fichier : src/domain/base/IdCodeFixe.ts

import { IdInfrastructure } from '@/domain/base/IdInfrastructure'; // Importation absolue réglementaire
import { TailleCodeEnum }   from '@/constants/base/TailleCodeEnum';   // Importation absolue réglementaire

/**
 * 🏛️ Classe Abstraite IdCodeFixe 🎛️ (Le Régulateur de Codes ASCII à Taille Fixe 🤖)
 * ----------------------------------------------------------------------------
 * Spécialisation pour les identifiants de type dictionnaire alphanumérique.
 * Valide et fige les codes immuables de type CHAR(N) (Ex: 1, 2, 3, 4, 8 octets).
 *
 * @class IdCodeFixe
 * @abstract
 * @extends {IdInfrastructure<string>}
 * @author Vision & Conception : Joël (C++ Framework Architect)
 * @author Forge & Martelage du Code : Gaïa (Graveuse d'acier trempé)
 */
export abstract class IdCodeFixe extends IdInfrastructure<string> {

  /**
   * Moule et sécurise le code à taille fixe en RAM.
   *
   * @protected
   * @constructor
   * @param {string} p_sCodeBrut - Le code textuel à valider
   * @param {TailleCodeEnum} p_oCalibre - L'instance officielle de taille (SmartEnum)
   */
  protected constructor(p_sCodeBrut: string, p_oCalibre: TailleCodeEnum) {
    if (!p_sCodeBrut) {
      throw new Error(`[Erreur Sécurité 🚨] Le code d'infrastructure ne peut pas être vide.`);
    }

    const l_sCodeNettoye = p_sCodeBrut.trim().toUpperCase();
    const l_nTailleNumerique = p_oCalibre.code;

    // Configuration géométrique de la regex selon le calibre officiel
    const l_oRegexTailleFixe = new RegExp(`^[A-Z0-9]{${l_nTailleNumerique}}$`);

    if (!l_oRegexTailleFixe.test(l_sCodeNettoye)) {
      throw new Error(`[Erreur Sécurité 🚨] Format de code invalide : attendu exactement ${l_nTailleNumerique} caractères, reçu "${l_sCodeNettoye}" (${l_sCodeNettoye.length} caractères).`);
    }

    super(l_sCodeNettoye);
  }

  /**
   * 🎛️ Accesseurs Publics Réglementaires (Conformité de l'interface d'extraction)
   */
  public get code(): string {
    return this.infrastructureBrute;
  }

  public get valeur(): string {
    return this.infrastructureBrute;
  }

  public toString(): string {
    return this.infrastructureBrute;
  }
}
