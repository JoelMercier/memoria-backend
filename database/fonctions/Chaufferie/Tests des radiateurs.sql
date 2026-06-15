-- ============================================================================
-- 🏺 SCRIPT DE SÉCURITÉ : CRASH-TEST DES 8 GUICHETS DE DICTIONNAIRE [MÉMORIA]
-- Fichier: database/migrations/99 - Crash Test Guichets Dictionnaires.sql
-- Version: 4.2.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Banc d'essai transactionnel pour la validation du WarmupCache
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🎛️ BATTERIE DE TESTS : EXTRATEURS ET VERROUS DE BOOT EN LIGNE DROITE
-- ----------------------------------------------------------------------------

-- 👥 1. Test du placard des Rôles (Attendu : roIdRole, roLibelle, roNiveau, roOrdreAff, roDefaut)
Select * From public."TousLesRoles"();

-- 📂 2. Test du placard des Catégories d'Événements (Attendu : caIdCategory, caLibelle, caOrdreAff, caDefaut)
Select * From public."ToutesLesCategories"();

-- 📦 3. Test du placard des Formats de Pépites (Attendu : ctIdContentType, ctLibelle, ctOrdreAff, ctDefaut)
Select * From public."TousLesFormats"();

-- 🔌 4. Test du placard des Fournisseurs d'Accès (Attendu : prIdProvider, prLibelle, prOrdreAff, prDefaut)
Select * From public."TousLesFournisseurs"();

-- ⚠️ 5. Test du placard des Sévérités d'Incidents (Attendu : seIdSeverity, seLibelle, seNiveau, seOrdreAff, seDefaut)
Select * From public."ToutesLesSeverites"();

-- 💻 6. Test du placard des Secteurs Fonctionnels (Attendu : scIdSecteur, scLibelle, scOrdreAff, scDefaut) [RÉPARÉ V4]
Select * From public."TousLesSecteurs"();

-- ⚙️ 7. Test du placard des Actions d'Audit (Attendu : acIdAction, acLibelle, acOrdreAff, acDefaut) [RÉPARÉ V4]
Select * From public."ToutesLesActions"();

-- 🎛️ 8. Test du régulateur virtuel des Directives de Tri (Attendu : otIdCode, otLibelle, otClauseSql, otOrdreAff, otDefaut) [NEW V4]
Select * From public."TousLesOrdresTri"();
