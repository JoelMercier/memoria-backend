// ——— fichier : src/infrastructure/repositories/mocks/MockItemTagRepository.ts

import { Tag                  } from '@/entities/Tag';
import { ItemId, TagId        } from '@/domain/value-objects/ids';
import { MockTagRepository    } from '@/infrastructure/repositories/mocks/MockTagRepository';
import type { IItemTagRepository } from '@/interfaces/repositories/PostGres/IItemTagRepository';

/**
 * 🗄️ Structure de liaison interne pour la simulation de table pivot en RAM 🧠
 */
interface IMockItemTagRow {
  tiItemId    : ItemId;
  tiTagId     : TagId;
  tiCreatedAt : Date;
}

/**
 * 🔗 Classe MockItemTagRepository 🧮 (Le Pivot de Simulation des Liaisons 🤖)
 * ----------------------------------------------------------------------------
 * Émule en mémoire active le comportement de la table associative pivot "ItemTags".
 * Nécessite une instance de MockTagRepository pour réarmer les entités Tag unifiées.
 *
 * @class MockItemTagRepository
 * @implements {IItemTagRepository}
 * @author Vision : Joël (Chasseur de padding)
 * @author Frapperie du code : Gaïa (Graveuse de pépites d'or)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export class MockItemTagRepository implements IItemTagRepository {

  /** 🧠 La table virtuelle associative Many-to-Many stockée en mémoire vive */
  private m_aoRelations: IMockItemTagRow[] = [];

  /** 🔌 Le pointeur vers le dépôt factice des étiquettes pour les jointures */
  private readonly m_oTagRepo: MockTagRepository;

  /**
   * Arme le pivot de simulation avec son dépôt d'étiquettes miroir.
   */
  public constructor(p_oTagRepo: MockTagRepository) {
    this.m_oTagRepo = p_oTagRepo;
  }

  /**
   * 🪓 Écriture concrète : Assigne une étiquette à une pépite en RAM 🪙.
   *
   * @public
   * @async
   * @param {ItemId} p_axItemId - L'identifiant binaire de la pépite cible
   * @param {TagId} p_axTagId - L'identifiant binaire de l'étiquette à lier
   * @returns {Promise<void>}
   */
  public async add(p_axItemId: ItemId, p_axTagId: TagId): Promise<void> {
    const l_bExiste = this.m_aoRelations.some((l_oRow: IMockItemTagRow): boolean =>
      l_oRow.tiItemId.estEgalA(p_axItemId) && l_oRow.tiTagId.estEgalA(p_axTagId)
    );

    // Émulation passive de la contrainte d'unicité (On Conflict Do Nothing) [Mémoria]
    if (!l_bExiste) {
      this.m_aoRelations.push({
        tiItemId    : p_axItemId,
        tiTagId     : p_axTagId,
        tiCreatedAt : new Date()
      });
    }
  }

  /**
   * 🪓 Écriture concrète : Supprime l'association Many-to-Many entre une pépite et une étiquette.
   */
  public async remove(p_axItemId: ItemId, p_axTagId: TagId): Promise<boolean> {
    const l_iTailleInitiale = this.m_aoRelations.length;
    this.m_aoRelations = this.m_aoRelations.filter((l_oRow: IMockItemTagRow): boolean =>
      !(l_oRow.tiItemId.estEgalA(p_axItemId) && l_oRow.tiTagId.estEgalA(p_axTagId))
    );
    return this.m_aoRelations.length < l_iTailleInitiale;
  }

  /**
   * 🪓 Transaction Commando : Synchronise la collection d'étiquettes d'une pépite.
   */
  public async sync(p_axItemId: ItemId, p_aaxTagIds: ReadonlyArray<TagId>): Promise<void> {
    // 1. Purge complète des liaisons existantes pour cette pépite (Simule le DELETE)
    await this.clearForItem(p_axItemId);

    // 2. Ré-injection séquentielle en boucle (Simule le INSERT multi-lignes)
    for (const l_axTagId of p_aaxTagIds) {
      await this.add(p_axItemId, l_axTagId);
    }
  }

  /**
   * 🔍 Jointure chirurgicale : Extrait toutes les étiquettes rattachées à une pépite 📥.
   * ----------------------------------------------------------------------------
   * Alignement d'acier : Tri chronologique indexé sur tiCreatedAt, respectant la base.
   *
   * @public
   * @async
   * @param {ItemId} p_axItemId - L'identifiant fort de la pépite cible
   * @returns {Promise<Tag[]>} La liste des étiquettes ordonnées chronologiquement
   */
  public async findTagsForItem(p_axItemId: ItemId): Promise<Tag[]> {
    // 1. Filtrage local des pivots liés à la pépite cible
    const la_oPivotFiltres = this.m_aoRelations.filter((l_oRow: IMockItemTagRow): boolean =>
      l_oRow.tiItemId.estEgalA(p_axItemId)
    );

    // 2. Tri chronologique immédiat sur les lignes du tas (Heap) de simulation
    const la_oPivotTriees = la_oPivotFiltres.sort((a, b) => a.tiCreatedAt.getTime() - b.tiCreatedAt.getTime());

    const la_oResultats: Tag[] = [];

    // 3. Émulation de l'INNER JOIN synchrone en RAM via le MockTagRepository
    for (const l_oPivot of la_oPivotTriees) {
      const l_oTagRiche = await this.m_oTagRepo.findById(l_oPivot.tiTagId);
      if (l_oTagRiche) {
        la_oResultats.push(l_oTagRiche);
      }
    }

    return la_oResultats;
  }

  /**
   * 🪓 Écriture concrète : Nettoie l'intégralité des étiquettes liées à une pépite.
   */
  public async clearForItem(p_axItemId: ItemId): Promise<void> {
    this.m_aoRelations = this.m_aoRelations.filter((l_oRow: IMockItemTagRow): boolean =>
      !l_oRow.tiItemId.estEgalA(p_axItemId)
    );
  }
}
