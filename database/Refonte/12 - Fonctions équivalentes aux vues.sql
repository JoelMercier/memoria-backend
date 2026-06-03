-- ============================================================================
-- 🏛️ MEMORIA - 11_APIFonctions.sql
-- Fichier: database/migrations/11_APIFonctions.sql
-- Version: 2.42.0 (PostgreSQL 17+)
-- Description: Catalogue de l API SQL d infrastructure fermée (Zéro alias, Zéro bégayage)
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 👥 1. LECTURE DES ACTEURS POUR L'ADMINISTRATION ("LireActeursSysteme")
-- ----------------------------------------------------------------------------
Create Or Replace Function "LireActeursSysteme"(
    p_NbLignesMax Int,
    p_IndexDepart Int
)
Returns Table (
    "usIdUser"     UUID,   -- 16 octets
    "usCreatedAt"  Timestamp,
    "usRoleId"     Char(4),
    "usIdProvider" Char(4),
    "usPseudo"     Varchar(50),
    "usCourriel"   Varchar(255)
) As $$
Begin
    If p_NbLignesMax <= 0 Or p_NbLignesMax > 100 Then p_NbLignesMax := 50; End If;
    If p_IndexDepart < 0 Then p_IndexDepart := 0; End If;

    Return Query
    Select "usIdUser", "usCreatedAt", "usRoleId", "usIdProvider", "usPseudo", "usCourriel"
    From "Users"
    Order By "usCreatedAt" Desc
    Limit p_NbLignesMax
    Offset p_IndexDepart;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 👥 2. ANONYMISATION ET SABOTAGE RGPD D'UN ACTEUR ("AnonymiserActeurSysteme")
-- ----------------------------------------------------------------------------
Create Or Replace Function "AnonymiserActeurSysteme"(p_usIdUser UUID)
Returns Void As $$
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then Raise Exception 'Identifiant binaire invalide (16 octets requis).'; End If;

    -- Sabotage du profil acteur [Mémoria]
    Update "Users"
    Set "usCourriel" = 'purgue.rgpd.' || encode("UUID-Bin"(p_usIdUser), 'hex') || '@memoria.com',
        "usPasswordHash" = '$2b$10$NON_RECONNECTABLE_' || encode(gen_random_bytes(16), 'hex'),
        "usPseudo" = 'Utilisateur Anonymisé',
        "usGdprConsent" = False,
        "usGdprDate" = Current_Timestamp
    Where "usIdUser" = p_usIdUser;

    -- Sabotage des destinataires des partages liés [Mémoria]
    Update "Shares"
    Set "shCourrielDest" = 'anonyme@memoria.com'
    Where "shItemId" In (Select "itIdItem" From "Items" Where "itUserId" = p_usIdUser);
End;
$$ Language plpgsql Volatile Strict;

-- ----------------------------------------------------------------------------
-- 👥 3. CALCUL DES MÉTRIQUES GLOBAL D'UN ACTEUR ("CalculerMetriquesActeur")
-- ----------------------------------------------------------------------------
Create Or Replace Function "CalculerMetriquesActeur"(p_usIdUser UUID)
Returns Table (
    "usPseudo"        Varchar(50),
    "TotalPepites"    Bigint,
    "TotalEtiquettes" Bigint
) As $$
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then Raise Exception 'Identifiant binaire invalide (16 octets requis).'; End If;

    Return Query
    Select
        "usPseudo",
        (Select Count(*) From "Items" Where "itUserId" = p_usIdUser),
        (Select Count(*) From "Tags"  Where "tgUserId" = p_usIdUser)
    From "Users"
    Where "usIdUser" = p_usIdUser;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 👥 4. ÉVALUATION DU TEMPS DE RÉTENTION D'UN ACTEUR ("CalculerDureeActiviteActeur")
