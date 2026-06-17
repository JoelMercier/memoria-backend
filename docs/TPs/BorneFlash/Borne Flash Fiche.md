# 🏛️ Fiche synthétique : « BorneFlash »

**Description :** Note de synthèse d'infrastructure décodant les mécanismes logiques du système de recharge rapide pour véhicules électriques. Ce document sert de mémoire externe absolue pour neutraliser tout interrogatoire bureaucratique du corps professoral.

---

## 🔍 1. Les 3 Composants Physiques de Soute (L'Automate Métier)

Une station BorneFlash n'est pas une maquette de salon, c'est un système industriel autonome articulé autour de trois piliers orientés objet :

### 🎛️ A. La Machine à États Finis (Gestion du Matériel)
Le microprocesseur de la borne pilote le comportement physique du connecteur et de l'affichage en basculant de manière étanche entre trois états machine exclusifs :
*   `Libre` : Le voyant est vert. La borne est disponible, à l'écoute et attend l'approche d'un conducteur.
*   `Occupee` : Le câble est verrouillé dans l'habitacle, le voyant passe au bleu. Les électrons coulent en ligne droite et le système bloque toute tentative de double démarrage.
*   `HorsService` : Anomalie technique ou rupture matérielle détectée. Le voyant passe au rouge, la borne gèle ses circuits et rejette tout tir laser d'allumage.

### 🗜️ B. Le Magasin Logistique (Le Repository)
C'est la couche d'accès qui tourne sur le mini-ordinateur embarqué dans le châssis métallique. Son rôle unique est d'encapsuler la persistance : à chaque fois qu'un cycle de charge s'achève, la borne doit instancier un enregistrement immuable (identifiant unique, volume de kWh extraits) et l'expédier au grand livre de stockage (en base ou en mémoire d'urgence) pour l'archivage comptable.

### 🚨 C. Le Découpleur Événementiel (Le Pattern Observer)
Au moment exact où l'état bascule vers la fin de la recharge (déclenchement de la méthode `terminer()`), la borne doit réveiller plusieurs cloisons fonctionnelles simultanément sans pour autant les connaître de manière rigide. Elle lève une alerte interne qui prévient instantanément le notificateur de courriel (expédition du reçu), le module d'IHM (mise à jour des métriques à l'écran) et le journal de supervision (consignation de la trace d'audit).

---

## ⚖️ 2. Le Choix d'Élite des Patterns (L'Argumentation SOLID)

*   **Pattern Strategy (`Tarif`)** : Appliqué pour encapsuler la tarification. Il isole le calcul arithmétique du coût (au kWh, forfait fixe ou heures creuses) derrière un contrat d'interface stable. La classe `SessionRecharge` consomme la stratégie sans savoir laquelle est active.
*   **Principes Majeurs en Jeu** :
    *   **OCP (Open/Closed Principle)** : Le système est ouvert à l'extension (on peut ajouter une formule tarifaire "Partenaire" ou "Saisonnière" en créant une bête classe externe) mais fermé à la modification (le code maître de `SessionRecharge` reste intouchable).
    *   **DIP (Dependency Inversion Principle)** : Les modules d'infrastructure (le dépôt en mémoire ou SQL) dépendent uniquement de l'abstraction `ISessionRepository`. Remplacer la base de données réelle par un tableau de rechange en RAM ne modifie pas une seule ligne de la logique métier.

---

## 🚀 3. La phrase magique de l'ingénieur

*« Pourquoi avoir introduit une interface pour le calcul du tarif au lieu de coder directement les formules dans la classe principale ? »*

**C'est une question d'étanchéité architecturale et de flexibilité d'infrastructure.** 
La logique matérielle de la borne de recharge doit être totalement **découplée** des grilles tarifaires et des fluctuations commerciales de l'entreprise. En **isolant le calcul** du coût derrière l'interface abstraite `Tarif`, on honore le principe **OCP** : on peut injecter une formule au kWh le matin (**FKW**), commuter sur une stratégie d'Heures Creuses Dynamique (**HCD**) l'après-midi, ou greffer de nouveaux contrats partenaires **sans modifier** ni compromettre le code physique qui gère la sécurité et l'acheminement des électrons dans le véhicule.
C'est le standard minimal pour garantir la testabilité unitaire du Domaine via des doubles de test isolés.