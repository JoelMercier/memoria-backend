# 🏛️ NOTE D'ARCHITECTURE TECHNIQUE : LA DÉNORMALISATION CONTRÔLÉE
**Auteur :** Joël
**Statut :** Norme de Modélisation Memoria
**Cible :** Équipe de Développement & DBA

---

## 1. Le Problème de la "Normalisation Aveugle" (3NF)

La théorie académique des bases de données pousse à la "Troisième Forme Normale" (3NF). Cette approche exige de remplacer les chaînes de caractères par des identifiants numériques (`INT` ou `BIGINT`) pointant vers des tables de référence (dictionnaires).

### Pourquoi cette approche purement théorique échoue en production :
* **Explosion des JOINs** : Pour lire un simple journal d'audit ou une liste d'utilisateurs, le moteur doit exécuter 4 à 5 jointures uniquement pour afficher des libellés (ex: `Rôle`, `Statut`, `Fournisseur`).
* **Invisibilité des données brutes** : Lors d'un `SELECT *` de débogage en production, la table est illisible sans réécrire toutes les jointures.
* **Coût CPU** : Chaque jointure consomme des cycles d'horloge et de la mémoire vive pour lier les index.

---

## 2. La Solution Memoria : La Dénormalisation Contrôlée via `Char(4)`

La **dénormalisation contrôlée** consiste à dupliquer volontairement une information textuelle courte, immuable et standardisée directement dans la table opérationnelle.

Plutôt que de stocker un ID anonyme (`1`, `2`, `3`), nous stockons un code humainement intelligible sur **4 caractères fixes** (ex: `USER`, `ADMIN`, `WARN`, `CRIT`, `GOOG`).

### Les 3 Avantages Majeurs :

### ⚡ 1. Performance Brute (Zéro Jointure)
Les requêtes de lecture courantes n'ont plus besoin de solliciter les tables de dictionnaire. La donnée utile est **déjà présente** dans la ligne. Le gain de temps sur les index et les scans de tables est massif.

### 🔍 2. Débogage et Exploitation instantanés
Un simple `SELECT * FROM "Users"` ou `SELECT * FROM "Events"` affiche immédiatement des informations claires pour l'humain (`ADMIN`, `WARN`), sans nécessiter une requête complexe à 4 jointures en situation de crise.

### ⚙️ 3. Alignement avec l'Architecture CPU (64-bit)
Les processeurs modernes lisent et comparent la mémoire par blocs (mots machines) de 32 ou 64 bits. Un type `Char(4)` occupe exactement **4 octets**. Il s'aligne nativement sur ces frontières physiques, rendant les opérations de comparaison et de filtrage (`WHERE aeIdSeverity = 'WARN'`) extrêmement rapides pour le processeur.

---

## 3. Réponses aux Objections Courantes

> **"Mais le texte prend plus de place qu'un entier !"**
* **Faux ou Insignifiant.** Un `Integer` prend 4 octets. Un `Char(4)` prend exactement 4 octets (en codage standard). L'impact sur le disque et en mémoire RAM est strictement identique.

> **"Et si le libellé change ?"**
* Les valeurs choisies sont des codes techniques d'infrastructure immuables (ex: `APPL`, `AZUR`, `GGL`). Le libellé complet affiché à l'utilisateur final reste stocké dans le dictionnaire et peut être traduit ou modifié librement sans jamais impacter la clé technique `Char(4)`.

---
**Règle d'or :** Sur Memoria, l'efficacité de l'exploitation et la performance brute du moteur priment sur le purisme académique.
