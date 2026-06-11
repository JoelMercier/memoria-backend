# 📜 Charte d'analyse architecturale et de conception d'infrastructure V4

**Rédacteur :** Pôle Ingénierie Système et Persistance
**Version :** 3.2.5 (PostgreSQL 17+)
**État du build :** 🟢 Validé à 100% | Spécifications d'acier pour le rapport

---

## 🏛️ 1. Synthèse des corrections matérielles réalisées sur la table "Users"

L'analyse de l'ancien modèle hérité a mis en lumière des divergences critiques entre les types de transport de l'application et la persistance physique. Les corrections suivantes ont été appliquées pour garantir l'alignement d'acier à 0% de padding :

* **Mutation du type UUID vers ByteA (16 octets)** : L'utilisation initiale du type natif `UUID` de PostgreSQL introduisait une validation et un stockage textuel à tirets sous le capot du moteur. Pour foudroyer le coût CPU des conversions et s'aligner sur le type `Buffer` de la couche TypeScript (Value Objects), la clé primaire `"usIdUser"` a été convertie en `ByteA` strict de 16 octets. Cette manœuvre supprime la nécessité de fonctions de conversion coûteuses à l'insertion et sécurises les phases d'anonymisation RGPD.
* **Rationalisation des verrous d'indexation du Courriel** : L'ancien modèle présentait un doublon physique d'index (une contrainte `UNIQUE` classique cumulée à un index unique fonctionnel sur le `Lower` de la colonne). PostgreSQL créait ainsi deux arbres B-Tree distincts sur le disque, gaspillant de la mémoire vive et ralentissant les écritures. La contrainte unique de table a été supprimée au profit du seul index fonctionnel externe `Users_usCourriel_Lower_Udx`. Combiné à la contrainte de vérification `CHECK`, ce dispositif offre un parachute de performance à l'optimiseur de requêtes (Query Planner) en garantissant un scan d'index instantané lors des phases d'authentification de Cour Basse.

---

## 🎯 2. Analyse des risques de la situation actuelle et propositions d'ajustement

Bien que l'orthogonalité des 7 tables de dictionnaire soit validée, l'analyse des flux applicatifs réels révèle trois zones de fragilité conceptuelle. Voici les propositions de blindage technique à intégrer dans la prochaine feuille de route :

### 🚨 Risque A : Perméabilité structurelle de la configuration des Partages
* **La situation actuelle** : La colonne `shConfiguration` de la table `"Shares"` délègue l'intégralité de sa logique à un sac JSONB libre.
* **Le problème de soute** : Laisser la racine du type de partage en texte variable à l'intérieur d'un JSON empêche PostgreSQL d'exercer son contrôle de validité à l'insertion. Une simple faute de frappe sur le mode de partage ne sera pas bloquée à la frontière de la base de données.
* **La proposition d'amélioration** : Forger une table de référence fixe **`"ShareModes"`** ou **`"ShareStatus"`** en `Char(4)` (0% padding). Elle viendra figer la nature constitutionnelle du partage :
  * `PUBL` : Consultation publique universelle.
  * `PROT` : Accès protégé par secret / mot de passe.
  * `EXPI` : Consultation éphémère à validité temporelle restreinte.
  * *Bénéfice* : Le JSONB applicatif est déchargé de la structure racine et ne stocke plus que les variables dynamiques (le hash du mot de passe ou l'horodatage de fin).

### 🚨 Risque B : Absence de machine d'état explicite pour l'Acteur
* **La situation actuelle** : La table `"Users"` s'appuie sur des drapeaux isolés ou des mécanismes logiques applicatifs pour évaluer la validité d'un compte.
* **Le problème de soute** : Un simple interrupteur booléen est incapable de couvrir la complexité du cycle de vie d'un acteur en production. On ne peut pas distinguer de manière étanche un compte actif, un compte suspendu pour tricherie, un compte en attente de validation de courriel, ou un compte en phase de purge RGPD.
* **La proposition d'amélioration** : Introduire la table de dictionnaire **`"UserStatus"`** (`Char(4)`) pour piloter la machine d'état à coût mémoire nul :
  * `PEND` : Acteur enrôlé en attente de certification de soute.
  * `ACTI` : Compte validé disposant de l'intégralité de ses accès de soute.
  * `SUSP` : Compte temporairement gelé par l'administration.
  * `BANN` : Compte définitivement banni (maintien des verrous d'accès).
  * `ANON` : Compte basculé sous protocole de nettoyage RGPD.

### 🚨 Risque C : Saturation visuelle et baisse de performance sur l'indexation de masse
* **La situation actuelle** : Les étiquettes (`Tags`) s'accumulent de manière plate dans le Domaine, sans catégorisation physique.
* **Le problème de soute** : Dans le cadre d'un usage intensif (Second Cerveau), le volume des étiquettes va croître de manière exponentielle, provoquant des temps de traitement lourds lors des jointures sur la table pivot `ItemTags`.
* **La proposition d'amélioration** : Anticiper la taxonomie en créant une table de référence optionnelle **`"TagCategories"`** (`Char(4)`). Elle permettra d'associer chaque mot-clé à une grande famille universelle (`TECH` pour la technique, `PERS` pour l'usage privé, `PROJ` pour les dossiers chauds).
  * *Bénéfice* : L'optimiseur PostgreSQL pourra filtrer des pans entiers de la table pivot avant même d'analyser les chaînes de caractères des étiquettes.

---

## 🛠️ 3. Cinématique globale de l'arbre généalogique V4

L'infrastructure applique désormais une décomposition modulaire stricte, isolant les responsabilités matérielles des contraintes de Cour Basse :

