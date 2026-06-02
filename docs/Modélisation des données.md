# 🐘 Spécification Relationnelle des Données (MCD, MLD, MPD) — Mémoria
> **Auteur :** @author Joël, Gaïa & Co
> **Infrastructure :** PostgreSQL 17+ & Intégrité Référentielle par Cascade

Ce document dresse la cartographie conceptuelle, logique et physique du coffre-fort numérique de Mémoria, purifié pour s'aligner sur l'armure nominale du Domaine.

---

## 📐 1. Modèle Conceptuel de Données (MCD)
*Niveau Métier : Définition des entités logiques et de leurs associations sémantiques (Règles de gestion).*

*   **Règle 1 :** Un `Utilisateur` peut posséder de 0 à N `Pépites` (Items). Une pépite appartient à un et un seul utilisateur.
*   **Règle 2 :** Une `Pépite` peut être associée à de 0 à N `Étiquettes` (Tags). Une étiquette peut qualifier de 0 à N pépites (Relation Many-to-Many).
*   **Règle 3 :** Une `Pépite` peut générer de 0 à N liens de `Partage` (Shares) pour les invités externes.
*   **Règle 4 :** Un `Utilisateur` peut posséder de 0 à N `Événements` d'audit (Logs system).

---

## 🏛️ 2. Modèle Logique de Données (MLD)
*Niveau Structurel : Traduction des associations en clés primaires (PK) et clés étrangères (FK).*

```text
USERS ( id_user [PK], email, pseudo, password_hash, role, auth_provider, created_at )
TAGS ( id_tag [PK], #id_user [FK], tag_name )
ITEMS ( id_item [PK], #id_user [FK], content_type, title, slug, content, source_author, thumbnail_url, created_at )
SHARE ( id_share [PK], #id_item [FK], recipient_email, share_token, access_config, created_at )
APP_EVENTS ( id_app_event [PK], #id_user [FK], event_category, event_type, severity, message, metadata, created_at )

-- Table pivot associative issue de la relation Many-to-Many
ITEM_TAGS ( #id_item [FK], #id_tag [FK] ) [PK Composite]
```

---

## 🗄️ 3. Modèle Physique de Données (MPD)
*Niveau Machine : Les scripts de création DDL SQL exacts exécutés dans PostgreSQL, armés des index de performance et du nettoyage automatique par cascade.*

```sql
-- 👥 1. Table des Acteurs Applicatifs
CREATE TABLE users (
    id_user UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    pseudo VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    auth_provider VARCHAR(30) NOT NULL,
    settings_user JSONB DEFAULT '{}'::jsonb,
    gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
    gdpr_consent_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 🏷️ 2. Table des Étiquettes (Dictionnaires personnalisés par acteur)
CREATE TABLE tags (
    id_tag UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_tags_user FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    CONSTRAINT uq_user_tag UNIQUE (id_user, tag_name) -- Anti-doublon insensible à la casse au niveau applicatif
);

-- 📦 3. Table des Pépites (Ressources atomiques racines)
CREATE TABLE items (
    id_item UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT,
    source_author VARCHAR(255),
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_items_user FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    CONSTRAINT uq_user_slug UNIQUE (id_user, slug) -- Isolation des permaliens par espace utilisateur
);

-- 🔗 4. Table Pivot des Liaisons Relationnelles (Many-to-Many)
CREATE TABLE item_tags (
    id_item UUID NOT NULL,
    id_tag UUID NOT NULL,
    PRIMARY KEY (id_item, id_tag), -- Clé composite unifiée
    CONSTRAINT fk_pivot_item FOREIGN KEY (id_item) REFERENCES items(id_item) ON DELETE CASCADE,
    CONSTRAINT fk_pivot_tag FOREIGN KEY (id_tag) REFERENCES tags(id_tag) ON DELETE CASCADE
);

-- 🔏 5. Table des Partages Sécurisés (Passerelles URL-Safe)
CREATE TABLE shares (
    id_share UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_item UUID NOT NULL,
    recipient_email VARCHAR(255),
    share_token VARCHAR(255) UNIQUE NOT NULL,
    access_config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_shares_item FOREIGN KEY (id_item) REFERENCES items(id_item) ON DELETE CASCADE
);

-- 🚨 6. Table du Journal d'Audit Append-Only (Logs Système)
CREATE TABLE app_events (
    id_app_event UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID, -- Optionnel (NULL si action anonyme comme un échec de login)
    event_category VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_user FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL -- Conserve le log si le compte est détruit
);

-- ⚡ INDEXATION STRATÉGIQUE POUR LES PERFORMANCES D'INFRASTRUCTURE
CREATE INDEX idx_items_user_slug ON items(id_user, slug);
CREATE INDEX idx_shares_token ON shares(share_token);
CREATE INDEX idx_app_events_category_severity ON app_events(event_category, severity);
```

---

## 🏛️ 4. Les 3 Règles de Sécurité Physique de la Base de Données

### A. L'Intégrité Référentielle par Cascade (`ON DELETE CASCADE`)
Pour éviter l'accumulation de données orphelines, la base implémente la destruction par cascade. Si un utilisateur supprime son compte, PostgreSQL prend la responsabilité physique de nettoyer instantanément et atomiquement toutes ses pépites (`items`), ses partages (`shares`), ses tags (`tags`) et ses liaisons pivots (`item_tags`) sans surcharger le serveur Node.js.

### B. La Préservation de la Traçabilité (`ON DELETE SET NULL`)
Contrairement aux ressources métier, les logs système de la table `app_events` ne doivent pas disparaître si un utilisateur s'en va. La contrainte est donc configurée en `ON DELETE SET NULL`. L'identifiant de l'utilisateur passe à `NULL`, mais l'historique de l'événement (ex: détection d'une anomalie passée) reste gravé pour l'audit de sécurité des administrateurs.

### C. La Puissance du type `JSONB`
Les colonnes `metadata`, `access_config` et `settings_user` exploitent le type binaire **`JSONB`** de PostgreSQL. Contrairement au type `JSON` textuel classique, le `JSONB` décompose le document à l'écriture, ce qui permet de l'indexer et de l'interroger à une vitesse fulgurante directement en SQL via les opérateurs fléchés (`->>`), alliant la flexibilité du NoSQL à la rigueur du relationnel.
