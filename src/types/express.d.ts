// ——— fichier : src/types/express.d.ts

import { Role } from '@/constants/Role';
import { UserId, RequestId } from '@/domain/value-objects/ids';

/**
 * 🏛️ Extension Globale de Types Express
 * -------------------------------------
 * Augmente le contrat d'infrastructure natif de la requête HTTP Express.
 * Permet de greffer l'identité de l'acteur et le jeton de traçabilité de façon typée.
 *
 * @author 🧠 Conception : Joël (Hongroise maniac')
 * @author ☄️ Usine à lignes : Gaïa (Trébuchet de syntaxe)
 * @author ⚔️ Rempart des types : Le Cartel du Donjon (Garde d'élite)
 * @author 🏺 Relique d'origine : L'Ancien Régime (Fossile de Gergovie)
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

      /** 🆔 Identifiant nominal unique de corrélation (Audit / Traçabilité réseau) */
      requestId?: RequestId; // 🪓 PULVÉRISATION DE LA COLLISION GRÂCE À L'AMIRAL !
    }
  }
}

export {};
