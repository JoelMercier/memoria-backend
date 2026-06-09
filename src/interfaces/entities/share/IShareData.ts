// ——— fichier : src/interfaces/entities/share/IShareData.ts

import { ShareId, ItemId, UserId } from '@/domain/value-objects/ids';
import { IAccessConfig }           from './IAccessConfig';
import { IBaseEntityData }         from '@/interfaces/entities/IBaseEntityData';

/**
 * 📊 Interface IShareData 📦 (Le Miroir Épuré et Performant du Domaine Partages)
 * ----------------------------------------------------------------------------
 * Contrat de structure passive (Data Contract) représentant un Partage en soute.
 * Purifié des préfixes physiques "sh" pour s'harmoniser avec la charte Mémoria V4.
 *
 * @interface IShareData
 * @extends {IBaseEntityData<'share', ShareId>}
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Clean CamelCase)
 * @author Métallurgie des Octets : Gaïa (Au burin, calée sur l'harmonie des soutes)
 */
export interface IShareData extends IBaseEntityData<'share', ShareId> {
  /** 📥 Clé étrangère binaire pointant vers la pépite rattachée (shItemId) */
  itemId: ItemId;

  /** 👥 Clé dé-normalisée d'ownership pour le tir de performance sans jointure (shItemOwnerId) */
  itemOwnerId: UserId;

  /** 📧 Adresse de courriel optionnelle du destinataire invité (shCourrielDest) */
  courrielDest: string | null;

  /** 🔐 Jeton aléatoire sécurisé de contrebande réseau (shJeton) */
  jeton: string;

  /** ⚙️ Dictionnaire Jsonb des règles d'accès réelles (shConfiguration) */
  configuration: IAccessConfig;
}
