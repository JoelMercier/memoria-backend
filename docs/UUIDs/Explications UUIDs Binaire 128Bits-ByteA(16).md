# 🪓 Rapport Technique — Le Passage à l'UUID Binaire 128 bits
> **Vision d'architecture :** Joël (Hongroise maniac' / Sabot 3mm)
> **Forge & Alignement :** Gaïa (Trébuchet de syntaxe)
> **Cible :** Extermination des chaînes de caractères volantes au poste frontière PostgreSQL.

---

## 🕵️‍♂️ 1. Le Constat de départ (Le Monde Cracra de l'Ancien Régime)

Avant notre intervention, l'application gérait les identifiants uniques (UUID) sous forme de **chaînes de caractères textuelles** (`string` volantes) au sein de la logique TypeScript.

### Le Problème :
* **Le danger des "chaînes volantes"** : N'importe quel texte pourri ou corrompu pouvait circuler librement dans le code et se faire passer pour un ID valide. Le compilateur fermait les yeux, et ça explosait à l'exécution en base de données.
* **Absence de barrière** : Aucune étanchéité de typage entre un ID utilisateur et un ID de pépite. Tout le monde était une simple `string`, favorisant les inversions de variables d'inattention.

---

## 🪓 2. Notre Démarche (La Solution Commando SOLID)

On a décidé de couper le sifflet à l'Ancien Régime en appliquant une règle stricte : **Zéro texte dans le code métier, place à l'acier nominal de nos Value Objects.**

### La manœuvre s'est faite en 3 étapes :

1. **L'Armure Nominale Forte (`IdMetier.ts`)** :
   On a forgé des classes spécifiques pour chaque identifiant (`UserId`, `ItemId`, `TagId`, `ShareId`, `AppEventId`). Fini les collisions ! Un `UserId` ne peut plus physiquement être confondu avec un `TagId`. Le compilateur TypeScript est devenu notre garde du corps au bit près.

2. **Le Traducteur Universel (`BaseRepository.ts`)** :
   On a logé deux outils de contrebande dans la classe mère de nos dépôts :
   * `toBuffer()` : Convertit notre identifiant fort en segment de mémoire binaire brute prêt à être envoyé.
   * `toDomainId()` : Récupère le flux physique issu de PostgreSQL et réarme instantanément l'armure nominale du Domaine. Si la donnée est foirée, on applique un *Fail-Fast* inconditionnel (C++ / ADA Style) pour tout couper avant la propagation du poison.

3. **Le Soupirail SQL** :
   Au poste frontière de la persistance, nos requêtes et jointures SQL utilisent la fonction stockée de contrebande `fn_bin_to_uuid($1)` pour communiquer proprement avec le type natif `UUID` de PostgreSQL.

---

## 🚀 3. Les Avantages (Pourquoi on a plié le match)

* **Sécurité absolue du Domaine** : Impossible de compiler le projet si on tente d'injecter une mauvaise structure. On arrête les bugs à la racine.
* **Affichage 100 % Propre dans pgAdmin** : Comme PostgreSQL utilise son type natif `UUID` en interne, l'affichage dans pgAdmin reste parfaitement lisible, long mais propre, avec ses 32 caractères et ses tirets d'origine. Zéro dégradation visuelle !
* **Gestion Propre des Acteurs Anonymes (Zéro Magouille)** : Pour les journaux d'audit (`app_events`), si aucun utilisateur n'est connecté, l'infrastructure envoie un vrai `NULL` SQL à PostgreSQL pour préserver l'intégrité de la clé étrangère (`fkey`) sans créer de faux utilisateur sentinelle en base. L'UUID composé de zéros (`00000000-0000-...`) reste confiné en mémoire vive (RAM) uniquement pour typer l'alerte du terminal.
