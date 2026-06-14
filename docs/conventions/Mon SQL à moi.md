# 🏺 Le manifeste du "Jojo-Style" : Normes et directives SQL

**Description :** Référentiel de rédaction des scripts de migration, d'ensemencement et de requêtage pour PostgreSQL (17+). Ce document sert de mémoire externe à l'intelligence artificielle en cas de rupture de contexte.

---

## 🏛️ Rule 1 : L'alignement d'acier (Le zéro padding physique)
L'ordre de déclaration des zones dans le `Create Table` doit suivre strictement une logique décroissante de taille physique pour éliminer le "padding" (les bits vides insérés par le moteur pour aligner la mémoire).

### L'ordre physique des types :
1. **Les colosses (16 octets fixes)** : `ByteA` (Clés binaires 128 bits, UUIDv7).
2. **Les horodateurs (8 octets fixes)** : `Timestamp`.
3. **Les numériques moyens (4 ou 2 octets fixes)** : `Integer`, `Smallint`.
4. **Les codes légers (4 octets fixes alignés)** : `Char(4)` (Quadrigrammes exclusifs).
5. **Les petits et les variables (Alignement 1 octet, fin de ligne)** : `Boolean`, `Varchar(n)`, `Text`, `Jsonb`.

*Note : Les zones de la clé primaire (PK) n'ont aucune obligation d'être en tête de fichier. Les index sont découplés du stockage en tas (Heap).*

---

## ✒️ Rule 2 : La règle grammaticale de la casse (Pas de cris SQL)
Pour le confort visuel des neurones biologiques et pour éviter de donner l'impression de hurler sur le moteur PostgreSQL, la casse des mots-clés du langage est régie par leur nombre de lettres :

* **Mots-clés de 3 lettres et plus** : Toujours au format capitalisé (ex: `Create Table`, `Insert Into`, `Select`, `From`, `Where`, `Null`, `Not`, `Char`, `ByteA`, `Function`, `Return`).
* **Mots-clés de moins de 3 lettres** : Toujours en minuscules strictes (ex: `if`, `on`, `to`, `is`, `or`, `in`, `as`).

---

## 🏷️ Rule 3 : L'unicité absolue des zones (Zéro alias de table et exception)
Chaque zone de la base de données possède un nom **strictement unique** à l'échelle de l'application tout entière grâce à son préfixe de table de deux lettres minuscules (ex: `us`, `it`, `sh`).

* **Zéro alias par défaut** : Il est donc inutile d'utiliser des alias de table (comme `FROM "Users" "us"`) dans les requêtes standards. Comme chaque zone est unique, PostgreSQL résout les noms sans aucune ambiguïté.
* **L'exception de la jointure double** : Si une requête doit appeler deux fois la même table de dictionnaire (ex: lier la table des civilités à la fois pour un auteur et pour un adhérent), l'usage d'alias courts improvisés est obligatoire pour le moteur (ex: `Join "Civilites" "CiA"` et `Join "Civilites" "CiB"`).
* **Nomenclature des clés** :
  * Clé primaire (PK) : `préfixe` + `Id` + `NomTable` (ex: `"usIdUser"`, `"roIdRole"`).
  * Clé étrangère (FK) : `préfixe` + `NomTableCible` + `Id` (ex: `"usRoleId"`, `"itContextId"`).

---

## 📋 Rule 4 : La notation hongroise Memoria (Portées, types et modificateurs)
La nomenclature des variables locales, des paramètres et des résultats au sein des fonctions ou procédures stockées obéit à la codification stricte suivante :

### 1. Portées (Scopes)
* `m_` : Membre privé d'une classe / Propriété
* `g_` : Variable globale
* `s_` : Variable statique
* `l_` : Variable locale
* `p_` : Paramètre d'une fonction ou procédure
* `r_` : Variable renvoyée comme résultat

### 2. Préfixes de types
* `i`  : Integer (Entier, entier court, entier long)
* `f`  : Float (Nombre à virgule flottante simple ou double, numérique)
* `d`  : Date (Date, date ou timestamp)
* `c`  : Char (Caractère de « petite » longueur fixe, de 1 à 20)
* `b`  : Booléen
* `w`  : Word (Mot machine, le plus souvent non signé)
* `s`  : String (Chaîne de caractères de longueur variable : varchar, text)
* `h`  : Handle / ID (Value Objects d'identifiants uniques forts)
* `o`  : Object (Structure complexe ou instance de classe)
* `v`  : Void ou any (Donnée brute non typée ou absence de retour)
* `e`  : Enum (Instances de nos précieux SmartEnums)

### 3. Modificateurs et extensions
* `x`  : Hexadécimal (Trame textuelle ou binaire compactée en base 16, UUIDs épurés)
* `u`  : Unsigned (Valeur positive uniquement)
* `p`  : Pointer (Pointeur de soute ou référence d'adresse)
* `a`  : Array (Tableau, collection ou liste d'éléments)

---

### 4. Être explicite dans les noms
#### 4.1 Les «UUID's»
Ça donnerait `p_axId`. Mais Id de quoi ? Donc `p_axIdUtilisateur`, `p_axIdPepite`, `p_axIdPartage`.

#### 4.2 Les «Quadrigrammes»
* `p_usRoleId` ou `l_usRoleId`
* `p_shNiveauId` ou `l_shNiveauId`
* `p_aeSeveriteId` ou `l_aeSeveriteId`

---

## 🔠 Rule 5 : L'orthographe d'acier (Majuscules accentuées)
Mémoria vit à l'ère de l'UTF-8 complet. Toutes les chaînes de caractères et tous les alias de sortie humaine doivent utiliser la typographie française correcte. **Les majuscules doivent être accentuées** (ex: `as 'Étiquette'`, `as 'Propriétaire'`). Les alias textuels contenant des apostrophes doivent être doublés de manière polie (ex: `as 'Statistiques de l''Éléphant'`).

---

## ⚡ Rule 6 : Les suffixes d'infrastructure et déclencheurs
Pour éviter tout bégayage ou collision visuelle dans le dictionnaire système :
* Index classique ➔ `_Idx`
* Index unique ➔ `_Udx`
* Contrainte de vérification ➔ `_Chk`
* Déclencheur (Trigger) ➔ `_Trg`
* Les déclencheurs utilisent la syntaxe stricte `Execute Function` combinée à l'astuce binaire `jsonb_populate_record` de `"TraceModif"`.

---

## 📝 Rule 7 : L'impératif de documentation absolue
Chaque fichier doit comporter 4 sections séparées par des lignes de commentaires ASCII. Chaque zone doit être documentée individuellement via un `Comment on Column`.
* **Alignement esthétique** : Pour le plaisir des yeux, le mot-clé `is` des commentaires doit être aligné verticalement sur l'ensemble du bloc. Il sera porté une attention particulière sur l'alignement vertical de manière générale.
