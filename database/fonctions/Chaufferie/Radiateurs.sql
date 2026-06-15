-- ============================================================================
-- 🏺 INFRASTRUCTURE D'ÉLITE [MÉMORIA] - VERSION FINALE DES GUICHETS DICTIONNAIRES
-- Fichier: database/functions/TousLesGuichetsDictionnaire.sql
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Centralisation des extracteurs de boot pour l'hydratation des SmartEnums
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🪓 FONCTION STOCKÉE 1 : Les Rôles
-- ----------------------------------------------------------------------------
Drop Function if exists public."TousLesRoles"();

Create Or Replace Function public."TousLesRoles"()
Returns Table(
    "roIdRole"   Char(4),
    "roLibelle"  Varchar(50),                                   -- [RÉPARÉ V4] Éradication définitive de roName.
    "roNiveau"   Integer,
    "roOrdreAff" Integer,
    "roDefaut"   Boolean                                        -- [RÉPARÉ V4] Injection du bit de repli nominal.
) as $$
Begin
    Return Query
    Select
        "Roles"."roIdRole",
        "Roles"."roLibelle",
        "Roles"."roNiveau"::Integer,
        "Roles"."roOrdreAff"::Integer,
        "Roles"."roDefaut"
    From public."Roles"
    Order By "Roles"."roOrdreAff" Asc;
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."TousLesRoles"() Is '🗄️ Guichet d''infrastructure officiel renvoyant l''intégralité du dictionnaire des rôles applicatifs pour hydratation de la RAM [Mémoria].';


-- ----------------------------------------------------------------------------
-- 🪓 FONCTION STOCKÉE 2 : Les Catégories d'Événements
-- ----------------------------------------------------------------------------
Drop Function if exists public."ToutesLesCategories"();

Create Or Replace Function public."ToutesLesCategories"()
Returns Table(
    "caIdCategory" Char(4),                                     -- [RÉPARÉ V4] Aligné sur la table Categories.
    "caLibelle"    Varchar(50),                                 -- [RÉPARÉ V4] Éradication définitive de ecName.
    "caOrdreAff"   Integer,
    "caDefaut"     Boolean                                      -- [RÉPARÉ V4] Injection du bit de repli nominal.
) as $$
Begin
    Return Query
    Select
        "Categories"."caIdCategory",
        "Categories"."caLibelle",
        "Categories"."caOrdreAff"::Integer,
        "Categories"."caDefaut"
    From public."Categories"                                    -- [RÉPARÉ V4] Ciblage de la nouvelle table francisée.
    Order By "Categories"."caOrdreAff" Asc;
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."ToutesLesCategories"() Is '🗄️ Guichet d''infrastructure officiel renvoyant l''intégralité des catégories du journal d''audit pour le monitoring système [Mémoria].';


-- ----------------------------------------------------------------------------
-- 🪓 FONCTION STOCKÉE 3 : Les Formats de Pépites (Content Types)
-- ----------------------------------------------------------------------------
Drop Function if exists public."TousLesFormats"();

Create Or Replace Function public."TousLesFormats"()
Returns Table(
    "ctIdContentType" Char(4),
    "ctLibelle"       Varchar(50),                              -- [RÉPARÉ V4] Éradication définitive de ctName.
    "ctOrdreAff"      Integer,
    "ctDefaut"        Boolean                                   -- [RÉPARÉ V4] Injection du bit de repli nominal.
) as $$
Begin
    Return Query
    Select
        "ContentTypes"."ctIdContentType",
        "ContentTypes"."ctLibelle",
        "ContentTypes"."ctOrdreAff"::Integer,
        "ContentTypes"."ctDefaut"
    From public."ContentTypes"
    Order By "ContentTypes"."ctOrdreAff" Asc;
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."TousLesFormats"() Is '🗄️ Guichet d''infrastructure officiel renvoyant les formats de structures sémantiques autorisés pour le stockage des pépites [Mémoria].';


-- ----------------------------------------------------------------------------
-- 🪓 FONCTION STOCKÉE 4 : Les Fournisseurs d'Accès
-- ----------------------------------------------------------------------------
Drop Function if exists public."TousLesFournisseurs"();

Create Or Replace Function public."TousLesFournisseurs"()
Returns Table(
    "prIdProvider" Char(4),                                     -- [RÉPARÉ V4] Aligné sur la table Providers pr.
    "prLibelle"    Varchar(50),                                 -- [RÉPARÉ V4] Éradication définitive de apName.
    "prOrdreAff"   Integer,
    "prDefaut"     Boolean                                      -- [RÉPARÉ V4] Injection du bit de repli nominal.
) as $$
Begin
    Return Query
    Select
        "Providers"."prIdProvider",
        "Providers"."prLibelle",
        "Providers"."prOrdreAff"::Integer,
        "Providers"."prDefaut"
    From public."Providers"                                     -- [RÉPARÉ V4] Ciblage de la nouvelle table francisée.
    Order By "Providers"."prOrdreAff" Asc;
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."TousLesFournisseurs"() Is '🗄️ Guichet d''infrastructure officiel renvoyant les protocoles et fournisseurs d''identités légitimes pour l''authentification [Mémoria].';


-- ----------------------------------------------------------------------------
-- 🪓 FONCTION STOCKÉE 5 : Les Sévérités d'Incidents
-- ----------------------------------------------------------------------------
Drop Function if exists public."ToutesLesSeverites"();

