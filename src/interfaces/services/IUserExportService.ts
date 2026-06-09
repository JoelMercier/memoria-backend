// ——— fichier : src/interfaces/services/IUserExportService.ts

import { IBaseService       } from '@/interfaces/services/IBaseService';
import { UserId             } from '@/domain/value-objects/ids';
import type { UserExportDto } from '@/dto/user/UserExportDto';
import { IUserRepository    } from '@/interfaces/repositories/IUserRepository';

/**
 * 📜 Interface IUserExportService
 * -------------------------------
 * Contrat du service applicatif dédié à la portabilité des données (RGPD).
 * Sécurise l'extraction de masse en exigeant le type nominal fort.
 *
 * @interface IUserExportService
 * @extends {IBaseService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IUserExportService extends IBaseService<IUserRepository> {

  /**
   * 📦 Agrège l'intégralité des données personnelles d'un utilisateur (RGPD Article 20).
   * Extraira de manière atomique le profil, les pépites, les tags et les partages de l'acteur.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'utilisateur demandant l'extraction
   * @returns {Promise<UserExportDto>} Le dictionnaire lourd de données purifiées pour la portabilité
   */
  exportUserData(p_axUserId: UserId): Promise<UserExportDto>;
}
