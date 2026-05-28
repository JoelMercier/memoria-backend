# 🏛️ Archéologie Technique — Structure Initiale du Backend Mémoria
> **Statut :** Version d'Origine (Avant Purification Hexagonale)
> **Constat global :** Silotage abusif par thématiques, fuites de primitives, et présence de résidus JavaScript (`.js`).

Ce document liste l'arborescence physique originelle des contrats, types et enums avant la refactorisation majeure vers l'armure nominale.

---

## 🗂️ 1. Cartographie de l'Ancien Régime (`src/interfaces/` & `src/constants/`)

```text
src/
├── constants/
│   └── enums/                       # ❌ ENUMS FOSSILES : Simples chaînes de transport sans aucune logique métier
│       ├── AuthProviderEnum.ts      # ❌ ENUM TEXTUEL : Risque de valeur sauvage hors protocole de sécurité
│       ├── ContentTypeEnum.ts       # ❌ ENUM TEXTUEL : Simple dictionnaire de chaînes modifiable par accident
│       └── RoleEnum.ts              # ❌ ENUM TEXTUEL : Fuite de privilèges par manipulation de texte brut
├── controllers/
│   └── AppEventController.js        # ❌ FANTÔME COMPILÉ : Fichier JavaScript résiduel polluant l'arborescence source
├── exceptions/                      # ❌ ANARCHIE DES TIROIRS : Silotage abusif masquant la visibilité globale des pannes
│   ├── database/
│   │   └── DatabaseErrorFactory.ts  # ❌ CACHETTE INFRA : Perdu dans son sous-dossier, brise l'alias d'importation unique
│   ├── entities/
│   │   ├── ItemErrorFactory.ts      # ❌ CACHETTE MÉTIER : Splitté artificiellement, complique la maintenance
│   │   ├── ShareErrorFactory.ts     # ❌ CACHETTE MÉTIER : Isolement inutile loin de la racine des anomalies
│   │   ├── TagErrorFactory.ts       # ❌ CACHETTE MÉTIER : Forçait des imports asymétriques pour le Domaine
│   │   └── UserErrorFactory.ts      # ❌ CACHETTE MÉTIER : Masquait la traçabilité unifiée des pannes utilisateur
│   └── security/
│       ├── PasswordError.ts         # ❌ CACHETTE INFRA : Silote la sécurité, multiplie les chemins d'accès
│       └── TokenError.ts            # ❌ CACHETTE INFRA : Complexifie la politique globale des imports d'erreurs
└── interfaces/
    ├── controllers/                 # ❌ EXPOSITION MIXTE : Frontières d'accès privées et publiques confondues
    │   ├── IAppEventAdminController.ts # ❌ CONTRAT ADMIN : Portait des méthodes dépréciées de debug sans garde-fou
    │   ├── IAppEventController.ts   # ❌ CONTRAT AUDIT : Dépouillé, sans aucune documentation d'intention
    │   ├── IAuthController.ts       # ❌ CONTRAT AUTH : Totalement nu, aucune JSDoc pour guider l'infrastructure web
    │   ├── IItemController.ts       # ❌ CONTRAT ITEM : Squelette brut livré sans aucune explication de barrière
    │   ├── IPublicShareController.ts # ❌ POSTE FRONTIÈRE : Noyé dans la masse, sans isolation de politique réseau (ISP)
    │   ├── IShareController.ts      # ❌ CONTRAT SHARE : Copie conforme sans distinction des privilèges d'accès
    │   ├── ITagController.ts        # ❌ CONTRAT TAG : Contrat minimaliste sans charte de scannabilité graphique
    │   └── IUserController.ts       # ❌ CONTRAT USER : Zéro guide documentaire pour l'extraction ou la protection RGPD
    ├── database/
    │   └── IDatabaseConnection.ts   # ❌ ACCÈS BASSE INFRA : Contrat de liaison PostgreSQL nu et sans repère visuel
    ├── entities/                    # ❌ SACS DE PRIMITIVES : Structures passives livrées pieds et poings liés aux strings
    │   ├── event/
    │   │   ├── IAppEvent.ts         # ❌ ACCESSEURS LOGS : Fuite de chaînes primitives sur les catégories et gravités
    │   │   └── IAppEventData.ts     # ❌ STRUCTURE PASSIVE : Entièrement dépendante des enums textuels d'infrastructure
    │   ├── item/
    │   │   ├── IItem.ts             # ❌ ACCESSEURS PÉPITES : Aucun Value Object fort pour protéger l'identité métier
    │   │   └── IItemData.ts         # ❌ DTO SANS ARMURE : { idUser: string } ➔ Risque d'inversion fatale de chaînes
    │   ├── share/
    │   │   ├── IAccessConfig.ts     # ❌ CONFIG ACCÈS : Simple propriété optionnelle perdue sans sémantique temporelle
    │   │   ├── IShare.ts            # ❌ ACCESSEURS PARTAGES : Livrait des primitives brutes au lieu de jetons sécurisés
    │   │   └── IShareData.ts        # ❌ COQUE POLLUÉE : Portait une vilaine faute de frappe typo 'IAAccessConfig'
    │   ├── tag/
    │   │   ├── ITag.ts              # ❌ ACCESSEURS ÉTIQUETTES : Souffrait de la méthode erronée '.getId()' non unifiée
    │   │   └── ITagData.ts          # ❌ DTO SANS ARMURE : { userId: string } ➔ Vulnérable aux inversions d'arguments
    │   └── user/
    │       ├── IUser.ts             # ❌ ACCESSEURS USER : Accesseurs capitalisés sans aucune harmonisation de Domaine
    │       └── IUserData.ts         # ❌ DTO SANS ARMURE : Dictionnaire de métadonnées libres exposé sans contrôle Zod
    ├── IBaseEntityData.ts           # ❌ TYPE DE BASE : Injectait les signatures d'index sans forcer la clé nominale
    │   └── IEntity.ts               # ❌ CONTRAT MÈRE : Limité aux chaînes textuelles, fermait la porte aux objets forts
    ├── http/                        # ❌ VITRINE RÉSEAU : Enveloppes de transport sans aucune explication technique
    │   ├── IApiResponseData.ts      # ❌ ENVELOPPE JSON : Contrat plat sans aucune documentation de parsing prévisible
    │   └── IHandlerService.ts       # ❌ ABSTRACTION PANNE : Simple signature d'intercepteur dénuée de manifeste DIP
    ├── repositories/                # ❌ PERSISTANCE TRONQUÉE : Dépôts ouverts aux quatre vents des chaînes primitives
    │   ├── IAppEventRepository.ts   # ❌ PERSISTANCE LOGS : Signatures d'appels polluées par des strings anonymes
    │   ├── IBaseRepository.ts       # ❌ CRUD GÉNÉRIQUE : Clé primaire bloquée sur 'string', interdisait les Value Objects
    │   ├── IItemRepository.ts       # ❌ PERSISTANCE ITEMS : { userId: string } ➔ Zéro barrière contre les triches d'ID
    │   ├── IItemTagRepository.ts    # ❌ PERSISTANCE JOINTURE : { itemId: string, tagId: string } ➔ Anarchie de typage
    │   ├── IShareRepository.ts      # ❌ PERSISTANCE SHARES : Souffrait de l'héritage par défaut amputé de sa clé forte
    │   └── ITagRepository.ts        # ❌ PERSISTANCE TAGS : Autorisation de tableaux de chaînes brutes non protégés
    ├── security/                    # ❌ SÉCURITÉ SILOTÉE : Abstractions de chiffrement coupées de l'identité du Domaine
    │   ├── IAdditionalInfo.ts       # ❌ INFOS ANOMALIES : Sac de propriétés libres sans aucun commentaire d'audit
    │   ├── IBlacklistService.ts     # ❌ LISTE NOIRE : Signatures limitées aux chaînes textuelles sans ancrage binaire
    │   ├── IPasswordHasher.ts       # ❌ HACHAGE SECRETS : Contrat minimaliste masquant le principe d'isolation DIP
    │   ├── ITokenManager.ts         # ❌ GESTIONNAIRE JWT : Aucune protection contre les falsifications de types amont
    │   └── ITokenPayload.ts         # ❌ CHARGE UTILE : { sub: string } ➔ Fuite majeure de la primitive de clé primaire
    └── services/                    # ❌ CAS D'USAGES INSTABLES : Services applicatifs dépendants des types de transport web
        ├── IAuthService.ts          # ❌ SERVICE AUTH : S'appuyait sur des imports brisés pointant vers /dto/user/auth/
        ├── IItemService.ts          # ❌ SERVICE ITEMS : Forçait l'usage de types primitifs au poste frontière applicatif
        └── IUserExportService.ts    # ❌ SERVICE EXPORT : Signatures bancales mélangeant les types de transport réseau
```

