# 🗺️ Carte des Routes de l'API [Mémoria] — v1

Ce document dresse l'inventaire complet des points d'accès (endpoints) HTTP Express de la plateforme. Toutes les routes (sauf mention contraire) sont protégées par l'armure de l'**`AuthMiddleware`** et exigent un jeton d'accès valide (`Authorization: Bearer <token>`).

---

## 🔐 1. Module Authentification (`/v1/auth`)
*Géré par `AuthController` • Routeur : `auth.routes.ts`*


| Verbe | Route | Sécurité | Description / Payload |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/v1/auth/register` | 🔓 Public | Inscription nominale d'un nouvel utilisateur dans le système.<br>*Payload: `{ email, password, pseudo, gdprConsent }`* |
| **`POST`** | `/v1/auth/login` | 🔓 Public | Ouverture de session (Émission du couple Access/Refresh tokens).<br>*Payload: `{ email, password }`* |
| **`POST`** | `/v1/auth/refresh` | 🔓 Public | Rotation et régénération des jetons d'accès via le Refresh Token.<br>*Payload: `{ refreshToken }`* |
| **`POST`** | `/v1/auth/logout` | 🛡️ Protégé | Révocation asynchrone de la session (Blacklist des jetons en cours).<br>*Payload: `{ refreshToken }`* |
| **`GET`** | `/v1/auth/me` | 🛡️ Protégé | Récupération autonome de la fiche d'identité de l'utilisateur connecté. |

---

## 👥 2. Module Utilisateurs & RGPD (`/v1/users`)
*Géré par `UserController` • Routeur : `user.routes.ts`*


| Verbe | Route | Sécurité | Description / Payload |
| :--- | :--- | :--- | :--- |
| **`PATCH`** | `/v1/users/me` | 🛡️ Protégé | Modification des informations de profil ou de contact.<br>*Payload (partiel): `{ pseudo, email, settingsUser }`* |
| **`PUT`** | `/v1/users/me/password` | 🛡️ Protégé | Renouvellement sécurisé du secret d'accès (Mot de passe).<br>*Payload: `{ currentPassword, newPassword }`* |
| **`DELETE`**| `/v1/users/me` | 🛡️ Protégé | Purge destructive légale du compte (FK CASCADE sur l'empreinte).<br>*Payload: `{ password }`* |
| **`GET`** | `/v1/users/me/export` | 🛡️ Protégé | Extraction transactionnelle complète pour portabilité RGPD (Art. 20).<br>*Renvoie un dump JSON plat et force un téléchargement de fichier.* |

---

## 📦 3. Module Pépites (`/v1/items`)
*Géré par `ItemController` • Routeur : `item.routes.ts`*


| Verbe | Route | Sécurité | Description / Query / Payload |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/v1/items` | 🛡️ Protégé | Liste paginée et filtrée des pépites de l'utilisateur connecté.<br>*Query params: `limit`, `offset`, `contentType`, `search`* |
| **`POST`** | `/v1/items` | 🛡️ Protégé | Création et indexation d'une nouvelle pépite d'or.<br>*Payload: `{ contentType, title, slug?, content, sourceAuthor?, tagIds? }`* |
| **`GET`** | `/v1/items/:id` | 🛡️ Protégé | Extraction chirurgicale d'une pépite unique par son ID (avec ses tags). |
| **`PATCH`** | `/v1/items/:id` | 🛡️ Protégé | Mise à jour partielle d'une pépite et synchronisation de ses étiquettes. |
| **`DELETE`**| `/v1/items/:id` | 🛡️ Protégé | Suppression d'une pépite (Entraîne la révocation des partages associés). |

---

## 🏷️ 4. Module Étiquettes (`/v1/tags`)
*Géré par `TagController` • Routeur : `tag.routes.ts`*


| Verbe | Route | Sécurité | Description / Payload |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/v1/tags` | 🛡️ Protégé | Extraction de la collection complète des tags de l'utilisateur par ordre alphabétique. |
| **`POST`** | `/v1/tags` | 🛡️ Protégé | Engendre et persiste un nouveau Tag au sein de l'espace de l'appelant.<br>*Payload: `{ tagName }`* |
| **`GET`** | `/v1/tags/:id` | 🛡️ Protégé | Récupération d'un tag spécifique après double validation de propriété. |
| **`PATCH`** | `/v1/tags/:id` | 🛡️ Protégé | Application d'une correction de libellé avec pré-vérification d'unicité.<br>*Payload: `{ tagName }`* |
| **`DELETE`**| `/v1/tags/:id` | 🛡️ Protégé | Suppression destructive d'un tag (Déconnecte le tag de toutes ses pépites). |

---

## 🔗 5. Module Partages Authentifiés (`/v1/shares`)
*Géré par `ShareController` • Routeur : `share.routes.ts`*


| Verbe | Route | Sécurité | Description / Payload |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/v1/shares` | 🛡️ Protégé | Liste l'intégralité des partages configurés et détenus par l'utilisateur. |
| **`POST`** | `/v1/shares` | 🛡️ Protégé | Génère un lien de partage sécurisé et immuable pour une pépite donnée.<br>*Payload: `{ itemId, recipientEmail?, accessConfig: { expiresAt? } }`* |
| **`GET`** | `/v1/shares/:id` | 🛡️ Protégé | Extrait le détail complet d'une restriction d'accès ou d'un destinataire. |
| **`PATCH`** | `/v1/shares/:id` | 🛡️ Protégé | Modifie à la volée la configuration, le mail cible ou la date d'expiration. |
| **`DELETE`**| `/v1/shares/:id` | 🛡️ Protégé | Révocation définitive d'un lien de partage (L'URL publique devient obsolète). |

---

## 🌐 6. Passerelle Publique Anonyme (`/v1/public`)
*Géré par `PublicShareController` • Routeur : `public.routes.ts`*


| Verbe | Route | Sécurité | Description |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/v1/public/shared/:token` | 🔓 Public | **Accès anonyme de consultation.** Localise et affiche une pépite via son jeton d'URL.<br>*Sécurité: Vérifie la date d'expiration. Purge tous les identifiants techniques (IDs) avant l'envoi sur le réseau.* |
