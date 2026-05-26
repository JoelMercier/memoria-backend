# 🏰 Le Guide du Château Fort — Mémoria & MiniLib
*Script officiel du débriefing d'architecture. Une vulgarisation sémantique de l'Architecture Hexagonale à consommer avec un humour Jojo-Style bien tranché.*

---

## 🚪 Étape 1 : Le Pont-Levis (Les Contrôleurs & DTO)

> *"Bienvenue au Pont-Levis. C'est le point d'entrée de notre application, là où arrive la boue du Web : les chaînes de caractères anonymes `string`, les URLs bizarres et le JSON en vrac [Mémoria]. En architecture standard, on laisse entrer tout le monde. Chez nous, c'est interdit.*
>
> *Le Pont-Levis est gardé par le douanier Zod, confiné dans sa guérite [Mémoria]. Si le payload HTTP n'est pas conforme, il prend une flèche. Si c'est valide, la primitive brute est immédiatement convertie en **Value Object** et en **Smart Enum** avant d'avoir le droit de franchir la herse et d'entrer dans l'application [Mémoria]."*

---

## 🛡️ Étape 2 : La Cour Basse (La Couche Applicative / Services)

> *"Vous entrez dans la Cour Basse. Ici, on ne parle pas la langue vulgaire du Web : pas de `req`, pas de `res`, pas de types Zod externes [Mémoria]. C'est le domaine exclusif des Services d'Administration [Mémoria]. On y orchestre la logique métier avec une pureté totale. C'est propre, c'est aligné verticalement, c'est aéré [Mémoria].*
>
> *C'est aussi ici qu'on a découvert que l'ancienne équipe laissait les administrateurs falsifier ou supprimer les logs en cachette de manière totalement anonyme, sans jamais enregistrer leur ID d'acteur... Une vraie Cour des Miracles qu'on a fini par flécher avec nos variables muettes `_actorUserId` pour blanchir le linter tout en archivant la faille [Mémoria]."*

---

## 👑 Étape 3 : Le Donjon (Le Domaine & Les Entités)

> *"Voici le Donjon, le cœur immuable du Royaume [Mémoria]. C'est là que vit l'entité vivante `AppEvent.ts` [Mémoria]. Elle est protégée des regards indiscrets par une armure de plaques en **Notation Hongroise stricte** (`m_idEvent`, `m_sUserId`, `m_eSeverity`, `m_dCreatedAt`) [Mémoria].*
>
> *Aucun intrus ne peut modifier ses attributs internes directement : tout passe par des propriétés virtuelles (getters implicites) [Mémoria]. C'est le Saint des Saints, totalement agnostique des bases de données et des frameworks extérieurs : si le reste de l'application s'effondre, le Donjon reste debout [Mémoria]."*

---

## 🗄️ Étape 4 : Les Souterrains (La Couche Infrastructure / Repositories)

> *"On descend à la cave, dans les Souterrains secrets. C'est là qu'on parle la langue de la roche, du fer et du SQL brut (PostgreSQL) [Mémoria]. Le Repository s'occupe de la basse besogne : il déconstruit nos magnifiques Smart Enums au tout dernier moment pour alimenter les jetons d'insertion [Mémoria].*
>
> *C'est ici qu'on applique la pagination ordonnée selon notre charte d'excellence avec le **`NbLignesMax`** et l'**`IndexDepart`** [Mémoria]. Et c'est en descendant ici qu'on s'est rendu compte qu'une simple analyse correcte de 4 bêtes tables de référence physiques nous aurait évité de bâtir toute cette usine à gaz en TypeScript... mais on a préféré les laisser poliment dans leur mouise [Mémoria] !"*
