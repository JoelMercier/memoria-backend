# 📊 Modélisation Graphique des Flux — Mémoria Backend
> **Auteur :** @author Joël, Gaïa & Co
> **Format :** Cartographie Visuelle des Couches & États

---

## 🗺️ 1. Matrice des Flux : De la Requête Brute à la Persistance

```text
  [ CLIENT WEB ]  ➔ Requête HTTP POST /v1/items
        │
        ▼  (Frontière Réseau Express : helmet, cors, rate-limit)
 ┌──────────────┐
 │  POSTE DE    │ ➔ RequestIdGenerator.generate() [UUID unique de corrélation]
 │  CONTRÔLE    │ ➔ Douane Zod : ItemValidation.validateCreate
 └──────┬───────┘     └── ❌ [ Rejet 400 Bad Request ] ➔ HandlerService
        │
        ▼  (Données épurées et structurées)
 ┌──────────────┐
 │  FRONTIÈRE   │ ➔ Instanciation de la coque de transport : CreateItemDto
 │  TRANSPORT   │ ➔ ItemController.create()
 └──────┬───────┘     └── Extraction de l'identité : userMetierId = req.user.id (UserId)
        │
        ▼  (Passage de frontière : userMetierId.valeur)
 ┌──────────────┐
 │  CŒUR LOGIC  │ ➔ ItemService.create()
 │  DU DOMAINE  │ ➔ Génération du permalien : SlugGenerator.generate()
 └──────┬───────┘ ➔ Armure nominale : validateTagOwnership(domainTagIds)
        │             └── ❌ [ Rejet 403 Access Denied ] ➔ TagErrorFactory
        │
        ▼  (Payload encapsulé : data = IItemData)
 ┌──────────────┐
 │ PERSISTANCE  │ ➔ PgItemRepository.create()
 │ POSTGRESQL   │ ➔ Synchronisation de masse : ItemTagRepository.sync()
 └──────┬───────┘
        │
        ▼  (Dialogue SQL via IDatabaseConnection)
  [ BASE DE DONNÉES ] ➔ Insertions atomiques : tables "items" & pivot "item_tags"
```

---

## 🏛️ 2. Évolution de l'Armure Nominale : Cycle de Transformation de la Donnée

Ce schéma illustre comment une simple chaîne de caractères vulnérable se transforme en un objet métier protégé avant de finir sérialisée proprement.

```text
 🧭 ENTRÉE (Réseau Web)          🧠 DOMAINE (Sécurisé)            🐘 SORTIE (Persistance SQL)
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  req.body.title         │     │  Item.title             │     │  items.title            │
│  "Ma Super Pépite"      │➔➔ │  "Ma Super Pépite"      │➔➔➔│  VARCHAR(255)           │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
             │                               │                               │
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  req.user.id            │     │  new UserId(id)         │     │  items.id_user          │
│  "8a3b-..." (string)    │➔➔ │  [Objet Nominal Fort]   │➔➔➔│  UUID (Clé Étrangère)   │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
                                             │
                                             ▼ (Comparaison sémantique étanche)
                                  item.idUser.valeur === actorId.valeur
```

---

## 📦 3. Ségrégation des Frontières : Privé vs Public (ISP)

Pour impressionner la salle de cours, voici le schéma d'isolation strict de ta plomberie réseau. Les deux flux ne se croisent jamais.

```text
🔒 ZONE PRIVÉE (Authentifiée par Token Bearer)
 ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
 │  Client Web  │ ➔➔  │  IShareCtrl  │ ➔➔ │ IShareService│ ➔➔ │ PgShareRepository│
 └──────────────┘      └──────────────┘      └──────────────┘      └──────────────────┘
                         [Édition]             [.create()]            [Insert SQL]

🔓 ZONE PUBLIQUE (Anonyme via lien d'invitation URL-Safe)
 ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
 │ Invité Exte  │ ➔➔ │ IPublicCtrl  │ ➔➔  │ IShareService│ ➔➔ │ PgItemRepository │
 └──────────────┘      └──────────────┘      └──────────────┘      └──────────────────┘
                         [Consultation]        [.findItem...]         [Select Item SQL]
                                               └── ⏱️ share.isExpired()
```
