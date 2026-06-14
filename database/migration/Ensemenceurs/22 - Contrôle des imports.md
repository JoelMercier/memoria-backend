# 📊 Procédure d'audit et de contrôle du jeu de données Mémoria

**Description :** Requête chirurgicale de vérification de l'intégrité du stockage binaire et de la cohérence relationnelle à exécuter après l'injection des ensemenceurs officiels. Conforme à la doctrine "True Getters Compliance" et purgée de toute gergovie logicielle.

---

## ⚡ 1. La requête d'autopsie (Style AS/400 - Zéro alias)

Cette requête exploite l'unicité absolue des zones (Rule 3) pour compter les liaisons sans aucun alias de table, et extrait les en-têtes humains avec des majuscules accentuées UTF-8 et doublement polie de l'apostrophe (Rule 5).

```sql
Select
    "usPseudo"                                   as "Acteur applicatif",
    "usCourriel"                                 as "Courriel de contact",
    Count(Distinct "itIdItem")                   as "Nombre de pépites",
    Count(Distinct "tgIdTag")                    as "Nombre d''étiquettes uniques"
From "Users"
Left Join "Items" on "itUserId" = "usIdUser"
Left Join "Tags"  on "tgUserId" = "usIdUser"
Group By
    "usIdUser",
    "usPseudo",
    "usCourriel"
Order By "Nombre de pépites" Desc;
```

---

## 📋 2. Cadran de contrôle nominal (Résultat physique du PC de dév)

Pour valider que le nettoyage de la "chienlit" d'origine est parfait et qu'aucune pépite n'a été perdue ou dupliquée lors du dédoublonnage de soute basse, le moteur PostgreSQL restitue exactement cette matrice (tri secondaire selon le scan physique du tas) :

| Acteur applicatif | Courriel de contact | Nombre de pépites | Nombre d'étiquettes uniques |
| :--- | :--- | :---: | :---: |
| **LucasDesign** | lucas.lefevre@design.com | **8** | 2 |
| **SophieDev** | sophie.laurent@tech.io | **2** | 5 |
| **AliceCEO** | alice.ceo@startup.io | **2** | 0 |
| **ChefThomas** | thomas.roux@startup.io | **1** | 0 |
| **JulieTech** | julie.bernard@agency.fr | **1** | 0 |
| **MarcPM** | marc.dubois@entreprise.fr | **1** | 2 |
| **PaulPhilo** | paul.martin@universite.fr | **1** | 0 |
| **EmmaPsy** | emma.martin@universite.fr | **1** | 2 |
| **CamilleArchi** | camille.archi@studio.com | **1** | 1 |
| **LeaMod** | lea.mod@memoria.io | **0** | 0 |
| **MaximeInfra** | maxime.infra@memoria.io | **0** | 0 |
| **PierreRoot** | pierre.root@memoria.io | **0** | 0 |

---

## 🛠️ 3. Les totaux de contrôle absolus de la Forteresse

L'intégrité de la Cour Basse est validée si et seulement si ces trois compteurs physiques sont exacts :
1.  **Nombre total d'acteurs (Users)** : `12` profils configurés à l'Argon2id.
2.  **Nombre total de pépites (Items)** : `18` pépites insérées (Le Corbusier inclus pour CamilleArchi, ce qui fait monter son compteur à 1 pépite !).
3.  **Nombre total d'étiquettes (Tags)** : `12` mots-clés uniques répartis dans la soute.
