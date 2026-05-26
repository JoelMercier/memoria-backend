// ——— fichier : src/interfaces/services/IUserExportService.ts

import { UserId        } from '@/domain/value-objects/IdMetier';
import type { UserExportDto } from '@/dto/user/UserExportDto';

/**
 * 📜 Interface IUserExportService
 * -------------------------------
 * Contrat du service applicatif dédié à la portabilité des données (RGPD).
 * Sécurise l'extraction de masse en exigeant le type nominal fort.
 *
 * @interface IUserExportService
 * @author Joël, Gaïa & Co
 */
export interface IUserExportService {

  /** 📦 Agrège l'intégralité des données personnelles d'un utilisateur (RGPD Article 20). */
  exportUserData(userId: UserId): Promise<UserExportDto>;
}
