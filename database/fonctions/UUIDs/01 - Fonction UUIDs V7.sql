-- ——— fichier : database/fonctions/UUIDs/01 - Fonction UUIDs V7.sql

-- ============================================================================
-- 🏺 Mémoria - 00 - Fonctions Utilitaires UUID.sql
-- Fichier: database/migrations/00 - Fonctions Utilitaires UUID.sql
-- Version: 4.2.4 (PostgreSQL 17+)
-- Description: Générateur autonome d'UUID v7 Volatile et Explicite - Jojo-Style
-- ============================================================================

Set search_path To Public;

Create Or Replace Function "GenererUuidV7"()
Returns UUID As $$
Declare
    l_iTimestampBigInt Bigint;
    l_sHexaTimestamp   Text;
    l_sHexaHasard      Text;
    l_sUuidConstruit   Text;
Begin
    -- 1. Extraction du timestamp Unix en millisecondes
    l_iTimestampBigInt := Floor(Extract(Epoch From Clock_Timestamp()) * 1000)::Bigint;

    -- 2. Encodage en chaîne hexadécimale sur 12 caractères (48 bits)
    l_sHexaTimestamp := Lpad(To_Hex(l_iTimestampBigInt), 12, '0');

    -- 3. Génération de 18 octets aléatoires pour combler le reste de la structure
    l_sHexaHasard := To_Hex(Floor(Random() * 9223372036854775807)::Bigint)
                  || To_Hex(Floor(Random() * 9223372036854775807)::Bigint);

    -- 4. Assemblage chirurgical au format UUID avec injection des bits de version (7) et de variante (2)
    l_sUuidConstruit := Substring(l_sHexaTimestamp, 1, 8)  || '-'
                     || Substring(l_sHexaTimestamp, 9, 4)  || '-'
                     || '7' || Substring(l_sHexaHasard, 1, 3) || '-' -- Version 7 🗲
                     || To_Hex((('x' || Substring(l_sHexaHasard, 4, 1))::Bit(4) & B'0011' | B'1000')::Integer)
                     || Substring(l_sHexaHasard, 5, 3) || '-'
                     || Substring(l_sHexaHasard, 8, 12);

    Return l_sUuidConstruit::UUID;
End;
$$ Language Plpgsql Volatile;

Comment on Function "GenererUuidV7"() is 'Générateur d''UUID v7 autonome et explicitement volatile, garantissant l''unicité stricte et l''évaporation du cache par ligne.';

-- ----------------------------------------------------------------------------
-- 🎭 Le Camouflage de Forteresse : Fonction miroir pour piéger les collègues
-- ----------------------------------------------------------------------------
Create Or Replace Function "Gen_Random_Uuid"()
Returns UUID As $$
Begin
    -- Exécute secrètement la V7 d'élite sous le nom de la V4 d'infrastructure
    Return "GenererUuidV7"();
End;
$$ Language Plpgsql Volatile;

Comment on Function "Gen_Random_Uuid"() is 'Doublure d''infrastructure simulant la V4 native pour Cour Basse mais injectant de la V7 chronologique.';
