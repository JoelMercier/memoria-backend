# 🏛️ Cartographie des Contrats & Interfaces — Mémoria Backend
> **Auteur :** @author Joël, Gaïa & Co
> **Méthodologie :** Architecture Hexagonale Pure & Typage Nominal Fort (Style C++)

Ce manifeste technique dresse l'arborescence et la justification de l'intégralité des interfaces, types génériques et extensions globales du système, purgés de leurs primitives volantes.

---

## 🗂️ 1. Arborescence Physique des Contrats (`src/interfaces/`)

```text
src/interfaces/
├── controllers/                     # Frontière d'Exposition (Web / Inbound Ports)
│   ├── IAppEventAdminController.ts  # Contrat d'exploitation étendu (Rôle Admin)
│   ├── IAppEventController.ts       # Enregistrement passif du journal d'audit
│   ├── IAuthController.ts           # Points d'accès de sécurité et sessions
│   ├── IItemController.ts           # Cycle de vie complet des Pépites
│   ├── IPublicShareController.ts    # Poste frontière public isolé (ISP - SOLID)
│   ├── IShareController.ts          # Gestion privée des droits de partage
│   ├── ITagController.ts            # Organisation et catalogue des étiquettes
│   └── IUserController.ts           # Gestion de profil et sécurité utilisateur
├── database/                        # Frontière d'Infrastructure Basse (Outbound Ports)
│   └── IDatabaseConnection.ts       # Contrat du pool de dialogue PostgreSQL (DIP)
├── entities/                        # Frontières du Domaine (Sacs de Données / DTOs)
│   ├── event/
│   │   ├── IAppEvent.ts             # Accesseurs en lecture des logs d'audit
│   │   └── IAppEventData.ts         # Structure passive (Intersection d'Index)
│   ├── item/
│   │   ├── IItem.ts                 # Accesseurs en lecture des Pépites
│   │   └── IItemData.ts             # Structure passive mappée de la table Item
│   ├── share/
│   │   ├── IAccessConfig.ts         # Restrictions temporelles du JSONB SQL
│   │   ├── IShare.ts                # Accesseurs en lecture des Partages
│   │   └── IShareData.ts            # Structure passive mappée de la table Share
│   ├── tag/
│   │   ├── ITag.ts                  # Accesseurs en lecture des Étiquettes
│   │   └── ITagData.ts              # Structure passive mappée de la table Tag
│   ├── user/
│   │   ├── IUser.ts                 # Accesseurs en lecture de l'Utilisateur
│   │   └── IUserData.ts             # Structure passive mappée de la table User
│   ├── IBaseEntityData.ts           # Métaprogrammation : Mappage dynamique des ID primaires
│   └── IEntity.ts                   # Contrat universel des entités vivantes du Domaine
├── http/                            # Frontière de Transport Réseau
│   ├── IApiResponseData.ts          # Contrat unique de l'enveloppe JSON (Vitrine)
│   ├── IHandlerService.ts           # Abstraction de la capture globale des pannes
│   └── index.ts                     # Façade d'exposition des types (`export type`)
├── repositories/                    # Abstractions de Persistance (Outbound Ports)
│   ├── IAppEventRepository.ts       # Recherche et statistiques d'audit
│   ├── IBaseRepository.ts           # Contrat universel du CRUD Générique
│   ├── IItemRepository.ts           # Recherche par Slug/Titre et listes paginées
│   ├── IItemTagRepository.ts        # Pivot transactionnel de la table de jointure
│   ├── IShareRepository.ts          # Traçabilité des jetons d'URL et jointures
│   └── ITagRepository.ts            # Validation d'unicité et requêtes de groupe
├── security/                        # Abstractions de Protection & Cryptographie
│   ├── IAdditionalInfo.ts           # Métadonnées typées de la trousse de secours ApiError
│   ├── IBlacklistService.ts         # Quarantaine RAM des jetons compromis (jti)
│   ├── IPasswordHasher.ts           # Chiffrement asynchrone des secrets (Argon2id)
│   ├── ITokenManager.ts             # Forge et analyse des couples de jetons JWT
│   └── ITokenPayload.ts             # Charge utile standardisée (RFC 7519 + Claims)
└── services/                        # Frontières des Cas d'Usage Application (Inbound)
    ├── IAuthService.ts              # Cinématique d'inscription, login et rotation
    ├── IItemService.ts              # Logique métier et ownership des Pépites
    └── IUserExportService.ts        # Compilation de masse pour extraction RGPD (Art. 20)
```

---

## 🏛️ 2. Justification des Pivots de Rétro-Ingénierie

### A. La Ségrégation des Interfaces Publiques (`IPublicShareController`)
* **Principe SOLID appliqué :** `ISP` (Interface Segregation Principle).
* **Justification :** Contrairement aux contrôleurs privés exigeant une authentification stricte, `IPublicShareController` gère l'accès anonyme des invités via des jetons d'URL. Isoler ce contrat unique empêche la pollution de la sécurité d'administration, permettant d'appliquer des middlewares d'infrastructure dédiés (ex: *rate-limiting* agressif anti-bruteforce) sans altérer le reste du système.

### B. Le CRUD Universel et l'Inversion de Dépendance (`IBaseRepository`)
* **Principe SOLID appliqué :** `DIP` (Dependency Inversion Principle).
* **Justification :** Le Domaine ne sait pas *comment* les données sont stockées (fichiers, mémoire, PostgreSQL). En liant les services aux abstractions (`IUserRepository`, etc.) héritant de `IBaseRepository`, l'application est totalement indépendante des pilotes physiques. La clé primaire générique s'accorde au type nominal fort (`TId extends AllowedIdTypes`), interdisant les fuites de primitives.

### C. La Métaprogrammation et Signature d'Index (`IBaseEntityData`)
* **Spécificité Jojo-Style :** `Générique Absolu & Mappage Dynamique`.
* **Justification :** Pour éviter la duplication de code d'infrastructure basse, ce type générique engendre chirurgicalement le nom de la clé primaire de la table à partir du littéral textuel de l'entité via l'utilitaire TypeScript `Capitalize`.
  * *Exemple :* Le littéral `'tag'` engendre dynamiquement la propriété d'infrastructure `{ idTag: TagId }`, combinée aux métadonnées d'audit universelles (`createdAt`, `updatedAt`).

### D. L'Extension Globale d'Infrastructure (`src/types/express.d.ts`)
* **Spécificité :** `Declaration Merging`.
* **Justification :** Ce contrat augmente l'interface native de la requête HTTP Express pour y injecter l'identité de l'acteur connecté. Elle applique l'armure nominale du domaine au poste frontière web en typant `req.user.id` directement avec le Value Object fort **`UserId`** au lieu d'une simple chaîne, permettant une transmission étanche et sécurisée vers les couches métier inférieures.