-- ----------------------------------------------------------------------------
Create Or Replace Function "CalculerDureeActiviteActeur"(p_usIdUser UUID)
Returns Table (
    "usPseudo"              Varchar(50),
    "DateInscription"       Timestamp,
    "DateDerniereActivite"  Timestamp,
    "NombreJoursActifs"     Int
) As $$
Declare
    v_dateDerniereActivite Timestamp;
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then Raise Exception 'Identifiant binaire invalide (16 octets requis).'; End If;

    Select Max("aeCreatedAt") Into v_dateDerniereActivite From "Events" Where "aeUserId" = p_usIdUser;

    Return Query
    Select "usPseudo", "usCreatedAt", v_dateDerniereActivite, Coalesce((v_dateDerniereActivite::date - "usCreatedAt":date)::int, 0)
    From "Users"
    Where "usIdUser" = p_usIdUser;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 🏷️ 5. LECTURE DES ÉTIQUETTES D'UN ACTEUR ("LireEtiquettesActeur")
-- ----------------------------------------------------------------------------
Create Or Replace Function "LireEtiquettesActeur"(p_usIdUser UUID)
Returns Table (
    "tgIdTag"     UUID,
    "tgUserId"    UUID,
    "tgCreatedAt" Timestamp,
    "tgName"      Varchar(50)
) As $$
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then Raise Exception 'Identifiant binaire invalide (16 octets requis).'; End If;

    Return Query
    Select "tgIdTag", "tgUserId", "tgCreatedAt", "tgName"
    From "Tags"
    Where "tgUserId" = p_usIdUser
    Order By "tgName" Asc;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 🏷️ 6. LECTURE DES ÉTIQUETTES AVEC DÉCOMPTE ("LireEtiquettesActeurAvecCompte")
-- ----------------------------------------------------------------------------
Create Or Replace Function "LireEtiquettesActeurAvecCompte"(p_usIdUser UUID)
Returns Table (
    "tgIdTag"       UUID,
    "tgUserId"      UUID,
    "tgCreatedAt"   Timestamp,
    "tgName"        Varchar(50),
    "NombrePepites" Bigint
) As $$
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then Raise Exception 'Identifiant binaire invalide (16 octets requis).'; End If;

    Return Query
    Select "Tags"."tgIdTag", "tgUserId", "tgCreatedAt", "tgName", Count("ItemTags"."tiItemId") As "NombrePepites"
    From "Tags"
    Left Outer Join "ItemTags"
      On "Tags"."tgIdTag" = "ItemTags"."tiTagId" 
    Where "tgUserId" = p_usIdUser
    Group By "Tags"."tgIdTag", "tgUserId", "tgName", "tgCreatedAt"
    Order By "tgName" Asc;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 📦 7. LECTURE DES PÉPITES BRUTES D'UN ACTEUR ("LirePepitesUtilisateur")
-- ----------------------------------------------------------------------------
Create Or Replace Function "LirePepitesUtilisateur"(p_usIdUser UUID)
Returns Table (
    "itIdItem"        UUID,
    "itUserId"        UUID,
    "itCreatedAt"     Timestamp,
    "itContentTypeId" Char(4),
    "itTitle"         Varchar(255),
    "itSlug"          Varchar(255),
    "itSourceAuthor"  Varchar(50),
    "itThumbnailUrl"  Varchar(255),
    "itMetadata"      Jsonb,
    "itContent"       Text
) As $$
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then Raise Exception 'Identifiant binaire invalide (16 octets requis).'; End If;

    Return Query
    Select "itIdItem", "itUserId", "itCreatedAt", "itContentTypeId", "itTitle", "itSlug", "itSourceAuthor", "itThumbnailUrl", "itMetadata", "itContent"
    From "Items"
    Where "itUserId" = p_usIdUser
    Order By "itCreatedAt" Desc;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 📦 8. LECTURE DES PÉPITES SANS ÉTIQUETTES ("LirePepitesOrphelines")
-- ----------------------------------------------------------------------------
Create Or Replace Function "LirePepitesOrphelines"(p_usIdUser UUID)
Returns Table (
    "itIdItem"        UUID,
    "itUserId"        UUID,
    "itCreatedAt"     Timestamp,
    "itContentTypeId" Char(4),
    "itTitle"         Varchar(255),
    "itSlug"          Varchar(255),
    "itContent"       Text
) As $$
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then Raise Exception 'Identifiant binaire invalide (16 octets requis).'; End If;

    Return Query
    Select "itIdItem", "itUserId", "itCreatedAt", "itContentTypeId", "itTitle", "itSlug", "itContent"
    From "Items"
    Left Outer Join "ItemTags" On "itIdItem" = "ItemTags"."tiItemId"
    Where "itUserId" = p_usIdUser
      And "ItemTags"."tiItemId" Is Null;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 📦 9. RECHERCHE TEXTUELLE CIBLÉE SUR UN ACTEUR ("RechercherPepitesActeur")
