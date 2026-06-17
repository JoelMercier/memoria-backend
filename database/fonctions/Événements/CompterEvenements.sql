-- ——— fichier : database\fonctions\Événements\CompterEvenements.sql

-- ============================================================================
-- 🚨 INFRASTRUCTURE : DÉNOMBREMENT ESTIMATIF INSTANTANÉ DE LA TABLE EVENTS
-- Version: 4.2.0 (PostgreSQL 17+)
-- Description: Lecture immédiate du catalogue pg_class sans Sequential Scan.
--              Sécurisé par SECURITY DEFINER pour le rôle restreint de Mémoria.
-- Auteur & Vision : Joël (C++ Framework Architect)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."CompterEvenements"();

Create Or Replace Function public."CompterEvenements"()
Returns Bigint As $$
Declare
    l_nEstimation Bigint;
Begin
    -- Extraction immédiate depuis les statistiques système (0,0001 ms)
    Select Coalesce(Floor(reltuples)::Bigint, 0) Into l_nEstimation
    From pg_class
    Where relname = 'Events';

    Return l_nEstimation;
End;
$$ Language plpgsql Stable Security Definer; -- 🔒 Autorise le rôle Mémoria à lire l'estimation.

Comment On Function public."CompterEvenements"() Is 'Calcule instantanément la volumétrie estimée des journaux d''audit via le catalogue pg_class.';
