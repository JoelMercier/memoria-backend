# 🗺️ Mémoria - Catalogue Permanent de l'Arsenal de Cour Basse (V4 Pro)

**Description :** Inventaire souverain et étanche des 19 turbines industrielles PL/pgSQL scellées en base de données. Cet arsenal foudroie définitivement l'utilisation du SQL volant dans le Domaine et garantit une étanchéité relationnelle absolue adossée aux index UUID natifs (128 bits).

---

## 👥 1. Le Coffre des Acteurs (`UserRepository` ➔ 4 Turbines)

Dédié à la gestion, à la traçabilité cryptographique et à la décontamination réglementaire du fichier des acteurs.

*   `public."CreerActeur"` ──➔ **[C]** Injection sécurisée à l'Argon2id avec normalisation du courriel et arbitrage automatique du rôle par défaut (`CUST`) via le bit `roDefaut`.
*   `public."ModifierActeur"` ──➔ **[U]** Mutation partielle dynamique (`Coalesce`) des profils avec recalcul automatique et réalignement sur les bits par défaut d'infrastructure.
*   `public."TousLesActeursDuChateau"` ──➔ **[R]** Extraction d'IHM administrative paginée avec fenêtrage analytique `Count(*) Over()` pour le calcul instantané du volume total.
*   `public."AnonymiserActeurSysteme"` ──➔ **[D]** Décontamination RGPD irréversible. Applique la doctrine de l'Acteur Fantôme : brise le secret Argon2id et vide les métadonnées textuelles, mais maintient les pointeurs d'audit intacts pour sauver les index et les statistiques.

---

## 📦 2. Le Coffre des Pépites (`ItemRepository` ➔ 6 Turbines)

Dédié à la manipulation et à la fouille textuelle rapide du tas physique des connaissances sémantiques.

*   `public."CreerPepite"` ──➔ **[C]** **[NOUVEAU V4]** Insertion nominale d'une ressource avec normalisation stricte du slug en minuscules de soute et libellé franconien (`itLibelle`).
*   `public."ModifierPepite"` ──➔ **[U]** **[NOUVEAU V4]** Révision partielle ou complète sécurisée du sac JSONB de métadonnées et du tas textuel libre.
*   `public."DetruirePepite"` ──➔ **[D]** **[NOUVEAU V4 - Frappe Orbitale]** Éradication destructive complète. Balaie de manière transactionnelle les pivots liés dans `ItemTags` et les permaliens dans `Shares` avant de désintégrer la ligne physique pour neutraliser tout crash d'intégrité.
*   `public."ToutesLesPepites"` ──➔ **[R]** Lecture multiple filtrée (par mots-clés et types) et paginée pour le flux personnel de l'acteur connecté.
*   `public."RechercherPepitesActeur"` ──➔ **[R]** Radar textuel localisé ultra-rapide agissant sous cordon sanitaire (moteur de recherche interne par acteur).
*   `public."ToutesLesPepitesDuChateau"` ──➔ **[R]** Rapatriement extensif paginé pour l'administration, exempt de barrière d'ownership.

---

## 🔗 3. Le Coffre des Partages (`ShareRepository` ➔ 5 Turbines)

Dédié à l'ouverture et au contrôle d'accès des passerelles URL-Safe de consultation externe.

*   `public."CreerPartage"` ──➔ **[C]** Injection des zones jumelles graphiques auto-complétées (`shAccesJeton`, `shAccesConfig`) avec scellage par défaut de la date d'éternité système à 100 ans (année `2126`).
*   `public."ModifierPartage"` ──➔ **[U]** Révision partielle des adresses de courriels destinataires et des droits d'accès JSONB.
*   `public."RevoquerPartage"` ──➔ **[D]** Coupe-circuit destructeur immédiat d'un lien de partage.
*   `public."TrouverPartageParId"` ──➔ **[R]** Tir laser indexé extrayant une passerelle unique via sa clé primaire binaire UUID.
*   `public."TrouverPartageParJeton"` ──➔ **[R]** Contrôle d'accès chirurgical au clic sur le permalien d'URL (Match sur l'index unique `shAccesJeton`).

---

## 🏷️ 4. Le Coffre des Liaisons (`TagRepository` ➔ 4 Turbines)

Dédié à l'indexation matricielle et à la gestion différentielle des croisements N <=> N.

*   `public."CreerTag"` ──➔ **[C]** Création stricte et normalisée en minuscules (`Lower(Trim())`) pour honorer les contraintes physiques de vérification.
*   `public."LierEtiquette"` ──➔ **[C]** Association unitaire idempotente avec clause `On Conflict` redressée au micron sur l'ordre de la clé primaire (`tiItemId`, `tiTagId`).
*   `public."SynchroniserLesEtiquettes"` ──➔ **[U]** Serrure transactionnelle matricielle différentielle. Calcule les entrants et les sortants en un seul cycle machine via `unnest()` sans ouvrir de curseur paresseux en RAM. Preserve le `CreatedAt` des liaisons inchangées.
*   `public."LireEtiquettesActeurAvecCompte"` ──➔ **[R]** Agrégateur d'IHM affichant le dictionnaire complet de l'acteur connecté avec le volume de pépites associé à chaque tag.
*   `public."EtiquettesDunePepite"` ──➔ **[R]** Extraction relationnelle d'élite des mots-clés rattachés à une ressource, ordonnés par libellé franconien.
