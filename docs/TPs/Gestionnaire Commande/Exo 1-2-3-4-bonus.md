# 🏛️ RAPPORT DE CONCEPTION ORIENTÉE OBJET — REFACTORING & DESIGN PATTERNS

## 🔍 Exercice 1 — Diagnostiquer un code

### 1.1 — Responsabilités assumées par la méthode `enregistrer()`
La méthode viole ouvertement le principe de responsabilité unique (SRP) en gérant simultanément trois métiers orthogonaux :
1. **Logique Métier / Tarification** : Arbitrage commercial et calcul des taux de remise selon le profil du client.
2. **Infrastructure de Stockage** : Gestion technique de la connexion physique à la base de données (MySQL) et injection de requêtes SQL brutes.
3. **Infrastructure de Communication** : Instanciation du protocole SMTP et expédition des notifications.

### 1.2 — Analyse des principes SOLID
*   **SRP (Responsabilité Unique) ❌ NON RESPECTÉ** : La classe change de comportement si la logique commerciale change, si le moteur de stockage migre, ou si le protocole d'envoi de mail évolue.
*   **OCP (Ouvert/Fermé) ❌ NON RESPECTÉ** : L'ajout d'un nouveau profil client (ex: Partenaire) force l'ouverture physique du fichier pour insérer un énième bloc conditionnel else if. Le code n'est pas fermé à la modification.
*   **DIP (Inversion des Dépendances) ❌ NON RESPECTÉ** : La classe dépend directement de composants concrets d'infrastructure (new MySQLConnection, new SmtpMailer) au lieu de se lier à des contrats d'abstractions stables.

### 1.3 — Impact des évolutions (Révélation du couplage)
*   Ajout du client "Partenaire" ➔ Modification du bloc de remises (Ligne 5).
*   Migration MySQL ➔ PostgreSQL ➔ Remplacement de la classe d'instanciation et de la syntaxe SQL (Ligne 11).
*   Notification par SMS au lieu de Mail ➔ Destruction de la plomberie SMTP pour injecter l'API SMS (Ligne 15).
*   **Révélation** : Ce code souffre de Rigidité et de Fragilité. Modifier un détail technique ou commercial force la réécriture du cœur du moteur de commande, multipliant les risques de régression.

---

## 🪓 Exercice 2 — Refactorer (Signatures & Abstractions)

### 2.1 — Signatures des Interfaces et Classes (Contrats du Domaine)
Pour découpler le système, nous isolons les responsabilités derrière trois abstractions injectées au Gestionnaire par son constructeur :

*   **Interface `ICalculRemise`** : Déclare la méthode `calculerRemise(commande: Commande): number`. Possède trois implémentations concrètes : `RemiseStandard`, `RemiseFidele` et `RemiseVip`.
*   **Interface `ICommandeRepository`** : Déclare la méthode `sauvegarder(commande: Commande, total: number): boolean`. Implémentée par `PgCommandeRepository`.
*   **Interface `INotifier`** : Déclare la méthode `notifier(client: Client, message: string): void`. Implémentée par `SmsNotificateur` ou `EmailNotificateur`.

### 2.2 — Principes SOLID respectés post-refactoring
Grâce à l'injection de dépendances, la classe `GestionnaireCommande` devient immuable :
*   **SRP** : Elle ne gère plus que l'orchestration pure du cas d'utilisation (calculer ➔ sauvegarder ➔ notifier).
*   **OCP & DIP** : Face aux trois évolutions techniques ou commerciales, le fichier principal ne reçoit plus aucune modification (0 ligne changée). On crée simplement une nouvelle classe d'implémentation externe et on l'injecte au boot.

---

## ⚙️ Exercice 3 — Choisir un pattern (Étude de cas)

*   **Cas A ──➔ Pattern STRATEGY** : Permet d'isoler une famille d'algorithmes interchangeables (les calculs de frais de port) derrière une interface commune, autorisant l'ajout de nouvelles règles sans altérer l'appelant.
*   **Cas B ──➔ Pattern ADAPTER** : Agit comme un convertisseur ou un traducteur de soute pour adapter l'interface incompatible d'une librairie tierce au format attendu par le contrat de notre application.
*   **Cas C ──➔ Pattern FACTORY (Fabrique)** : Délègue et centralise la responsabilité de l'instanciation des objets (LoggerConsole ou LoggerFichier) selon la configuration, masquant la tuyauterie de création au reste du Domaine.

---

## 🗄️ Exercice 4 — Recherche guidée : Le Pattern SINGLETON

*   **Problème résolu** : Garantit qu'une classe ne possède qu'une seule et unique instance accessible globalement dans toute la RAM du système (ex: un gestionnaire de configuration ou un pool de connexion unique) pour éviter les collisions et le gaspillage de mémoire vive.
*   **Fonctionnement** : Le constructeur de la classe est verrouillé en accès privé. L'accès à l'instance unique se fait exclusivement via une méthode statique dédiée (généralement `getInstance()`) qui instancie l'objet au premier appel (Lazy Initialization) puis renvoie toujours la même référence par la suite.
*   **Exemple concret** : `LoggerSingleton.getInstance()` pour l'écriture centralisée des traces applicatives.
*   **Sources** : refactoring.guru/design-patterns/singleton

---

## 💎 Bonus — Mini-conception de Système de Notification Extensible

Pour envoyer par e-mail, SMS ou Push sans modifier le code qui déclenche, on applique le principe **OCP** (Ouvert/Fermé) combiné au pattern **Observer (ou Strategy multicaste)**.
*   **Contrat** : Une interface `INotificationChannel` avec une méthode `envoyer(message: string): void`.
*   **Orchestrateur** : Une classe `CentralNotificateur` contenant une liste dynamique de canaux (`List<INotificationChannel>`). Elle expose une méthode `enregistrerCanal()` pour ajouter des cibles au boot, et une méthode `emettreAlerteGlobal()` qui boucle sur le tableau pour notifier tous les canaux enregistrés en ligne droite sans couplage dur.
