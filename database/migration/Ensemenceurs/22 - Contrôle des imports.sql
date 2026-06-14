Select
    "usPseudo"                                   as "Acteur applicatif",
    "usCourriel"                                 as "Courriel de contact",
    Count(Distinct "itIdItem")                   as "Nombre de pépites",            -- 🪓 RAJOUT DU DISTINCT OBLIGATOIRE !
    Count(Distinct "tgIdTag")                    as "Nombre d''étiquettes uniques"  -- Majuscule accentuée et apostrophe doublée
From "Users"
Left Join "Items" on "itUserId" = "usIdUser"
Left Join "Tags"  on "tgUserId" = "usIdUser"
Group By
    "usIdUser",
    "usPseudo",
    "usCourriel"
Order By "Nombre de pépites" Desc;
