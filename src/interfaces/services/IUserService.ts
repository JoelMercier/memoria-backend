// ——— fichier : src/interfaces/services/IUserService.ts

import      { IBaseService      } from '@/interfaces/services/IBaseService';
import      { UserId            } from '@/domain/value-objects/ids';
import type { ChangePasswordDto } from '@/dto/user/ChangePasswordDto';
import type { DeleteAccountDto  } from '@/dto/user/DeleteAccountDto';
import type { UpdateProfileDto  } from '@/dto/user/UpdateProfileDto';
import type { IUser             } from '@/interfaces/entities/user/IUser';
import      { IUserRepository   } from '@/interfaces/repositories/IUserRepository';

/**
 * 📜 Interface IUserService
 * -------------------------
 * Contrat du service applicatif orchestrant le cycle de vie et la sécurité des utilisateurs.
 * Transitionne vers le type nominal pour interdire les chaînes primitives brutes.
 *
 * @interface IUserService
 * @extends {IBaseService}
 * @author Directrice du Silicium : Joël (DR-DOS maniac, Nominal Casse Obsession)
 * @author Graveuse de Pépites : Gaïa (Au burin, à la chaleur de l'acier et des octets V4)
 * @author Garde d'Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export interface IUserService extends IBaseService<IUserRepository>  {

  /**
   * 🎛️ Modifie les informations de contact ou publiques du profil.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur cible
   * @param {UpdateProfileDto} p_oDto - Les nouveaux attributs de profil (Pseudo, etc.) à appliquer
   * @returns {Promise<IUser>} L'entité de l'utilisateur révisée et mise à jour
   */
  updateProfile(p_axUserId: UserId, p_oDto: UpdateProfileDto): Promise<IUser>;

  /**
   * 🔏 Applique et valide le renouvellement du mot de passe de l'acteur.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire de l'acteur concerné
   * @param {ChangePasswordDto} p_oDto - Le doublet d'anciens et de nouveaux mots de passe bruts
   * @returns {Promise<void>}
   */
  changePassword(p_axUserId: UserId, p_oDto: ChangePasswordDto): Promise<void>;

  /**
   * 🗑️ Purge définitivement l'intégralité du compte de l'utilisateur.
   * Déclenchera l'anonymisation RGPD ou le nettoyage complet de ses dépendances.
   *
   * @param {UserId} p_axUserId - L'identifiant fort binaire du compte à éradiquer
   * @param {DeleteAccountDto} p_oDto - Le payload de confirmation (Mot de passe de validation, etc.)
   * @returns {Promise<void>}
   */
  deleteAccount(p_axUserId: UserId, p_oDto: DeleteAccountDto): Promise<void>;
}
