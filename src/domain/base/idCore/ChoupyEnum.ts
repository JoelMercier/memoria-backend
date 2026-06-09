// ——— fichier : src\domain\base\idCore\ChoupyEnum.ts

import { SmartEnum } from '@/constants/base/SmartEnum';

/**
 * 🎛️ Classe ChoupyEnum 📐 (Le Calibreur et Protecteur de Buffers Binaires 🤖)
 * ----------------------------------------------------------------------------
 * Verrouille constitutionnellement les dimensions physiques maximales de la RAM.
 * Gère la douane active polymorphe (Buffer, Hexa, UUID) face au standard ByteA.
 *
 * @class ChoupyEnum
 * @extends {SmartEnum<number>}
 * @author Directrice du Silicium : Joël (MANIAC de la Justification Technique)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur la Choupy Doctrine)
 */
export class ChoupyEnum extends SmartEnum<number> {

  /**
   * Moule et scelle une dimension d'infrastructure immuable en RAM.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - Le libellé machine explicite et choupy
   * @param {number} p_nLongueurOctets - La taille physique stricte en octets
   * @param {number} p_nOrdreAff - La position numérique de tri logique
   */
  private constructor(p_sLibelle: string, p_nLongueurOctets: number, p_nOrdreAff: number) {
    super(p_sLibelle, p_nLongueurOctets, p_nOrdreAff);

    // Gel constitutionnel de l'instance pour interdire toute altération en RAM
    Object.freeze(this);
  }

  /**
   * ⚖️ Obtient le poids équivalent de la dimension converti en bits.
   * Useful pour documenter les messages de douane ou les logs système.
   *
   * @public
   * @returns {number} Le nombre total de bits (Octets * 8)
   */
  public get bits(): number {
    return this.code * 8;
  }

  /**
   * ⚖️ Obtient la contenance équivalente convertie en Kilo-octets (Ko).
   * Idéal pour le calibrage futur des clés lourdes ou des tampons de fichiers.
   *
   * @public
   * @returns {number} La dimension en Ko (Octets / 1024)
   */
  public get kiloOctets(): number {
    return this.code / 1024;
  }

  /**
   * 🛡️ Douane Active Polymorphe : Valide la conformité d'une donnée face au calibre physique.
   * Accepte et décode les Buffers binaires, les chaînes UUID v7 et les trames Hexadécimales brutes.
   *
   * @public
   * @param {unknown} p_vDonnee - La structure ou primitive textuelle à soumettre au guichet
   * @throws {Error} Si la longueur physique ou le format de transport viole la contrainte de la soute
   * @returns {void}
   */
  public validerContenance(p_vDonnee: unknown): void {
    const l_sNomDimension = this.libelle;

    // Cas d'école 1 : C'est un Buffer binaire pur (Format ByteA de persistance)
    if (Buffer.isBuffer(p_vDonnee)) {
      if (p_vDonnee.length !== this.code) {
        throw new Error(`[Erreur Silicium 🚨] Le buffer binaire a une taille de ${p_vDonnee.length} octets, attendu exactement ${this.code} octets pour : ${l_sNomDimension}.`);
      }
      return;
    }

    // Cas d'école 2 : C'est une chaîne de caractères de transport (Réseau / Tuyau)
    if (typeof p_vDonnee === 'string') {
      const l_sTexteNettoye = p_vDonnee.trim();

      // Sous-cas A : C'est le format UUID v7 textuel standard à 36 caractères (avec tirets)
      if (this.code === 16 && l_sTexteNettoye.length === 36 && l_sTexteNettoye.includes('-')) {
        return; // Validation sémantique du tuyau UUID
      }

      // Sous-cas B : C'est une trame Hexadécimale brute (1 octet physique = 2 caractères hexa)
      const l_nLongueurAttendueHexa = this.code * 2;
      if (l_sTexteNettoye.length !== l_nLongueurAttendueHexa) {
        throw new Error(`[Erreur Silicium 🚨] La chaîne de transport textuelle fait ${l_sTexteNettoye.length} caractères, attendu exactement ${l_nLongueurAttendueHexa} caractères (format Hexa) pour : ${l_sNomDimension}.`);
      }
      return;
    }

    // Cas pathologique : La structure passée n'est pas gérée par le décodeur
    throw new Error(`[Erreur Sémantique 🚨] Type de donnée inconnu au poste-frontière de ChoupyEnum. Impossible de valider la contenance.`);
  }

  // ----------------------------------------------------------------------------
  // 🏺 LES CALIBRES MACHINES ENRAMÉS (Garantie absolue de l'alignement matériel)
  // ----------------------------------------------------------------------------

  /** 🪙 DIM_1 - 1 octet (char) : Pour les indicateurs ou drapeaux courts (Ex: "A", "I", "V") */
  public static readonly DIM_1 = new ChoupyEnum('1 octet (char)', 1, 5);

  /** 🪙 DIM_2 - 2 octets (mot 16 bits) : Pour les codes courts (Ex: ISO "FR", "BE") */
  public static readonly DIM_2 = new ChoupyEnum('2 octets (mot 16 bits)', 2, 10);

  /** 💽 DIM_3 - 3 octets (Trigramme 24 bits) : Pour les acronymes internationaux (Ex: Devises "EUR") */
  public static readonly DIM_3 = new ChoupyEnum('3 octets (Trigramme 24 bits)', 3, 15);

  /** 💽 DIM_4 - 4 octets (Quadrigramme 32 bits) : Le standard Mémoria (Rôles "CUST", Sévérités "INFO") */
  public static readonly DIM_4 = new ChoupyEnum('4 octets (Quadrigramme 32 bits)', 4, 20);

  /** 🚀 DIM_8 - 8 octets (GrosMot 64 bits) : Pour les extensions lourdes ou identifiants systèmes */
  public static readonly DIM_8 = new ChoupyEnum('8 octets (GrosMot 64 bits)', 8, 25);

  /** 💎 DIM_16 - 16 octets (UUID''s 128 bits) : Le cœur V4 pour le stockage ByteA compact des UUID v7 */
  public static readonly DIM_16 = new ChoupyEnum(`16 octets (UUID''s 128 bits)`, 16, 30);

  /** 🛡️ DIM_32 - 32 octets (SHA-256 256 bits) : Pour les empreintes de hachage de vérification d''intégrité */
  public static readonly DIM_32 = new ChoupyEnum('32 octets (SHA-256 256 bits)', 32, 35);

  /** 🔮 DIM_64 - 64 octets (SHA-512 512 bits) : Pour le chiffrement lourd et les signatures d''élite */
  public static readonly DIM_64 = new ChoupyEnum('64 octets (SHA-512 512 bits)', 64, 40);

  /** 🔐 DIM_128 - 128 octets (CléAsym 1024 bits) : Premier palier des clés asymétriques étendues */
  public static readonly DIM_128 = new ChoupyEnum('128 octets (CléAsym 1024 bits)', 128, 45);

  /** 🏰 DIM_256 - 256 octets (CléAsym 2048 bits) : Le coffre-fort maximal pour les chiffrements asymétriques lourds */
  public static readonly DIM_256 = new ChoupyEnum('256 octets (CléAsym 2048 bits)', 256, 50);
}
