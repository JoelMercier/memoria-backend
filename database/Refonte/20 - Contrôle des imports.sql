Select
    "usPseudo"                                   as "Acteur applicatif",
    "usCourriel"                                 as "Courriel de contact",
    Count("itIdItem")                            as "Nombre de pépites",
    Count(Distinct "tgIdTag")                    as "Nombre d étiquettes uniques"
From "Users"
Left Join "Items" on "itUserId" = "usIdUser"
Left Join "Tags" on "tgUserId" = "usIdUser"
Group By
    "usIdUser",
    "usPseudo",
    "usCourriel"
Order By "Nombre de pépites" Desc;
