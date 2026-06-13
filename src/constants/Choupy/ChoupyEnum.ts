// ——— fichier : src\constants\Choupy\ChoupyEnum.ts

import { SmartEnum } from '@/constants/Choupy/SmartEnum';

/**
 * 🎛️ Classe ChoupyEnum 📐 (Le Calibreur et Protecteur de Buffers Binaires 🤖)
 * ----------------------------------------------------------------------------
 * Verrouille constitutionnellement les dimensions physiques maximales de la RAM.
 * Gère la douane active polymorphe (Buffer, Hexa, UUID, Texte Clair) face au ByteA.
 *
 * @class ChoupyEnum
 * @extends {SmartEnum<number>}
 * @author Directrice du Silicium : Joël (MANIAC de la Justification Technique)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur la Choupy Doctrine V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers en surchauffe de la V4)
 */
export class ChoupyEnum extends SmartEnum<number> {
  /** 🛡️ Regex de soute : Validation stricte du format UUID v4/v7 (36 caractères, hex + tirets) */
  private static readonly m_rRegexUuid =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  /** 🛡️ Regex de soute : Validation de la pureté hexadécimale (Uniquement 0-9 et a-f) */
  private static readonly m_rRegexHexa = /^[0-9a-fA-F]+$/;

  /**
   * Moule et scelle une dimension d'infrastructure immuable en RAM.
   * Constructeur privé pour interdire l'anarchie des tailles en dehors de la forge.
   */
  private constructor(p_sLibelle: string, p_nLongueurOctets: number, p_nOrdreAff: number) {
    super(p_sLibelle, p_nLongueurOctets, p_nOrdreAff);
    Object.freeze(this);
  }

  /** @public @returns {number} Le nombre total de bits */
  public get bits(): number {
    return this.code * 8;
  }

  /** @public @returns {number} La dimension en Ko */
  public get kiloOctets(): number {
    return this.code / 1024;
  }

  /**
   * 🛡️ Douane Active Polymorphe : Valide la conformité d'une donnée face au calibre physique.
   * [RÉPARÉ V4] Intègre constitutionnellement le format texte clair (1 caractère = 1 octet) !
   */
  public validerContenance(p_vDonnee: unknown): void {
    const l_sNomDimension = this.libelle;

    if (Buffer.isBuffer(p_vDonnee)) {
      if (p_vDonnee.length !== this.code) {
        throw new Error(
          `[Erreur Silicium 🚨] Le buffer binaire a une taille de ${p_vDonnee.length} octets, attendu exactement ${this.code} octets pour : ${l_sNomDimension}.`
        );
      }
      return;
    }

    if (typeof p_vDonnee === 'string') {
      const l_sTexteNettoye = p_vDonnee.trim();

      // Sous-cas A : Le format UUID textuel standard à 36 caractères pour un calibre 16 octets
      if (this.code === 16 && l_sTexteNettoye.length === 36) {
        if (!ChoupyEnum.m_rRegexUuid.test(l_sTexteNettoye)) {
          throw new Error(
            `[Erreur Silicium 🚨] La chaîne de transport de 36 caractères n'est pas un UUID structurellement valide pour : ${l_sNomDimension}.`
          );
        }
        return;
      }

      // Sous-cas B : Le format texte clair brut (1 caractère textuel standard = 1 octet physique)
      // [INSÉRÉ V4] Permet le transit de fiers quadrigrammes nominaux comme 'SYST' ou 'CONN'
      if (l_sTexteNettoye.length === this.code) {
        return;
      }

      // Sous-cas C : Le format Trame Hexadécimale codée (1 octet physique = 2 caractères hexa)
      const l_nLongueurAttendueHexa = this.code * 2;
      if (l_sTexteNettoye.length === l_nLongueurAttendueHexa) {
        if (!ChoupyEnum.m_rRegexHexa.test(l_sTexteNettoye)) {
          throw new Error(
            `[Erreur Silicium 🚨] La trame de transport contient des caractères invalides pour le format Hexadécimal pour : ${l_sNomDimension}.`
          );
        }
        return;
      }

      throw new Error(
        `[Erreur Silicium 🚨] La chaîne de transport textuelle fait ${l_sTexteNettoye.length} caractères, attendu exactement ${this.code} (texte clair) ou ${l_nLongueurAttendueHexa} (format Hexa) pour : ${l_sNomDimension}.`
      );
    }

    throw new Error(
      `[Erreur Sémantique 🚨] Type de donnée inconnu au poste-frontière de ChoupyEnum. Impossible de valider la contenance.`
    );
  }

  // ----------------------------------------------------------------------------
  // 🏺 LES CALIBRES MACHINES ENRAMÉS (Garantie absolue de l'alignement matériel)
  // ----------------------------------------------------------------------------
  public static readonly DIM_1 = new ChoupyEnum('1 octet (char)', 1, 5);
  public static readonly DIM_2 = new ChoupyEnum('2 octets (mot 16 bits)', 2, 10);
  public static readonly DIM_3 = new ChoupyEnum('3 octets (Trigramme 24 bits)', 3, 15);
  public static readonly DIM_4 = new ChoupyEnum('4 octets (Quadrigramme 32 bits)', 4, 20);
  public static readonly DIM_8 = new ChoupyEnum('8 octets (GrosMot 64 bits)', 8, 25);
  public static readonly DIM_16 = new ChoupyEnum(`16 octets (UUID's 128 bits)`, 16, 30);
  public static readonly DIM_32 = new ChoupyEnum('32 octets (SHA-256 256 bits)', 32, 35);
  public static readonly DIM_64 = new ChoupyEnum('64 octets (SHA-512 512 bits)', 64, 40);
  public static readonly DIM_128 = new ChoupyEnum('128 octets (CléAsym 1024 bits)', 128, 45);
  public static readonly DIM_256 = new ChoupyEnum('256 octets (CléAsym 2048 bits)', 256, 50);
}
