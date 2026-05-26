// ——— fichier : src/interfaces/security/IPasswordHasher.ts

/**
 * 🔒 Interface IPasswordHasher
 * ----------------------------
 * Contrat d'infrastructure régissant le chiffrement et la vérification des secrets.
 * Isole le cœur métier des algorithmes de hachage physiques (Argon2, bcrypt, etc.).
 *
 * SOLID :
 *  - DIP (Dependency Inversion Principle) : Le Domaine dépend de cette abstraction, pas d'une lib tierce.
 *
 * @interface IPasswordHasher
 * @author Joël, Gaïa & Co
 */
export interface IPasswordHasher {

  /** 🔐 Engendre l'empreinte cryptographique sécurisée d'un mot de passe en texte brut. */
  hash(plaintext: string): Promise<string>;

  /** 🔍 Compare un mot de passe en texte brut avec une empreinte de référence stockée en base. */
  verify(plaintext: string, hashStr: string): Promise<boolean>;
}
