-- ——— fichier : database/fonctions/Pépites/SupprimerPepite.sql

-- ============================================================================
-- 🚨 INFRASTRUCTURE : DESTRUCTEUR CHIRURGICAL ET SÉCURISÉ DES PÉPITES D'OR
-- Version: 4.2.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Suppression définitive sous Security Definer avec double verrou.
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

Drop Function If Exists public."SupprimerPepite"(Uuid, Uuid);

Create Or Replace Function public."SupprimerPepite"(
    p_axIdPepite Uuid,             -- Paramètre : Identifiant 128 bits de la pépite à abattre.
    p_axIdActeur Uuid              -- Paramètre : Identifiant 128 bits de l'acteur ordonnateur.
)
Returns Table (
    "itIdItem"        Uuid,
    "itUserId"        Uuid,
    "itCreatedAt"     TimeStamp Without Time Zone,
    "itUpdatedAt"     TimeStamp Without Time Zone,
    "itContentTypeId" Character(4),
    "itLibelle"       Character Varying,
    "itSlug"          Character Varying,
    "itAuteurSource"  Character Varying,
    "itThumbnailUrl"  Character Varying,
    "itMetadata"      JsonB,
    "itContent"       Text
) As $$
Begin
    Return Query
    Delete From public."Items"
    Where "itIdItem" = p_axIdPepite
      and "itUserId" = p_axIdActeur -- 🛡️ [DOUBLE VERROU] Sécurité : Empêche un acteur d'abattre la pépite d'un autre [1.1].
    Returning *;                    -- ⚡ Renvoie la dépouille de la ligne pour mise à jour instantanée du cache RAM applicatif [1.1, 1.2.8].
End;
$$ Language plpgsql Security Definer; -- 🔒 [DECRET JOEL] Surélévation impérative pour contourner les blocages du rôle restreint [1.1] !

-- ----------------------------------------------------------------------------
-- 📝 4. La documentation du dictionnaire (Rule 7 : Alignement vertical du 'is')
-- ----------------------------------------------------------------------------
Comment On Function public."SupprimerPepite"(Uuid, Uuid) is 'Ablation sécurisée et définitive d''une pépite d''or via son identifiant unique et son propriétaire [1.1].';
