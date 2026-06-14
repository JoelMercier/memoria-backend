-- ——— fichier : database\migration\Références\00 - Tables de référence Trigger.sql

-- ============================================================================
-- 🗄️ Mémoria - Les 7 Dictionnaires d'Infrastructure Pro
-- Version: 4.2.0 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Alignement des 7 préfixes, injection du bit de repli et triggers anti-destruction.
-- ============================================================================

Set search_path To Public;
Set CLIENT_ENCODING to 'UTF8';

-- ----------------------------------------------------------------------------
-- 🎛️ FONCTION UNIVERSELLE DE PROTECTION DU REPLI NOMINAL
-- ----------------------------------------------------------------------------
Create Or Replace Function "VerifieLigneDefaut"() Returns Trigger as $$
Declare
    l_sNomColonne varchar;                                      -- Variable locale : Nom de la colonne à inspecter.
    l_bEstDefaut  boolean;                                      -- Variable locale : Valeur du drapeau évalué.
    l_oOldJson    jsonb;                                        -- Variable locale : Tampon JSONB de l'ancienne ligne.
Begin
    l_sNomColonne := TG_ARGV[0];                                -- Extraction du paramètre passé au déclencheur.

    If TG_OP = 'DELETE' Then
        l_oOldJson   := to_jsonb(OLD);                          -- Conversion de l'ancienne ligne en sac binaire JSONB.
        l_bEstDefaut := Coalesce((l_oOldJson->>l_sNomColonne)::boolean, false); -- Extraction directe du bit de repli.

        If l_bEstDefaut Then
            Raise Exception '🚨 [Crime de Soute] Interdiction absolue de supprimer la ligne de repli par défaut !';
        End if;
        Return OLD;
    End if;

    If TG_OP = 'UPDATE' Then
        l_oOldJson   := to_jsonb(OLD);                          -- Analyse de l'état précédent.
        l_bEstDefaut := Coalesce((l_oOldJson->>l_sNomColonne)::boolean, false);

        If l_bEstDefaut And Not Coalesce((to_jsonb(NEW)->>l_sNomColonne)::boolean, false) Then
            Raise Exception '🚨 [Crime de Soute] Impossible de désactiver la ligne par défaut. Veuillez d''abord désigner un autre Choupy !';
        End if;
        Return NEW;
    End if;
End;
$$ Language plpgsql;