# 🏛️ Spécification Architecturale — Ségrégation des Contrats de Persistance
> **Conception & Vision :** Joël (Abstrait' Obsession)
> **Réalisation & Alignement :** Gaïa (Trébuchet de syntaxe)
> **Statut :** Arbitrage technologique et refactoring de la cour basse.

Ce manifeste technique documente l'analyse et la résolution d'une dette d'architecture (antipattern hérité de l'Ancien Régime) concernant la gestion du cycle de vie des données immuables au sein du pipeline PostgreSQL.

---

## 🚨 1. Le Problème Consolidé : Violation du Principe ISP (SOLID)

L'implémentation initiale de l'infrastructure centralisait l'intégralité des opérations CRUD au sein d'une interface monolithique unique nommée `IBaseRepository` :

```text
 ┌─────────────────────────────────────────────────────────┐
 │                  IBaseRepository<T>                     │
 ├─────────────────────────────────────────────────────────┤
 │  + findAll() : Promise<T[]>                             │
 │  + findById(id) : Promise<T|null>                       │
 │  + create(data) : Promise<T>                            │
 │  + update(id, data) : Promise<T>   <── Pollution d'audit│
 │  + delete(id) : Promise<boolean>   <── Danger d'effacement
 └─────────────────────────────────────────────────────────┘
```

### Le Paradoxe des Journaux d'Audit (`app_events`) :
Par définition industrielle et réglementaire, un journal d'audit est une structure en **Append-Only** (écriture seule) et **Read-Only** (lecture seule).
Forcer la classe `PgAppEventRepository` à implémenter les signatures `update` et `delete` constitue une violation flagrante du principe **ISP (Interface Segregation Principle)**. Cela introduit un risque majeur de faille de sécurité (possibilité pour un acteur malveillant d'altérer ou d'effacer les traces de ses activités en base de données).

---

## 🪓 2. La Parade Tactique Immédiate : Le Garde d'Élite Défensif

Pour sécuriser l'infrastructure à court terme sans casser les couplages des autres dépôts de la promo avant la livraison, l'équipage a implémenté un **verrouillage applicatif par exception clinique (C++ Style)**.

La méthode `delete` a été maintenue pour satisfaire la forme exigée par le compilateur TypeScript, mais son cœur a été neutralisé de manière inconditionnelle (le fameux principe du *« void défensif »*) :

```typescript
public async delete(id: AppEventId): Promise<boolean> {
  throw new Error('[Erreur Sécurité] Violation d\'intégrité : Interdiction absolue de supprimer un log d\'audit.');
}
```

### Bénéfices de la manœuvre :
* **Sécurité absolue du disque** : Aucun appel de suppression ne peut atteindre physiquement la table PostgreSQL.
* **Fail-Fast immédiat** : L'exception interrompt la transaction défaillante et remonte de façon fluide jusqu'au `HandlerService` central pour notification d'audit.

---

## 🏛️ 3. La Solution Cible Hexagonale Pure (Pour la Soutenance)

Pour ceux qui réclameraient "la documentation des bonnes pratiques", la véritable correction architecturale consiste à segmenter (découpler) les contrats au poste frontière des interfaces :

### A. Le Contrat de Lecture / Écriture Standard (`IBaseRepository.ts`)
```typescript
export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: any): Promise<T | null>;
  create(data: any): Promise<T>;
}
```

### B. Le Contrat des Dépôts Mutables (`IWriteableRepository.ts`)
```typescript
import { IBaseRepository } from './IBaseRepository';

export interface IWriteableRepository<T> extends IBaseRepository<T> {
  update(id: any, data: any): Promise<T>;
  delete(id: any): Promise<boolean>;
}
```

### C. Alignement sémantique final :
*   `IItemRepository` dérive de **`IWriteableRepository`** (la pépite peut être mutée).
*   `IAppEventRepository` dérive **uniquement** de **`IBaseRepository`** (le log est immuable et protégé par nature).
