# 🏛️ RAPPORT DE CONCEPTION UML — COMPLEXE CINÉMATOGRAPHIQUE « LE LUMIÈRE »

## 👥 Exercice 1 — Identification et rôles des acteurs du système

*   **Visiteur / Client** : Acteur externe (anonyme ou authentifié) dont le rôle est de consulter la programmation à l'affiche, vérifier la grille horaire des séances, sélectionner des places physiques et valider ses réservations via la passerelle de paiement en ligne.
*   **Caissier** : Opérateur interne de l'établissement chargé d'enregistrer et de valider les ventes physiques de billets directement au guichet physique, en exploitant le même système de soute centralisé.
*   **Administrateur** : Gestionnaire système disposant des droits d'écriture sur le catalogue pour enrichir la base de films et orchestrer la programmation logistique des séances dans les différentes salles.

---

## 📖 Exercice 4 — Analyse et lecture des multiplicités structurelles

1.  Une séance concerne **strictement 1** film, et un film peut être programmé dans **0 à plusieurs (0..*)** séances au sein de la grille de programmation.
2.  Une réservation comprend **1 à plusieurs (1..*)** places physiques, et une place physique appartient à **0 ou 1 (0..1)** réservation active à un instant donné (interdiction absolue du double référencement ou de la collision de soute).
3.  Un client peut effectuer **0 à plusieurs (0..*)** réservations au cours de sa vie technique, et une réservation est faite par **strictement 1** client unique.

---

## 🧠 Exercice 5 — Esprit critique, encapsulation et scénarios métiers

### 5.1 — Prise en charge de la règle d'annulation
La règle de gestion interne (« Une réservation peut être annulée tant que la séance n’a pas commencé ») est intégralement prise en charge au cœur du Domaine par la classe **`Reservation`** via sa méthode dédiée **`annuler()`**.
Lors de l'activation du verbe, l'objet Reservation exécute une vérification de parité temporelle en interrogeant l'instance de la classe **`Seance`** associée. La Séance valide ou rejette la requête en calculant son état via sa méthode interne **`estCommencee()`** (qui compare la date/heure système courante à la date d'infrastructure de la projection). Si le délai est dépassé, la méthode lève un blindage d'exception logicielle et gèle le statut.

---

## 💎 Bonus — Réponses et arbitrages d'architecture d'élite

1.  **Modélisation de l'héritage des acteurs** : Introduction d'une classe de base abstraite `Client` dont héritent de manière étanche deux structures de soute spécialisées : `ClientAbonne` (embarquant l'attribut `numAbonnement` et les règles de calcul de réduction machine) et `ClientOccasionnel`.
2.  **Justification de la relation d'agrégation forte (Composition)** : La liaison entre `Salle` et `Place` est modélisée par un **losange plein (Composition)**. Une place de cinéma n'a aucune autonomie existentielle ou conceptuelle en dehors de la salle physique qui l'abrite. En cas de destruction ou de restructuration d'une salle dans le dictionnaire, toutes les places associées sont désintégrées du tas en cascade.
3.  **7e Cas d'Utilisation en extension («extend»)** : Le cas d'utilisation maître est `Gérer la programmation` (Administrateur). Nous y greffons une extension conditionnelle **`«extend»`** nommée `Générer une alerte de chevauchement horaire`, activée par le système uniquement si deux séances se percutent sur une même plage horaire dans la même salle.