Create Or Replace Function public."ToutesLesSeverites"()
Returns Table(
    "seIdSeverity" Char(4),
    "seLibelle"    Varchar(50),                                 -- [RÉPARÉ V4] Éradication définitive de seName.
    "seNiveau"     Integer,                                     -- Poids de comparaison numérique machine conservé.
    "seOrdreAff"   Integer,
    "seDefaut"     Boolean                                      -- [RÉPARÉ V4] Injection du bit de repli nominal.
) as $$
Begin
    Return Query
    Select
        "Severites"."seIdSeverity",
        "Severites"."seLibelle",
        "Severites"."seNiveau"::Integer,
        "Severites"."seOrdreAff"::Integer,
        "Severites"."seDefaut"
    From public."Severites"
    Order By "Severites"."seOrdreAff" Asc;
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."ToutesLesSeverites"() Is '🗄️ Guichet d''infrastructure officiel renvoyant les indices de criticité et de sévérité pour la coupure défensive des logs d''incidents.';


-- ----------------------------------------------------------------------------
-- 🪓 FONCTION STOCKÉE 6 : Les Secteurs Fonctionnels (Anciens Contextes)
-- ----------------------------------------------------------------------------
Drop Function if exists public."TousLesContextes"();
Drop Function if exists public."TousLesSecteurs"();

Create Or Replace Function public."TousLesSecteurs"()
Returns Table (
    "scIdSecteur" Char(4),                                      -- [RÉPARÉ V4] Aligné sur la table Secteurs.
    "scLibelle"   Varchar(50),                                  -- [RÉPARÉ V4] Transmutation de ecName en scLibelle.
    "scOrdreAff"  Integer,
    "scDefaut"    Boolean                                       -- [RÉPARÉ V4] Injection du bit de repli nominal.
) as $$
Begin
    Return Query
    Select
        "Secteurs"."scIdSecteur",
        "Secteurs"."scLibelle",
        "Secteurs"."scOrdreAff"::Integer,
        "Secteurs"."scDefaut"
    From public."Secteurs"                                      -- [RÉPARÉ V4] Ciblage de la nouvelle table francisée Secteurs sc.
    Order By "Secteurs"."scOrdreAff" Asc;
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."TousLesSecteurs"() Is '🗄️ Extracteur de dictionnaire stable pour l''hydratation nominale du SmartEnum Secteur au boot applicatif [Mémoria].';


-- ----------------------------------------------------------------------------
-- 🪓 FONCTION STOCKÉE 7 : Les Actions Traçables
-- ----------------------------------------------------------------------------
Drop Function if exists public."ToutesLesActions"();

Create Or Replace Function public."ToutesLesActions"()
Returns Table (
    "acIdAction" Char(4),                                       -- [RÉPARÉ V4] Aligné sur la table Actions.
    "acLibelle"  Varchar(50),                                   -- [RÉPARÉ V4] Transmutation de eaName en acLibelle.
    "acOrdreAff" Integer,
    "acDefaut"   Boolean                                        -- [RÉPARÉ V4] Injection du bit de repli nominal.
) as $$
Begin
    Return Query
    Select
        "Actions"."acIdAction",
        "Actions"."acLibelle",
        "Actions"."acOrdreAff"::Integer,
        "Actions"."acDefaut"
    From public."Actions"                                       -- [RÉPARÉ V4] Ciblage de la nouvelle table francisée Actions ac.
    Order By "Actions"."acOrdreAff" Asc;
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."ToutesLesActions"() Is '🗄️ Extracteur de dictionnaire stable pour l''hydratation nominale du SmartEnum Action au boot applicatif [Mémoria].';

-- ----------------------------------------------------------------------------
-- 🗄️ Mémoria - FONCTION STOCKÉE 8 : Les Directives d'Ordre de Tri SQL
-- ----------------------------------------------------------------------------

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function if exists public."TousLesOrdresTri"();

Create Or Replace Function public."TousLesOrdresTri"()
Returns Table (
    "otIdCode"   Char(4),                                       -- Identifiant immuable unique en RAM (ex: 'CROI', 'DECR').
    "otLibelle"  Varchar(50),                                   -- Désignation intelligible pour le débogage et l'IHM.
    "otClauseSql" Varchar(10),                                  -- La chaîne physique s'engouffrant dans SQL ('ASC', 'DESC', '').
    "otOrdreAff" Integer,                                       -- Indice technique de tri pour l'affichage graphique.
    "otDefaut"   Boolean                                        -- Le Choupy de repli (Décroissant par défaut).
) as $$
Begin
    -- Injection en ligne droite des trois piliers immuables de l'ordonnancement V4 Pro
    Return Query Values
        ('CROI'::char(4), 'Croissant'::varchar(50),   'ASC'::varchar(10),  1, false),
        ('NATU'::char(4), 'Naturel'::varchar(50),     ''::varchar(10),     2, false),
        ('DECR'::char(4), 'Décroissant'::varchar(50), 'DESC'::varchar(10), 3, true); -- 🔒 Bit True nominal de secours !
End;
$$ Language plpgsql Stable Strict;

Comment On Function public."TousLesOrdresTri"() Is '🗄️ Guichet d''infrastructure virtuel renvoyant les directives et opérateurs de tri SQL légitimes pour l''hydratation nominale d''OrdreTriEnum [Mémoria].';
