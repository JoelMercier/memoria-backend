// ——— fichier : src/infrastructure/repositories/mocks/MockTagRepository.ts

import { Tag }                  from '@/entities/Tag';
import { TagId, UserId }        from '@/domain/value-objects/ids';
import type { ITagData }        from '@/interfaces/entities/tag/ITagData';
import type { ITagRepository }  from '@/interfaces/repositories/ITagRepository';

/**
 * 🗄️ Classe MockTagRepository 🧮 (Le Banc de Test des Étiquettes 🤖)
 * ----------------------------------------------------------------------------
 * Simulateur passif en RAM émulant le cycle de vie complet de la table "Tags".
 * Garantit des tests unitaires rapides et étanches sans aucun transit réseau.
 *
 * @class MockTagRepository
 * @implements {ITagRepository}
 * @author Déconstruction : Joël (Nostalgique de l'ADA)
 * @author Ciselage du code : Gaïa (Perle de la fonderie)
 * @author Reliques Git->Origin : L'Ancien Régime & Co (Artisans du temps imparti)
 */
export class MockTagRepository implements ITagRepository {
  /** 🧠 La table virtuelle simulant le stockage physique contigu en mémoire vive */
  private m_aoTags: Tag[] = [];

  /**
   * 🔍 Localise une étiquette via son identifiant nominal fort 🤖.
   *
   * @public
   * @async
   * @param {TagId} p_oId - L identifiant unique encapsulant le Buffer
   * @returns {Promise<Tag | null>} L instance trouvée ou null si absente
   */
  public async findById(p_oId: TagId): Promise<Tag | null> {
    // Utilisation de la méthode native d égalité au bit près en RAM ! [Mémoria]
    return this.m_aoTags.find((l_oTag: Tag): boolean => l_oTag.getTagId().estEgalA(p_oId)) ?? null;
  }

  /**
   * 🔍 Extraction chirurgicale : Récupère toutes les étiquettes rattachées à un acteur 👥.
   *
   * @public
   * @async
   * @param {UserId} p_oUserId - L identifiant de l acteur propriétaire
   * @returns {Promise<Tag[]>} Le tableau d étiquettes de l acteur
   */
  public async findByUserId(p_oUserId: UserId): Promise<Tag[]> {
    return this.m_aoTags.filter((l_oTag: Tag): boolean => l_oTag.getUserId().estEgalA(p_oUserId));
  }

  /**
   * 🔍 Localise une étiquette spécifique via son nom normalisé pour un acteur 🔍.
   */
  public async findByName(p_oUserId: UserId, p_sTagName: string): Promise<Tag | null> {
    const l_sRecherche: string = p_sTagName.toLowerCase().trim();
    return (
      this.m_aoTags.find((l_oTag: Tag): boolean =>
        l_oTag.getUserId().estEgalA(p_oUserId) && l_oTag.getTagName().toLowerCase().trim() === l_sRecherche
      ) ?? null
    );
  }

  /**
   * 🔍 Lecture groupée : Localise un tableau d étiquettes via un index d identifiants binaires.
   */
  public async findByIds(p_aoIds: ReadonlyArray<TagId>): Promise<Tag[]> {
    if (p_aoIds.length === 0) return [];
    // Recherche optimisée : on évite le transit par les valeurs textuelles de tirets
    return this.m_aoTags.filter((l_oTag: Tag): boolean =>
      p_aoIds.some((l_oIdCible: TagId): boolean => l_oTag.getTagId().estEgalA(l_oIdCible))
    );
  }

  /**
   * 🪓 Écriture concrète : Insère une fausse étiquette dans la collection de simulation 🪙.
   */
  public async create(p_oData: ITagData): Promise<Tag> {
    const l_oTag = new Tag({
      ...p_oData,
      createdAt : new Date(),
      updatedAt : new Date()
    });
    this.m_aoTags.push(l_oTag);
    return l_oTag;
  }

  /**
   * 🪓 Mutation en mémoire : Modifie le nom d une étiquette simulée.
   */
  public async update(p_oId: TagId, p_oData: Partial<ITagData>): Promise<Tag> {
    const l_iIdx: number = this.m_aoTags.findIndex((l_oTag: Tag): boolean => l_oTag.getTagId().estEgalA(p_oId));

    if (l_iIdx === -1) {
      throw new Error(`[Mock 🚨] Tag unique ID ${p_oId.valeur} introuvable pour la mise à jour.`);
    }

    const l_oCourant : ITagData = this.m_aoTags[l_iIdx].toData();
    const l_oMute    = new Tag({
      ...l_oCourant,
      ...p_oData,
      idTag     : p_oId,
      updatedAt : new Date()
    });

    this.m_aoTags[l_iIdx] = l_oMute;
    return l_oMute;
  }

  /**
   * 🪓 Extraction complète de la table factice sans filtrage.
   */
  public async findAll(): Promise<Tag[]> {
    return [...this.m_aoTags];
  }

  /**
   * 🪓 Retrait physique : Supprime une ressource de la collection.
   */
  public async delete(p_oId: TagId): Promise<boolean> {
    const l_iTailleInitiale: number = this.m_aoTags.length;
    this.m_aoTags = this.m_aoTags.filter((l_oTag: Tag): boolean => !l_oTag.getTagId().estEgalA(p_oId));
    return this.m_aoTags.length < l_iTailleInitiale;
  }
}