## 🏛️ 2. Les 3 Failles Majeures de l'Ancienne Architecture

### A. L'Enfer des Primitives Volantes (Primitive Obsession)
Dans l'ancienne version, tous les identifiants physiques transitent sous forme de chaînes de caractères `string` brutes. Au niveau de `IItemTagRepository`, la méthode `add(itemId: string, tagId: string)` n'offrait aucune sécurité : inverser par mégarde les deux arguments au sein d'un service provoquait un bug silencieux indétectable par le compilateur.

### B. Le Sabotage du Tiroir Caché des Exceptions
En éparpillant les fabriques d'anomalies dans des sous-dossiers thématiques (`exceptions/entities/`, `exceptions/security/`), l'architecture créait une asymétrie complexe. Les alias d'importation devenaient illisibles (`@/exceptions/entities/UserErrorFactory`) et masquaient la vision globale des pannes sur une même couche technique.

### C. La Rigidité de l'Ancêtre `IBaseRepository`
Le contrat générique de persistance initial fixait par défaut sa clé primaire sur une `string` bas niveau (`TId = string`). Cela empêchait les repositories enfants de s'interfacer proprement avec des types complexes ou des objets de valeur (Value Objects), forçant les implémentations concrètes à manipuler du texte brut PostgreSQL plutôt que des concepts sécurisés du Domaine.
