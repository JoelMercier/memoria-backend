// ——— fichier : src/constants/base/TailleCodeEnum.ts

import { SmartEnum } from '@/constants/base/SmartEnum'; // Importation absolue réglementaire

/**
 * 🎛️ Classe TailleCodeEnum 📐 (Le Calibreur d'Octets d'Infrastructure 🤖)
 * ----------------------------------------------------------------------------
 * Verrouille et valide les longueurs strictes autorisées pour les colonnes CHAR(N).
 * Évite les allocations anarchiques en RAM et sécurise les expressions régulières.
 *
 * @class TailleCodeEnum
 * @extends {SmartEnum<number>}
 * @author Vision & Conception : Joël (C++ Framework Architect)
 * @author Forge & Martelage du Code : Gaïa (Gardienne du silicium)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers de la première heure)
 */
export class TailleCodeEnum extends SmartEnum<number> {

  private constructor(p_sLibelle: string, p_nLongueurOctets: number, p_nOrdreAff: number) {
    super(p_sLibelle, p_nLongueurOctets, p_nOrdreAff);
  }

  // ----------------------------------------------------------------------------
  // 🏺 LES CALIBRES OFFICIELS ENRAMÉS (Garantie de l'alignement disque)
  // ----------------------------------------------------------------------------

  /** 🪙 DIM_1 - Pour les indicateurs ou drapeaux dictionnaire courts (Ex: "A", "I", "V") */
  public static readonly DIM_1 = new TailleCodeEnum('Dimension 1 octet', 1, 5);

  /** 🪙 DIM_2 - Pour les codes courts (Ex: Codes pays ISO "FR", "BE", "CA") */
  public static readonly DIM_2 = new TailleCodeEnum('Dimension 2 octets', 2, 10);

  /** 💽 DIM_3 - Pour les acronymes internationaux (Ex: Devises ISO "EUR", "USD") */
  public static readonly DIM_3 = new TailleCodeEnum('Dimension 3 octets', 3, 15);

  /** 💽 DIM_4 - Le standard de Mémoria (Rôles "CUST", Catégories "AUDI", Sévérités "INFO") */
  public static readonly DIM_4 = new TailleCodeEnum('Dimension 4 octets', 4, 20);

  /** 🚀 DIM_8 - Pour les extensions lourdes ou identifiants systèmes dictionnaire */
  public static readonly DIM_8 = new TailleCodeEnum('Dimension 8 octets', 8, 30);
}
