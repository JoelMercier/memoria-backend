# 📊 Procédure d'audit et de contrôle du jeu de données Mémoria
**Description :** Requête chirurgicale de vérification de l'intégrité du stockage binaire à exécuter après l'injection des ensemenceurs officiels.

---

## ⚡ 1. La requête d'autopsie (Style AS/400 - Zéro alias)

Cette requête utilise l'unicité absolue des zones pour compter les liaisons sans aucun alias de table, et extrait les en-têtes humains avec des majuscules accentuées UTF-8.

```sql
Select
    "usPseudo"                                   as "Acteur applicatif",
    "usCourriel"                                 as "Courriel de contact",
    Count("itIdItem")                            as "Nombre de pépites",
    Count(Distinct "tgIdTag")                    as "Nombre d étiquettes uniques"
From "Users"
Left Join "Items" on "itUserId" = "usIdUser"
Left Join "Tags" on "tgUserId" = "usIdUser"
Group By
    "usIdUser",
    "usPseudo",
    "usCourriel"
Order By "Nombre de pépites" Desc;
```

---

## 📋 2. Ce que le tableau de contrôle DOIT afficher

Pour valider que le nettoyage de la "chienlit" d'origine est parfait et qu'aucune pépite n'a été perdue lors du dédoublonnage, le moteur PostgreSQL doit cracher exactement ces valeurs :


| Acteur applicatif | Courriel de contact | Nombre de pépites | Nombre d'étiquettes uniques |
| :--- | :--- | :---: | :---: |
| **LucasDesign** | lucas.lefevre@design.com | **8** | 2 |
| **SophieDev** | sophie.laurent@tech.io | **2** | 5 |
| **AliceCEO** | alice.ceo@startup.io | **2** | 0 |
| **MarcPM** | marc.dubois@entreprise.fr | **1** | 2 |
| **EmmaPsy** | emma.martin@universite.fr | **1** | 2 |
| **PaulPhilo** | paul.martin@universite.fr | **1** | 0 |
| **JulieTech** | julie.bernard@agency.fr | **1** | 0 |
| **ChefThomas** | thomas.roux@startup.io | **1** | 0 |
| **CamilleArchi** | camille.archi@studio.com | **0** | 1 |
| **MaximeInfra** | maxime.infra@memoria.io | **0** | 0 |
| **LeaMod** | lea.mod@memoria.io | **0** | 0 |
| **PierreRoot** | pierre.root@memoria.io | **0** | 0 |

### 🛠️ Totaux de contrôle absolus à valider :
* **Nombre total d'acteurs (Users)** : 12 profils configurés.
* **Nombre total de pépites (Items)** : 18 pépites insérées (les 11 de Lucas incluses et le doublon d'Alice Growth Hacking/Lean Startup résolu de manière logicielle).
