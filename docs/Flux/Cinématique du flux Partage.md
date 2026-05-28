# 🛤️ Rétro-Ingénierie — Cinématique du Flux Partage (Share)
> **Auteur :** @author Joël, Gaïa & Co
> **Composant :** Génération de jetons URL-Safe, Sécurité des accès invités et Ségrégation des Frontières

Ce manifeste détaille le double cycle de vie technique du module de partage : la création sécurisée par un acteur authentifié et la consultation anonyme par un invité externe.

---

## 🗺️ 1. Diagramme Linéaire des Deux Frontières du Partage

Le module Share orchestre deux cinématiques totalement indépendantes à travers l'Hexagone :

### Flux A : Création Privée (Acteur Authentifié)
```text
[ POST /v1/shares ] ➔ JSON brut (itemId, recipientEmail, accessConfig)
      │
      ▼ (Validation du payload par ShareValidation.validateCreate)
[ CreateShareDto ] ➔ Emballage et isolation de la requête HTTP
      │
      ▼ (L'identifiant req.user.id arrive déjà armé en tant que UserId via express.d.ts)
[ ShareService.create(userId, dto) ] ➔ Déclenche les verrous de sécurité :
      │   ├── 1. Vérifie l'existence et l'ownership de la Pépite (itemRepository.findById)
      │   │      └── Si l'acteur triche ➔ 🚨 throw ItemErrorFactory.accessDenied()
      │   └── 2. Allocation d'entropie cryptographique : ShareTokenGenerator.generate()
      │
      ▼ (L'identifiant primaire idShare est mis à undefined ➔ Géré par PostgreSQL)
[ PgShareRepository.create ] ➔ Sac de données passif IShareData persisté
      │
      ▼ 🐘 Insertion SQL (DatabaseConnection) ➔ Stocke le token et le JSONB de restriction
[ Base de Données PostgreSQL ]
```

### Flux B : Consultation Publique Anonyme (Passerelle Invité)
```text
[ GET /v1/public/shares/:token ] ➔ Un utilisateur anonyme clique sur le lien d'invitation
      │
      ▼ (Le contrôleur isolé IPublicShareController intercepte la chaîne textuelle brute)
[ ShareService.findItemByToken(token) ] ➔ Point d'ancrage de la passerelle publique :
      │   ├── 1. Localise le partage via sa signature : shareRepository.findByToken(token)
      │   │      └── Si introuvable ➔ 🚨 throw ShareErrorFactory.notFound(token)
      │   ├── 2. Contrôle de validité temporelle : share.isExpired()
      │   │      └── Si horodatage dépassé ➔ 🚨 throw ShareErrorFactory.expired(token)
      │   └── 3. Extrait l'atome racine masqué : itemRepository.findById(share.getItemId())
      │
      ▼ (L'entité Item vivante et riche est renvoyée au contrôleur public)
[ ResponseItemDto.fromItem(item) ] ➔ Formate et livre la Pépite au client sans aucune fuite d'infra
```

---

## 🧱 2. Le Rôle des Périphériques sur le Flux `Share`

### 🔑 La Machine à Entropie URL-Safe (`ShareTokenGenerator`)
Pour éviter que des utilisateurs malveillants ne devinent les liens de partage par force brute (*IDOR attacks*), le périphérique `ShareTokenGenerator` alloue **24 octets de pur hasard binaire** (`randomBytes`) via le module natif `node:crypto`. Le résultat est sérialisé en encodage `base64url`. Cette signature d'environ 32 caractères offre ≈192 bits d'entropie, exclut les caractères perturbateurs (`+`, `/`) et s'injecte directement dans les URLs sans sauter.

### 🎛️ Le Coffre Temporaire JSONB (`IAccessConfig`)
Les restrictions du partage (date d'expiration, mot de passe éventuel, nombre maximal de lectures autorisées) ne polluent pas la structure de la table SQL. Elles sont encapsulées dans un bloc JSON passif typé par `IAccessConfig` et stockées dans une colonne de type **JSONB** dans PostgreSQL. L'entité `Share.ts` s'occupe de lire ce dictionnaire à l'exécution pour valider la méthode `share.isExpired()`.

---

## 🏛️ 3. Vérité d'Atelier : La Ségrégation des Interfaces Publiques

Pour clouer définitivement le bec aux débats de la salle de cours sur la sécurité des partages :

L'ancienne architecture mélangeait les routes publiques et privées dans un même contrôleur, créant un risque majeur de fuite de privilèges. La version actuelle applique le principe **SOLID `ISP` (Interface Segregation Principle)** :
*   Les actions d'administration (créer, lister, modifier un partage) dépendent de `IShareController` et exigent le middleware d'authentification JWT.
*   L'accès invité dépend de **`IPublicShareController`**, une interface totalement isolée, ouverte aux utilisateurs anonymes, et sur laquelle on peut brancher un *rate-limiting* ultra-agressif pour bloquer les robots qui tenteraient de scanner tes tokens d'URL.

Le Domaine reste pur, la frontière publique est étanche, et l'architecture est royale !
