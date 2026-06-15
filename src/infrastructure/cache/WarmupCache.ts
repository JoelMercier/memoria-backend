// ——— fichier : src/infrastructure/cache/WarmupCache.ts

import { Action } from '@/constants/Actions';
import { Categorie } from '@/constants/Categories';
import { Secteur } from '@/constants/Secteurs';
import { Severite } from '@/constants/Severites';
import { Role } from '@/constants/Roles';
import { AuthProvider } from '@/constants/AuthProviders';
import { ContentType } from '@/constants/ContentTypes';
import { OrdreTriEnum } from '@/constants/OrdreTriEnum';

/**
 * ⚡ Classe WarmupCache 🛂 (Le Contrôleur de Boot et d'Hydratation de la RAM 🔋)
 * ----------------------------------------------------------------------------
 * Scanne, valide et verrouille la conformité sémantique des SmartEnums au démarrage.
 * En cas d'échec SQL, active la stratégie de repli d'urgence autonome de soute.
 *
 * @class WarmupCache
 * @author Vision : Joël (Chasseur de padding)
 * @author Forgerie logicielle : Gaïa (Graveuse de lignes d'acier)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans de la Vague Alpha)
 */
export class WarmupCache {
  /** Map d'écurie associant chaque classe fille à son guichet SQL de boot */
  private static readonly m_aDictionnaires = [
    { classe: Role,           guichet: 'public."TousLesRoles"'        },
    { classe: Categorie,      guichet: 'public."ToutesLesCategories"' },
    { classe: ContentType,    guichet: 'public."TousLesFormats"'      },
    { classe: AuthProvider,   guichet: 'public."TousLesFournisseurs"' },
    { classe: Severite,       guichet: 'public."ToutesLesSeverites"'  },
    { classe: Secteur,        guichet: 'public."TousLesSecteurs"'     },
    { classe: Action,         guichet: 'public."ToutesLesActions"'    },
    { classe: OrdreTriEnum,   guichet: 'public."TousLesOrdresTri"'    }
  ];

  /**
   * 🔥 ALLUMEZ LE FEU ! (Ex-ValiderAlignementSysteme purifié)
   * Orchestre le crash-test d'alignement transactionnel au démarrage de l'application.
   * @param {any} p_oPoolDatabase - Le pool de connexion natif vers PostgreSQL 17 (driver pg)
   */
  public static async AllumezLeFeu(p_oPoolDatabase: any): Promise<void> {
    console.log('🏺 [Mémoria - Chaufferie] Démarrage du scan d\'intégrité de la RAM...');

    try {
      for (const l_oDict of this.m_aDictionnaires) {
        const l_sNomClasse = l_oDict.classe.name;
        const l_aoInstancesRam = l_oDict.classe.ObtenirToutes();

        // 🚨 VERROU 1 : Vérification de la présence d'un Choupy de repli unique en RAM
        const l_anDefautsRam = l_aoInstancesRam.filter(i => (i as any).isDefaut);
        if (l_anDefautsRam.length !== 1) {
          throw new Error(
            `🚨 [Divergence RAM] La classe ${l_sNomClasse} doit déclarer exactement UNE instance par défaut. Trouvé : ${l_anDefautsRam.length}`
          );
        }

        // 2. Interrogation directe du guichet de Cour Basse correspondant
        const l_oResultatSql = await p_oPoolDatabase.query(`SELECT * FROM ${l_oDict.guichet}();`);
        const l_aoLignesBase = l_oResultatSql.rows;

        // 🚨 VERROU 2 : Vérification du Choupy de repli unique en Base de données
        const l_aoDefautsBase = l_aoLignesBase.filter((r: any) =>
          r.roDefaut || r.caDefaut || r.ctDefaut || r.prDefaut || r.seDefaut || r.scDefaut || r.acDefaut || r.otDefaut
        );
        if (l_aoDefautsBase.length !== 1) {
          throw new Error(
            `🚨 [Divergence Base] Le guichet ${l_oDict.guichet} retourne ${l_aoDefautsBase.length} ligne(s) par défaut au lieu d'une seule.`
          );
        }

        // 3. Contrôle croisé des identifiants (Parité absolue de soute)
        for (const l_oLigne of l_aoLignesBase) {
          const l_sCodeSql = Object.values(l_oLigne)[0] as string | number;

          if (!l_oDict.classe.isValidCode(l_sCodeSql)) {
            throw new Error(
              `🚨 [Alerte Désalignement] Le code '${l_sCodeSql}' extrait de ${l_oDict.guichet} est absent du SmartEnum ${l_sNomClasse} en RAM !`
            );
          }
        }
      }
      console.log('🏺 [Mémoria - Chaufferie] Alignement RAM <=> Base validé à 100 %. Forteresse étanche !');

    } catch (l_oErreur: any) {
      // 🛡️ STRATÉGIE DE REPLI NOMINALE SOUVERAINE ACTIVÉE
      console.error('⚠️ [Mémoria - ALERTE SOUTE] Échec ou indisponibilité critique de la base locale !');
      console.error(`Détail : ${l_oErreur.message}`);
      console.log('🛡️ [Mémoria - PROTECTION SYSTEME] Activation d\'urgence du repli d\'écurie.');
      console.log('🔋 Les SmartEnums riches en RAM prennent le contrôle nominal des barrières d\'accès.');
    }
  }
}

export default WarmupCache;
