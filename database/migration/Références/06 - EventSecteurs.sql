-- ============================================================================
-- 📦 Mémoria - EventSecteurs
-- Fichier: database/migrations/06 - Table EventSecteurs.sql
-- Version: 3.2.0 (PostgreSQL 17+)
-- Description: Dictionnaire des Secteurs fonctionnels d'audit - Jojo-Style
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🏛️ 1. La structure physique et l'alignement des blocs (Zéro bits vides)
-- ----------------------------------------------------------------------------
Drop Table if Exists "EventSecteurs";

Create Table "EventSecteurs" (
    "esCreatedAt" Timestamp Not Null Default Current_Timestamp, -- 8 octets fixes
    "esUpdatedAt" Timestamp,                                    -- 8 octets fixes
    "esIdSecteur" Char(4) Not Null,                             -- 4 octets fixes (Quadrigramme unique)
    "esOrdreAff"  Smallint Not Null,                            -- 2 octets fixes (Ordre d'affichage)
    "esName"      Varchar(50) Not Null,                         -- Variable (Ferme la marche)

    Constraint "EventSecteurs_esIdSecteur Primary Key ("esIdSecteur"),

    Constraint "EventSecteurs_esName_Udx"     Unique ("esName"),
    Constraint "EventSecteurs_esOrdreAff_Udx" Unique ("esOrdreAff"),

    Constraint "EventSecteurs_esIdSecteur_Chk" Check ("esIdSecteur" = Upper("esIdSecteur")),
    Constraint "EventSecteurs_esOrdreAff_Chk"  Check ("esOrdreAff" >= 0)
);

-- ----------------------------------------------------------------------------
-- ⚡ 2. Le déclencheur universel dynamique
-- ----------------------------------------------------------------------------
Create Trigger "EventSecteurs_TraceModifs_Trg"
Before Update on "EventSecteurs"
For Each Row Execute Function "TraceModif"('esUpdatedAt');

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment on Table "EventSecteurs" is 'Dictionnaire centralisé des Secteurs fonctionnels (périmètres applicatifs) pour le journal d''audit.';

Comment on Column "EventSecteurs"."esCreatedAt" is 'Horodatage système automatique de la création du Secteur en base.';
Comment on Column "EventSecteurs"."esUpdatedAt" is 'Horodatage système automatique de la modification via le trigger TraceModif.';
Comment on Column "EventSecteurs"."esIdSecteur" is 'Quadrigramme fixe unique et en majuscules servant de clé primaire (ex: SYST, UTIL).';
Comment on Column "EventSecteurs"."esOrdreAff"  is 'Position numérique unique pour le tri logique des listes déroulantes de l''interface.';
Comment on Column "EventSecteurs"."esName"      is 'Libellé descriptif complet du Secteurs fonctionnel (ex: Système, Utilisateur).';

-- -------------------------------------------------------------------------------
-- 🏺 4. Script d'ensemencement initial (Alignement parfait avec vos logs existants)
-- -------------------------------------------------------------------------------
Insert Into "EventSecteurs" ("esOrdreAff", "esIdSecteur", "esName") Values
(10, 'SYST', 'Système'          ), -- Ex: systeme.demarrage
(20, 'UTIL', 'Utilisateur'      ), -- Ex: utilisateur.enregistrement
(30, 'AUTH', 'Authentification' ), -- Ex: authentification.echec
(40, 'PEPI', 'Pépite'           ), -- Ex: pepite.creation / partage
(50, 'BASE', 'Base de données'  ), -- Ex: bd.requete_lente
(60, 'RGPD', 'RGPD'             )  -- Ex: rgpd.exportation
On Conflict Do Nothing;
