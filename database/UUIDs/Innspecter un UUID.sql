-- ============================================================================
-- 🛠️ Mémoria - 00 - InspecterUuid7.sql
-- Fichier: database/migrations/00 - InspecterUuid7.sql
-- Version: 1.3.0 (PostgreSQL 17+)
-- Description: Outil d autopsie et de validation des identifiants UUIDv7
-- ============================================================================

Set search_path To Public;

-- ----------------------------------------------------------------------------
-- 🛠️ 1. La fonction d autopsie binaire (Zéro alias - Improvisation p_ax)
-- ----------------------------------------------------------------------------
Create Or Replace Function "InspecterUuid7"("p_axDonneeEntree" Bytea)
Returns Table (
    "uuEstUnUuid7Valide" Boolean,
    "uuVersionDetectee"  Integer,
    "uuVarianteDetectee" Integer,
    "uuHorodatageExtrait" Timestamp,
    "uuBilanAnalyse"     Text
) as $$
Declare
    "l_sTexteHexa"   Text;
    "l_iBitsTemps"   Bigint;
    "l_iOctetVersion" Integer;
    "l_iOctetVariante" Integer;
Begin
    -- Sécurité : gestion d une donnee absente
    If "p_axDonneeEntree" Is Null Then
        Return Query Select False, Null::Integer, Null::Integer, Null::Timestamp, 'Aucune donnée fournie à l analyse.'::Text;
        Return;
    End If;

    -- Validation stricte de la taille physique obligatoire (16 octets)
    If octet_length("p_axDonneeEntree") != 16 Then
        Return Query Select False, Null::Integer, Null::Integer, Null::Timestamp, 'Échec de taille : le segment binaire doit mesurer exactement 16 octets.'::Text;
        Return;
    End If;

    -- Conversion du flux binaire en chaîne hexadécimale standard pour l extraction de contrebande
    "l_sTexteHexa" := encode("p_axDonneeEntree", 'hex');

    -- Extraction des 48 premiers bits (12 caractères hexadécimaux) pour retrouver le temps machine
    "l_iBitsTemps" := ('x' || lpad(substring("l_sTexteHexa" From 1 For 12), 16, '0'))::bit(64)::Bigint;

    -- Extraction du 13ème caractère hexadécimal pour la version (Bits 48 à 51)
    "l_iOctetVersion" := ('x' || substring("l_sTexteHexa" From 13 For 1))::bit(4)::Integer;

    -- Extraction du 17ème caractère hexadécimal pour la variante (Bits 64 à 67)
    "l_iOctetVariante" := ('x' || substring("l_sTexteHexa" From 17 For 1))::bit(4)::Integer;

    -- Construction du bilan de l inspecteur
    If "l_iOctetVersion" = 7 And "l_iOctetVariante" >= 8 Then
        Return Query Select
            True,
            "l_iOctetVersion",
            "l_iOctetVariante",
            -- Conversion des millisecondes Unix en horodatage lisible par des neurones biologiques
            to_timestamp("l_iBitsTemps" / 1000.0)::Timestamp,
            'Structure UUIDv7 parfaitement saine et conforme aux spécifications.'::Text;
    Else
        Return Query Select
            False,
            "l_iOctetVersion",
            "l_iOctetVariante",
            to_timestamp("l_iBitsTemps" / 1000.0)::Timestamp,
            'Anomalie : la signature de version (attendue: 7) ou de variante (attendue: >= 8) is corrompue.'::Text;
    End If;
End;
$$ Language plpgsql;

-- ----------------------------------------------------------------------------
-- 🛠️ 2. Surcharge pratique pour accepter le format texte standardisé (UUID)
-- ----------------------------------------------------------------------------
Create Or Replace Function "InspecterUuid7"("p_sDonneeTexte" Uuid)
Returns Table (
    "uuEstUnUuid7Valide" Boolean,
    "uuVersionDetectee"  Integer,
    "uuVarianteDetectee" Integer,
    "uuHorodatageExtrait" Timestamp,
    "uuBilanAnalyse"     Text
) as $$
Begin
    -- Conversion transparente vers le type binaire natif de Mémoria
    Return Query Select * From "InspecterUuid7"(decode(replace("p_sDonneeTexte"::Text, '-', ''), 'hex'));
End;
$$ Language plpgsql;

-- ----------------------------------------------------------------------------
-- 📝 3. La documentation du dictionnaire
-- ----------------------------------------------------------------------------
Comment On Function "InspecterUuid7"(Bytea) is 'Autopsie binaire un UUIDv7 pour extraire son horodatage milliséconde et valider sa structure de conformité.';
