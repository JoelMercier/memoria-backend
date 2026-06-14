// ——— fichier : src/infrastructure/cache/WarmupCache.ts

import type { DatabaseConnection } from '@/config/DatabaseConnection';

import { Role }              from '@/constants/Role';
import { AppEventCategory }  from '@/constants/Categories';
import { ContentType }       from '@/constants/ContentType';
import { AuthProvider }      from '@/constants/AuthProvider';
import { AppEventSeverity }  from '@/constants/Severity';
import { AppEventSecteur }   from '@/constants/Secteur';
import { AppEventAction }    from '@/constants/Actions';

/**
 * 🗄️ Classe WarmupCache 🔥 (La Chaudière Initiale Élite & Résiliente 🤖)
 * ----------------------------------------------------------------------------
 * Orchestre le pré-chargement chirurgical et le chauffage des 7 tables de
 * référence de Mémoria en RAM dès l'allumage du serveur Express.
 * Mode "Auto-Mock" intégré : Bascule sur les reliques locales en cas de panne SQL.
 *
 * SOLID :
 *  - SRP 📐 : Découpage étanche des requêtes SQL par table de référence.
 *
 * @class WarmupCache
 * @author Vision & Conception : Joël (FIFO Architect & Nominal Casse Obsession)
 * @author Forge & Martelage du Code : Gaïa (Gardienne du silicium et du creuset)
 * @author Garde d Élite des Types : La Vague Initiale (Ouvriers de la V4 en surchauffe)
 */
export class WarmupCache {

  /**
   * 🎛️ Déclencheur Principal : Allume simultanément les 7 radiateurs de la RAM.
   *
   * @static
   * @public
   * @async
   * @param {DatabaseConnection} p_oDb - L'instance de connexion active à PostgreSQL
   * @returns {Promise<void>}
   */
  public static async allumez(p_oDb: DatabaseConnection): Promise<void> {
    await WarmupCache.chaufferRoles(p_oDb);
    await WarmupCache.chaufferCategories(p_oDb);
    await WarmupCache.chaufferFormats(p_oDb);
    await WarmupCache.chaufferFournisseurs(p_oDb);
    await WarmupCache.chaufferSeverites(p_oDb);
    await WarmupCache.chaufferContextes(p_oDb);
    await WarmupCache.chaufferActions(p_oDb);
  }

  /**
   * ⚙️ Injecteur Générique Universel : Instancie dynamiquement les lignes SQL manquantes en RAM.
   * Consomme les lignes pour le linter et alimente le registre caché de la maman SmartEnum.
   *
   * @private
   * @static
   * @param {any} p_oClasseFille - La classe du SmartEnum cible à instancier
   * @param {any[]} p_aLignes - Le tableau de lignes brutes renvoyé par PostgreSQL
   * @param {string} p_sColId - Le nom de la colonne contenant le code de clé primaire
   * @param {string} p_sColName - Le nom de la colonne contenant le libellé descriptif
   * @param {string} p_sColOrdre - Le nom de la colonne contenant l'ordre d'affichage
   * @param {string} [p_sColNiveau] - Le nom optionnel de la colonne de niveau (spécifique aux rôles)
   * @returns {void}
   */
  private static injecterDynamique(
    p_oClasseFille: any,
    p_aLignes: any[],
    p_sColId: string,
    p_sColName: string,
    p_sColOrdre: string,
    p_sColNiveau?: string
  ): void {
    p_aLignes.forEach((l_oLigne: any) => {
      const l_sCode = l_oLigne[p_sColId].toString().trim().toUpperCase();

      // On interroge la douane de la maman pour savoir si l'instance existe déjà en RAM
      if (!p_oClasseFille.isValidCode(l_sCode)) {
        const l_sName  = l_oLigne[p_sColName];
        const l_nOrdre = Number(l_oLigne[p_sColOrdre]);

        if (p_sColNiveau && l_oLigne[p_sColNiveau] !== undefined) {
          const l_nNiveau = Number(l_oLigne[p_sColNiveau]);
          // Cas spécifique de la classe Role (Libellé, Code, Niveau, OrdreAff)
          new (p_oClasseFille as any)(l_sName, l_sCode, l_nNiveau, l_nOrdre);
        } else {
          // Cas standard de Mémoria à 3 paramètres (Libellé, Code, OrdreAff)
          new (p_oClasseFille as any)(l_sName, l_sCode, l_nOrdre);
        }
      }
    });
  }

  /**
   * 🪓 Radiateur 1 : Extrait la table "Roles" via "TousLesRoles"
   */
  private static async chaufferRoles(p_oDb: DatabaseConnection): Promise<void> {
    try {
      const l_oPool = p_oDb.getPool();
      const l_sRequete = 'Select * From "TousLesRoles"();';
      const l_rResultat = await l_oPool.query(l_sRequete);

      if (l_rResultat.rows.length === 0) throw new Error('Dictionnaire vide');
      WarmupCache.injecterDynamique(Role, l_rResultat.rows, 'idRole', 'roName', 'roOrdreAff', 'roNiveau');

    } catch (l_oPanne) {
      console.warn(`[Warmup Cache ⚠️] Le guichet "TousLesRoles" est inaccessible. Repli défensif sur la RAM.`);
    }
  }

