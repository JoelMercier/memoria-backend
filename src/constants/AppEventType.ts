// ——— fichier : src/constants/AppEventType.ts

import { SmartEnum } from './base/SmartEnum';
import { AppEventCategory } from './AppEventCategory';

/**
 * 🏛️ Classe AppEventType 🗄️ (Le Verrouilleur d Actions Systèmes 🤖)
 * ----------------------------------------------------------------------------
 * Valide et sécurise les chaînes de caractères autorisées pour les types d événements.
 * Rattachée fonctionnellement aux catégories parentes pour le monitoring.
 *
 * @class AppEventType
 * @extends {SmartEnum<string>}
 * @author Vision : Joël (<Struct> périmée)
 * @author Frapperie du code : Gaïa (Gardienne du feu binaire)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers de la première heure)
 */
export class AppEventType extends SmartEnum<string> {
  /** 🗂️ Catégorie sémantique parente associée à ce type d événement d audit */
  private readonly m_oCategorie: AppEventCategory;

  /**
   * Moule une instance immuable de type d action en RAM 🧠.
   *
   * @private
   * @constructor
   * @param {string} p_sLibelle - Affichage textuel explicite pour l écran de supervision
   * @param {string} p_sCodeSql - La chaîne exacte attendue et stockée en BDD
   * @param {AppEventCategory} p_oCategorie - Le domaine d audit parent associé
   * @param {number} p_nOrdreAff - La position de tri pour les listes administratives
   */
  private constructor(p_sLibelle: string, p_sCodeSql: string, p_oCategorie: AppEventCategory, p_nOrdreAff: number) {
    super(p_sLibelle, p_sCodeSql, p_nOrdreAff);
    this.m_oCategorie = p_oCategorie;
  }

  /**
   * 🗂️ Obtient la catégorie parente de l événement d audit.
   */
  public get categorie(): AppEventCategory {
    return this.m_oCategorie;
  }

  /** 🗄️ Convertisseur d'infrastructure historique branché sur le décodeur central [Mémoria] */
  public static fromSql(p_sCodeSql: string): AppEventType {
    // La maman va scanner le placard de la RAM pour retrouver l'instance vivante de l'action !
    return this.DeCode<AppEventType>(p_sCodeSql);
  }

  // ----------------------------------------------------------------------------
  // 🏺 ENSEMENCEMENT DE LA RAM (Les actions officielles de production - Raccord V4)
  // ----------------------------------------------------------------------------

  // 🔐 Module AUTHENTIFICATION & COMPTES (Catégorie : AUDI / ANAL)
  public static readonly UTILISATEUR_CONNEXION = new AppEventType('Connexion réussie', 'utilisateur.connexion', AppEventCategory.AUDI, 10);
  public static readonly AUTHENTIFICATION_ECHEC = new AppEventType('Échec d authentification', 'authentification.echec', AppEventCategory.AUDI, 20);
  public static readonly UTILISATEUR_ENREGISTREMENT = new AppEventType('Nouvelle inscription', 'utilisateur.enregistrement', AppEventCategory.ANAL, 30);

  // 📦 Module PEPITES / ITEMS & PARTAGES (Catégorie : ANAL)
  public static readonly PEPITE_CREATION = new AppEventType('Création de pépite', 'pepite.creation', AppEventCategory.ANAL, 40);
  // Correction de ma bêtise : Ajout de la clé de partage manquante au catalogue !
  public static readonly PEPITE_PARTAGE = new AppEventType('Partage de pépite', 'pepite.partage', AppEventCategory.ANAL, 45);

  // 🚨 Module MONITORING & RGPD (Catégorie : MONI / GDPR)
  public static readonly RGPD_EXPORTATION = new AppEventType('Exportation de données', 'rgpd.exportation', AppEventCategory.GDPR, 50);
  public static readonly BD_REQUETE_LENTE = new AppEventType('Requête SQL lente', 'bd.requete_lente', AppEventCategory.MONI, 60);
}
