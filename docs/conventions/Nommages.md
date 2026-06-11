# 📜 Nomage des variables : C++ / PascalObjet / TS / Sql
# 📜 MA charte de notation hongroise «Jojo-style»

## 🌐 1. Scopes (Gouvernance des portées)
* 🌍 **`g_`** : Variable globale (Espace accessible partout dans le système)
* 🔒 **`s_`** : Variable statique (Fixe, liée à la structure et non à l'instance)
* 🏷️ **`m_`** : Membre privé de classe / Propriété (Attribut interne d'une table ou d'un objet)
* 📍 **`l_`** : Variable locale (Restreinte à un bloc d'exécution)
* 📥 **`p_`** : Paramètre (Argument entrant d'une fonction ou procédure)
* 📤 **`r_`** : Résultat (Valeur de retour finale renvoyée par le bloc)

## 🔤 2. Préfixes de types (Souveraineté des données)
* 🔢 **`i`** : Integer / Smallint (Nombres entiers, compteurs, index)
* 🧮 **`f`** : Float / Numeric (Calculs précis, nombres à virgule)
* 📅 **`d`** : Date / Timestamp (Horodatage machine, dates d'audit)
* 🔠 **`c`** : Char (Caractères de longueur fixe pour nos codes)
* 🔲 **`b`** : Boolean (Interrupteur binaire, vrai ou faux)
* ⚙️ **`w`** : Word (Mot machine, stockage de bas niveau)
* ✍️ **`s`** : String (Chaînes de texte variables, courriels, varchars)
* 🆔 **`h`** : Handle / ID (Value Objects d'identifiants uniques forts)
* 📦 **`o`** : Object (Structure complexe, instance de classe ou JSONB)
* 📋 **`e`** : Énumérations (Instances de nos précieux SmartEnums)
* 🚫 **`v`** : Void ou Any (Donnée brute non typée ou absence de retour)

## 🎛️ 3. Modificateurs (Extensions de types)
* 🔮 **`x`** : Hexadécimal (Trame textuelle ou binaire compactée en base 16, UUIDs épurés)
* ➕ **`u`** : Unsigned (Valeur strictement positive)
* 👉 **`p`** : Pointer (Pointeur de soute, référence d'adresse ou flèche)
* 📚 **`a`** : Array (Tableau, collection ou liste d'éléments)
