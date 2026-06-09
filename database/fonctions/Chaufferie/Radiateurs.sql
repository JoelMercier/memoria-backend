-- ============================================================================
-- 🏺 INFRASTRUCTURE D'ÉLITE [MÉMORIA] - VERSION FINALE DES GUICHETS
-- ============================================================================

Drop Function If Exists "TousLesRoles"();

-- 🪓 FONCTION STOCKÉE 1 : Les Rôles
Create Or Replace Function "TousLesRoles"()
Returns Table("idRole" Char(4), "roName" Varchar(50), "roNiveau" Int, "roOrdreAff" Int) As $$
Begin
    Return Query
    Select
        "Roles"."roIdRole",
        "Roles"."roName",
        "Roles"."roNiveau"::Int,
        "Roles"."roOrdreAff"::Int
    From "Roles"
    Order By "Roles"."roOrdreAff" Asc;
End;
$$ Language plpgsql Stable;

Comment On Function "TousLesRoles"() is '🗄️ Guichet d''infrastructure officiel renvoyant l''intégralité du dictionnaire des rôles applicatifs triés par poids hiérarchique [Mémoria].';


-- 🪓 FONCTION STOCKÉE 2 : Les Catégories d'Événements
Drop Function If Exists "ToutesLesCategories"();

Create Or Replace Function "ToutesLesCategories"()
Returns Table("idCategory" Char(4), "ecName" Varchar(50), "ecOrdreAff" Int) As $$
Begin
    Return Query
    Select
        "EventCategories"."ecIdCategory",
        "EventCategories"."ecName",
        "EventCategories"."ecOrdreAff"::Int
    From "EventCategories"
    Order By "EventCategories"."ecOrdreAff" Asc;
End;
$$ Language plpgsql Stable;

Comment On Function "ToutesLesCategories"() is '🗄️ Guichet d''infrastructure officiel renvoyant l''intégralité des catégories du journal d''audit pour le monitoring système [Mémoria].';


-- 🪓 FONCTION STOCKÉE 3 : Les Formats de Pépites (Content Types)
Drop Function If Exists "TousLesFormats"();

Create Or Replace Function "TousLesFormats"()
Returns Table("idContentType" Char(4), "ctName" Varchar(50), "ctOrdreAff" Int) As $$
Begin
    Return Query
    Select
        "ContentTypes"."ctIdContentType",
        "ContentTypes"."ctName",
        "ContentTypes"."ctOrdreAff"::Int
    From "ContentTypes"
    Order By "ContentTypes"."ctOrdreAff" Asc;
End;
$$ Language plpgsql Stable;

Comment On Function "TousLesFormats"() is '🗄️ Guichet d''infrastructure officiel renvoyant les formats de structures sémantiques autorisés pour le stockage des pépites [Mémoria].';


-- 🪓 FONCTION STOCKÉE 4 : Les Fournisseurs d'Accès
Drop Function If Exists "TousLesFournisseurs"();

Create Or Replace Function "TousLesFournisseurs"()
Returns Table("idProvider" Char(4), "apName" Varchar(50), "apOrdreAff" Int) As $$
Begin
    Return Query
    Select
        "Providers"."apIdProvider",
        "Providers"."apName",
        "Providers"."apOrdreAff"::Int
    From "Providers"
    Order By "Providers"."apOrdreAff" Asc;
End;
$$ Language plpgsql Stable;

Comment On Function "TousLesFournisseurs"() is '🗄️ Guichet d''infrastructure officiel renvoyant les protocoles et fournisseurs d''identités légitimes pour l''authentification réseau [Mémoria].';


-- 🪓 FONCTION STOCKÉE 5 : Les Sévérités d'Incidents

Drop Function If Exists "ToutesLesSeverites"();

Create Or Replace Function "ToutesLesSeverites"()
Returns Table("idSeverity" Char(4), "seName" Varchar(50), "seOrdreAff" Int) As $$
Begin
    Return Query
    Select
        "Severites"."seIdSeverity",
        "Severites"."seName",
        "Severites"."seOrdreAff"::Int
    From "Severites"
    Order By "Severites"."seOrdreAff" Asc;
End;
$$ Language plpgsql Stable;

Comment On Function "ToutesLesSeverites"() is '🗄️ Guichet d''infrastructure officiel renvoyant les indices de criticité et de sévérité pour la coupure défensive des logs d''incidents.';

/**
 * 🔨 Fonction "TousLesContextes"
 * ----------------------------------------------------------------------------
 * Extrait l'intégralité du catalogue des contextes fonctionnels d'audit.
 * Point de passage obligatoire au boot de la RAM pour hydrater le SmartEnum applicatif.
 *
 * 🐦 STABLE : Garantit la mise en cache de la structure au sein d'une même transaction.
 */
Drop Function If Exists "TousLesContextes"();

Create Or Replace Function "TousLesContextes"()
Returns Table (
    "ecIdContext" Char(4),
    "ecName" Varchar(50),
    "ecOrdreAff" Int

) As $$
Begin
    Return Query
    Select
        "EventContexts"."ecIdContext",
        "EventContexts"."ecName",
        "EventContexts"."ecOrdreAff"::Int
    From "EventContexts"
    Order By "EventContexts"."ecOrdreAff" Asc;
End;
$$ Language Plpgsql Stable; -- 🗲 [PERFORMANCE V4] Cache optimisé pour les tables fixes !

Comment on Function "TousLesContextes"() is 'Extracteur de dictionnaire stable pour l''hydratation nominale du SmartEnum AppEventContext au boot applicatif.';


/**
 * 🔨 Fonction "ToutesLesActions"
 * ----------------------------------------------------------------------------
 * Extrait l'intégralité du catalogue des opérations et actions techniques d'audit.
 * Branché en direct sur le décodeur central pour sécuriser les quadrigrammes fixes.
 *
 * 🐦 STABLE : Autorise PostgreSQL à optimiser le plan de requête sans recalcul.
 */
Drop Function If Exists "ToutesLesActions"();

Create Or Replace Function "ToutesLesActions"()
Returns Table (
    "eaIdAction" Char(4),
    "eaName" Varchar(50),
    "eaOrdreAff" int
) As $$
Begin
    Return Query
    Select
        "EventActions"."eaIdAction",
        "EventActions"."eaName",
        "EventActions"."eaOrdreAff"::int
    From "EventActions"
    Order By "EventActions"."eaOrdreAff" Asc;
End;
$$ Language Plpgsql Stable; -- 🗲 [PERFORMANCE V4] Cache optimisé pour les tables fixes !

Comment on Function "ToutesLesActions"() is 'Extracteur de dictionnaire stable pour l''hydratation nominale du SmartEnum AppEventAction au boot applicatif.';
