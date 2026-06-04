# 🪓 Note d'Arbitrage Technique — Pourquoi le Domaine doit générer des UUIDv7 en RAM

> **Auteur :** Ingénierie Système [Mémoria]
> **Cible :** Équipe d'Architecture Backend & Groupe de Réfractaires
> **Objectif :** Justifier le déplacement et le surclassement de la génération des identifiants (UUIDv7) depuis PostgreSQL (Infrastructure) vers le Noyau Applicatif TypeScript (Domaine).

---

## 🧭 1. Le Constat de l'Ancien Régime

Dans l'implémentation de départ, la structure de la base de données déléguait l'identité au moteur SQL :
```sql
-- ❌ ANTI-PATTERN : Dépendance d'infrastructure, fragmentation d'index et entité anémique
id_user UUID DEFAULT gen_random_uuid() PRIMARY KEY
```

Si le choix d'un identifiant 128 bits (UUID) est indiscutable pour la sécurité, sa génération par la base de données via un format purement aléatoire (v4) introduisait un **couplage lourd**, des **pertes de performance réseau**, et un **sabotage des index physiques**.

---

## 🪓 2. Pourquoi passer à l'UUIDv7 ? (Le compromis parfait)

L'UUIDv4 classique souffre d'un défaut physique : il est 100 % aléatoire. Lors des écritures de masse, PostgreSQL insère ces clés au hasard, ce qui force le moteur à réorganiser constamment ses index B-Tree sur le disque (fragmentation), ralentissant le système.

L'**UUIDv7** (standardisé par l'IETF) résout définitivement ce problème en découpant le jeton de 128 bits en deux segments stratégiques :
1. **Les 48 premiers bits** : Stockent l'horodatage Unix (le temps qui passe en millisecondes).
2. **Les bits restants** : Stockent de l'aléatoire cryptographique pur pour l'unicité.

**Le résultat physique :** Les UUIDv7 sont naturellement triés dans l'ordre chronologique de leur création (*timestamp-ordered*). On obtient la performance brute d'un compteur séquentiel (`SERIAL`), mais sans ses failles de sécurité (imprévisibilité totale des jetons à l'utilisation).

---

## 🪓 3. Les 4 Arguments Système (Pour plier le match face au groupe)

### A. L'Extermination du Syndrome de l'Entité Anémique (Principe SRP)
En Architecture Hexagonale pure, le **Donjon (Le Domaine)** est le maître absolu. Une entité métier (`User`, `Item`) ne doit pas naître incomplète en mémoire vive.
* **Le problème du `DEFAULT` SQL** : Lors d'un `POST`, l'objet naît en RAM sans identifiant. L'entité est incapable de valider son intégrité interne car elle dépend de l'infrastructure pour obtenir son identité.
* **La solution d'acier** : L'identifiant est un attribut obligatoire dès la naissance de l'objet. L'entité naît complète, blindée et autonome en RAM. PostgreSQL se contente de stocker ce que le Domaine lui ordonne.

### B. Suppression des Allers-Retours Réseau (`RETURNING`)
Si c'est la base de données qui génère l'identifiant, Node.js est **obligé d'attendre activement** le retour de PostgreSQL via la clause `RETURNING` pour mettre à jour sa propre mémoire vive, bloquant la fluidité du flux.
En générant l'UUIDv7 en RAM, l'application connaît déjà l'ID *avant* d'écrire en base. On peut envoyer les requêtes d'insertion en rafale (*Fire-and-Forget*) ou paralléliser des écritures de masse sans jamais attendre un retour de clé d'infrastructure.

### C. Isolation Totale des Tests Unitaires (Vitesse Supersonic)
Si la génération est verrouillée dans le `DEFAULT` de la base, vous êtes **physiquement incapable de tester la création d'une entité sans lancer une vraie base de données active** (Docker/Local). Vos tests unitaires Vitest deviennent des tests d'intégration lourds. En centralisant la génération dans le Domaine, vous testez 100 % de votre logique métier en RAM à la vitesse de la lumière (en millisecondes).

### D. Modernité Node.js : Zéro Dépendance Externe (Crypto Native)
L'argument classique des réfractaires : *"Générer des UUIDs en backend va polluer le projet avec des packages packages npm externes !"* **C'est FAUX aujourd'hui.**
Node.js intègre désormais dans son noyau global l'API standard Web Crypto. Générer un UUIDv7 s'exécute nativement et de manière synchrone, sans *aucun* `npm install` :
```typescript
// ⚡ 100% Natif Node.js — Performance RAM maximale
const r_nouvelUuidV7 = crypto.randomUUIDv7();
```
*(Note : Si l'environnement utilise une version de Node.js antérieure à l'intégration globale de la v7, la bibliothèque officielle et standardisée `uuid` prend le relais de manière transparente).*

---

## 🎛️ 4. Le Grand Alignement : UUIDv7 + `IdBinaire` (C++ Style)

Associer l'UUIDv7 à notre classe mère **`IdBinaire`** forme l'armure ultime du projet :
1. Le Domaine calcule l'UUIDv7 à la vitesse de la RAM.
2. La classe `IdBinaire` extrait la valeur brute et la tasse dans un **`Buffer` Node.js de 16 octets** (128 bits contigus sans alignement).
3. PostgreSQL reçoit ce flux binaire compact, l'indexe en bout de B-Tree sans aucune fragmentation, et préserve la performance maximale du disque.

---

## 🏗️ 5. Cycle de Vie Comparé des Flux

### ❌ L'Ancien Régime (Génération DB / UUIDv4 Aléatoire)
```text
[HTTP POST] ➔ [Service (ID absent)] ➔ [Dépôt SQL] ➔ [PostgreSQL (Calcul UUIDv4 + Fragmentation Index)] ➔ [Réseau (Attente RETURNING)] ➔ [RAM Node.js]
```

### 🛡️ L'Armure Nominale Forte (Génération Domaine / UUIDv7 Séquentiel)
```text
[HTTP POST] ➔ [Service (Génère UUIDv7 en RAM)] ➔ [Entité vivante, complète et ordonnée (16 octets Buffer)] ➔ [PostgreSQL (Stockage direct et linéaire)]
```

---

## ⚖️ Le Verdict de Refonte

Le mot-clé `DEFAULT gen_random_uuid()` est officiellement révoqué des tables principales du MPD. La base de données est soulagée de tout calcul d'identité. Le Domaine prend le contrôle, le code devient hautement testable, prédictif, et les index de stockage PostgreSQL restent légers et compacts.
