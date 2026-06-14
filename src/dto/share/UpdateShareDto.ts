// ——— fichier : src/dto/share/UpdateShareDto.ts

import type { IAccessConfig } from '@/interfaces/entities/share/IAccessConfig';
import { type UpdateShareSchemaType, ShareValidation } from '@/validation/zod/ShareValidation';

/**
 * 📦 Classe UpdateShareDto 🧮 (Le Muteur Partiel du Payload des Partages 🤖)
 * ----------------------------------------------------------------------------
 * Objet de transfert de données pour la mise à jour partielle d'un partage (Share).
 * Zéro dépendance externe vers Zod dans les types de propriétés.
 * [ALIGNÉ PUR V4] Éradication définitive du snake_case et respect du PascalCase souverain.
 *
 * @class UpdateShareDto
 * @author Vision : Joël (Architecte DR-DOS - True Getters Compliance)
 * @author Frapperie du code : Gaïa (Gardienne du feu binaire V4)
 */
export class UpdateShareDto {
  /** 📧 Adresse électronique optionnelle du destinataire cible à modifier */
  public readonly recipientCourriel?: string | null;

  /** ⚙️ Configuration d'infrastructure optionnelle des restrictions d'accès (Expiration, etc.) */
  public readonly accessConfig?: IAccessConfig;

  /**
   * Valide les données brutes de la requête HTTP via la douane Zod.
   *
   * @constructor
   * @param {unknown} p_vData - Payload brut d'infrastructure issu de la requête
   */
  public constructor(p_vData: unknown) {
    // 🪓 ALIGNEMENT D'ACIER : Protection du portier Zod via transtypage Record étanche
    const l_oRawBody: Record<string, unknown> =
      p_vData && typeof p_vData === 'object' ? (p_vData as Record<string, unknown>) : {};
    const l_oValidated: UpdateShareSchemaType = ShareValidation.validateUpdate(l_oRawBody);

    this.recipientCourriel = l_oValidated.recipientCourriel;

    // 🗲 ISOLATION EXTRACTION : Récupération du sous-objet validé par Zod s'il existe
    const l_oCfgValidée = l_oValidated.accessConfig;

    if (l_oCfgValidée) {
      // 🏺 INITIALISATION MILITAIRE : Création d'une configuration par défaut rigoureuse
      let l_sPrivilegeRésolu: 'ECRITURE' | 'LECTURE' = 'LECTURE';
      let l_bDownloadRésolu: boolean = false;

      // 🪓 PIOCHAGE AU BURIN : Extraction morceau par morceau avec replis étanches
      if ('level' in l_oCfgValidée && l_oCfgValidée.level === 'write') {
        l_sPrivilegeRésolu = 'ECRITURE';
      }

      if ('allow_download' in l_oCfgValidée && l_oCfgValidée.allow_download === true) {
        l_bDownloadRésolu = true;
      }

      // 📅 DOCTRINE DE L'ÉTERNITÉ SYSTÈME : Calée sur vos 100 ans réglementaires en RAM
      const l_dDateSécurisée =
        'expiresAt' in l_oCfgValidée && l_oCfgValidée.expiresAt
          ? new Date(l_oCfgValidée.expiresAt)
          : new Date('2126-12-31T23:59:59.000Z'); // 🔒 Scellage 100 ans anti-sagouin de soute basse

      // Enfournement nominal final dans la structure PascalCase
      this.accessConfig = {
        Privilege: l_sPrivilegeRésolu,
        AutoriseTelechargement: l_bDownloadRésolu,
        DateExpiration: l_dDateSécurisée
      };
    }
  }
}