-- ----------------------------------------------------------------------------
Create Or Replace Function "RechercherPepitesActeur"(p_usIdUser UUID, p_Recherche Varchar(100))
Returns Table (
    "itIdItem"        UUID,
    "itUserId"        UUID,
    "itCreatedAt"     Timestamp,
    "itContentTypeId" Char(4),
    "itTitle"         Varchar(255),
    "itSlug"          Varchar(255),
    "itContent"       Text,
    "itThumbnailUrl"  Varchar(255)
) As $$
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then Raise Exception 'Identifiant binaire invalide (16 octets requis).'; End If;
    p_Recherche := Lower(Trim(p_Recherche));

    Return Query
    Select "itIdItem", "itUserId", "itCreatedAt", "itContentTypeId", "itTitle", "itSlug", "itContent", "itThumbnailUrl"
    From "Items"
    Where "itUserId" = p_usIdUser
      And (Lower("itTitle") Like '%' || p_Recherche || '%' Or Lower("itContent") Like '%' || p_Recherche || '%');
End;
$$ Language plpgsql Stable Strict;

-- ============================================================================
-- 📦 MEMORIA - 11_APIFonctions.sql (BLOC B : CONNAISSANCES & PASSERELLES)
-- Version: 1.0.0 (PostgreSQL 17+)
-- Description: API SQL de Cour Basse fermée - Suite du catalogue unifié
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🔗 10. LECTURE DES LIENS DE PARTAGE D'UNE PÉPITE ("LirePartagesPepite")
-- ----------------------------------------------------------------------------
Create Or Replace Function "LirePartagesPepite"(p_itIdItem UUID)
Returns Table (
    "shIdShare"       UUID,     -- 16 octets fixes (Clé primaire) [Mémoria]
    "shItemId"        UUID,     -- 16 octets fixes (Clé étrangère) [Mémoria]
    "shCreatedAt"     Timestamp, -- 8 octets fixes
    "shUpdatedAt"     Timestamp, -- 8 octets fixes
    "shCourrielDest"  Varchar(255), -- Variable francisée [Mémoria]
    "shJeton"         Varchar(255), -- Variable polie [Mémoria]
    "shConfiguration" Jsonb      -- Le sac immonde d access_config brut [Mémoria]
) As $$
Begin
    -- Sécurité physique : verrouillage de la longueur du Buffer invité [Mémoria]
    If octet_length("UUID-Bin"(p_itIdItem)) != 16 Then
        Raise Exception 'Identifiant binaire invalide : la clé doit comporter exactement 16 octets.';
    End If;

    Return Query
    Select "shIdShare", "shItemId", "shCreatedAt", "shUpdatedAt", "shCourrielDest", "shJeton", "shConfiguration"
    From "Shares"
    Where "shItemId" = p_itIdItem -- Utilisation de l index de clé étrangère [Mémoria]
    Order By "shCreatedAt" Desc;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 🔗 11. HISTORIQUE COMPLET DES PARTAGES D'UN ACTEUR ("LirePartagesActeur")
-- ----------------------------------------------------------------------------
-- Foudroie la 20ème ébauche en supprimant la jointure inutile vers Users [Mémoria]
Create Or Replace Function "LirePartagesActeur"(p_usIdUser UUID)
Returns Table (
    "shIdShare"       UUID,     -- 16 octets fixes
    "itIdItem"        UUID,     -- 16 octets fixes
    "shCreatedAt"     Timestamp, -- 8 octets fixes
    "itTitle"         Varchar(255),
    "shCourrielDest"  Varchar(255),
    "shJeton"         Varchar(255),
    "shConfiguration" Jsonb
) As $$
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then
        Raise Exception 'Identifiant binaire invalide : la clé doit comporter exactement 16 octets.';
    End If;

    Return Query
    Select "shIdShare", "shItemId", "shCreatedAt", "itTitle", "shCourrielDest", "shJeton", "shConfiguration"
    From "Shares"
    Inner Join "Items" On "shItemId" = "itIdItem" -- Jointure explicite
    Where "itUserId" = p_usIdUser -- Tri direct sur index du propriétaire à la racine
    Order By "shCreatedAt" Desc;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 🔗 12. CONSULTATION INTERFACES ET LIENS PUBLICS ("ConsulterPartagePublic")
