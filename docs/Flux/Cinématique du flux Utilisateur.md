# 🛤️ Rétro-Ingénierie — Cinématique du Flux Utilisateur (User)
> **Auteur :** @author Joël, Gaïa & Co
> **Composant :** Gestion des comptes, Sécurité des secrets et Identité Domaine

Ce manifeste détaille le cycle de vie technique et le parcours d'une donnée Utilisateur à travers l'Hexagone, en prenant l'exemple précis de l'inscription (`register`).

---

## 🗺️ 1. Diagramme Linéaire du Flux d'Inscription

Chaque action sur l'identité de l'acteur traverse le pipeline de manière étanche :

```text
[ POST /v1/auth/register ] ➔ JSON brut envoyé par le client Web
      │
      ▼ (Vérification des en-têtes réseau par src/app.ts)
[ Douane Zod : UserValidation.validateCreate ]
      │   └── Si format ou email invalide ➔ 🚨 Rejet immédiat par le HandlerService
      │
      ▼ (Payload 100% validé et propre)
[ Classe CreateUserDto ] ➔ Le sac de transport étanche isole la requête HTTP
      │
      ▼ (Aiguillage de la frontière)
[ AuthController.register ] ➔ Extrait le RequestId et passe le DTO au Domaine
      │
      ▼ 🧠 SOUVERAINETÉ DU DOMAINE (src/services/AuthService.ts)
[ AuthService.register ] ➔ Déclenche le Fail-Fast unitaire et la sécurité :
      │   ├── 1. Interroge le dépôt pour vérifier l'unicité de l'email et du pseudo
      │   │      └── Si doublon ➔ 🚨 throw UserErrorFactory.emailExists()
      │   ├── 2. Délègue le chiffrement asynchrone : passwordHasher.hash() (Argon2id)
      │   └── 3. Assemble le sac de données passif d'infrastructure (IUserData)
      │
      ▼ 🗄️ INVERSION DE DÉPENDANCE (IUserRepository ➔ PgUserRepository)
[ PgUserRepository.create ] ➔ Forge et injecte la clé primaire nominale UserId
      │
      ▼ 🐘 Insertion SQL transactionnelle (DatabaseConnection via pg)
[ Base de Données PostgreSQL ] ➔ Écrit la ligne physique dans la table "users"
```

---

## 🧱 2. Le Rôle des Périphériques sur le Flux `User`

### 🛡️ Le Poste de Douane (Zod)
Le schéma `UserValidation` intercepte les chaînes brutes du formulaire. C'est lui qui applique les regex de conformité sur l'adresse email et valide la longueur minimale du mot de passe. Si le client tente d'injecter une propriété inconnue, elle est instantanément nettoyée. Le contrôleur reçoit un objet purifié.

### 🔐 L'Armure Cryptographique (`PasswordHasher`)
La logique métier ne manipule jamais de mot de passe en texte brut. L'abstraction `IPasswordHasher` isole le Domaine. Son implémentation concrète `PasswordHasher.ts` ingère le secret, applique les coûts de mémoire et de threads recommandés par l'OWASP via l'algorithme **Argon2id**, et recrache une empreinte immuable qui sera stockée en base.

### 👥 La Barrière d'Identité du Domaine (`UserId`)
À l'instant où l'infrastructure PostgreSQL confirme l'insertion, la clé primaire textuelle brute générée par la base (`gen_random_uuid()`) est immédiatement emprisonnée dans son objet de valeur nominal fort : **`new UserId(id)`**. Plus jamais cette clé ne transitera sous forme de simple `string` dans le Domaine, interdisant toute faille d'inversion ou d'usurpation latérale.

---

## 🏛️ 3. Vérité d'Atelier : Qui appelle Qui ?

Pour clouer le bec aux débats de la salle de cours sur le module `User` :

*   **L'Infrastructure Web** (`routes/v1`) appelle ➔ **`AuthController`**
*   **`AuthController`** instancie le DTO et appelle ➔ **`IAuthService`** (exécuté par `AuthService`)
*   **`AuthService`** orchestre la sécurité et appelle ➔ **`IUserRepository`** (exécuté par `PgUserRepository`)
*   **`PgUserRepository`** se connecte au pool et appelle ➔ **`DatabaseConnection`** (PostgreSQL)

L'Hexagone est respecté, les dépendances pointent toutes vers le centre, le linter sourit et le compilateur reste blanc.
