-- ——— fichier : database/migrations/04 - Inspecter un UUID.sql

-- ============================================================================
-- 🛠️ Mémoria - InspecterUuid7.sql
-- Fichier: database/migrations/04 - Inspecter un UUID.sql
-- Version: 1.4.0 (PostgreSQL 17+)
-- Description: Outil d'autopsie et de validation des identifiants UUID v4 / v7
-- ============================================================================

Set search_path To Public;

-- ---------------------------------------------------------------------------------
-- 🛠️ 1. La fonction d'autopsie binaire (p_x : paramètre de soute Hexa/ByteA)
-- ---------------------------------------------------------------------------------
Drop Function if Exists "InspecterUuid7"(ByteA);

Create Or Replace Function "InspecterUuid7"(p_xDonneeEntree ByteA)
Returns Table (
    "uuEstUnUuid7Valide"  Boolean  ,
    "uuVersionDetectee"   Integer  ,
    "uuVarianteDetectee"  Integer  ,
    "uuHorodatageExtrait" Timestamp,
    "uuBilanAnalyse"      Text
) As $$

Declare
    l_sTexteHexa       Text;
    l_iBitsTemps       Bigint;
    l_iOctetVersion    Integer;
    l_iOctetVariante   Integer;
Begin
    -- Sécurité : gestion d'une donnée absente
    if p_xDonneeEntree is Null Then
        Return Query Select False, Null::Integer, Null::Integer, Null::Timestamp, 'Aucune donnée fournie à l''analyse.'::Text;
        Return;
    End if;

    -- Validation stricte de la taille physique obligatoire (16 octets)
    if Octet_length(p_xDonneeEntree) != 16 Then
        Return Query Select False, Null::Integer, Null::Integer, Null::Timestamp, 'Échec de taille : le segment binaire doit mesurer exactement 16 octets.'::Text;
        Return;
    End if;

    -- Conversion du flux binaire en chaîne hexadécimale standard pour l'extraction de contrebande
    l_sTexteHexa     := Encode(p_xDonneeEntree, 'hex');

    -- Extraction des 48 premiers bits (12 caractères hexadécimaux) pour retrouver le temps machine
    l_iBitsTemps     := ('x' || Lpad(Substring(l_sTexteHexa From 1 For 12), 16, '0'))::Bit(64)::Bigint;

    -- Extraction du 13ème caractère hexadécimal pour la version (Bits 48 à 51)
    l_iOctetVersion  := ('x' || Substring(l_sTexteHexa From 13 For 1))::Bit(4)::Integer;

    -- Extraction du 17ème caractère hexadécimal pour la variante (Bits 64 à 67)
    l_iOctetVariante := ('x' || Substring(l_sTexteHexa From 17 For 1))::Bit(4)::Integer;

    -- Construction du bilan de l'inspecteur conforme aux spécifications
    if l_iOctetVersion = 7 And l_iOctetVariante >= 8 Then
        Return Query Select
            True,
            l_iOctetVersion,
            l_iOctetVariante,
            To_timestamp(l_iBitsTemps / 1000.0)::Timestamp,
            'Structure UUID v7 parfaitement saine et conforme aux spécifications.'::Text;
    Else
        Return Query Select
            False,
            l_iOctetVersion,
            l_iOctetVariante,
            To_timestamp(l_iBitsTemps / 1000.0)::Timestamp,
            'Anomalie : la signature de version (attendue: 7) ou de variante (attendue: >= 8) est corrompue.'::Text;
    End if;
End;
$$ Language Plpgsql;

-- ----------------------------------------------------------------------------
-- 🛠️ 2. Surcharge pratique pour accepter le format texte standardisé (UUID)
-- ----------------------------------------------------------------------------
Drop Function if Exists "InspecterUuid7"(UUID);

Create Or Replace Function "InspecterUuid7"(p_hDonneeTexte UUID)
Returns Table (
    "uuEstUnUuid7Valide"  Boolean  ,
    "uuVersionDetectee"   Integer  ,
    "uuVarianteDetectee"  Integer  ,
    "uuHorodatageExtrait" Timestamp,
    "uuBilanAnalyse"      Text
) As $$
Begin
    -- Conversion transparente vers le type binaire natif de Mémoria via notre soupiraîl
    Return Query Select * From "InspecterUuid7"("UUID-Bin"(p_hDonneeTexte));
End;
$$ Language Plpgsql;
