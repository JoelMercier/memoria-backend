-- ============================================================================
-- 🏺 INFRASTRUCTURE D'ÉLITE [MÉMORIA] - VERSION FINALE DES GUICHETS
-- ============================================================================

Drop Function If Exists "TousLesRoles"();
Drop Function If Exists "ToutesLesCategories"();
Drop Function If Exists "TousLesFormats"();
Drop Function If Exists "TousLesFournisseurs"();
Drop Function If Exists "ToutesLesSeverites"();

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
$$ Language plpgsql;

Comment On Function "TousLesRoles"() is '🗄️ Guichet d''infrastructure officiel renvoyant l''intégralité du dictionnaire des rôles applicatifs triés par poids hiérarchique [Mémoria].';


-- 🪓 FONCTION STOCKÉE 2 : Les Catégories d'Événements
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
$$ Language plpgsql;

Comment On Function "ToutesLesCategories"() is '🗄️ Guichet d''infrastructure officiel renvoyant l''intégralité des catégories du journal d''audit pour le monitoring système [Mémoria].';


-- 🪓 FONCTION STOCKÉE 3 : Les Formats de Pépites (Content Types)
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
$$ Language plpgsql;

Comment On Function "TousLesFormats"() is '🗄️ Guichet d''infrastructure officiel renvoyant les formats de structures sémantiques autorisés pour le stockage des pépites [Mémoria].';


-- 🪓 FONCTION STOCKÉE 4 : Les Fournisseurs d'Accès
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
$$ Language plpgsql;

Comment On Function "TousLesFournisseurs"() is '🗄️ Guichet d''infrastructure officiel renvoyant les protocoles et fournisseurs d''identités légitimes pour l''authentification réseau [Mémoria].';


-- 🪓 FONCTION STOCKÉE 5 : Les Sévérités d'Incidents
-- ============================================================================
-- 🏺 INFRASTRUCTURE D'ÉLITE [MÉMORIA] - RECTIFICATION SÉVÉRITÉS (PREFISE SE)
-- ============================================================================

Drop Function If Exists "ToutesLesSeverites"();

-- 🪓 FONCTION STOCKÉE 5 : Les Sévérités d'Incidents
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
$$ Language plpgsql;

Comment On Function "ToutesLesSeverites"() is '🗄️ Guichet d''infrastructure officiel renvoyant les indices de criticité et de sévérité pour la coupure défensive des logs d''incidents [Mémoria].';
