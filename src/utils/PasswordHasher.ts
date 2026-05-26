// ——— fichier : src/utils/PasswordHasher.ts

import { hash as argonHash,
         verify as argonVerify } from '@node-rs/argon2';
import { PasswordError }         from '@/exceptions/PasswordError';
import type { IPasswordHasher }  from '@/interfaces/security/IPasswordHasher';

/**
 * 🔒 Classe PasswordHasher
 * ------------------------
 * Hashing et chiffrement de mots de passe via l'algorithme de pointe Argon2id.
 * Paramètres de coût et de parallélisme calibrés selon les recommandations de sécurité OWASP.
 *
 * SOLID :
 *  - SRP : Unique responsabilité d'encapsuler la transformation cryptographique asynchrone des secrets.
 *
 * @class PasswordHasher
 * @implements {IPasswordHasher}
 * @author Joël, Gaïa & Co
 */
export class PasswordHasher implements IPasswordHasher {

  /** 🎛️ Profil de sécurité mémoire OWASP : Coût en mémoire en Kio (~19 Mo) */
  private static readonly MEMORY_COST : number = 19_456;

  /** ⏱️ Profil de sécurité temporel OWASP : Nombre d'itérations de calcul */
  private static readonly TIME_COST : number = 2;

  /** ⚙️ Profil de parallélisation OWASP : Nombre de threads système alloués */
  private static readonly PARALLELISM : number = 1;

  /**
   * 🔐 Engendre l'empreinte cryptographique sécurisée d'un mot de passe en texte brut.
   * Intercepte les pannes de bas niveau pour les remonter sous forme de PasswordError.
   *
   * @public
   * @async
   * @function hash
   */
  public async hash(plaintext: string): Promise<string> {
    try {
      return await argonHash(plaintext, {
        memoryCost  : PasswordHasher.MEMORY_COST,
        timeCost    : PasswordHasher.TIME_COST,
        parallelism : PasswordHasher.PARALLELISM
      });
    } catch (err) {
      const msg : string = err instanceof Error ? err.message : 'unknown';
      throw PasswordError.hashFailed(msg);
    }
  }

  /**
   * 🔍 Compare un mot de passe en texte brut avec une empreinte de référence cryptographique.
   *
   * @public
   * @async
   * @function verify
   */
  public async verify(plaintext: string, hashStr: string): Promise<boolean> {
    try {
      return await argonVerify(hashStr, plaintext);
    } catch (err) {
      const msg : string = err instanceof Error ? err.message : 'unknown';
      throw PasswordError.verifyFailed(msg);
    }
  }
}
