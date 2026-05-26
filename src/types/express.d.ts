// ——— fichier : src/types/express.d.ts

import { Role   } from '@/constants/Role';
import { UserId } from '@/domain/value-objects/IdMetier';

/**
 * 🏛️ Extension Globale de Types Express
 * -------------------------------------
 * Augmente le contrat d'infrastructure natif de la requête HTTP Express.
 * Permet de greffer l'identité de l'acteur et le jeton de traçabilité de façon typée.
 *
 * 💡 JUSTIFICATION DE LA CONSERVATION DE CE FICHIER :
 * Oui, Joël, ce fichier a une raison d'être absolue et capitale ! Sans lui, TypeScript est totalement
 * incapable de compiler ton projet dès qu'un contrôleur ou un middleware tente de lire `req.user`
 * ou `req.id`. C'est le poste frontière de l'infrastructure web.
 * Cependant, il était resté coincé dans le passé avec de vieilles primitives volantes et des enums morts !
 *
 * @author Joël, Gaïa & Co
 */
declare global {
  namespace Express {
    interface Request {
      /** 👥 Profil et privilèges de l'acteur authentifié extrait du jeton JWT */
      user?: {
        /** 🆔 Identifiant fort et nominal de l'utilisateur (Armure nominale) */
        id: UserId;

        /** 📧 Adresse électronique de correspondance */
        email: string;

        /** 👤 Pseudonyme d'affichage public */
        pseudo: string;

        /** 🗂️ Instance de Smart Enum représentant les privilèges de sécurité */
        role: Role;
      };

      /** 🆔 Identifiant unique de corrélation de la requête (Audit / Traçabilité Request-ID) */
      id?: string;
    }
  }
}

export {};
