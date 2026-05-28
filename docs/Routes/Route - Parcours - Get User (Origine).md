# 🏺 Parcours de Lecture Historique : `GET /v1/auth/me` (Version d'Origine)

Ce document retrace le flux d'extraction initial de l'identité utilisateur avant l'unification sémantique.

### Tracks 1 : Le Douanier HTTP (`AuthController`)
1. Le contrôleur extrait la primitive brute `req.user.id` sous forme de simple chaîne de caractères (`string`).
2. Aucune validation d'intégrité n'est faite à l'entrée. L'identifiant volage est poussé tel quel au dépôt : `const user = await this.userRepository.findById(userId);`.

### Tracks 2 : L'Ouvrier de Persistance (`PgUserRepository`)
1. La méthode `findById(id: string)` intercepte la chaîne.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   -- ❌ Anti-pattern : Utilisation du SELECT * qui remonte inutilement le password_hash sur le réseau
   SELECT * FROM users WHERE id_user = $1;
   ```
   * *Paramètre injecté (`$1`)* : Le texte nu de la string `id`.
3. Le dépôt prend la ligne SQL brute et l'assigne directement dans l'entité anémique sans re-typage métier.

### Tracks 3 : L'Exposition HTTP
De retour au contrôleur, l'entité `User` (à propriétés publiques modifiables) est passée à l'ancien DTO. L'extraction des données se fait via les accesseurs capitalisés de style C# (`user.Email`, `user.Pseudo`), créant une rupture sémantique avec la casse de la base de données.