-- ----------------------------------------------------------------------------
-- Aligné au bit près en RAM (Multiple de 8 octets) du plus lourd au variable [Mémoria]
Create Or Replace Function "ConsulterPartagePublic"(p_shJeton Varchar(255))
Returns Table (
    "shIdShare"       UUID,     -- 16 octets
    "itIdItem"        UUID,     -- 16 octets
    "shCreatedAt"     Timestamp, -- 8 octets
    "itContentTypeId" Char(4),   -- 3 octets
    "shJeton"         Varchar(255),
    "itTitle"         Varchar(255),
    "itThumbnailUrl"  Varchar(255),
    "itSourceAuthor"  Varchar(50),
    "shConfiguration" Jsonb,
    "itContent"       Text       -- Sac de texte infini en fermeture [Mémoria]
) As $$
Begin
    Return Query
    Select "shIdShare", "shItemId", "shCreatedAt", "itContentTypeId", "shJeton", "itTitle", "itThumbnailUrl", "itSourceAuthor", "shConfiguration", "itContent"
    From "Shares"
    Inner Join "Items" On "shItemId" = "itIdItem"
    Where "shJeton" = p_shJeton; -- Index unique direct [Mémoria]
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 📦 13. RECHERCHE TEXTUELLE CIBLÉE SUR UN ACTEUR ("RechercherPepitesActeur")
-- ----------------------------------------------------------------------------
-- Remplace la 19ème ébauche en filtrant sur l index avant tout calcul [Mémoria]
Create Or Replace Function "RechercherPepitesActeur"(
    p_usIdUser UUID,
    p_Recherche Varchar(100)
)
Returns Table (
    "itIdItem"        UUID,
    "itUserId"        UUID,
    "itCreatedAt"     Timestamp,
    "itContentTypeId" Char(4),
    "itTitle"         Varchar(255),
    "itSlug"          Varchar(255),
    "itContent"       Text,
    "itThumbnailUrl"  Varchar(255)
) As $$
Begin
    If octet_length("UUID-Bin"(p_usIdUser)) != 16 Then
        Raise Exception 'Identifiant binaire invalide : la clé doit comporter exactement 16 octets.';
    End If;

    p_Recherche := Lower(Trim(p_Recherche));

    Return Query
    Select "itIdItem", "itUserId", "itCreatedAt", "itContentTypeId", "itTitle", "itSlug", "itContent", "itThumbnailUrl"
    From "Items"
    Where "itUserId" = p_usIdUser -- Cadre direct sur l index du propriétaire [Mémoria]
      And (Lower("itTitle") Like '%' || p_Recherche || '%' Or Lower("itContent") Like '%' || p_Recherche || '%');
End;
$$ Language plpgsql Stable Strict;


