-- ============================================================================
-- 🏺 SCRIPT DE SÉCURITÉ : CRASH-TEST DES 5 GUICHETS DE DICTIONNAIRE [MÉMORIA]
-- ============================================================================

-- 👥 1. Test du placard des Rôles (Attendu : CUST, ADMN, SADM...)
Select * From "TousLesRoles"();

-- 📊 2. Test du placard des Catégories d'Événements (Attendu : MONI, ANAL, AUDI, RGPD...)
Select * From "ToutesLesCategories"();

-- 📦 3. Test du placard des Formats de Pépites (Attendu : NOTE, ARTI, BOOK, PODC, VIDE...)
Select * From "TousLesFormats"();

-- 🔌 4. Test du placard des Fournisseurs d'Accès (Attendu : LOCA, GOOG, AZUR, APPL...)
Select * From "TousLesFournisseurs"();

-- 🚨 5. Test du placard des Sévérités d'Incidents (Attendu : INFO, WARN, ERRO, CRIT...)
Select * From "ToutesLesSeverites"();
