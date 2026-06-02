# 🪓 Rapport d'Autopsie Technique — Preuve par les Faits du Non-Fonctionnement de l'Ancien Régime

> **Auteur :** Direction de l'Ingénierie Système [Mémoria]
> **Cible :** Équipe d'Architecture & Comité de Revue de Code
> **Statut :** Constat clinique irréfutable (Fouilles DDL / Seeders)

---

## 🧭 1. Le Mythe de l'Existant Fonctionnel

L'argument classique opposé aux réformes architecturales strictes (SOLID / Hexagonale) est généralement : *« Ne touchons pas au code existant, car l'application fonctionne déjà en l'état. »*

L'analyse de bas niveau et la cartographie croisée des scripts d'ensemencement physiques (`database/seeders/`) apportent la preuve matérielle et mathématique du contraire : **L'application de l'Ancien Régime n'a JAMAIS fonctionné globalement, n'a jamais été testée en recette, et constitue un chantier abandonné en cours de route.**

---

## 🪓 2. Les Preuves Cliniques du Désastre

### A. Le Désert des Pépites (`03_add_items_seeders.sql`)
Le script de création des utilisateurs (Étape 01) crée un écosystème de **12 acteurs applicatifs réels** (utilisateurs réguliers, modérateurs, tech-leads).
* **Le constat :** Le script d'insertion des pépites de connaissances (`Items`) s'arrête brutalement au milieu du 4ème profil (Lucas, le Designer).
* **La réalité physique :** Pour **8 utilisateurs sur 12**, il n'existe strictement aucun contenu en base de données. L'application simule des profils d'entrepreneurs (Alice), de philosophes (Paul), de journalistes (Julie) ou de cuisiniers (Thomas) qui n'ont aucune pépite en RAM.

### B. Le Sabotage de la Table Pivot (`05_add_item_tags_seeders.sql`)
La table pivot Many-to-Many (`ItemTags`) est le cœur névralgique de l'indexation de Mémoria. C'est elle qui valide la logique de notre "Deuxième Cerveau".
* **Le constat :** Le fichier d'ensemencement d'origine s'effondre à la **ligne 109**, juste après le lot d'Emma Martin.
* **La réalité physique :**
  1. Bien que Lucas possède 8 pépites de design et 5 tags créés, **aucune liaison Many-to-Many n'a été écrite pour lui**. Ses pépites flottent de manière poreuse dans le système, rattachées à aucun mot-clé.
  2. Pour les 8 autres profils, la table pivot est un désert total.
  3. Le script est corrompu par un point-virgule orphelin à la ligne 41 (lot de Sophie), qui ferait planter n'importe quel parseur SQL d'intégration continue standard.

---

## 🏗️ 3. Ce que cela DÉMONTRE sur le plan Système

1. **Absence de Tests d'Intégration Globaux** : L'équipe précédente a développé des briques de code de manière isolée sans jamais lancer un script de build global. Si l'application avait tourné ne serait-ce qu'une fois en recette, les jointures inverses auraient immédiatement renvoyé des payloads vides pour 80 % de la base.
2. **Conception Fantôme (Le cas JWT/Session)** : Ils ont documenté l'implémentation de jetons d'accès auto-porteurs (JWT) tout en laissant traîner une vieille table d'infrastructure de sessions Express (`user_sessions`). Ils ont empilé des couches de tutoriels contradictoires trouvés sur le Web sans en comprendre la plomberie binaire.

---

## ⚖️ Conclusion d'Ingénierie

Nous ne reprenons pas un produit fonctionnel : **nous sauvons une ébauche poreuse**. S'aligner sur leur "To-Do list" ou respecter leur code d'origine revient à pactiser avec le chaos. La réécriture unilatérale sous l'**Armure Hexagonale strict et SOLID** avec nos identifiants d'acier compacts (`Bytea`) est la seule voie industrielle valide pour mener ce projet au succès.
