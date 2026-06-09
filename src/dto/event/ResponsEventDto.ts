// ——— fichier : src/dto/event/ResponseEventDto.ts

/**
 * 📦 Type décrivant une ligne brute enrichie issue de notre fonction stockée SQL.
 * Capture les identifiants d'entités transmutés en ByteA ainsi que les désignations textuelles de soute.
 */
export interface IAppEventEnrichedRow {
  aeIdEvent: Buffer | string;
  aeUserId: Buffer | string | null;
  aeCreatedAt: Date;
  aeMessage: string;
  aeMetadata: Record<string, unknown>;
  aeSecteurId: string;
  aeActionId: string;
  aeCategoryId: string;
  aeSeverityId: string;
  secteurLibelle: string;
  actionLibelle: string;
  categoryLibelle: string;
  severityLibelle: string;
}

/**
 * 📦 Structure JSON finale expédiée à travers le réseau vers le Front-End.
 */
export interface IAppEventResponseJson {
  id: string;
  userId: string | null;
  createdAt: string;
  message: string;
  metadata: Record<string, unknown>;
  secteur: { id: string; libelle: string };
  action: { id: string; libelle: string };
  category: { id: string; libelle: string };
  severity: { id: string; libelle: string };
}

/**
 * 📦 Classe ResponseEventDto 🛡️
 * ----------------------------------------------------------------------------
 * Convertisseur et sérialiseur officiel pour l'exportation des logs d'audit.
 * Hydrate les structures d'IHM en combinant les types forts et les libellés SQL.
 *
 * @class ResponseEventDto
 * @author Directrice du Silicium : Joël (C++ Framework Architect - Zéro Bâclage)
 * @author Métallurgie des Octets : Gaïa (Au burin, redressée sur le standard V4)
 */
export class ResponseEventDto {

  /**
   * 🏭 Transforme une ligne brute enrichie de la base de données en JSON d'IHM purifié.
   *
   * @static
   * @public
   * @param {IAppEventEnrichedRow} p_oRow - La ligne brute enrichie extraite par la fonction stockée
   * @returns {IAppEventResponseJson} Le payload JSON normalisé pour le réseau
   */
  public static extraireLigne(p_oRow: IAppEventEnrichedRow): IAppEventResponseJson {
    // 🗲 [RÉALIGNÉ V4] Conservation impérative de la lecture du format ByteA issu du convertisseur SQL
    const l_sIdEvent = Buffer.isBuffer(p_oRow.aeIdEvent) ? p_oRow.aeIdEvent.toString('hex') : p_oRow.aeIdEvent;
    const l_sUserId  = Buffer.isBuffer(p_oRow.aeUserId) ? p_oRow.aeUserId.toString('hex') : p_oRow.aeUserId;

    const l_oResultat: IAppEventResponseJson = {
      id: l_sIdEvent,
      userId: l_sUserId || null,
      createdAt: p_oRow.aeCreatedAt.toISOString(),
      message: p_oRow.aeMessage,
      metadata: p_oRow.aeMetadata,
      secteur: {
        id: p_oRow.aeSecteurId.trim(),
        libelle: p_oRow.secteurLibelle ? p_oRow.secteurLibelle.trim() : 'Inconnu'
      },
      action: {
        id: p_oRow.aeActionId.trim(),
        libelle: p_oRow.actionLibelle ? p_oRow.actionLibelle.trim() : 'Inconnu'
      },
      category: {
        id: p_oRow.aeCategoryId.trim(),
        libelle: p_oRow.categoryLibelle ? p_oRow.categoryLibelle.trim() : 'Inconnu'
      },
      severity: {
        id: p_oRow.aeSeverityId.trim(),
        libelle: p_oRow.severityLibelle ? p_oRow.severityLibelle.trim() : 'Inconnu'
      }
    };

    return Object.freeze(l_oResultat);
  }

  /**
   * 🏭 Formate le pack de résultats paginés complet pour le guichet de sortie Express.
   *
   * @static
   * @public
   * @param {IAppEventEnrichedRow[]} p_aRows - La collection de lignes enrichies de la page active
   * @param {number} p_nTotal - Le volume global absolu capté par le totalCount SQL
   * @param {number} p_nNbLignes - Le nombre maximum de lignes exigé par le client (limit)
   * @param {number} p_nLigneDebut - L'index de départ du curseur (offset)
   */
  public static formaterPackagePagine(
    p_aRows: IAppEventEnrichedRow[],
    p_nTotal: number,
    p_nNbLignes: number,
    p_nLigneDebut: number
  ) {
    const l_oPackage = {
      NbLignes: p_nNbLignes,
      LigneDebut: p_nLigneDebut,
      total: p_nTotal,
      count: p_aRows.length,
      items: p_aRows.map((l_oRow) => ResponseEventDto.extraireLigne(l_oRow))
    };

    return Object.freeze(l_oPackage);
  }
}