-- ----------------------------------------------------------------------------
-- 🔗 14. AUDIT GLOBAL ET TRACKING DES ACCÈS ("AuditerPartagesSysteme")
-- ----------------------------------------------------------------------------
-- Utilise le Left Outer Join pour conserver la trace si le compte est purgé [Mémoria]
Create Or Replace Function "AuditerPartagesSysteme"()
Returns Table (
    "shIdShare"      UUID,      -- 16 octets fixes
    "shItemId"       UUID,      -- 16 octets fixes
    "itUserId"       UUID,      -- 16 octets fixes
    "shCreatedAt"    Timestamp, -- 8 octets fixes
    "itTitle"        Varchar(255),
    "usCourriel"     Varchar(255),
    "shCourrielDest" Varchar(255)
) As $$
Begin
    Return Query
    Select
        "shIdShare",
        "shItemId",
        "itUserId",
        "shCreatedAt",
        "itTitle",
        "usCourriel",
        "shCourrielDest"
    From "Shares"
    Left Outer Join "Items" On "shItemId" = "itIdItem" -- Jointure explicite protectrice [Mémoria]
    Left Outer Join "Users" On "itUserId" = "usIdUser";
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 🚨 15. LECTURE DES ALERTES CRITIQUES FILTRÉES ("LireAlertesCritiques")
-- ----------------------------------------------------------------------------
-- Remplace la bouse du WHERE OR textuel en ciblant directement l index CRT [Mémoria]
Create Or Replace Function "LireAlertesCritiques"()
Returns Table (
    "aeIdEvent"   UUID,         -- 16 octets fixes
    "aeUserId"    UUID,         -- 16 octets fixes
    "aeCreatedAt" Timestamp,    -- 8 octets fixes
    "seName"      Varchar(50),  -- Libellé de dictionnaire
    "aeType"      Varchar(100), -- Code francisé 'authentification.echec'
    "aeMessage"   Text,
    "aeMetadata"  Jsonb         -- Le sac immonde brut renvoyé en queue
) As $$
Begin
    Return Query
    Select "aeIdEvent", "aeUserId", "aeCreatedAt", "seName", "aeType", "aeMessage", "aeMetadata"
    From "Events"
    Inner Join "Severites" On "aeSeverityId" = "seIdSeverity"
    Where "aeSeverityId" = 'CRT'; -- Utilise l'index Events_aeSeverityId_Idx !
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 🚨 16. LECTURE DES ÉVÉNEMENTS PAR SEVÉRITÉ MATHÉMATIQUE ("LireEvenementsParGravite")
-- ----------------------------------------------------------------------------
-- Exploite votre colonne seNiveau unique et son index pour trier sans s emmêler les curseurs [Mémoria]
Create Or Replace Function "LireEvenementsParGravite"(p_seIdSeverityMin Char(4))
Returns Table (
    "aeIdEvent"   UUID,        -- 16 octets fixes
    "aeUserId"    UUID,        -- 16 octets fixes
    "aeCreatedAt" Timestamp,    -- 8 octets fixes
    "seName"      Varchar(50),
    "aeType"      Varchar(100),
    "aeMessage"   Text
) As $$
Declare
    v_seNiveauMin Int;
Begin
    -- Extraction synchrone du poids numérique depuis l'index unique
    Select "seNiveau" Into v_seNiveauMin From "Severites" Where "seIdSeverity" = p_seIdSeverityMin;

    If v_seNiveauMin Is Null Then
        Raise Exception 'Code de sévérité d infrastructure inconnu : %', p_seIdSeverityMin;
    End If;

    Return Query
    Select "aeIdEvent", "aeUserId", "aeCreatedAt", "seName", "aeType", "aeMessage"
    From "Events"
    Inner Join "Severites" On "aeSeverityId" = "seIdSeverity"
    Where "seNiveau" >= v_seNiveauMin -- Filtrage mathématique Jojo-Style Supersonic [Mémoria]
    Order By "aeCreatedAt" Desc;
End;
$$ Language plpgsql Stable Strict;

-- ----------------------------------------------------------------------------
-- 🚨 17. JOURNAL D'AUDIT COMPLET D'UN ACTEUR CIBLÉ ("LireEvenementsActeur")
-- ----------------------------------------------------------------------------
-- Remplace la 18ème ébauche en forçant le tri sur l index partiel à la racine [Mémoria]
Create Or Replace Function "LireEvenementsActeur"(p_aeUserId UUID)
Returns Table (
    "aeIdEvent"    UUID,     -- 16 octets fixes
    "aeUserId"     UUID,     -- 16 octets fixes
    "aeCreatedAt"  Timestamp, -- 8 octets fixes
    "aeCategoryId" Char(4),
    "aeSeverityId" Char(4),
    "aeType"       Varchar(100), -- Code francisé [Mémoria]
    "aeMessage"    Text,
    "aeMetadata"   Jsonb      -- Sac brut extrait du disque [Mémoria]
) As $$
Begin
    If octet_length("UUID-Bin"(p_aeUserId)) != 16 Then
        Raise Exception 'Identifiant binaire invalide : la clé doit comporter exactement 16 octets.';
    End If;

    Return Query
    Select "aeIdEvent", "aeUserId", "aeCreatedAt", "aeCategoryId", "aeSeverityId", "aeType", "aeMessage", "aeMetadata"
    From "Events"
    Where "aeUserId" = p_aeUserId -- Utilise l index partiel Events_aeUserId_Idx [Mémoria]
    Order By "aeCreatedAt" Desc;
End;
$$ Language plpgsql Stable Strict;
