# 🏛️ Le Catalogue des Patterns — Jojo-Style
*Ce document centralise les patrons de conception (Design Patterns) d'ingénierie système appliqués et validés sur le module d'audit du projet Mémoria. À copier religieusement dans les fondations de MiniLib.*

---

## 🧱 1. Le Pattern *Value Object* (Objet-Valeur)

*   **📍 Localisation dans le code** : `src/domain/base/IdBinaire.ts`, `UserId`, `ItemId`, et `EventId`.
*   **💡 Le Concept théorique** : En programmation web standard, on passe des primitives anonymes et poreuses (`string`, `number`). Avec le *Value Object*, on encapsule la donnée dans un petit objet immuable qui s'auto-valide dès sa construction via sa propre logique interne (Regex, contrôles stricts).
*   **🗜️ En Jojo-Langage** : *"Une variable blindée qui n'accepte pas qu'on lui mente à la naissance."*

---

## 🎛️ 2. Le Pattern *Smart Enum* (Énumération Riche)

*   **📍 Localisation dans le code** : `src/constants/base/SmartEnum.ts`, `AppEventCategory.ts`, `AppEventSeverity.ts`, `AppEventType.ts`, et `OrdreAff.ts`.
*   **💡 Le Concept théorique** : Remplacer les structures d'énumérés natifs rigides et purement textuels par des classes riches héritant d'un ancêtre abstrait universel. Cela permet d'associer de manière atomique un code SQL brut, un libellé humain descriptif, et des comportements métier (comme la méthode mathématique `estSuperieurOuEgalA` pour calculer le poids des alertes).
*   **🗜️ En Jojo-Langage** : *"L'équivalent d'une surcharge d'opérateur `=` du C++ pour donner des super-pouvoirs à nos listes de choix."*

---

## 🪄 3. Le Pattern *Type Opaque / Branded Type*

*   **📍 Localisation dans le code** : Première version d'étude des identifiants et signatures d'index de types (`string & { readonly __brand: unique symbol }`).
*   **💡 Le Concept théorique** : Utiliser un mécanisme avancé du compilateur pour forcer un langage à typage structurel (TypeScript) à se comporter comme un langage à typage nominal strict (C++ / Pascal). Le compilateur bloque physiquement l'assignation de variables si l'estampille (*le brand*) de destination ne correspond pas, empêchant toute inversion accidentelle de paramètres de même nature technique.
*   **🗜️ En Jojo-Langage** : *"La magouille sémantique de derrière les fagots pour retrouver la sécurité absolue du compilateur système."*

---

## 🏭 4. Le Pattern *Factory* (Fabrique)

*   **📍 Localisation dans le code** : `src/domain/value-objects/UuidFactory.ts` ou les méthodes de transition `fromSql()`.
*   **💡 Le Concept théorique** : Isoler et centraliser la logique de création, de conversion et d'instanciation d'objets complexes ou de structures de données au sein d'une méthode statique dédiée. Cela évite de polluer le reste de l'application avec des opérateurs `new` anarchiques et non contrôlés.
*   **🗜️ En Jojo-Langage** : *"Le poste de douane officielle à la frontière de la fonction : tu ne passes pas si tes papiers ne sont pas valides."*

---

## 📐 5. Le Pattern *Generic Template* (Contraintes de Templates)

*   **📍 Localisation dans le code** : `src/interfaces/repositories/IBaseRepository.ts`, `IEntity.ts` et `BaseEntity.ts` via les signatures paramétrées `<TEntityName, TData, TId>`.
*   **💡 Le Concept théorique** : Concevoir des composants d'infrastructure universels et abstraits (des coquilles logiques vides), mais solidement verrouillés par des contraintes mathématiques d'héritage, que les modules spécifiques viennent habiller en leur injectant des types métiers réels lors de la compilation.
*   **🗜️ En Jojo-Langage** : *"L'esprit pur du `template <typename T>` de 2001, mais adapté aux contraintes de la structure du Web."*
