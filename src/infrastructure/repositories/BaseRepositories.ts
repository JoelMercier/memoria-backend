// ——— fichier : src/infrastructure/repositories/BaseRepository.ts

import { Pool, PoolClient } from 'pg';
import { IdBinaire } from '@/domain/base/IdBinaire';
import { IDatabaseConnection } from '@/interfaces/database/IDatabaseConnection';


/**
 * 🧱 Classe Abstraite BaseRepository 🗄️ (La Dalle de Fondation des Souterrains 🔌)
 * ----------------------------------------------------------------------------
 * Centralise les outils de transaction, la pagination et le remapping binaire.
 *
 * @class BaseRepository
 * @abstract
 * @author Vision : Joël ((très)Abstract Class)
 * @author Frapperie du code : Gaïa (Gardienne du creuset)
 * @author Héritage Git->Origin : La Vague Initiale (Ouvriers de la première heure)
 */
export abstract class BaseRepository {
  /** 🔌 Le pool de connexions persistant de l'infrastructure PostgreSQL 💽 */
  private readonly m_rPool: Pool;

  /** 🎛️ Connexion physique universelle encapsulée [Mémoria] */
  private readonly m_oDb: IDatabaseConnection;

  /**
   * @constructor
   * @param {IDatabaseConnection} p_oDb - Le gestionnaire de connexion universel.
   */
  protected constructor(p_oDb: IDatabaseConnection) {
    this.m_oDb = p_oDb;
    this.m_rPool = p_oDb.getPool();
  }

  /**
   * ⚖️ Accesseur Public (Getter) : Permet aux classes filles de récupérer proprement
   * la connexion sans manipuler directement le membre privé.
   *
   * @public
   * @returns {IDatabaseConnection} L'instance vivante du gestionnaire de connexion.
   */
  public get db(): IDatabaseConnection {
    return this.m_oDb;
  }

  protected toBuffer(p_Id: IdBinaire | undefined | null): Buffer | null {
    if (!p_Id) return null;
    return p_Id.binaire;
  }

  protected toDomainId<T extends IdBinaire>(p_vRawId: unknown, p_oIdClass: new (val: string | Buffer) => T): T {
    try {
      return new p_oIdClass(p_vRawId as string | Buffer);
    } catch (l_oErr) {
      throw new Error(`[Infrastructure 🚨] Impossible de mapper la clé brute vers le Domaine.`);
    }
  }

  /**
   * 🛂 Cordon sanitaire de contrôle de la masse pour la pagination [Mémoria].
   */
  protected calculerPaginationContractuelle(p_nNbLignesMax: number, p_nIndexDepart: number): { limit: number; offset: number } {
    const l_nLimit = p_nNbLignesMax <= 0 || p_nNbLignesMax > 100 ? 50 : Math.floor(p_nNbLignesMax);
    const l_nOffset = p_nIndexDepart < 0 ? 0 : Math.floor(p_nIndexDepart);
    return { limit: l_nLimit, offset: l_nOffset };
  }

  /**
   * 🛠️ Exécuteur chirurgical de requêtes isolées [Mémoria].
   */
  protected async executer<T>(p_sRequeteSql: string, p_aParametres: any[] = []): Promise<T[]> {
    let l_oClient: PoolClient | null = null;

    try {
      l_oClient = await this.m_rPool.connect();

      const l_aArgumentsNettoyes = p_aParametres.map(l_vParam =>
        l_vParam instanceof IdBinaire ? l_vParam.binaire : l_vParam
      );

      const l_rResultatBrut = await l_oClient.query(p_sRequeteSql, l_aArgumentsNettoyes);
      return l_rResultatBrut.rows as T[];

    } catch (l_oErrSysteme) {

      throw new Error(`[Infrastructure 🚨] Échec SQL : ${(l_oErrSysteme as Error).message}`);

    } finally {

      if (l_oClient) {
        l_oClient.release();
      }
      
    }
  }
}
