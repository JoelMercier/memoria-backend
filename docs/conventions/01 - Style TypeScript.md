# 📐 Style TypeScript — TSDoc, Visibilité, Nommage

> Le livre de règles pour écrire du code dans ce projet. Lisez-le une fois, intégrez-le, puis suivez-le sans cérémonie.

## Philosophie

Nous visons une **explicitation des contrats au niveau de Java** combinée à une **concision au niveau de TypeScript**. Cela signifie :

- Chaque symbole exporté possède une documentation TSDoc.
- La visibilité est communiquée via la frontière du module (`export` vs pas d'export), renforcée par les balises `@public` / `@internal`.
- Nous utilisons des classes uniquement lorsque la structure possède une réelle **identité** (une instance avec un état et un comportement — comme un type d'erreur). Les services, utilitaires et assistants (*helpers*) sont de simples fonctions ou objets.
- Nous ne sacrifions jamais la clarté au profit de l'ingéniosité.

## Visibilité : comment nous faisons dans cette base de code

TypeScript propose plusieurs mécanismes de visibilité. Nous les utilisons avec intention.

### 1. Au niveau du module : `export` vs pas d'`export` (outil principal)

Les modules ES nous offrent l'encapsulation gratuitement. Un symbole qui n'est pas exporté est **invisible à l'extérieur du fichier** — ce qui est plus strict que le *package-private* de Java.

```ts
// helpers.ts

// Non exporté → inaccessible de l'extérieur. C'est notre "private".
function buildUrl(base: string, path: string): string {
  return `${base}${path}`;
}

// Exporté → API publique. À documenter avec TSDoc.
/**
 * Récupère un utilisateur par son identifiant.
 * @public
 */
export function fetchUser(id: string) {
  const url = buildUrl(BASE_URL, `/users/${id}`);
  // ...
}
```

**Règle** : n'exportez pas « juste au cas où ». Exporter est un engagement envers un contrat public.

### 2. Balises TSDoc : `@public`, `@internal`, `@deprecated`

Lorsque la règle export/non-export ne suffit pas (par exemple, un symbole est exporté uniquement pour que les tests puissent l'atteindre), balisez-le explicitement :

```ts
/**
 * Assistant interne utilisé par `api`. Exporté uniquement pour les tests directs.
 * Le code de l'application ne doit pas importer ceci — utilisez `api.*` à la place.
 *
 * @internal
 */
export function buildHeaders(extra?: Record<string, string>) {
  /* ... */
}
```

La balise est contraignante plus tard (via `eslint-plugin-tsdoc` ou `api-extractor`) et immédiatement lisible pour les humains.

### 3. Membres de classe : `public`, `private`, `protected`, `#field`

Nous utilisons des **classes uniquement lorsqu'une instance possède une identité** — typiquement pour les **types d'erreurs** (`ApiError`) et les **entités du domaine avec des invariants**. Pour les services, les clients HTTP, les dépôts (*repositories*), etc., nous préférons les objets et les fonctions (voir `../architecture.md` pour la justification).

Lorsque vous écrivez une classe, annotez la visibilité explicitement :

```ts
export class ApiError extends Error {
  public constructor(
    public readonly status: number, // ← public, readonly : le contrat est clair
    message: string,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

Pour un état véritablement privé au moment de l'exécution (rare), utilisez les champs privés ES avec `#` :

```ts
class Counter {
  #count = 0; // véritablement privé — invisible pour JS à l'exécution

  public increment(): void {
    this.#count++;
  }
}
```

**Quand utiliser quel modificateur de classe** :

- `public` — explicite sur chaque membre de classe que vous souhaitez pouvoir appeler de l'extérieur.
- `private` — pour les membres internes où une contrainte uniquement au niveau de TS est suffisante.
- `#field` — lorsque le type peut fuiter vers les consommateurs via des bibliothèques, pour les états sensibles à la sécurité, ou pour empêcher absolument le *monkey-patching*.

### 4. `readonly` — communique l'intention

Marquez les champs et les paramètres en `readonly` chaque fois qu'ils ne sont pas réassignés après la construction. C'est autant de la documentation que de la contrainte :

```ts
public readonly status: number   // l'appelant le sait : jamais muté
```
## TSDoc : la couche de contrat

Chaque symbole **exporté** porte une TSDoc. Les assistants internes peuvent s'en passer si le nom et la signature sont évidents par eux-mêmes.

### Balises requises


| Balise | Quand l'utiliser |
| :--- | :--- |
| Résumé | Description en une ligne, première ligne du commentaire. |
| `@param` | Chaque paramètre qui n'est pas nommé de façon triviale. |
| `@returns` | Chaque retour non-void. |
| `@throws` | Chaque type d'erreur auquel l'appelant doit s'attendre. |
| `@example` | Recommandé pour les API publiques non triviales. |
| `@typeParam` | Pour chaque paramètre générique qui nécessite une explication. |
| `@public` | Marque l'API publique (associé à `@internal` pour la clarté des frontières). |
| `@internal` | Marque les symboles _exportés uniquement pour les tests_, pas pour le code de l'application. |
| `@remarks` | Pour le contexte, les pièges ou les liens vers des docs connexes. |
| `@see` / `@link` | Références croisées (`@link` en ligne, `@see` dans un bloc). |

### Modèle

```ts
/**
 * Effectue un GET et valide la réponse par rapport au schéma fourni.
 *
 * @typeParam T - Déduit du schéma. Le type de retour est `z.infer<typeof schema>`.
 * @param path - Chemin de l'API, ex: `/items` (précédé de l'URL de base).
 * @param schema - Schéma Zod utilisé pour analyser et typer le corps de la réponse.
 * @param options - En-têtes optionnels et signal d'abandon.
 * @returns Le corps de la réponse analysé et validé.
 * @throws {@link ApiError} sur les réponses non-2xx.
 * @throws ZodError si la réponse ne correspond pas au schéma.
 *
 * @example
 * ```ts
 * const user = await api.get('/users/me', userSchema)
 * ```
 *
 * @public
 */
async get<T>(path: string, schema: z.ZodType<T>, options?: ApiRequestOptions): Promise<T>
```

### TSDoc sur les composables et les stores

Pour les composables, documentez la _forme du retour_ — c'est cela l'API publique :

```ts
/**
 * État réactif et actions pour gérer les éléments de l'utilisateur actuel.
 *
 * @returns Un objet avec :
 *  - `items`: ref réactive de `Item[]`
 *  - `loading`: ref réactive de `boolean`
 *  - `error`: ref réactive de `string | null`
 *  - `load()`: récupère les éléments depuis le backend
 *
 * @public
 */
export function useItems() {
  /* ... */
}
```

## Conventions de nommage


| Symbole | Convention | Exemple |
| :--- | :--- | :--- |
| Fichier : composable | `useXxx.ts` | `useAuth.ts`, `useItems.ts` |
| Fichier : service | `xxxApi.ts` | `authApi.ts`, `itemsApi.ts` |
| Fichier : schéma | `xxx.ts` (nom de l'entité, au singulier) | `item.ts`, `user.ts` |
| Fichier : store | `useXxxStore.ts` | `useAuthStore.ts` |
| Fichier : composant | `PascalCase.vue` | `ItemCard.vue` |
| Fichier : vue | `XxxView.vue` | `HomeView.vue`, `ItemEditView.vue` |
| Type / Interface | `PascalCase` | `Item`, `ApiRequestOptions` |
| Constante | `UPPER_SNAKE_CASE` pour les vraies constantes | `BASE_URL` |
| Variable | `camelCase` | `currentUser` |
| Fonction | `camelCase`, verbe en premier | `fetchUser`, `buildPayload` |
| Classe | `PascalCase`, nom | `ApiError` |
| Membre privé | `camelCase` (pas de préfixe `_`) | `baseUrl`, `rawRequest` |
| Privé strict | `#camelCase` | `#count` |
| Booléen | Préfixe `is`/`has`/`should` | `isLoading`, `hasError` |

**Rejetez** la notation hongroise, les préfixes par soulignement (*underscore*) pour le "private", et les abréviations (`usr`, `btn`, `cfg`). Soyez explicite.

## Importations

Utilisez l'alias `@/` pour les chemins vers `src/`. Groupez les importations :

```ts
// 1. Externes
import { ref, computed, onMounted } from 'vue';
import { z } from 'zod';

// 2. Internes — services / schémas / stores
import { api, ApiError } from '@/services/api';
import { itemSchema } from '@/schemas/item';

// 3. Types uniquement (utilisez `import type`)
import type { Item } from '@/schemas/item';

// 4. Importations relatives du même dossier
import { formatDate } from './formatDate';
```

## Longueur des fichiers

Limite indicative : **300 lignes**. Si un fichier dépasse cette taille, demandez-vous s'il a plus d'une seule responsabilité. Divisez-le.

## Fonctions

- Limite indicative sur la longueur d'une fonction : **40 lignes**. Si vous la dépassez, envisagez une extraction.
- Un seul verbe par nom (`fetchAndCacheUser` contient deux verbes → séparez-le).
- Préférez les chaînes `async`/`await` aux chaînes `.then()`/`.catch()`.

## Gestion des erreurs

Trois modèles légitimes, par ordre de préférence :

1. **Levez une `ApiError` (ou une sous-classe spécifique) à la source**, et laissez l'appelant la gérer.
2. **`.catch((e) => e)` pour inspecter** dans les tests ou là où vous avez véritablement besoin des deux branches du traitement.
3. **`try/catch/finally`** pour le nettoyage (par exemple : `loading.value = false` dans un bloc `finally`).

N'avalez jamais d'erreurs en silence. Ne faites jamais un `catch` sans lever à nouveau l'erreur (*re-throw*) ou sans l'enregistrer dans les journaux (*log*).

## Quand utiliser une classe

Par défaut : **ne le faites pas**. Utilisez des fonctions et des objets. Ne recourez à une classe que si l'un de ces cas s'applique :

- ✅ La structure est un **type d'erreur** (`ApiError`, future `ValidationError`…). Par convention en JS, les erreurs reposent sur des classes.
- ✅ La structure possède une **identité distincte** avec un état qui doit être encapsulé sous forme d'instance (rare sur le front-end ; plus fréquent en DDD sur le back-end).
- ✅ Vous avez véritablement besoin d'**héritage** pour une hiérarchie fermée (rare).
- ✅ Vous avez besoin d'un **état privé au moment de l'exécution** via des champs `#fields`.

Pour les clients HTTP, les services, les dépôts (*repositories*), les validateurs, les utilitaires, les composables, les stores — **utilisez des fonctions ou des objets**. Cela permet de maintenir la base de code cohérente avec les composables (qui doivent être des fonctions) et les stores (qui sont des fonctions de style *setup* dans Pinia).

## Documents connexes

- [`02-file-organization.md`](./02-file-organization.md) — où vont les fichiers.
- [`../architecture.md`](../architecture.md) — les couches que ces conventions servent.

[⬆ Retour à l'index des docs](../README.md)

---

_Dernière mise à jour : 12/05/2026_
