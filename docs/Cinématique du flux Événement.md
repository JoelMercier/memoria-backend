# 🛤️ Rétro-Ingénierie — Cinématique du Flux Événement (AppEvent)
> **Auteur :** @author Joël, Gaïa & Co
> **Composant :** Journalisation d'audit, Sécurité transverse et Statistiques Administrateur

Ce manifeste détaille le cycle de vie technique et l'émission automatique des traces de sécurité à travers l'Hexagone, ainsi que l'exploitation de ces logs par le volet d'administration.

---

## 🗺️ 1. Diagramme Linéaire du Flux d'Audit Automatique (Exemple: Connexion Réussie)

Le module de traçabilité s'enclenche de manière transparente en arrière-plan des cas d'usages :

```text
[ Processus d'Authentification (AuthService.login) ] ➔ L'acteur valide ses secrets
      │
      ▼ 🔐 Succès de l'opération ➔ Déclenche l'appel asynchrone transverse
[ AppEventService.authSuccess(userId) ] ➔ Capture le caillou de couleur UserId
      │
      ▼ 🪓 ASSEMBLAGE DE L'ATOME UNIFIÉ
[ AppEventService.log ] ➔ Moule le log en associant les Smart Enums du Domaine :
      │   ├── Type     : AppEventType.AUTH_LOGIN_SUCCESS (Connexion validée)
      │   ├── Catégorie: AppEventCategory.aecAudit (Sécurité & Traçabilité)
      │   └── Gravité  : AppEventSeverity.fromSql('info') (Indicateur standard)
      │
      ▼ 🗄️ PERSISTANCE INVISIBLE (IAppEventRepository ➔ PgAppEventRepository)
[ PgAppEventRepository.create ] ➔ Prépare le sac de données passif IAppEventData
      │
      ▼ 🐘 Écriture Append-Only (DatabaseConnection via pg)
[ Base de Données PostgreSQL ] ➔ Insère la ligne immuable dans la table "app_events"
```

---

## 🧱 2. Le Rôle des Périphériques et des Smart Enums sur le Flux `AppEvent`

### 🗂️ Les Gardiens Sémantiques (Smart Enums)
L'ancien système stockait de bêtes chaînes de caractères volantes en base de données, vulnérables aux fautes de frappe [Mémoria]. Désormais, le flux est verrouillé par les classes vivantes du Domaine :
*   **`AppEventType`** : Cartographie de manière exhaustive toutes les actions critiques de l'application (création d'item, échec de login, révocation de token).
*   **`AppEventCategory`** : Sépare les flux d'infrastructure pure (Erreurs système) des flux d'audit légaux ou d'analytique business.
*   **`AppEventSeverity`** : Gère la criticité de la trace (`info`, `warning`, `error`, `critical`).

### 🏭 La Capture Chirurgicale des Pannes (`AppEventErrorFactory`)
Pour l'exploitation humaine de ces événements par les administrateurs (`AppEventAdminService`), plus aucune exception brute JavaScript (`new Error()`) ne circule [Mémoria]. Si un log demandé par son identifiant **`EventId`** est introuvable sur le disque, le service lève immédiatement l'anomalie normalisée **`AppEventErrorFactory.notFound(eventId)`** [Mémoria], garantissant un code d'erreur prévisible et une étanchéité totale aux frontières.

### 🧹 Le Purgeur de Conformité RGPD (`cleanupOldEvents`)
Pour respecter la législation sur la durée de conservation limitée des données d'audit, le service intègre une routine de nettoyage automatique. Elle calcule l'horodatage limite de rétention (`cutoffDate`) et ordonne au dépôt PostgreSQL de balayer en une seule transaction de masse tous les enregistrements obsolètes.

---

## 🏛️ 3. Vérité d'Atelier : Qui appelle Qui ?

Pour clouer définitivement le bec aux débats de la salle de cours sur le module `AppEvent` :

*   **Le Mode Automatique (Transverse)** : Les services de domaine (`AuthService`, `ItemService`) appellent directement le service statique autonome **`AppEventService.log()`** [Mémoria].
*   **Le Mode Administration (Exploitation)** : Le contrôleur d'administration (`AppEventAdminController`) intercepte la requête web, interroge **`AppEventAdminService`**, qui orchestre les requêtes de statistiques et de pagination à travers l'entrepôt **`PgAppEventRepository`**.
*   **La Règle d'Or de l'Audit** : Le dépôt est configuré en mode **Append-Only** pour la production. On peut créer et lire les logs, mais aucune méthode de modification (`update`) n'est exposée aux utilisateurs standards, protégeant le journal contre les altérations.
