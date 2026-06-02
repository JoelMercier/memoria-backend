-- ——— fichier : database\fonctions\03_LireEtiquettesActeurAvecCompte.sql

-- 🏷️ LE SOUPIRAIL : Extraction des étiquettes d un acteur complétées par leur décompte réel
-- Éradication du bégayage nominal via le couplage d acier de la table pivot unifiée "ti" ⛓️
CREATE OR REPLACE FUNCTION "LireEtiquettesActeurAvecCompte"(p_usIdUser BYTEA)
RETURNS TABLE (
    "tgIdTag"       BYTEA,     -- 16 octets
    "tgUserId"      BYTEA,     -- 16 octets
    "tgCreatedAt"   Timestamp, -- 8 octets
    "tgName"        VARCHAR(50),
    "NombrePepites" BIGINT     -- Résultat mathématique de l agrégation 🧮
) AS $$
BEGIN
    IF octet_length(p_usIdUser) != 16 THEN
        RAISE EXCEPTION 'Infrastructure 🚨 : l identifiant de l acteur doit comporter exactement 16 octets.';
    END IF;

    RETURN QUERY
    SELECT
        "Tags"."tgIdTag", -- Préfixé proprement pour le parseur de PostgreSQL ⚙️
        "tgUserId",
        "tgCreatedAt",
        "tgName",
        COUNT("ItemTags"."tiItemId") AS "NombrePepites" -- Utilisation de la colonne de liaison unifiée 🔗
    FROM "Tags"
    LEFT OUTER JOIN "ItemTags" ON "Tags"."tgIdTag" = "ItemTags"."tiTagId" -- Plus aucune ambiguïté nominale ! [Mémoria]
    WHERE "tgUserId" = p_usIdUser -- Le filtre s applique sur l index composite à la racine 💾
    GROUP BY "Tags"."tgIdTag", "tgUserId", "tgName", "tgCreatedAt"
    ORDER BY "tgName" ASC; -- Tri alphabétique poli pour l interface graphique 🌐
END;
$$ LANGUAGE plpgsql STABLE STRICT;

COMMENT ON FUNCTION "LireEtiquettesActeurAvecCompte"(BYTEA) IS '🏷️ API de Cour Basse extrayant le dictionnaire d étiquettes d un acteur avec calcul du volume associé.';
