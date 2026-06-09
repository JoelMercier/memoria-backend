-- ============================================================================
-- 🏺 SCRIPT DE SÉCURITÉ : CRASH-TEST DES 7 GUICHETS DE DICTIONNAIRE [MÉMORIA]
-- Fichier: database/migrations/99 - Crash Test Guichets Dictionnaires.sql
-- Version: 4.2.0 (PostgreSQL 17+)
-- Description: Banc d'essai transactionnel pour la validation du WarmupCache
-- ============================================================================

Set search_path To Public;

-- 👥 1. Test du placard des Rôles (Attendu : CUST, ADMN, SADM...)
Select * From "TousLesRoles"();

-- 📂 2. Test du placard des Catégories d'Événements (Attendu : MONI, ANAL, AUDI, RGPD...)
Select * From "ToutesLesCategories"();

-- 📦 3. Test du placard des Formats de Pépites (Attendu : NOTE, ARTI, BOOK, PODC, VIDE...)
Select * From "TousLesFormats"();

-- 🔌 4. Test du placard des Fournisseurs d'Accès (Attendu : LOCA, GOOG, AZUR, APPL...)
Select * From "TousLesFournisseurs"();

-- ⚠️ 5. Test du placard des Sévérités d'Incidents (Attendu : INFO, WARN, ERRO, CRIT...)
Select * From "ToutesLesSeverites"();

-- 💻 6. Test du placard des Contextes d'Audit V4 (Attendu : AUTH, PEPI, SYST, RGPD...) [NEW V4]
Select * From "TousLesContextes"();

-- ⚙️ 7. Test du placard des Actions d'Audit V4 (Attendu : CONN, ECHE, CREA, PURG...) [NEW V4]
Select * From "ToutesLesActions"();
