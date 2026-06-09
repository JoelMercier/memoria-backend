-- 🏛️ Étape A : Destruction de l'ancien moule désaligné
Drop Table If Exists public."Shares";

-- 🏛️ Étape B : Coulée du bronze unique avec l'alignement d'acier (Rule 1 & 2)
Create Table public."Shares"
(
    -- 1. Les colosses (16 octets fixes fixed-width fixed-alignment Bytea/UUID)
    "shIdShare"       Uuid Not Null,
    "shItemId"        Uuid Not Null,
    "shItemOwnerId"   Uuid Not Null,

    -- 2. Les horodateurs (8 octets fixes fixed-width alignment)
    "shCreatedAt"     Timestamp Without Time Zone Not Null Default Current_TIMESTAMP,
    "shUpdatedAt"     Timestamp Without Time Zone,

    -- 3. Les variables et formats légers (Alignement fin de tas)
    "shCourrielDest"  Varchar(255) collate pg_catalog."default",
    "shJeton"         Varchar(255) collate pg_catalog."default" Not Null,
    "shConfiguration" Jsonb Not Null Default '{}'::Jsonb,

    Constraint "Shares_shIdShare_Pkey" Primary Key ("shIdShare"),
    Constraint "Shares_shJeton_Udx" Unique ("shJeton"),

    -- Clés étrangères nominelles
    Constraint "Shares_shItemId_Fkey" Foreign Key ("shItemId")
        References public."Items" ("itIdItem") match simple
        on update No Action on delete No Action,

    Constraint "Shares_shItemOwnerId_Fkey" Foreign Key ("shItemOwnerId")
        References public."Users" ("usIdUser") match simple
        on update No Action on delete No Action,

    -- Verrous de validation de la taille binaire du Bloc 1 (_Chk)
    Constraint "Shares_shIdShare_Taille_Chk"     Check (octet_length("UUID-Bin"("shIdShare"    )) = 16),
    Constraint "Shares_shItemId_Taille_Chk"      Check (octet_length("UUID-Bin"("shItemId"     )) = 16),
    Constraint "Shares_shItemOwnerId_Taille_Chk" Check (octet_length("UUID-Bin"("shItemOwnerId")) = 16)
)
Tablespace pg_default;

Alter Table public."Shares" Owner to postgres;

-- 🏛️ Étape C : Parchemins de documentation et alignement vertical Jojo-Style (Rule 7)
Comment on Table public."Shares" is 'Passerelles URL-Safe permettant l''accès de consultation temporaire ou permanent aux pépites.';

Comment on Column public."Shares"."shIdShare"       is 'Identifiant unique du partage, calculé en UUID v7 (16 octets Bytea / UUID).';
Comment on Column public."Shares"."shItemId"        is 'Clé étrangère binaire invitée pointant vers la pépite partagée.';
Comment on Column public."Shares"."shItemOwnerId"   is 'Clé étrangère binaire dé-normalisée pour la performance pure, pointant vers l''utilisateur propriétaire.';
Comment on Column public."Shares"."shCreatedAt"     is 'Horodatage de création physique.';
Comment on Column public."Shares"."shUpdatedAt"     is 'Horodatage de dernière modification géré physiquement par le trigger universel TraceModif.';
Comment on Column public."Shares"."shCourrielDest"  is 'Adresse de courriel optionnelle du destinataire invité externe, normalisée en minuscules.';
Comment on Column public."Shares"."shJeton"         is 'Jeton aléatoire sécurisé de contrebande réseau servant de clé d''accès unique publique.';
Comment on Column public."Shares"."shConfiguration" is 'Dictionnaire Jsonb stockant les règles d accès brutes (level, allow_download, expiration).';

-- 🏛️ Étape D : Reconstruction des index de combat B-Tree (_Idx)
Create Index if Not Exists "Shares_shItemId_Idx"      on public."Shares" Using btree ("shItemId" Asc Nulls Last);
Create Index if Not Exists "Shares_shItemOwnerId_Idx" on public."Shares" Using btree ("shItemOwnerId" Asc Nulls Last);

-- 🏛️ Étape E : Réarmement de la sentinelle temporelle (_Trg)
Create or Replace Trigger "Shares_TraceModifs_Trg"
    Before Update on public."Shares"
    For Each Row
    Execute Function public."TraceModif"('shUpdatedAt');
