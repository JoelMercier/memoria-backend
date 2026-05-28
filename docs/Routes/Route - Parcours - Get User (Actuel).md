# 🪓 Parcours de Lecture : `GET /v1/auth/me` (Version Actuelle)

Ce document détaille comment l'identité de l'utilisateur connecté est extraite de la base de données PostgreSQL et purifiée pour le réseau.

### Tracks 1 : Le Douanier HTTP (`AuthController`)
1. Le contrôleur reçoit la requête. Il extrait l'ID de session via `req.user?.id`.
2. Grâce au check `instanceof UserId`, l'ID est nominalisé de manière étanche : `const cibleUserId = new UserId(sIdBrut);`.
3. Le contrôleur interroge le dépôt : `const user = await this.m_rUserRepository.findById(cibleUserId);`.

### Tracks 2 : L'Ouvrier de Persistance (`PgUserRepository`)
1. La méthode `findById(id: UserId)` reçoit le Value Object fort.
2. **Le SQL Effectivement Exécuté** :
   ```sql
   SELECT id_user, email, password_hash, pseudo, role, auth_provider, settings_user, gdpr_consent, gdpr_consent_date, created_at, updated_at
   FROM users
   WHERE id_user = $1;
   ```
   * *Paramètre injecté (`$1`)* : `id.valeur` (L'UUID pur extrait du type nominal).
3. **Résurrection Métier** : Le dépôt intercepte la ligne, convertit les colonnes SQL, et instancie l'entité vivante : `return new User(dbRow);`.

### Tracks 3 : L'Exposition Sécurisée (`ResponseUserDto`)
De retour au contrôleur, l'entité `User` immuable (cadenassée en notation hongroise) est passée à la factory : `ResponseUserDto.fromUser(user)`. Les getters métiers unifiés (`user.getEmail()`) extraient les données en purgeant définitivement le `passwordHash` avant l'envoi de la réponse `200 OK`.
