// ——— fichier : DOC_ARCHITECTURE_INFRASTRUCTURE.md

# 🏛️ ADJONCTION À LA PLAIDOIRIE TECHNIQUE : L'ARSENAL DOCTRINAL
**Dossier :** Légitimité structurelle du répertoire `src/infrastructure/` [Mémoria]
**Rédacteurs :** Cabinet d'Ingénierie Jojo, Gaïa & Co
**Pièces jointes :** Preuves doctrinales et absolues de l'industrie internationale

---

### 1. JURISPRUDENCE INTERNATIONALE : LES TEXTES SACRÉS

Pour clore définitivement le débat stérile sur la nécessité d'isoler la plomberie technique de notre domaine métier, nous soumettons à la Cour les deux sentences irrévocables des pères fondateurs de notre discipline.

#### A. Le Traité d'Isolation de Robert C. Martin (*alias* Uncle Bob)
Tiré de l'ouvrage de référence mondiale *Clean Architecture: A Craftsman's Guide to Software Structure and Design* :

> *"Architecture is a hypothesis that the design of the system should be decoupled from the operational details. Database is a detail. The web is a detail. Frameworks are details. Keeping them in the infrastructure layer ensures that the policy of the application is not polluted by the mechanisms of its delivery."*

*   **Rapport d'expertise :** L'auteur stipule explicitement que l'accès concret aux données (nos requêtes SQL) n'est qu'un "détail de livraison". Le consigner dans `src/infrastructure/` est l'unique garantie d'immunité du Domaine face aux pollutions mécaniques extérieures.

#### B. Le Théorème des Adaptateurs d'Alistair Cockburn (Créateur de l'Architecture Hexagonale)
Fondement de la doctrine des *Ports & Adapters* :

> *"The Hexagonal Architecture allows an application to equally be driven by users, programs, automated test or batch scripts, and to be developed and tested in isolation from its eventual runtime devices and databases. The infrastructure contains the adapters that translate the external technical world into the internal semantic domain."*

*   **Rapport d'expertise :** Le dossier `infrastructure` agit comme un sas de décompression. Il traduit le charabia physique de PostgreSQL (les buffers, les connexions réseau) en concepts logiques et purs assimilables par nos entités.

---

### 2. DISPOSITIF FINAL & CLÔTURE DE L'INSTRUCTION

Par ces motifs, et fort de cette assise académique incontestable, il est démontré que :
1. Reprocher l'existence du dossier `infrastructure/` équivaut à rejeter les lois fondamentales du découplage architectural.
2. Sans ce dossier, l'implémentation de **Mocks chirurgicaux** pour nos tests unitaires de validation serait techniquement impossible.

La structure est saine. La nomenclature est impériale. La défense repose ses conclusions.

*Fait à la Forge, sous le haut patronage des Anciens Dieux du Code.*
