-- ——— fichier : database\fonctions\TraceModif.sql

-- ⚡ LE SOUPIRAIL : Fonction d'infrastructure universelle d'audit temporel
-- Reçoit dynamiquement le nom de la colonne UpdatedAt en argument via le déclencheur (Trigger)
CREATE OR REPLACE FUNCTION "TraceModif"()
RETURNS TRIGGER AS $$
DECLARE
    -- 🧠 NOTE TECHNIQUE D'ALIGNEMENT BINAIRE :
    -- Dans PostgreSQL, le type 'text' et le type 'varchar' partagent exactement la même structure
    -- binaire en interne (le type varlena). Ils consomment la même place en RAM et sur le disque.
    -- L'utilisation de 'text' ici évite au moteur de s'épuiser à valider des longueurs de chaînes
    -- lors des manipulations de variables à l'intérieur de la mémoire vive.
    "NomColonne" TEXT;
BEGIN
    -- 1. Récupération directe du paramètre textuel passé lors de la déclaration du Trigger 📜
    "NomColonne" := TG_ARGV[0];

    IF "NomColonne" IS NULL THEN
        RAISE EXCEPTION 'Infrastructure 🚨 : Le trigger doit obligatoirement recevoir le nom de la zone de modification en paramètre.';
    END IF;

    -- 2. Injection dynamique de la date UTC brute sans calcul lourd dans l'enregistrement NEW ⚙️
    NEW := jsonb_populate_record(NEW, jsonb_build_object("NomColonne", CURRENT_TIMESTAMP));

    RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE STRICT;

COMMENT ON FUNCTION "TraceModif"() IS '⚡ Fonction d infrastructure universelle injectant dynamiquement l horodatage de modification dans la colonne spécifiée en paramètre.';
