// ——— fichier : src/domain/value-objects/ids/index.ts

/**
 * 🚪 Barillet de Ré-exportation Universel (Barrel Export) 💎
 * ----------------------------------------------------------------------------
 * Centralise, aligne et expose l'intégralité des identifiants forts nominaux du Domaine.
 * Fait office de guichet unique pour maintenir le couplage lâche et la portabilité de l'infrastructure.
 *
 * 💡 SOUVERAINETÉ DRY :
 * Permet d'effacer définitivement les anciens fichiers monolithiques et les mamans dupliquées
 * sans casser la moindre ligne d'importation dans les services, les contrôleurs ou les dépôts.
 *
 * @author Directrice du Silicium : Joël (C++ Framework Architect - DRY Engine)
 * @author Alignement des Vannes : Gaïa (Gardienne du barillet atomique Choupy)
 */

// --- 💎 La Lignée des UUIDs Lourds (16 octets / ByteA / IdChoupy DIM_16) ---
export { UserId       } from './UserId';
export { ItemId       } from './ItemId';
export { EventId      } from './EventId';
export { ShareId      } from './ShareId';
export { SessionId    } from './SessionId';
export { TagId        } from './TagId';

// --- 🔌 La Lignée des Quadrigrammes Fixes (4 octets / Char(4) / IdChoupy DIM_4) ---
export { RoleId        } from './RoleId';
export { CategorieId   } from './CategorieId';
export { SeveriteId    } from './SeveriteId';
export { ProviderId    } from './ProviderId';
export { ContentTypeId } from './ContentTypeId';
export { SecteurId     } from './SecteurId';
export { ActionId      } from './ActionId';
