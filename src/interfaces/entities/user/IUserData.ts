// ——— fichier : src/interfaces/entities/user/IUserData.ts

import type { AuthProvider    } from '@/constants/AuthProvider';
import type { Role            } from '@/constants/Role';
import type { UserId          } from '@/domain/value-objects/IdMetier';
import type { IBaseEntityData } from '@/interfaces/entities/IBaseEntityData';

/**
 * 📦 Interface IUserData
 * ----------------------
 * Contrat de structure passive pour les données brutes d'un utilisateur.
 * Entièrement calé sur le mécanisme de type mapping générique absolu.
 *
 * @interface IUserData
 * @extends {IBaseEntityData<'user', UserId>}
 * @author Joël, Gaïa & Co
 */
export interface IUserData extends IBaseEntityData<'user', UserId> {

  /** 🆔 Identifiant unique et fortement typé de l'utilisateur (idUser). */
  idUser : UserId;

  /** 📧 Adresse email unique servant d'identifiant de connexion principale. */
  email : string;

  /** 🔑 Empreinte cryptographique (Hachage) du mot de passe utilisateur. */
  passwordHash : string;

  /** 👤 Pseudonyme ou nom d'affichage public sur la plateforme. */
  pseudo : string;

  /** 🗂️ Rôle de privilège hiérarchique (Smart Enum : CUSTOMER, ADMIN...). */
  role : Role;

  /** 🌐 Fournisseur d'authentification d'origine (Smart Enum : LOCAL, GOOGLE...). */
  authProvider : AuthProvider;

  /** 🗄️ Configurations et préférences de l'interface au format JSON. */
  settingsUser : Record<string, any>;

  /** 🛡️ Indicateur d'acceptation des conditions d'utilisation et du RGPD. */
  gdprConsent : boolean;

  /** ⏱️ Horodatage précis de la signature du consentement RGPD (Peut être NULL). */
  gdprConsentDate? : Date | null;
}