  /**
   * 🪓 Radiateur 2 : Extrait la table "EventCategories" via "ToutesLesCategories"
   */
  private static async chaufferCategories(p_oDb: DatabaseConnection): Promise<void> {
    try {
      const l_oPool = p_oDb.getPool();
      const l_sRequete = 'Select * From "ToutesLesCategories"();';
      const l_rResultat = await l_oPool.query(l_sRequete);

      if (l_rResultat.rows.length === 0) throw new Error('Dictionnaire vide');
      WarmupCache.injecterDynamique(AppEventCategory, l_rResultat.rows, 'idCategory', 'ecName', 'ecOrdreAff');

    } catch (l_oPanne) {
      console.warn(`[Warmup Cache ⚠️] Le guichet "ToutesLesCategories" est inaccessible. Repli défensif sur la RAM.`);
    }
  }

  /**
   * 🪓 Radiateur 3 : Extrait la table "ContentTypes" via "TousLesFormats"
   */
  private static async chaufferFormats(p_oDb: DatabaseConnection): Promise<void> {
    try {
      const l_oPool = p_oDb.getPool();
      const l_sRequete = 'Select * From "TousLesFormats"();';
      const l_rResultat = await l_oPool.query(l_sRequete);

      if (l_rResultat.rows.length === 0) throw new Error('Dictionnaire vide');
      WarmupCache.injecterDynamique(ContentType, l_rResultat.rows, 'idContentType', 'ctName', 'ctOrdreAff');

    } catch (l_oPanne) {
      console.warn(`[Warmup Cache ⚠️] Le guichet "TousLesFormats" est inaccessible. Repli défensif sur la RAM.`);
    }
  }

  /**
   * 🪓 Radiateur 4 : Extrait la table "Providers" via "TousLesFournisseurs"
   */
  private static async chaufferFournisseurs(p_oDb: DatabaseConnection): Promise<void> {
    try {
      const l_oPool = p_oDb.getPool();
      const l_sRequete = 'Select * From "TousLesFournisseurs"();';
      const l_rResultat = await l_oPool.query(l_sRequete);

      if (l_rResultat.rows.length === 0) throw new Error('Dictionnaire vide');
      WarmupCache.injecterDynamique(AuthProvider, l_rResultat.rows, 'idProvider', 'apName', 'apOrdreAff');

    } catch (l_oPanne) {
      console.warn(`[Warmup Cache ⚠️] Le guichet "TousLesFournisseurs" est inaccessible. Repli défensif sur la RAM.`);
    }
  }

  /**
   * 🪓 Radiateur 5 : Extrait la table "Severites" via "ToutesLesSeverites"
   */
  private static async chaufferSeverites(p_oDb: DatabaseConnection): Promise<void> {
    try {
      const l_oPool = p_oDb.getPool();
      const l_sRequete = 'Select * From "ToutesLesSeverites"();';
      const l_rResultat = await l_oPool.query(l_sRequete);

      if (l_rResultat.rows.length === 0) throw new Error('Dictionnaire vide');
      WarmupCache.injecterDynamique(AppEventSeverity, l_rResultat.rows, 'idSeverity', 'aeName', 'aeOrdreAff');

    } catch (l_oPanne) {
      console.warn(`[Warmup Cache ⚠️] Le guichet "ToutesLesSeverites" est inaccessible. Repli défensif sur la RAM.`);
    }
  }

  /**
   * 🪓 Radiateur 6 : Extrait la table "EventContexts" via "TousLesContextes"
   */
  private static async chaufferContextes(p_oDb: DatabaseConnection): Promise<void> {
    try {
      const l_oPool = p_oDb.getPool();
      const l_sRequete = 'Select * From "TousLesContextes"();';
      const l_rResultat = await l_oPool.query(l_sRequete);

      if (l_rResultat.rows.length === 0) throw new Error('Dictionnaire vide');
      WarmupCache.injecterDynamique(AppEventSecteur, l_rResultat.rows, 'ecIdContext', 'ecName', 'ecOrdreAff');

    } catch (l_oPanne) {
      console.warn(`[Warmup Cache ⚠️] Le guichet "TousLesContextes" est inaccessible. Repli défensif sur la RAM.`);
    }
  }

  /**
   * 🪓 Radiateur 7 : Extrait la table "EventActions" via "ToutesLesActions"
   */
  private static async chaufferActions(p_oDb: DatabaseConnection): Promise<void> {
    try {
      const l_oPool = p_oDb.getPool();
      const l_sRequete = 'Select * From "ToutesLesActions"();';
      const l_rResultat = await l_oPool.query(l_sRequete);

      if (l_rResultat.rows.length === 0) throw new Error('Dictionnaire vide');
      WarmupCache.injecterDynamique(AppEventAction, l_rResultat.rows, 'eaIdAction', 'eaName', 'eaOrdreAff');

    } catch (l_oPanne) {
      console.warn(`[Warmup Cache ⚠️] Le guichet "ToutesLesActions" est inaccessible. Repli défensif sur la RAM.`);
    }
  }
}
